import { assert, assertEquals } from "std/assert/mod.ts";

import { Cost } from "../../cost.ts";
import { DirectedGraph } from "../../graph.ts";
import { createVertex } from "../../vertex.ts";
import { Edge } from "../../edge.ts";
import { ICost } from "../../types/mod.ts";
import { createRandomConnectedGraph } from "../../createConnectedGraph.ts";
import { solveFptasMosp } from "../fptas_mosp.ts";
import { solveMosp } from "../mosp.ts"

const V0 = createVertex(0).expect("Never failures.");
const V1 = createVertex(1).expect("Never failures.");
const V2 = createVertex(2).expect("Never failures.");
const V3 = createVertex(3).expect("Never failures.");
const V4 = createVertex(4).expect("Never failures.");
const V5 = createVertex(5).expect("Never failures.");

const COST_DIMENSION = 2;
const evaluator = (c: ICost<typeof COST_DIMENSION>) =>
    c.values.reduce((acc, v) => acc >= v ? acc : v);

const graph = new DirectedGraph(COST_DIMENSION);

graph
    .addEdge(new Edge([V0, V1], Cost.fromValues(2n, 2n)))
    .addEdge(new Edge([V0, V2], Cost.fromValues(4n, 3n)))
    .addEdge(new Edge([V0, V3], Cost.fromValues(3n, 1n)))
    .addEdge(new Edge([V0, V5], Cost.fromValues(1000n, 1000n)))
    .addEdge(new Edge([V1, V0], Cost.fromValues(2n, 2n)))
    .addEdge(new Edge([V1, V3], Cost.fromValues(0n, 6n)))
    .addEdge(new Edge([V1, V4], Cost.fromValues(8n, 6n)))
    .addEdge(new Edge([V2, V0], Cost.fromValues(4n, 3n)))
    .addEdge(new Edge([V2, V3], Cost.fromValues(5n, 1n)))
    .addEdge(new Edge([V2, V5], Cost.fromValues(9n, 7n)))
    .addEdge(new Edge([V3, V0], Cost.fromValues(3n, 1n)))
    .addEdge(new Edge([V3, V1], Cost.fromValues(0n, 6n)))
    .addEdge(new Edge([V3, V2], Cost.fromValues(5n, 1n)))
    .addEdge(new Edge([V3, V4], Cost.fromValues(8n, 4n)))
    .addEdge(new Edge([V4, V1], Cost.fromValues(8n, 6n)))
    .addEdge(new Edge([V4, V3], Cost.fromValues(8n, 4n)))
    .addEdge(new Edge([V4, V5], Cost.fromValues(1n, 9n)))
    .addEdge(new Edge([V5, V0], Cost.fromValues(1000n, 1000n)))
    .addEdge(new Edge([V5, V2], Cost.fromValues(9n, 7n)))
    .addEdge(new Edge([V5, V4], Cost.fromValues(1n, 9n)));

Deno.test("MOSP test", () => {
    const shortestPath = solveMosp(graph, V0, V5, evaluator);

    assert(shortestPath.isOk(), "Failed to find shortest path.");
    assertEquals(shortestPath.value, [V0, V2, V5]);
});

Deno.test("FPTAS MOSP test", () => {
    const shortestPath = solveFptasMosp(graph, V0, V5, evaluator, {
        denom: 5n,
        numer: 1n,
    });

    assert(shortestPath.isOk(), "Failed to find shortest path.");
    assertEquals(shortestPath.value, [V0, V2, V5]);
});

Deno.test("Performance test", () => {
    const VERTICES_COUNT = 6000;
    const AVE_DEGREE     = 12;
    const MAX_BIT_LENGTH = 2000;

    const { graph, start } = createRandomConnectedGraph(2, VERTICES_COUNT, {
        aveDegree: AVE_DEGREE,
        maxBitLength: MAX_BIT_LENGTH,
    });

    console.time("mosp");
    solveMosp(graph.clone(), start, V4, evaluator);
    console.timeEnd("mosp");

    const cloned = graph.clone()

    console.time("fptas-mosp");
    console.group("fptas-mosp");
    solveFptasMosp(cloned, start, V4, evaluator, {
        denom: 10n,
        numer: 2n,
    });
    console.groupEnd();
    console.timeEnd("fptas-mosp");
});
