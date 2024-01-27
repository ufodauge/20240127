type RangeParam = Readonly<{
    to: number;
    from?: number;
    step?: number | ((v: number) => number);
}>;

export function* range(
    value: number | RangeParam,
) {
    const isOnlyNumberType = typeof value === "number";

    if (isOnlyNumberType) {
        yield* numberRange({
            from: 0,
            to: value,
            step: 1,
        });
    } else {
        yield* numberRange({
            from: value.from ?? 0,
            to: value.to,
            step: value.step ?? 1,
        });
    }
}

function* numberRange(
    params: Required<RangeParam>,
) {
    let current = params.from;
    const { to, step } = params;

    const stepFunc = typeof step === "number" ? (v: number) => v + step : step;

    while (current < to) {
        yield current;
        current += stepFunc(current);
    }
}
