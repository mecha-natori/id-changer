// oxlint-disable import/no-empty-named-blocks, unicorn/require-module-specifiers
// noinspection ES6UnusedImports
import type {} from 'hono';
// oxlint-enable import/no-empty-named-blocks, unicorn/require-module-specifiers

declare module 'hono' {
    interface Env {
        Bindings: object;
        Variables: object;
    }
}
