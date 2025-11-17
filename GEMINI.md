# Project Overview

This project is a personal portfolio website designed to mimic a desktop operating system interface. It is built with React, TypeScript, and Vite. The UI is styled with Tailwind CSS and features animations powered by GSAP. The routing is handled by TanStack Router, and data fetching is managed with TanStack Query.

The application has a login screen that leads to a desktop environment. The desktop includes icons to open different sections of the portfolio, such as "About Me," "Resume," "Projects," "Blog," "Links," and "Contact Me." These sections are displayed in draggable and resizable windows.

# Building and Running

## Development

To run the application in development mode:

```bash
yarn install
yarn dev
```

This will start a development server, typically on `http://localhost:3000`.

## Production

To build the application for production:

```bash
yarn build
```

This will create a `dist` directory with the optimized production build.

To preview the production build locally:

```bash
yarn serve
```

# Testing

The project uses Vitest for testing. To run the tests:

```bash
yarn test
```

# Development Conventions

*   **Styling:** The project uses Tailwind CSS for styling. Utility classes are preferred over custom CSS.
*   **Components:** Components are organized in the `src/components` directory. Reusable UI components are located in `src/components/ui`.
*   **Routing:** The project uses file-based routing with TanStack Router. Routes are defined as files in the `src/routes` directory.
*   **State Management:** TanStack Query is used for server state management, and component state is managed with React hooks.
*   **Animations:** GSAP is used for animations to create a more interactive and engaging user experience.
*   **Code Quality:** The project is configured with TypeScript for static typing and likely uses a linter (though not explicitly configured in the provided files) to maintain code quality.
