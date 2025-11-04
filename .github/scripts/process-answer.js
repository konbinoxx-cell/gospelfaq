const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function run() {
    try {
        console.log('🚀 开始处理GitHub Actions...');
        
        const token = process.env.GITHUB_TOKEN;
        if (!token) {
            throw new Error('GITHUB_TOKEN 未设置');
        }

        const octokit = github.getOctokit(token);
        const context = github.context;

        console.log('仓库:', context.repo.owner, context.repo.repo);
        console.log('问题编号:', context.issue.number);
        console.log('事件类型:', context.eventName);

        // 获取Issue信息
        const { data: issue } = await octokit.rest.issues.get({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.issue.number
        });

        console.log('问题标题:', issue.title);
        console.log('问题标签:', issue.labels.map(l => l.name));
        console.log('问题状态:', issue.state);

        // 获取评论
        const { data: comments } = await octokit.rest.issues.listComments({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.issue.number
        });

        console.log('评论数量:', comments.length);

        let latestComment;
        if (comments.length === 0) {
            console.log('⚠️ 没有找到评论，使用默认回答');
            latestComment = {
                body: '这个问题正在等待专业回答，请稍后查看更新。'
            };
        } else {
            latestComment = comments[comments.length - 1];
        }

        console.log('最新评论:', latestComment.body);

        // 确定分类
        const categoryLabels = issue.labels
            .map(label => label.name)
            .filter(name => !['question', 'answered'].includes(name.toLowerCase()));

        const category = categoryLabels.length > 0 ? categoryLabels[0] : '基本信仰';
        console.log('分类:', category);

        // 读取现有的FAQ数据
        let faqData = [];
        try {
            if (fs.existsSync('./faq-data.json')) {
                const faqContent = fs.readFileSync('./faq-data.json', 'utf8');
                faqData = JSON.parse(faqContent);
                console.log('现有FAQ数据条数:', faqData.length);
            }
        } catch (error) {
            console.log('创建新的FAQ数据文件');
        }

        // 添加新的已回答问题
        const newFAQ = {
            id: faqData.length > 0 ? Math.max(...faqData.map(f => f.id)) + 1 : 1,
            question: issue.title.replace(/^\[问题\]\s*/, ''),
            answer: latestComment.body,
            category: category,
            date: new Date().toISOString().split('T')[0],
            status: 'answered'
        };

        console.log('新FAQ条目:', newFAQ);
        faqData.push(newFAQ);

        // 保存更新后的数据
        fs.writeFileSync('./faq-data.json', JSON.stringify(faqData, null, 2));
        console.log('✅ FAQ数据已保存');

        // 关闭Issue
        await octokit.rest.issues.update({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.issue.number,
            state: 'closed'
        });

        console.log('✅ 问题已关闭');

    } catch (error) {
        console.error('❌ 处理失败:', error);
        core.setFailed(error.message);
    }
}

run();
