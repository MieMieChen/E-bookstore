export async function handleBaseApiResponse(res, messageApi, onSuccess, onFail) {
    if (res) {
        await messageApi.success(res.message, 0.5);
        onSuccess?.();
    } else {
        await messageApi.error(res.message, 0.5);
        onFail?.();
    }
}