import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {InjectCssToJsPlugin} from 'vite-plugin-inject-css-to-js';

export default defineConfig({
    plugins: [
        react(),
        InjectCssToJsPlugin(),
    ],
    build: {
        minify: true,
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: undefined,
                dir: './dist/',
                entryFileNames: 'ha-view-access-panel.js',
                format: 'es',
                inlineDynamicImports: true,
            },
        },
    },
});
