export type Result<T, E> = Success<T, E> | Failure<T, E>;

interface IResult<T, E> {
    isOk(): this is Success<T, E>;
    isErr(): this is Failure<T, E>;
    unwrapOr(v: T): T;
    map<U>(fn: (v: T) => U): IResult<U, E>;
    mapOr<U>(def: U, fn: (v: T) => U): IResult<U, E>;
    mapErr<F>(fn: (e: E) => F): IResult<T, F>;
    expect(message: string): T;
}

export class Success<T, E> implements IResult<T, E> {
    public readonly value: T;

    constructor(value: T) {
        this.value = value;
    }

    isOk(): this is Success<T, E> {
        return true;
    }

    isErr(): this is Failure<T, E> {
        return false;
    }

    unwrapOr() {
        return this.value;
    }

    map<U>(fn: (v: T) => U): IResult<U, E> {
        return new Success(fn(this.value));
    }

    mapOr<U>(_: U, fn: (v: T) => U): IResult<U, E> {
        return this.map(fn);
    }

    mapErr<F>(_: (e: E) => F): IResult<T, F> {
        return new Success(this.value);
    }

    expect() {
        return this.value;
    }
}

export class Failure<T, E> implements IResult<T, E> {
    public readonly error: E;

    constructor(error: E) {
        this.error = error;
    }

    isOk(): this is Success<T, E> {
        return false;
    }

    isErr(): this is Failure<T, E> {
        return true;
    }

    unwrapOr(v: T) {
        return v;
    }

    map<U>(): IResult<U, E> {
        return new Failure(this.error);
    }

    mapOr<U>(def: U, _: (v: T) => U): IResult<U, E> {
        return new Success(def);
    }

    mapErr<F>(fn: (e: E) => F): IResult<T, F> {
        return new Failure(fn(this.error));
    }

    // never returns Success.
    expect(message: string): T {
        throw new Error(message);
    }
}

export const ok = <T, E>(value: T) => {
    return new Success<T, E>(value);
};

export const err = <T, E>(err: E) => {
    return new Failure<T, E>(err);
};
