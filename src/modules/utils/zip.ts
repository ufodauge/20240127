export function* zip<T, U>(
    a: IterableIterator<T>,
    b: IterableIterator<U>,
) {
    while (true) {
        const a_result = a.next();
        const b_result = b.next();

        if (a_result.done || b_result.done) {
            return;
        }

        yield [a_result.value, b_result.value] as const;
    }
}
