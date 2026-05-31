# 小兔鲜 - 电商前端项目

基于 Vue 3 的电商前端单页应用，提供首页、商品分类、商品详情、购物车、订单、支付等完整的购物流程。

## 技术栈

| 技术 | 说明 |
|---|---|
| Vue 3.4 | 核心框架，使用 Composition API + `<script setup>` |
| Vite 5 | 构建工具，支持 HMR 热更新 |
| Vue Router 4 | 路由管理，采用 History 模式 |
| Pinia | 状态管理，配合 `pinia-plugin-persistedstate` 持久化到 localStorage |
| Element Plus | UI 组件库，按需自动导入，中文语言包 |
| Axios | HTTP 请求，封装了请求/响应拦截器 |
| SCSS | CSS 预处理器，自定义 Element Plus 主题 |
| @vueuse/core | Vue 组合式工具库（图片懒加载等） |
| dayjs | 日期时间格式化 |

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装依赖

```sh
pnpm install
```

### 授权构建

首次安装依赖后，需要运行以下命令授权 native 模块构建（如 esbuild、vue-demi 等）：

```sh
pnpm approve-builds
```

### 开发

```sh
pnpm dev
```

启动本地开发服务器，支持热更新。

### 生产构建

```sh
pnpm build
```

### 预览构建产物

```sh
pnpm preview
```

### 代码检查

```sh
pnpm lint
```

运行 ESLint 并自动修复代码问题。

### 代码格式化

```sh
pnpm format
```

使用 Prettier 格式化 `src/` 目录下的所有文件。

## 测试账号

| 账号 | 昵称 | 手机号 | 密码 |
|------|------|--------|------|
| heima282 | 我是小兔鲜 | 12056258282 | hm#qd@23! |
| heima283 | 我是小兔鲜 | 12056258283 | hm#qd@23! |
| heima284 | 我是小兔鲜 | 12056258284 | hm#qd@23! |
| heima285 | 我是小兔鲜 | 12056258285 | hm#qd@23! |
| heima286 | 我是小兔鲜 | 12056258286 | hm#qd@23! |
| heima287 | 我是小兔鲜 | 12056258287 | hm#qd@23! |
| heima288 | 我是小兔鲜 | 12056258288 | hm#qd@23! |
| heima289 | 我是小兔鲜 | 12056258289 | hm#qd@23! |
| heima290 | 我是小兔鲜 | 12056258290 | hm#qd@23! |
| heima291 | 我是小兔鲜 | 12056258291 | hm#qd@23! |
| heima292 | 我是小兔鲜 | 12056258292 | hm#qd@23! |
| heima293 | 我是小兔鲜 | 12056258293 | hm#qd@23! |

**沙箱支付账号：** askgxl8276@sandbox.com（登录和支付密码：111111）

## 项目结构

```
vue-xtx/
├── src/
│   ├── apis/            # API 接口模块（home、login、cart、cate、order、product、address、user）
│   ├── assets/          # 静态资源（图片、图标、iconfont）
│   ├── components/      # 公共组件（含 XtxSku 商品规格选择器）
│   ├── composables/     # 组合式函数
│   ├── directive/       # 自定义指令（v-img-lazy 图片懒加载）
│   ├── router/          # 路由配置及路由守卫
│   ├── stores/          # Pinia 状态仓库（login、cart、category）
│   ├── styles/          # 全局样式及 Element Plus 主题覆盖
│   ├── utils/           # 工具函数（Axios 封装）
│   └── views/           # 页面组件
│       ├── home/        # 首页
│       ├── category/    # 商品分类
│       ├── product/     # 商品详情
│       ├── cart/        # 购物车
│       ├── order/       # 订单
│       ├── pay/         # 支付
│       ├── login/       # 登录
│       ├── user/        # 用户中心
│       └── layout/      # 布局容器（头部导航等）
├── public/              # 公共静态文件
├── index.html           # 入口 HTML
├── vite.config.js       # Vite 配置
└── jsconfig.json        # 路径别名 @/* -> ./src/*
```

## 路由结构

| 路径 | 页面 | 说明 |
|---|---|---|
| `/home` | 首页 | 默认首页，展示轮播图、推荐商品等 |
| `/category/:id` | 商品分类 | 一级分类页面 |
| `/subcategory/:id` | 子分类 | 二级分类页面 |
| `/product/:id` | 商品详情 | 商品信息、规格选择、加购 |
| `/cart` | 购物车 | 购物车管理 |
| `/order` | 订单 | 订单确认 |
| `/pay` | 支付 | 支付页面 |
| `/user/message` | 我的消息 | 用户中心 - 消息 |
| `/user/userorder` | 我的订单 | 用户中心 - 订单 |
| `/login` | 登录 | 用户登录 |
| `/paycallback` | 支付回调 | 支付结果回调页 |

## 核心设计

### 请求封装

`src/utils/request.js` 封装了 Axios 实例：

- **请求拦截器**：自动从 Pinia 用户仓库读取 token，添加 `Authorization: Bearer <token>` 请求头
- **响应拦截器**：检查响应状态码，非成功状态弹出错误提示；遇到 401 自动跳转登录页

### 状态管理

使用 Pinia 管理全局状态，通过 `pinia-plugin-persistedstate` 实现 localStorage 持久化：

- **用户仓库** (`stores/login`)：登录信息、token
- **购物车仓库** (`stores/cart`)：购物车商品列表
- **分类仓库** (`stores/category`)：商品分类数据

### 路由守卫

未登录用户访问需要权限的页面时，自动重定向到登录页并提示"请先登录"。支付回调页仅允许从订单页跳转进入。

### 自定义指令

`v-img-lazy`：基于 `@vueuse/core` 的 IntersectionObserver 实现图片懒加载，注册为全局 Vue 插件。

### 组件自动导入

通过 `unplugin-auto-import` 和 `unplugin-vue-components` 实现 Element Plus 组件和 API 的按需自动导入，无需手动引入。

## 接口地址

后端 API：`http://pcapi-xiaotuxian-front-devtest.itheima.net`

## 推荐开发工具

- [VSCode](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 扩展（需禁用 Vetur）
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) 扩展
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 扩展
