import { ICost, IEdge, Vertex } from "./types/mod.ts";

export class Edge<const Dimension extends number> implements IEdge<Dimension> {
    constructor(
        public readonly vertices: readonly [Vertex, Vertex],
        public readonly cost: ICost<Dimension>,
    ) {
    }

    getOpponent(vertex: Vertex): Vertex {
        if (vertex === this.vertices[0]) {
            return this.vertices[1];
        } else {
            return this.vertices[0];
        }
    }

    clone(): Edge<Dimension> {
        return new Edge(
            [this.vertices[0], this.vertices[1]],
            this.cost.map((v) => v),
        );
    }
}
