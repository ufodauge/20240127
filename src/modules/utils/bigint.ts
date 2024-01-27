import { randomBigIntBits } from "x/random_bigint@v1.5/src/randomBigInt.ts";

export const BigIntMath = {
    max(...arr: bigint[]) {
        return arr.reduce((acc, v) => acc > v ? acc : v);
    },
    min(...arr: bigint[]) {
        return arr.reduce((acc, v) => acc > v ? acc : v);
    },
    random(maxBitLength: number): bigint {
        return randomBigIntBits(maxBitLength) >>
            BigInt(Math.floor(Math.random() * maxBitLength));
    },
} as const;
