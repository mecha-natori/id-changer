import { getAllBoardNames } from '@/lib/boards';
import { createRoute } from 'honox/factory';

export default createRoute(async c => {
    const boards = getAllBoardNames();
    return c.render(
        <div class="flex h-full w-full flex-col items-center justify-center">
            <h1>基板IDチェンジャー</h1>
            <p>メカトロ製基板のCANのIDを変更します。</p>
            <form
                class="flex flex-col gap-8"
                method="post"
            >
                <div class="flex flex-col gap-4">
                    <label for="board">基板:</label>
                    <select id="board">
                        {boards.map(async board => (
                            <option
                                key={board}
                                value={board}
                            >
                                {board}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    class="rounded-2xl bg-(--foreground) px-12 py-4 text-(--background)"
                    type="submit"
                >
                    変更
                </button>
            </form>
        </div>
    );
});

export const POST = createRoute(c => {
    c.status(204);
    return c.body(null);
});
