export type Option<S> = Some<S> | None<S>;

interface IOption<S> {
    isSome(): this is Some<S>;
    isNone(): this is None<S>;
    unwrapOr(v: S): S;
    map<U>(fn: (v: S) => U): IOption<U>;
    mapOr<U>(def: U, fn: (v: S) => U): IOption<U>;
    expect(message: string): S;
}

export class Some<S> implements IOption<S> {
    public readonly value: S;

    constructor(value: S) {
        this.value = value;
    }

    isSome(): this is Some<S> {
        return true;
    }

    isNone(): this is None<S> {
        return false;
    }

    unwrapOr() {
        return this.value;
    }

    map<U>(fn: (v: S) => U): IOption<U> {
        return new Some(fn(this.value));
    }

    mapOr<U>(_: U, fn: (v: S) => U): IOption<U> {
        return this.map(fn);
    }

    expect() {
        return this.value;
    }
}

export class None<S> implements IOption<S> {
    isSome(): this is Some<S> {
        return false;
    }

    isNone(): this is None<S> {
        return true;
    }

    unwrapOr(v: S) {
        return v;
    }

    map<U>(): IOption<U> {
        return new None();
    }

    mapOr<U>(def: U, _: (v: S) => U): IOption<U> {
        return new Some(def);
    }

    // never returns Some.
    expect(message: string): S {
        throw new Error(message);
    }
}

export const some = <S>(value: S) => {
    return new Some<S>(value);
};

export const none = <S>() => {
    return new None<S>();
};
