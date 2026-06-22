import adapter from '@hono/vite-dev-server/node';
import ssg from '@hono/vite-ssg';
import tailwindcss from '@tailwindcss/vite';
import honox from 'honox/vite';
import { defineConfig } from 'vite';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
    build: {
        assetsDir: 'static',
        cssMinify: 'lightningcss',
        emptyOutDir: false,
        minify: 'oxc',
        ssrEmitAssets: true
    },
    clearScreen: false,
    plugins: [
        ssg({ entry: './app/server.ts' }),
        honox({
            client: { input: ['/app/client.ts', '/app/style.css'] },
            devServer: { adapter }
        }),
        tailwindcss()
    ],
    resolve: { builtins: [/^node:/u], tsconfigPaths: true },
    server: {
        hmr: host ? { host, port: 1421, protocol: 'ws' } : false,
        host: host ?? false,
        port: 1420,
        strictPort: true,
        watch: {
            ignored: [
                '**/*.nix',
                '**/Cargo.*',
                '**/Tauri.toml',
                '**/capabilities/**',
                '**/flake.*',
                '**/gen/**',
                '**/icons/**',
                '**/nix/**',
                '**/result',
                '**/src/**',
                '**/target/**'
            ]
        }
    },
    ssr: { target: 'node' }
});
