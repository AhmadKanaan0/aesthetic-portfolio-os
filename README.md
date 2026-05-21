# Aesthetic Portfolio OS

A personal portfolio website designed to mimic a desktop operating system interface, built with modern web technologies and interactive UI components.

[![TypeScript](https://img.shields.io/badge/TypeScript-92.7%25-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-6.8%25-38B2AC)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite)](https://vitejs.dev/)

## 🎨 Features

- **Desktop OS Interface**: Interactive desktop environment with draggable and resizable windows
- **Authentication**: Login screen for portfolio access
- **Multiple Sections**: Organized portfolio sections including:
  - About Me
  - Resume
  - Projects
  - Blog
  - Links
  - Contact Me
- **Smooth Animations**: GSAP-powered animations for engaging interactions
- **Responsive Design**: Built with Tailwind CSS for modern styling
- **Type-Safe**: Full TypeScript support for robust development

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Yarn package manager

### Development

1. Install dependencies:
```bash
yarn install
```

2. Start the development server:
```bash
yarn dev
```

The application will be available at `http://localhost:3000`.

### Production Build

Build the application for production:
```bash
yarn build
```

This creates an optimized build in the `dist` directory.

Preview the production build locally:
```bash
yarn serve
```

## 🧪 Testing

Run the test suite with Vitest:

```bash
yarn test
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   └── ui/             # Reusable UI components
├── routes/             # File-based routing with TanStack Router
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Root application component
```

## 🛠️ Technology Stack

### Frontend Framework
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Animation library for smooth interactions

### Routing & State
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state management

## 📝 Development Conventions

### Styling
- Tailwind CSS utility classes are preferred
- Avoid custom CSS when possible
- Use responsive design utilities

### Components
- Components are organized in `src/components`
- Reusable UI components go in `src/components/ui`
- Follow single responsibility principle

### Routing
- File-based routing with TanStack Router
- Routes defined in `src/routes` directory
- Type-safe route configuration

### State Management
- TanStack Query for server state
- React hooks for component state
- Consider Context API for global state if needed

### Code Quality
- Static typing with TypeScript
- Code formatting and linting recommended
- Follow ESLint conventions

## 🎯 Usage

### Login
1. Access the application at the development/production URL
2. Enter credentials on the login screen
3. Successfully authenticated users are redirected to the desktop

### Desktop Navigation
- Click desktop icons to open portfolio sections
- Drag windows to reposition them
- Resize windows using the corner handles
- Close windows by clicking the close button

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `yarn install` | Install dependencies |
| `yarn dev` | Start development server |
| `yarn build` | Build for production |
| `yarn serve` | Preview production build |
| `yarn test` | Run tests with Vitest |

## 📄 License

This project is personal and can be used for portfolio purposes.

## 🤝 Contributing

This is a personal portfolio project. Contributions are welcome for improvements and bug fixes.

## 📧 Contact

For inquiries about this portfolio, please use the contact section within the application.

---

**Built with ❤️ using React, TypeScript, and Vite**
