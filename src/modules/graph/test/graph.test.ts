import { assertEquals } from "std/assert/mod.ts";
import { Cost } from "../cost.ts";
import { DirectedGraph } from "../graph.ts";
import { Edge } from "../edge.ts";
import { createVertex } from "../vertex.ts";
import { ok } from "../../utils/result.ts";

Deno.test("DirectedGraph test", () => {
    const COST_DIMENSION = 2;
    const builder = new DirectedGraph(COST_DIMENSION);

    const v0 = createVertex(0).expect("Never Failure");
    const v1 = createVertex(1).expect("Never Failure");
    const v2 = createVertex(2).expect("Never Failure");
    const v3 = createVertex(3).expect("Never Failure");

    const e0 = new Edge([v0, v1], Cost.fromValues(0n, 1n));
    const e1 = new Edge([v1, v2], Cost.fromValues(3n, 1n));
    const e2 = new Edge([v0, v3], Cost.fromValues(2n, 2n));
    const e3 = new Edge([v2, v3], Cost.fromValues(4n, 2n));

    const graph = builder
        .addEdge(e0)
        .addEdge(e1)
        .addEdge(e2)
        .addEdge(e3);

    assertEquals(graph.getOutDegree(v0), 2);
    assertEquals(graph.getOutDegree(v1), 1);
    assertEquals(graph.getOutDegree(v2), 1);
    assertEquals(graph.getOutDegree(v3), 0);
    assertEquals(graph.hasEdgeOf([v0, v1]), true);
    assertEquals(graph.hasEdgeOf([v0, v2]), false);

    assertEquals(graph.dimension, 2);
    assertEquals(
        graph.edges,
        new Map([
            [v0, new Set([e0, e2])],
            [v1, new Set([e1])],
            [v2, new Set([e3])],
            [v3, new Set([])]
        ]),
    );

    assertEquals(
        graph.getCostFromPath([v0, v1, v2, v3]),
        ok(Cost.fromValues(7n, 4n))
    )
});
