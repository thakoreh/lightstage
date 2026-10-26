import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], root: 'example', build: {outDir:'../showcase',emptyOutDir:true}, server:{port:4173,strictPort:true} });
