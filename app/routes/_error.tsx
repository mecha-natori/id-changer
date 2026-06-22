import type { ErrorHandler } from 'hono';

const handler: ErrorHandler = async (e, c) => {
    if ('getResponse' in e) {
        return e.getResponse();
    }
    console.error(e.message);
    c.status(500);
    return c.render(
        <>
            <h1>エラーが発生しました</h1>
            <p>
                このエラーはバグである可能性が高いため、開発者へ報告することをおすすめします。
            </p>
        </>
    );
};

export default handler;
