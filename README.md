# Unified SSO Manager

[中文文档 (Chinese Documentation)](./README_CN.md)

---

## Introduction
**Unified SSO Manager** is a comprehensive administration dashboard designed to configure and manage third-party Single Sign-On (SSO) integrations. It provides a unified interface for managing authentication providers using **CAS**, **OIDC**, **OAuth2.0**, and **SAML2.0** protocols.

The system features a **React** frontend and a **Python Flask** backend, offering both a "Mock Mode" (running entirely in the browser) and a "Real API Mode" (connected to the backend).

## ✨ Features
- **Multi-Protocol Support**: Configure OIDC, OAuth2, SAML, and CAS providers.
- **Provider Management**: CRUD operations for Identity Providers.
- **Dual Modes**: 
  - **Mock Mode**: Uses `localStorage` for demonstration purposes without a backend.
  - **API Mode**: Connects to a Python Flask server for real data persistence and auth flows.
- **User Dashboard**: Visual confirmation of successful SSO login and JWT inspection.
- **Security**: JWT-based session management (simulated in Mock mode, real in API mode).

## 📸 Screenshots

### Login Interface
The unified login page supports local authentication and multiple dynamic SSO providers.
![Login Page](https://placehold.co/1000x600/f3f4f6/2563eb?text=Unified+SSO+Login+Interface&font=roboto)

### Provider Management
An intuitive grid layout to view, edit, configure, and delete identity providers.
![Provider List](https://placehold.co/1000x600/f3f4f6/2563eb?text=Provider+Management+Dashboard&font=roboto)

## 🛠 Tech Stack
- **Frontend**: React (TypeScript), Tailwind CSS, React Router.
- **Backend**: Python 3, Flask, PyJWT.

## 🚀 Getting Started

### Prerequisites
- Node.js & npm (for frontend)
- Python 3.8+ & pip (for backend)

### 1. Backend Setup (Optional if using Mock Mode)
If you want to use the real backend features:

```bash
# Navigate to the project root
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the server (Runs on port 5000)
python app.py
```

### 2. Frontend Setup

```bash
# Navigate to the project root
npm install

# Start the development server
npm run dev
```

### 3. Configuration (Toggle API Mode)
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

## 🔑 Usage
- **Default Login (Mock/Local)**:
  - Username: `admin`
  - Password: `admin`
- **SSO Login**:
  - Configure a provider in the Admin Dashboard.
  - Go to the Login Page and click "Sign in with [Provider]".

## Project Structure

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
├── README.md               # English Documentation
└── README_CN.md            # Chinese Documentation
```