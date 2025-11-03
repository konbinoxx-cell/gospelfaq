# gospelfaq
# ✝️ 福音常见问题网站 | Gospel FAQ Website

一个简洁、优雅的单页面福音问答网站，帮助寻求信仰真理的人找到答案。

A clean, elegant single-page Gospel FAQ website to help seekers find answers about faith.

## ✨ 特性 | Features

- 📱 **响应式设计** - 完美适配手机、平板和桌面设备
- 🌍 **多语言支持** - 集成 Google Translate，支持 12+ 种语言
- 🎨 **现代暗色主题** - 护眼的深色界面，专业而温馨
- 📝 **问题提交系统** - 访客可以提交自己的信仰问题
- 🏷️ **分类筛选** - 按主题分类浏览问题
- 📧 **邮件通知** - 自动发送问题到管理员邮箱
- 💾 **零后端依赖** - 纯静态 HTML，一个文件包含所有功能
- ⚡ **加载快速** - 无需数据库，即开即用

## 🎯 适用场景 | Use Cases

- 教会网站的 FAQ 页面
- 福音布道的在线资源
- 慕道友学习平台
- 基督徒团契的参考资料
- 个人福音见证网站

## 📋 问题分类 | Categories

- **基本信仰** - 基础教义和信仰核心
- **圣经真理** - 关于圣经的真实性和权威
- **救恩之道** - 如何得救和因信称义
- **基督生平** - 耶稣的生平和复活
- **灵命成长** - 属灵生命的培养
- **祷告生活** - 祷告的方法和意义
- **疑难解答** - 常见的信仰疑问
- **教会生活** - 教会聚会和团契

## 🚀 快速开始 | Quick Start

### 方法一：直接使用

1. 下载 `gospel-faq.html` 文件
2. 用浏览器打开即可使用
3. 无需任何安装或配置

### 方法二：部署到服务器

```bash
# 克隆仓库
git clone https://github.com/yourusername/gospel-faq.git

# 上传到你的网站服务器
# 可以使用 FTP、GitHub Pages、Netlify 等
```

### 方法三：GitHub Pages 部署

1. Fork 这个仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择主分支作为源
4. 访问 `https://yourusername.github.io/gospel-faq`

## ⚙️ 自定义配置 | Customization

### 修改管理员邮箱

在 HTML 文件中找到这一行并修改：

```javascript
const adminEmail = 'gospel@example.com'; // 改为您的邮箱
```

### 添加新的 FAQ

在 `faqData` 数组中添加新条目：

```javascript
{
    id: 9,
    question: "您的问题？",
    answer: "您的答案...",
    category: "基本信仰",
    date: "2024-01-20",
    status: "answered"
}
```

### 修改颜色主题

在 CSS `:root` 部分修改颜色变量：

```css
:root {
    --bg: #0b1220;        /* 背景色 */
    --panel: #0f172a;     /* 面板色 */
    --text: #e2e8f0;      /* 文字色 */
    --brand: #60a5fa;     /* 主题色 */
    --gold: #fbbf24;      /* 金色强调 */
}
```

### 添加/删除语言

修改语言选择器中的选项：

```html
<select id="languageSelect">
    <option value="zh-CN">中文</option>
    <option value="en">English</option>
    <!-- 添加更多语言 -->
</select>
```

## 📖 内置问答内容 | Built-in Q&A

网站已包含 8 个精心准备的常见问题：

1. 什么是福音？
2. 我如何才能得救？
3. 圣经是神的话语吗？
4. 神为什么允许苦难存在？
5. 如何开始祷告？
6. 耶稣真的从死里复活了吗？
7. 如何读懂圣经？
8. 为什么需要去教会？

## 🎨 设计特色 | Design Highlights

- **优雅的渐变效果** - 使用微妙的渐变增强视觉层次
- **金色强调色** - 象征神圣和真理的金色点缀
- **圣经经文引用** - 顶部展示相关经文
- **悬停动画** - 流畅的交互反馈
- **清晰的视觉层级** - 让内容易于阅读和理解

## 📱 浏览器兼容性 | Browser Compatibility

- ✅ Chrome / Edge (推荐)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🛠️ 技术栈 | Tech Stack

- **纯 HTML5** - 语义化标签
- **原生 CSS3** - 现代 CSS 特性
- **原生 JavaScript** - 无需任何框架
- **Google Translate API** - 多语言支持

## 📝 待办事项 | TODO

- [ ] 添加搜索功能
- [ ] 支持问题点赞/收藏
- [ ] 添加打印友好样式
- [ ] 支持问题分享到社交媒体
- [ ] 添加更多预设问答
- [ ] 支持 Markdown 格式答案
- [ ] 添加管理后台（可选）

## 🤝 贡献 | Contributing

欢迎提交问题和改进建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证 | License

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢 | Acknowledgments

- 感谢所有为福音传播做出贡献的弟兄姐妹
- 感谢开源社区的支持和启发
- 一切荣耀归于神

## 📞 联系方式 | Contact

如有问题或建议，请：

- 📧 发送邮件至：gospel@example.com
- 🐛 提交 Issue
- 💬 参与 Discussions

---

**"你们祈求，就给你们；寻找，就寻见；叩门，就给你们开门。" — 马太福音 7:7**

*"Ask and it will be given to you; seek and you will find; knock and the door will be opened to you." — Matthew 7:7*

---

⭐ 如果这个项目对您有帮助，请给一个 Star！

Made with ❤️ and Faith
