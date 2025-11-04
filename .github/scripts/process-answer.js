// ...existing code...
const fs = require('fs');
const path = require('path');
const core = require('@actions/core');
const github = require('@actions/github');

async function main() {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error('GITHUB_TOKEN is required');

    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;
    const eventName = github.context.eventName;
    const payload = github.context.payload;

    // 打印当前事件类型和 issue 编号
    const issue = payload.issue;
    console.log(`Event: ${eventName}`);
    if (!issue) {
      console.log('No issue found on the event payload. Exiting.');
      return;
    }
    const issueNumber = issue.number;
    console.log(`Issue number: ${issueNumber}`);

    // 使用 Octokit 获取 issue 的所有评论
    const commentsRes = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: issueNumber,
      per_page: 100,
    });

    const comments = commentsRes.data || [];
    if (comments.length === 0) {
      console.warn('No comments found for this issue. Exiting.');
      return;
    }

    // 获取最新评论
    const latestComment = comments[comments.length - 1];

    // 检查最新评论是否由仓库维护者/所有者发布（允许 OWNER/MEMBER/COLLABORATOR）
    const assoc = (latestComment.author_association || '').toUpperCase();
    const allowed = ['OWNER', 'MEMBER', 'COLLABORATOR'];
    if (!allowed.includes(assoc)) {
      console.log(`Latest comment author_association="${assoc}" not in ${allowed.join(', ')}. Skipping.`);
      return;
    }

    // 构建一个新的 FAQ 条目，包含 id、question、answer、category、date 和 status 字段
    const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `faq-${Date.now()}`;
    const question = issue.title || '';
    const answer = latestComment.body || '';
    const category = (issue.labels && issue.labels[0] && (typeof issue.labels[0] === 'string' ? issue.labels[0] : issue.labels[0].name)) || 'uncategorized';
    const date = new Date().toISOString();
    const status = 'published';

    const newEntry = { id, question, answer, category, date, status };

    // 检查根目录是否存在 faq-data.json，如果没有则创建
    const faqPath = path.resolve(process.cwd(), 'faq-data.json');
    let faqData = [];
    if (fs.existsSync(faqPath)) {
      const raw = fs.readFileSync(faqPath, 'utf8');
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) faqData = parsed;
        else {
          console.warn('Existing faq-data.json is not an array. Overwriting with a new array.');
          faqData = [];
        }
      } catch (e) {
        console.warn('Failed to parse existing faq-data.json. Overwriting with a new array.');
        faqData = [];
      }
    } else {
      console.log('faq-data.json not found — will create a new one.');
    }

    // 将新的条目写入数组并保存到文件，格式化为缩进为 2 的 JSON
    faqData.push(newEntry);
    fs.writeFileSync(faqPath, JSON.stringify(faqData, null, 2) + '\n', 'utf8');
    console.log(`Wrote FAQ entry to ${faqPath}`);

    // 使用 Octokit 关闭当前 issue
    await octokit.rest.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: 'closed',
    });
    console.log(`Closed issue #${issueNumber}`);
  } catch (error) {
    core.setFailed(error.message || String(error));
  }
}

main();
// ...existing code...
