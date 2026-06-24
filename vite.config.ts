import adapter from '@hono/vite-dev-server/node';
import ssg from '@hono/vite-ssg';
import tailwindcss from '@tailwindcss/vite';
import honox from 'honox/vite';
import client from 'honox/vite/client';
import { resolve } from 'node:path';
import picomatch from 'picomatch';
import { defineConfig, normalizePath } from 'vite';
import type { Plugin } from 'vite';

const host = process.env.TAURI_DEV_HOST;

const appDirectory = normalizePath(resolve(import.meta.dirname, 'app'));

const isIgnored = picomatch(
    [
        '**/*.nix',
        '**/.direnv/**',
        '**/.pre-commit-config.yaml',
        '**/flake.*',
        '**/nix/**',
        '**/result/**',
        '**/src-tauri/**'
    ],
    { dot: true }
);

function isServerSideAppFile(file: string): boolean {
    const normalized = normalizePath(file);
    return (
        normalized === resolve(appDirectory, 'server.ts') ||
        normalized.startsWith(resolve(appDirectory, 'routes'))
    );
}

function watchHonoxAppFiles(): Plugin {
    return {
        configureServer: server => {
            let restartTimer: null | ReturnType<typeof setTimeout> = null;

            function restartServer() {
                // oxlint-disable-next-line promise/prefer-await-to-callbacks
                server.restart().catch((err: unknown) => {
                    server.config.logger.error(String(err));
                });
            }

            function restart() {
                if (restartTimer) {
                    clearTimeout(restartTimer);
                }

                restartTimer = setTimeout(() => {
                    restartTimer = null;
                    restartServer();
                }, 50);
            }

            server.watcher.add(appDirectory);
            server.watcher.on('add', file => {
                if (!isIgnored(file) && isServerSideAppFile(file)) {
                    restart();
                }
            });
            server.watcher.on('change', file => {
                if (!isIgnored(file) && isServerSideAppFile(file)) {
                    restart();
                }
            });
            server.watcher.on('unlink', file => {
                if (!isIgnored(file) && isServerSideAppFile(file)) {
                    restart();
                }
            });
        },
        name: 'watch-honox-app-files'
    };
}

export default defineConfig(({ command, mode }) =>
    mode === 'client'
        ? {
              plugins: [
                  client({ input: ['/app/client.ts', '/app/style.css'] }),
                  tailwindcss()
              ]
          }
        : {
              build: {
                  assetsDir: 'static',
                  cssMinify: 'lightningcss',
                  emptyOutDir: false,
                  minify: 'oxc',
                  ssrEmitAssets: true
              },
              clearScreen: false,
              plugins: [
                  watchHonoxAppFiles(),
                  command === 'build'
                      ? ssg({ entry: './app/server.ts' })
                      : // oxlint-disable-next-line eslint/no-undefined
                        undefined,
                  honox({ devServer: { adapter } }),
                  tailwindcss()
              ],
              resolve: { builtins: [/^node:/u], tsconfigPaths: true },
              server: {
                  // oxlint-disable-next-line eslint/no-undefined
                  hmr: host ? { host, port: 1421, protocol: 'ws' } : undefined,
                  host: host ?? false,
                  port: 1420,
                  strictPort: true,
                  watch: {
                      followSymlinks: false,
                      ignored: file => isIgnored(file, false)
                  }
              },
              ssr: { target: 'node' }
          }
);
