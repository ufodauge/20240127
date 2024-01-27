import { Edge } from "./edge.ts";
import { DirectedGraph } from "./graph.ts";
import { createVertex } from "./vertex.ts";
import { range } from "../utils/range.ts";
import { ArrayUtils } from "../utils/shuffle.ts";
import { Vertex } from "./types/mod.ts";
import { Cost } from "./cost.ts";

const AVE_DEGREE = 4;
const MAX_BIT_LENGTH = 12;

export function createRandomSpanningTree<Dimension extends number>(
    dimension: Dimension,
    verticesCount: number,
    options?: {
        maxBitLength?: number;
    },
): {
    graph: DirectedGraph<Dimension>;
    start: Vertex;
} {
    const startVertex = createVertex(0).expect("Never failures");
    const maxBitLength = options?.maxBitLength ?? MAX_BIT_LENGTH;

    const graph = new DirectedGraph(dimension);

    const vertices = [...new Array(verticesCount - 1)].map((_, i) =>
        createVertex(i + 1).expect("Never failures")
    );
    ArrayUtils.shuffle(vertices);
    vertices.push(startVertex);

    for (const i of range(verticesCount - 1)) {
        const v_a = vertices[i];

        const j = Math.ceil((verticesCount - 1 - i) * Math.random()) + i;
        const v_b = vertices[j];

        const cost = Cost.random(dimension, maxBitLength);
        const edge = new Edge([v_b, v_a], cost);
        graph.addEdge(edge);
    }

    return {
        graph,
        start: startVertex,
    };
}

export function createRandomConnectedGraph<Dimension extends number>(
    dimension: Dimension,
    verticesCount: number,
    options?: {
        aveDegree?: number;
        maxBitLength?: number;
    },
): {
    graph: DirectedGraph<Dimension>;
    start: Vertex;
} {
    const aveDegree = options?.aveDegree ?? AVE_DEGREE;
    const maxBitLength = options?.maxBitLength ?? MAX_BIT_LENGTH;

    const startVertex = createVertex(0).expect("Never failures");

    const graph = new DirectedGraph(dimension);

    const vertices = [...new Array(verticesCount - 1)].map((_, i) =>
        createVertex(i + 1).expect("Never failures")
    );
    ArrayUtils.shuffle(vertices);
    vertices.push(startVertex);

    for (const i of range(verticesCount - 1)) {
        const v_a = vertices[i];

        let j = i;
        let connected = false;
        while (j < verticesCount) {
            j += Math.ceil(verticesCount * Math.random() / aveDegree);

            const v_b = vertices[j];
            if (v_b === undefined) {
                break;
            }

            const cost = Cost.random(dimension, maxBitLength);
            const edge = new Edge([v_b, v_a], cost);
            graph.addEdge(edge);
            connected = true;
        }

        if (connected === false) {
            j = Math.ceil((verticesCount - 1 - i) * Math.random()) + i;
            const v_b = vertices[j];

            const cost = Cost.random(dimension, maxBitLength);
            const edge = new Edge([v_b, v_a], cost);
            graph.addEdge(edge);
        }
    }

    return {
        graph,
        start: startVertex,
    };
}
