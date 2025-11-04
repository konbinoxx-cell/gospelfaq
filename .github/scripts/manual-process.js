const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function run() {
    try {
        const token = process.env.GITHUB_TOKEN;
        const issueNumber = process.env.MANUAL_ISSUE_NUMBER || github.context.issue.number;
        const octokit = github.getOctokit(token);

        console.log('手动处理问题:', issueNumber);

        // 获取Issue信息
        const { data: issue } = await octokit.rest.issues.get({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: parseInt(issueNumber)
        });

        console.log('问题标题:', issue.title);

        // 获取评论
        const { data: comments } = await octokit.rest.issues.listComments({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: parseInt(issueNumber)
        });

        if (comments.length === 0) {
            throw new Error('没有找到评论');
        }

        const latestComment = comments[comments.length - 1];
        console.log('使用评论作为回答:', latestComment.body);

        // 确定分类
        const categoryLabels = issue.labels
            .map(label => label.name)
            .filter(name => !['question', 'answered'].includes(name.toLowerCase()));

        const category = categoryLabels.length > 0 ? categoryLabels[0] : '基本信仰';

        // 读取现有的FAQ数据
        let faqData = [];
        try {
            if (fs.existsSync('./faq-data.json')) {
                const faqContent = fs.readFileSync('./faq-data.json', 'utf8');
                faqData = JSON.parse(faqContent);
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

        faqData.push(newFAQ);

        // 保存更新后的数据
        fs.writeFileSync('./faq-data.json', JSON.stringify(faqData, null, 2));
        console.log('✅ FAQ数据已更新');

        // 关闭Issue（如果还开着）
        if (issue.state === 'open') {
            await octokit.rest.issues.update({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                issue_number: parseInt(issueNumber),
                state: 'closed'
            });
            console.log('✅ 问题已关闭');
        }

    } catch (error) {
        console.error('❌ 处理失败:', error);
        core.setFailed(error.message);
    }
}

run();
