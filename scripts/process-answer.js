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
    const payload = github.context.payload;

    const issue = payload.issue;
    console.log(`Event: ${github.context.eventName}`);
    if (!issue) {
      console.log('No issue found. Exiting.');
      return;
    }
    
    const issueNumber = issue.number;
    console.log(`Issue number: ${issueNumber}`);

    // 获取评论
    const commentsRes = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: issueNumber,
      per_page: 100,
    });

    const comments = commentsRes.data || [];
    if (comments.length === 0) {
      console.warn('No comments found. Exiting.');
      return;
    }

    // 获取最新评论
    const latestComment = comments[comments.length - 1];

    // 检查权限
    const assoc = (latestComment.author_association || '').toUpperCase();
    const allowed = ['OWNER', 'MEMBER', 'COLLABORATOR'];
    if (!allowed.includes(assoc)) {
      console.log(`Author "${assoc}" not allowed. Skipping.`);
      return;
    }

    // 构建新条目
    const id = require('crypto').randomUUID();
    const question = issue.title || '';
    const answer = latestComment.body || '';
    const category = (issue.labels?.[0]?.name || issue.labels?.[0] || 'uncategorized');
    const date = new Date().toISOString();
    const status = 'published';

    const newEntry = { id, question, answer, category, date, status };

    // 直接使用当前工作目录的路径
    const faqPath = path.join(process.cwd(), 'faq-data.json');
    console.log('FAQ file path:', faqPath);

    let faqData = [];
    if (fs.existsSync(faqPath)) {
      try {
        const raw = fs.readFileSync(faqPath, 'utf8');
        faqData = JSON.parse(raw);
        if (!Array.isArray(faqData)) {
          console.warn('Existing data is not an array. Creating new array.');
          faqData = [];
        }
      } catch (e) {
        console.warn('Parse error. Creating new array.');
        faqData = [];
      }
    }

    // 写入文件
    faqData.push(newEntry);
    fs.writeFileSync(faqPath, JSON.stringify(faqData, null, 2) + '\n');
    console.log(`Successfully wrote to ${faqPath}`);

    // 关闭 issue
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
