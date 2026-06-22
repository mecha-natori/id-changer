import { jsxRenderer } from 'hono/jsx-renderer';
import { Link, Script } from 'honox/server';

export default jsxRenderer(async ({ children }) => (
    <html lang="ja">
        <head>
            <meta charset="utf-8" />
            <meta
                content="initial-scale=1,viewport-fit=cover,width=device-width"
                name="viewport"
            />
            <title>基板IDチェンジャー</title>
            <Link
                href="/app/style.css"
                rel="stylesheet"
            />
            <Script
                async
                src="/app/client.ts"
            />
        </head>
        <body class="h-full w-full">{children}</body>
    </html>
));
