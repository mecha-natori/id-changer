import { hono, jsx } from '@ms0503/oxc-config/lint';
import { convertGlobals } from '@ms0503/oxc-config/utils';
import globals from 'globals';
import { defineConfig } from 'oxlint';

export default defineConfig({
    extends: [hono, jsx],
    ignorePatterns: [],
    options: { typeAware: true, typeCheck: true },
    overrides: [
        {
            files: ['app/**/*.ts', 'app/**/*.tsx'],
            globals: convertGlobals({
                ...globals.browser,
                ...globals.builtin,
                ...globals.es2026,
                ...globals.node
            })
        },
        {
            files: [
                'app/routes/**/*.ts',
                'app/routes/**/*.tsx',
                'app/server.ts'
            ],
            rules: {
                'import/no-default-export': 'off',
                'import/no-named-default': 'off'
            }
        },
        {
            files: ['oxfmt.config.ts', 'oxlint.config.ts', 'vite.config.ts'],
            globals: convertGlobals({
                ...globals.builtin,
                ...globals.es2026,
                ...globals.node
            }),
            rules: {
                'import/extensions': [
                    'error',
                    'always',
                    { ignorePackages: true }
                ],
                'import/no-relative-parent-imports': 'off'
            }
        }
    ],
    rules: {
        'import/extensions': [
            'error',
            'never',
            { ignorePackages: true, json: 'always' }
        ],
        // incompatible with hono/jsx (expected `htmlFor` but hono/jsx uses `for`)
        'jsx-a11y/label-has-associated-control': 'off'
    }
});
