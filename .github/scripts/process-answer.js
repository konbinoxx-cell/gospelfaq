const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    console.log('🚀 开始处理GitHub Actions...');

    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error('GITHUB_TOKEN 未设置');

    const octokit = github.getOctokit(token);
    const context = github.context;
    const issue = context.payload.issue;
    const issueNumber = issue.number;

    console.log('仓库:', context.repo.owner, context.repo.repo);
    console.log('问题编号:', issueNumber);
    console.log('事件类型:', context.eventName);

    // 获取评论
    const { data: comments } = await octokit.rest.issues.listComments({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueNumber
    });

    if (comments.length === 0) {
      console.log('⚠️ 没有评论，跳过处理');
      return;
    }

    const latestComment = comments[comments.length - 1];
    const isMaintainer = latestComment.user.login === context.repo.owner;
    if (!isMaintainer) {
      console.log('⚠️ 最新评论不是维护者提交的，跳过处理');
      return;
    }

    const categoryLabels = issue.labels
      .map(label => label.name)
      .filter(name => !['question', 'answered'].includes(name.toLowerCase()));
    const category = categoryLabels.length > 0 ? categoryLabels[0] : '基本信仰';

    const faqPath = path.join(__dirname, '..', 'data', 'faq-data.json');
    if (!fs.existsSync(path.dirname(faqPath))) {
      fs.mkdirSync(path.dirname(faqPath));
    }

    let faqData = [];
    if (fs.existsSync(faqPath)) {
      const content = fs.readFileSync(faqPath, 'utf8');
      faqData = JSON.parse(content);
    }

    const newFAQ = {
      id: faqData.length > 0 ? Math.max(...faqData.map(f => f.id)) + 1 : 1,
      question: issue.title.replace(/^

\[问题\]

\s*/, ''),
      answer: latestComment.body,
      category: category,
      date: new Date().toISOString().split('T')[0],
      status: 'answered'
    };

    faqData.push(newFAQ);
    fs.writeFileSync(faqPath, JSON.stringify(faqData, null, 2));
    console.log('✅ FAQ数据已保存');

    await octokit.rest.issues.update({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueNumber,
      state: 'closed'
    });

    console.log('✅ 问题已关闭');

  } catch (error) {
    console.error('❌ 处理失败:', error);
    core.setFailed(error.message);
  }
}

run();
