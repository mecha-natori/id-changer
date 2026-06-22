import type { NotFoundHandler } from 'hono';

const handler: NotFoundHandler = async c => {
    c.status(404);
    return c.render(
        <>
            <h1>エラーが発生しました</h1>
            <p>
                このエラーはバグである可能性が非常に高いため、開発者へ報告することをおすすめします。
            </p>
        </>
    );
};

export default handler;
