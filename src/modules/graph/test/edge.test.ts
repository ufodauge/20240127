import { assertEquals } from "std/assert/assert_equals.ts";
import { Edge } from "../edge.ts";
import { Cost } from "../cost.ts";
import { createVertex } from "../vertex.ts";

const VERTICES = [...new Array(10)].map((_, i) =>
    createVertex(i).expect("Never Failures")
);

Deno.test("Edge test", () => {
    const sampleEdge = new Edge([VERTICES[0], VERTICES[1]], new Cost(0));

    assertEquals(sampleEdge.vertices, [VERTICES[0], VERTICES[1]]);
    assertEquals(sampleEdge.cost, new Cost(0));
    assertEquals(sampleEdge.getOpponent(VERTICES[0]), VERTICES[1]);
    assertEquals(sampleEdge.getOpponent(VERTICES[1]), VERTICES[0]);
});
