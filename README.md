SmartHealthcare Project
Overview
A React-based healthcare application providing healthcare services to villages in India. This is a frontend-only application built with modern web technologies.

Technology Stack
Frontend: React 19.1.1 with Vite 7.1.2
Styling: Tailwind CSS 4.1.13 with dark mode support
Routing: React Router DOM 7.9.1
Icons: Lucide React 0.544.0
Build Tool: Vite with React plugin

Project Structure
frontend/smartHealthCare-Project/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Features.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── context/          # React context providers
│   │   └── theme.context.jsx
│   ├── pages/            # Route pages
│   │   ├── About.jsx
│   │   ├── Doctors.jsx
│   │   └── Patient.jsx
│   ├── assets/           # Static assets
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Public assets
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
└── tailwind.config.js    # Tailwind configuration

Development
The project is configured to run on port 5000 with Vite's development server. The configuration allows all hosts for Replit's proxy environment.

Deployment
Configured for autoscale deployment with build step (npm run build) and preview server (npm run preview).

