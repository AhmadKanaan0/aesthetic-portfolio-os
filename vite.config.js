import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ 
      autoCodeSplitting: true,
      generatedRouteTree: './src/routeTree.gen.ts'
    }), 
    viteReact({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Optimize React in production
      babel: {
        plugins: process.env.NODE_ENV === 'production' ? [
          ['babel-plugin-react-remove-properties', { properties: ['data-testid'] }]
        ] : []
      }
    }), 
    tailwindcss()
  ],
  test: {
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    // Optimize build output
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          ui: ['@radix-ui/react-avatar', '@radix-ui/react-dropdown-menu', '@radix-ui/react-slider'],
          motion: ['motion'],
          utils: ['clsx', 'tailwind-merge', 'date-fns']
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable source maps in development
    sourcemap: process.env.NODE_ENV === 'development'
  },
  optimizeDeps: {
    // Pre-bundle dependencies for faster dev server startup
    include: [
      'react',
      'react-dom',
      '@tanstack/react-router',
      '@tanstack/react-query',
      'motion',
      'lucide-react',
      'date-fns',
      'clsx',
      'tailwind-merge'
    ],
    // Exclude large dependencies that don't need pre-bundling
    exclude: ['@dnd-kit/core']
  },
  server: {
    // Enable HTTP/2 for better performance
    https: false,
    // Optimize HMR
    hmr: {
      overlay: true
    }
  },
  // Enable CSS code splitting
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase'
    }
  }
});