# Vitality 健康追踪 App

这是一个使用 React (前端) 和 Express + Supabase (后端) 构建的全栈健康追踪应用。

## 功能特点

- **用户认证**: 注册、登录和会话持久化（通过 Supabase Auth）。
- **个人资料管理**: 更新昵称、头像、性别、生日、身高和体重。
- **饮食追踪**: 记录每日饮食，自动计算卡路里和宏量营养素（蛋白质、碳水、脂肪）。
- **饮水追踪**: 记录每日饮水量，设定饮水提醒。
- **体重记录**: 追踪体重变化，自动更新个人资料。
- **每日计划**: 创建和管理每日健康任务。
- **自定义追踪器**: 添加自定义营养补剂或其他健康指标的追踪。
- **健康目标**: 设定卡路里摄入、饮水和运动消耗目标。

## 技术栈

- **前端**: React, TypeScript, Vite, Tailwind CSS, Motion (动画), Recharts (图表), Lucide React (图标)。
- **后端**: Node.js, Express, tsx (开发运行)。
- **数据库/认证**: Supabase (PostgreSQL, Auth, RLS)。

## 项目结构

- `src/`: 前端 React 代码。
- `server/`: 后端 Express 代码。
- `supabase/`: 数据库模式定义 (`schema.sql`)。

## 安装与运行

### 1. 克隆项目并安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并填写你的 Supabase 凭据：

```env
VITE_SUPABASE_URL=你的_supabase_url
VITE_SUPABASE_ANON_KEY=你的_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=你的_supabase_service_role_key
PORT=3001
```

### 3. 初始化数据库

在 Supabase 控制台的 SQL Editor 中运行 `supabase/schema.sql` 中的内容。这会创建所有必要的表、索引、RLS 策略和触发器。

### 4. 运行应用

**启动后端服务器:**

```bash
npm run server
```

**启动前端开发服务器:**

```bash
npm run dev
```

打开浏览器访问 `http://localhost:3000`。

## 注意事项

- 确保后端服务器在 3001 端口运行，前端在 3000 端口运行（已在配置中设定）。
- 数据库启用了 RLS (行级安全性)，所有数据都与用户 ID 绑定，确保了数据的私密性。
