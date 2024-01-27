import { assert } from "std/assert/assert.ts";
import { assertEquals } from "std/assert/assert_equals.ts";
import { assertGreater } from "std/assert/assert_greater.ts";
import { dijkstra } from "../algorithm/dijkstra.ts";
import {
    createRandomConnectedGraph,
    createRandomSpanningTree,
} from "../createConnectedGraph.ts";
import { createVertex } from "../vertex.ts";
import ProgressBar from "x/progress@v1.4.4/mod.ts";
import { CostMap } from "../algorithm/costMap.ts";

Deno.test("Create Spanning Tree", () => {
    const VERTICES_COUNT = 10;

    const {
        graph,
    } = createRandomSpanningTree(4, VERTICES_COUNT);

    assertEquals(graph.dimension, 4);
    for (const [, edgeSet] of graph.edges) {
        for (const edge of edgeSet) {
            const { vertices: [, to] } = edge;

            assertGreater(VERTICES_COUNT, to);
        }
    }

    const { graph: graph2, start: v_s } = createRandomSpanningTree(
        1,
        VERTICES_COUNT,
    );

    for (let i = 0; i < VERTICES_COUNT - 1; i++) {
        const v_t = createVertex(i + 1).expect("Never failures.");

        const path = dijkstra(graph2, v_s, v_t, new CostMap((c) => c.sum()));

        assert(
            path.isOk(),
            `Path doesn't found at trial ${i}, from ${v_s} to ${v_t}`,
        );
    }
});

Deno.test("Create Connected Graph", async () => {
    const VERTICES_COUNT = 100;
    const AVE_DEGREE = 6;

    const { graph } = createRandomConnectedGraph(4, VERTICES_COUNT, {
        aveDegree: AVE_DEGREE,
    });

    assertEquals(graph.dimension, 4);
    for (const edges of graph.edges.values()) {
        for (const edge of edges) {
            const [from, to] = edge.vertices;

            assertGreater(VERTICES_COUNT, from);
            assertGreater(VERTICES_COUNT, to);
        }
    }

    const { graph: graph2, start: v_s } = createRandomConnectedGraph(
        1,
        VERTICES_COUNT,
        {
            aveDegree: AVE_DEGREE,
        },
    );

    const progress = new ProgressBar({
        total: VERTICES_COUNT,
    });
    let completed = 0;

    for (let i = 0; i < VERTICES_COUNT - 1; i++) {
        const v_t = createVertex(i + 1).expect("Never failures.");

        const path = dijkstra(graph2, v_s, v_t, new CostMap((c) => c.sum()));

        assert(path.isOk(), `There's any paths from ${v_s} to ${v_t}.`);
        await progress.render(++completed);
    }
    await progress.render(++completed);
});

Deno.test("Performance test", () => {
    const VERTICES_COUNT = 3000;
    const AVE_DEGREE = 6;

    createRandomConnectedGraph(4, VERTICES_COUNT, {
        aveDegree: AVE_DEGREE,
    });
});
