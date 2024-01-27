import { ICost } from "../types/mod.ts";
import { ICostMap } from "./types/mod.ts";

export class CostMap<
    D extends number,
    R extends ICost<D> | bigint,
> implements ICostMap<D, R> {
    private cache: Map<ICost<D>, R>;

    constructor(
        public readonly fn: (c: ICost<D>) => R,
    ) {
        this.cache = new Map();
    }

    public read(c: ICost<D>): R {
        const cost = this.cache.get(c);
        if (cost) {
            return cost;
        } else {
            const result = this.fn(c);
            this.cache.set(c, result);
            return result;
        }
    }
}
