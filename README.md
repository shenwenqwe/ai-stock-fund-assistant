# AI 智能选股基金决策助手

实时接入东方财富数据的智能选股基金决策助手，移动端优先，PC自适应。

## 功能特性

- 📊 **实时大盘** — 上证/深证/创业板/沪深300实时行情
- 🤖 **AI推荐** — 10支精选股票/基金推荐，含买卖参考价、评分拆解
- 📈 **行情中心** — 沪深A股、基金实时行情，支持排序、搜索
- 🔍 **智能筛选** — 一键筛选模板 + 自定义多维度筛选
- 👤 **个人中心** — 自选收藏、推荐历史、风险预警、投资日志

## 技术栈

- **前端**: React 18 + React Router 6 + TailwindCSS v4 + Vite 5
- **后端**: Express + 东方财富公开API代理
- **图标**: Lucide React

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式（前后端同时启动）
npm run dev:all

# 或分别启动
npm run dev          # 前端 Vite 开发服务器 (localhost:5173)
npm run dev:server   # 后端 API 服务器 (localhost:3000)

# 生产构建 + 启动
npm run build
npm start            # 启动生产服务器 (localhost:3000)
```

## 部署到 Vercel

1. 注册 [Vercel](https://vercel.com) 账号
2. 安装 CLI: `npm i -g vercel`
3. 登录: `vercel login`
4. 部署: `vercel --prod`

项目已包含 `vercel.json` 配置和 `api/` 目录下的 Serverless Functions。

## 部署到 Railway

1. 注册 [Railway](https://railway.app) 账号
2. 新建项目，连接 GitHub 仓库
3. Railway 自动检测 Express 服务器，设置启动命令 `npm start`
4. 环境变量设置 `PORT` (Railway 自动注入)

## 部署到 Render

1. 注册 [Render](https://render.com) 账号
2. 新建 Web Service，连接 GitHub 仓库
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`

## API 接口

| 路径 | 说明 |
|------|------|
| `/api/indices` | 实时大盘指数 |
| `/api/stocks?page=1&size=30&sort=f3&order=0` | 沪深A股行情 |
| `/api/funds?page=1&size=30&type=` | 基金行情 |
| `/api/sectors` | 行业板块涨幅榜 |
| `/api/search?q=关键词` | 搜索股票/基金 |
| `/api/stock/[code]` | 个股详情 |
| `/api/fund/[code]` | 基金详情 |

## 项目结构

```
├── api/              # Vercel Serverless Functions
│   ├── indices.js
│   ├── stocks.js
│   ├── funds.js
│   ├── sectors.js
│   ├── search.js
│   ├── stock/[code].js
│   └── fund/[code].js
├── server/           # Express 后端（本地/Railway/Render）
│   └── index.js
├── src/              # React 前端
│   ├── api/client.js
│   ├── components/
│   ├── pages/
│   └── data/mockData.js
├── dist/             # 构建产物
├── vercel.json
└── package.json
```
