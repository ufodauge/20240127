import { IDirectedGraph, Vertex } from "./types/mod.ts";
import { Edge } from "./edge.ts";
import { ICost } from "./types/mod.ts";
import { zip } from "../utils/zip.ts";
import { Result, err, ok } from "../utils/result.ts";

export class DirectedGraph<D extends number>
    implements IDirectedGraph<D> {
    readonly edges: Map<Vertex, Set<Edge<D>>>;
    readonly dimension: D;

    constructor(dimension: D) {
        this.edges = new Map();
        this.dimension = dimension;
    }

    addEdge(edge: Edge<D>) {
        const { vertices: [from, to] } = edge;

        const edgeSet = this.edges.get(from);
        if (edgeSet) {
            this.edges.set(
                from,
                edgeSet.add(edge),
            );
        } else {
            this.edges.set(
                from,
                new Set([edge]),
            );
        }

        if (!this.edges.has(to)) {
            this.edges.set(to, new Set([]));
        }

        return this;
    }

    hasEdgeOf(vertices: [Vertex, Vertex]): boolean {
        const [v_a, v_b] = vertices;
        const edges = this.edges.get(v_a);
        if (edges === undefined) {
            return false;
        }

        for (const edge of edges.values()) {
            if (edge.getOpponent(v_a) === v_b) {
                return true;
            }
        }

        return false;
    }

    getOutDegree(vertex: Vertex): number {
        const edge = this.edges.get(vertex);
        return edge?.size ?? 0;
    }

    clone(): DirectedGraph<D> {
        const graph = new DirectedGraph(this.dimension);

        this.edges.forEach((edgeSet) => {
            edgeSet.forEach((edge) => {
                graph.addEdge(edge.clone());
            });
        });

        return graph;
    }

    getCostFromPath(path: Vertex[]): Result<ICost<D>, string> {
        const edgesIter = zip<Vertex, Vertex>(
            path.slice(0, -1).values(),
            path.slice(1).values(),
        )

        const costs = [];
        for (const [s, t] of edgesIter) {
            const edges = this.edges.get(s);
            if (!edges) {
                return err(`There's no edges from ${s}.`)
            }

            let isOk = false
            for (const edge of edges.values()) {
                if (edge.getOpponent(s) === t) {
                    costs.push(edge.cost);
                    isOk = true;
                    break;
                }
            }

            if (!isOk) {
                return err(`There's no edges from ${s} to ${t}.`)
            }
        }

        return ok(costs.reduce((acc, c) => acc.toAdded(c)))
    }
}


