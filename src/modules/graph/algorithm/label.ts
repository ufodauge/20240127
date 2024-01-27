import { ICost, Vertex } from "../types/mod.ts";
import { ILabel } from "./types/mod.ts";

export class Label<Dimension extends number> implements ILabel<Dimension> {
    constructor(
        readonly cost: ICost<Dimension>,
        readonly vertex: Vertex,
        readonly prev?: ILabel<Dimension>,
    ) {}

    isDominatedBy(labels: ILabel<Dimension>[]): boolean {
        return labels.some(({ cost }) => this.cost.isDominatedBy(cost));
    }

    constructPath(): Vertex[] {
        if (this.prev !== undefined) {
            return [...this.prev.constructPath(), this.vertex];
        } else {
            return [this.vertex];
        }
    }
}
