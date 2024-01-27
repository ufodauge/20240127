import { IDirectedGraph, Vertex } from "./types/mod.ts";
import { Edge } from "./edge.ts";

export class DirectedGraph<Dimension extends number>
    implements IDirectedGraph<Dimension> {
    readonly edges: Map<Vertex, Set<Edge<Dimension>>>;
    readonly dimension: Dimension;

    constructor(dimension: Dimension) {
        this.edges = new Map();
        this.dimension = dimension;
    }

    addEdge(edge: Edge<Dimension>) {
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

    clone(): DirectedGraph<Dimension> {
        const graph = new DirectedGraph(this.dimension);

        this.edges.forEach((edgeSet) => {
            edgeSet.forEach((edge) => {
                graph.addEdge(edge.clone());
            });
        });

        return graph;
    }
}

// export class UndirectedGraph<Dimension extends number>
//     implements IUndirectedGraph<Dimension> {
//     readonly edges: Map<Vertex, Set<Edge<Dimension>>>;
//     readonly dimension: Dimension;

//     constructor(dimension: Dimension) {
//         this.edges = new Map();
//         this.dimension = dimension;
//     }

//     addEdge(edge: Edge<Dimension>) {
//         const { vertices } = edge;

//         for (const vertex of vertices) {
//             const edgeSet = this.edges.get(vertex);
//             if (edgeSet) {
//                 this.edges.set(
//                     vertex,
//                     edgeSet.add(edge),
//                 );
//             } else {
//                 this.edges.set(
//                     vertex,
//                     new Set([edge]),
//                 );
//             }
//         }

//         return this;
//     }

//     hasEdgeOf(vertices: [Vertex, Vertex]): boolean {
//         const [v_a, v_b] = vertices;
//         const edges = this.edges.get(v_a);
//         if (edges === undefined) {
//             return false;
//         }

//         for (const edge of edges.values()) {
//             if (edge.getOpponent(v_a) === v_b) {
//                 return true;
//             }
//         }

//         return false;
//     }

//     getDegree(from: Vertex): number {
//         const edge = this.edges.get(from);
//         return edge?.size ?? 0;
//     }
// }
