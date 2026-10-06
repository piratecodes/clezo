# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


admin/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/
│   │   └── fetchClient.jsx
│   ├── assets/
│   ├── components/
│   │   ├── cities/ (CityGrid, CityHeader, CityFormDrawer)
│   │   ├── common/ (AuthGuard, GuestGuard)
│   │   ├── dashboard/ (ChangePasswordModal, MyAccountModal, RecentLeadsWidget, Sidebar, StatsRow, TopNav)
│   │   ├── gallery/ (GalleryUploader)
│   │   ├── leads/ (LeadsHeader, LeadsTable, LeadSlideOver)
│   │   ├── login/ (LoginForm, LoginHero)
│   │   ├── services/ (CategoryModal)
│   │   ├── settings/ (ContactForm)
│   │   └── team/ (AddStaffModal)
│   ├── hooks/
│   │   └── useDocumentMeta.jsx
│   ├── layouts/
│   │   └── DashboardLayout.jsx
│   ├── pages/
│   │   ├── CitiesPage.jsx
│   │   ├── CrmPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── GalleryPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── ServicesPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── TeamPage.jsx
│   ├── style/
│   │   └── global.css
│   ├── app.jsx
│   └── main.jsx
├── .env
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package.json
└── vite.config.js