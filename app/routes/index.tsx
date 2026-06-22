import type { JSX } from 'hono/jsx/jsx-runtime';

export default function Page(): JSX.Element {
    return (
        <div class="h-full w-full">
            <h1>基板IDチェンジャー</h1>
            <p>メカトロ製基板のCANのIDを変更します。(WIP)</p>
        </div>
    );
}
