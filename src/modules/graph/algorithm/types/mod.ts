import { ICost, Vertex } from "../../types/mod.ts";

export interface ILabel<Dimension extends number> {
    readonly cost: ICost<Dimension>;
    readonly vertex: Vertex;
    readonly prev?: ILabel<Dimension>;

    isDominatedBy(labels: ILabel<Dimension>[]): boolean;

    constructPath(): Vertex[];
}

export interface ICostMap<
    D extends number,
    R extends ICost<D> | bigint,
> {
    readonly read: (c: ICost<D>) => R;
}
