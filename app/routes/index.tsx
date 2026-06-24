import { getAllBoardNames } from '@/lib/boards';
import { createRoute } from 'honox/factory';

export default createRoute(async c => {
    const boards = getAllBoardNames();
    return c.render(
        <div class="flex h-full w-full flex-col items-center justify-center">
            <h1>基板IDチェンジャー</h1>
            <p>メカトロ製基板のCANのIDを変更します。</p>
            <form
                class="my-8 flex flex-col items-center justify-center gap-8"
                method="post"
            >
                <div class="flex flex-col gap-1">
                    <label for="board">基板:</label>
                    <select
                        class="rounded-xl px-2 py-1"
                        id="board"
                    >
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
                    class="max-w-40 cursor-pointer rounded-4xl bg-(--foreground) px-12 py-3 text-(--background) transition-colors duration-200 hover:bg-(--hover-background) hover:text-(--hover-foreground)"
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
