import { BigIntMath } from "../utils/bigint.ts";
import { zip } from "../utils/zip.ts";
import { ICost, IFixedLengthArray } from "./types/mod.ts";

const createFixedLengthArray = <Length extends number>(
    length: Length,
): IFixedLengthArray<bigint, Length> => {
    return new Array<bigint>(length).fill(0n) as IFixedLengthArray<
        bigint,
        Length
    >;
};

export class Cost<const Dimension extends number> implements ICost<Dimension> {
    readonly values: IFixedLengthArray<bigint, Dimension>;

    protected setValues(values: IFixedLengthArray<bigint, Dimension>) {
        Object.assign(this.values, values);
    }

    get length(): Dimension {
        return this.values.length as Dimension;
    }

    constructor(length: Dimension) {
        this.values = createFixedLengthArray(length);
    }

    sum(): bigint {
        return this.values.reduce((acc, v) => acc + v, 0n);
    }

    isGeq(target: ICost<Dimension>): boolean {
        const selfIter = this.values.values();
        const otherIter = target.values.values();

        for (const [s, o] of zip(selfIter, otherIter)) {
            if (s < o) {
                return false;
            }
        }

        return true;
    }

    isLeq(target: ICost<Dimension>): boolean {
        const selfIter = this.values.values();
        const otherIter = target.values.values();

        for (const [s, o] of zip(selfIter, otherIter)) {
            if (s > o) {
                return false;
            }
        }

        return true;
    }

    isDominatedBy(target: ICost<Dimension>): boolean {
        const selfIter = this.values.values();
        const otherIter = target.values.values();

        let isEqual = true;
        for (const [s, o] of zip(selfIter, otherIter)) {
            if (o > s) {
                return false;
            } else if (o < s) {
                isEqual = false;
            }
        }

        return isEqual === false;
    }

    toAdded(
        target: ICost<Dimension>,
    ): ICost<Dimension> {
        return Cost.fromValues(
            ...this.values.map((v, i) => v + target.values[i]) as never,
        );
    }

    toSubtracted(
        target: ICost<Dimension>,
    ): ICost<Dimension> {
        return Cost.fromValues(
            ...this.values.map((v, i) => v - target.values[i]) as never,
        );
    }

    map(op: (v: bigint, i: number) => bigint): ICost<Dimension> {
        return Cost.fromValues(...this.values.map(op) as never);
    }

    static fromValues<const Dimension extends number>(
        ...values: IFixedLengthArray<bigint, Dimension>
    ): Cost<Dimension> {
        const cost = new Cost(values.length as Dimension);
        cost.setValues(values);
        return cost;
    }

    static random<const Dimension extends number>(
        dimension: Dimension,
        bitLength: number,
    ): Cost<Dimension> {
        const cost = new Cost(dimension);
        const values = [...new Array(dimension)].map(() =>
            BigIntMath.random(bitLength)
        ) as IFixedLengthArray<bigint, Dimension>;
        cost.setValues(values);
        return cost;
    }
}
