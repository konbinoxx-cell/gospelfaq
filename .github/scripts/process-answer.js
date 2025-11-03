const fs = require('fs');
const { GitHub, context } = require('@actions/github');

async function processAnsweredQuestion() {
  const github = new GitHub(process.env.GITHUB_TOKEN);
  const { owner, repo } = context.repo;
  const issueNumber = context.issue.number;
  
  // 获取Issue信息
  const { data: issue } = await github.rest.issues.get({
    owner,
    repo,
    issue_number: issueNumber
  });
  
  // 获取最新的评论（回答）
  const { data: comments } = await github.rest.issues.listComments({
    owner,
    repo,
    issue_number: issueNumber
  });
  
  if (comments.length === 0) {
    console.log('没有找到评论');
    return;
  }
  
  const latestComment = comments[comments.length - 1];
  const answer = latestComment.body;
  
  // 确定分类
  const category = issue.labels
    .map(label => label.name)
    .find(name => !['question', 'answered'].includes(name)) || '基本信仰';
  
  // 读取现有的FAQ数据
  let faqData = [];
  try {
    const faqContent = fs.readFileSync('./faq-data.json', 'utf8');
    faqData = JSON.parse(faqContent);
  } catch (error) {
    console.log('创建新的FAQ数据文件');
  }
  
  // 添加新的已回答问题
  const newFAQ = {
    id: faqData.length > 0 ? Math.max(...faqData.map(f => f.id)) + 1 : 1,
    question: issue.title.replace(/^\[问题\]\s*/, ''),
    answer: answer,
    category: category,
    date: new Date().toISOString().split('T')[0],
    status: 'answered'
  };
  
  faqData.push(newFAQ);
  
  // 保存更新后的数据
  fs.writeFileSync('./faq-data.json', JSON.stringify(faqData, null, 2));
  
  // 关闭Issue
  await github.rest.issues.update({
    owner,
    repo,
    issue_number: issueNumber,
    state: 'closed'
  });
  
  console.log(`成功处理问题 #${issueNumber}`);
}

processAnsweredQuestion().catch(console.error);
