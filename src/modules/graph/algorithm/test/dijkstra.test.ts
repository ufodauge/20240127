import { assertEquals } from "https://deno.land/std@0.209.0/assert/mod.ts";
import { dijkstra } from "../dijkstra.ts";
import { Cost } from "../../cost.ts";
import { DirectedGraph } from "../../graph.ts";
import { createVertex } from "../../vertex.ts";
import { Edge } from "../../edge.ts";
import { assert } from "std/assert/assert.ts";
import { CostMap } from "../costMap.ts";

const V = new Array(6).fill(0).map((_, i) =>
    createVertex(i).expect("Never failures.")
);

Deno.test("Dijkstra test", () => {
    const COST_DIMENSION = 1;
    const builder = new DirectedGraph(COST_DIMENSION);

    builder
        .addEdge(new Edge([V[0], V[1]], Cost.fromValues(2n)))
        .addEdge(new Edge([V[0], V[2]], Cost.fromValues(5n)))
        .addEdge(new Edge([V[0], V[3]], Cost.fromValues(4n)))
        .addEdge(new Edge([V[1], V[0]], Cost.fromValues(2n)))
        .addEdge(new Edge([V[1], V[3]], Cost.fromValues(3n)))
        .addEdge(new Edge([V[1], V[4]], Cost.fromValues(6n)))
        .addEdge(new Edge([V[2], V[0]], Cost.fromValues(5n)))
        .addEdge(new Edge([V[2], V[3]], Cost.fromValues(2n)))
        .addEdge(new Edge([V[2], V[5]], Cost.fromValues(6n)))
        .addEdge(new Edge([V[3], V[0]], Cost.fromValues(4n)))
        .addEdge(new Edge([V[3], V[1]], Cost.fromValues(3n)))
        .addEdge(new Edge([V[3], V[2]], Cost.fromValues(2n)))
        .addEdge(new Edge([V[3], V[4]], Cost.fromValues(2n)))
        .addEdge(new Edge([V[4], V[1]], Cost.fromValues(6n)))
        .addEdge(new Edge([V[4], V[3]], Cost.fromValues(2n)))
        .addEdge(new Edge([V[4], V[5]], Cost.fromValues(4n)))
        .addEdge(new Edge([V[5], V[2]], Cost.fromValues(6n)))
        .addEdge(new Edge([V[5], V[4]], Cost.fromValues(4n)));

    const graph = builder;

    const shortestCost = dijkstra(graph, V[0], V[5], new CostMap((c) => c.sum()));

    assert(shortestCost.isOk());

    assertEquals(shortestCost.value, 10n);
});
