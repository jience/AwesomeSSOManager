# Unified SSO Manager (统一单点登录管理系统)

[English](#english) | [中文](#chinese)

---

<a name="english"></a>
## 🇬🇧 English Documentation

### Introduction
**Unified SSO Manager** is a comprehensive administration dashboard designed to configure and manage third-party Single Sign-On (SSO) integrations. It provides a unified interface for managing authentication providers using **CAS**, **OIDC**, **OAuth2.0**, and **SAML2.0** protocols.

The system features a **React** frontend and a **Python Flask** backend, offering both a "Mock Mode" (running entirely in the browser) and a "Real API Mode" (connected to the backend).

### ✨ Features
- **Multi-Protocol Support**: Configure OIDC, OAuth2, SAML, and CAS providers.
- **Provider Management**: CRUD operations for Identity Providers.
- **Dual Modes**: 
  - **Mock Mode**: Uses `localStorage` for demonstration purposes without a backend.
  - **API Mode**: Connects to a Python Flask server for real data persistence and auth flows.
- **User Dashboard**: Visual confirmation of successful SSO login and JWT inspection.
- **Security**: JWT-based session management (simulated in Mock mode, real in API mode).

### 🛠 Tech Stack
- **Frontend**: React (TypeScript), Tailwind CSS, React Router.
- **Backend**: Python 3, Flask, PyJWT.

### 🚀 Getting Started

#### Prerequisites
- Node.js & npm (for frontend)
- Python 3.8+ & pip (for backend)

#### 1. Backend Setup (Optional if using Mock Mode)
If you want to use the real backend features:

```bash
# Navigate to the project root
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the server (Runs on port 5000)
python app.py
```

#### 2. Frontend Setup

```bash
# Navigate to the project root
npm install

# Start the development server
npm run dev
```

#### 3. Configuration (Toggle API Mode)
By default, the app might run in **Mock Mode**. To switch to the real Python backend:

1. Open `config.ts`.
2. Change `API_MODE` to `true`:
   ```typescript
   export const APP_CONFIG = {
     API_MODE: true, // Set to true to use Flask backend
     // ...
   };
   ```
3. Ensure your Flask server is running on `http://localhost:5000`.

### 🔑 Usage
- **Default Login (Mock/Local)**:
  - Username: `admin`
  - Password: `admin`
- **SSO Login**:
  - Configure a provider in the Admin Dashboard.
  - Go to the Login Page and click "Sign in with [Provider]".

---

<a name="chinese"></a>
## 🇨🇳 中文文档

### 简介
**Unified SSO Manager (统一单点登录管理系统)** 是一个用于配置和管理第三方单点登录（SSO）集成的综合管理后台。它提供了一个统一的界面来管理基于 **CAS**、**OIDC**、**OAuth2.0** 和 **SAML2.0** 协议的认证提供商。

该系统由 **React** 前端和 **Python Flask** 后端组成，支持“模拟模式”（完全在浏览器中运行）和“真实 API 模式”（连接到后端）。

### ✨ 功能特性
- **多协议支持**：支持配置 OIDC, OAuth2, SAML 和 CAS 提供商。
- **提供商管理**：支持对身份提供商（IdP）进行增删改查操作。
- **双模式运行**：
  - **模拟模式 (Mock Mode)**：使用 `localStorage` 进行演示，无需启动后端。
  - **API 模式 (API Mode)**：连接到 Python Flask 服务器，实现真实的数据持久化和认证流程。
- **用户仪表盘**：可视化展示 SSO 登录成功状态及 JWT 令牌解析。
- **安全性**：基于 JWT 的会话管理。

### 🛠 技术栈
- **前端**：React (TypeScript), Tailwind CSS, React Router。
- **后端**：Python 3, Flask, PyJWT。

### 🚀以此开始

#### 环境要求
- Node.js & npm (用于前端)
- Python 3.8+ & pip (用于后端)

#### 1. 后端设置 (如果使用 API 模式)
如果您想使用真实的后端功能：

```bash
# 在项目根目录下，安装 Python 依赖
pip install -r backend/requirements.txt

# 启动服务器 (默认运行在 5000 端口)
python backend/app.py
```

#### 2. 前端设置

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

#### 3. 配置说明 (切换 API 模式)
默认情况下，应用可能运行在 **Mock Mode**。如需切换到真实的 Python 后端：

1. 打开根目录下的 `config.ts` 文件。
2. 将 `API_MODE` 设置为 `true`：
   ```typescript
   export const APP_CONFIG = {
     API_MODE: true, // 设置为 true 以启用 Flask 后端
     // ...
   };
   ```
3. 确保您的 Flask 服务器正在 `http://localhost:5000` 运行。

### 🔑 使用指南
- **默认本地登录 (管理员)**：
  - 用户名：`admin`
  - 密码：`admin`
- **SSO 登录**：
  - 使用管理员账号登录后台，配置一个新的提供商。
  - 注销后，在登录页面点击 "Sign in with [Provider]" 进行测试。

---

### Project Structure (项目结构)

```
.
├── backend/                # Python Flask Backend
│   ├── app.py              # Main application entry
│   └── requirements.txt    # Python dependencies
├── components/             # Reusable UI components
├── pages/                  # Application pages
├── services/               # API and Storage services
├── types/                  # TypeScript type definitions
├── config.ts               # Global configuration
├── App.tsx                 # Main React Component
└── README.md               # Documentation
```
