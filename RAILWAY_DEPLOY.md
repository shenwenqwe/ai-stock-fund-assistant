# Railway 部署指南

## 方式一：GitHub 连接（推荐）

### 1. 创建 GitHub 仓库

1. 打开 https://github.com/new
2. 仓库名: `ai-stock-fund-assistant`
3. 选择 Private 或 Public
4. 点击 Create repository

### 2. 推送代码到 GitHub

```bash
cd d:\工作文档\牛马\swnew
git remote add origin https://github.com/你的用户名/ai-stock-fund-assistant.git
git branch -M main
git push -u origin main
```

### 3. 在 Railway 部署

1. 打开 https://railway.app 并用 GitHub 登录
2. 点击 **New Project**
3. 选择 **Deploy from GitHub repo**
4. 选择 `ai-stock-fund-assistant` 仓库
5. Railway 自动检测到 Node.js 项目
6. 在 **Settings** 中设置:
   - Build Command: `npm run build`
   - Start Command: `npm start`
7. 点击 **Deploy**，等待构建完成
8. 部署完成后，在 Settings → Networking 中添加自定义域名或使用 Railway 提供的 `.up.railway.app` 域名

---

## 方式二：Railway CLI（如果网络通畅）

```bash
# 安装 CLI
npm i -g @railway/cli

# 登录
railway login

# 初始化项目
cd d:\工作文档\牛马\swnew
railway init

# 部署
railway up

# 添加公开域名
railway domain
```

---

## 环境变量（可选）

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | 3000 | Railway 自动注入，无需设置 |

---

## 部署后验证

访问 Railway 提供的 URL，检查：
- 首页大盘指数是否实时更新
- 行情页股票/基金数据是否正常
- API: `https://你的域名/api/indices`
