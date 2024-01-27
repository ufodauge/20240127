import { FibonacciHeap } from "npm:@tyriar/fibonacci-heap";

import { IGraph, Vertex } from "../types/mod.ts";
import { err, ok, Result } from "../../utils/result.ts";
import { CostMap } from "./costMap.ts";

export function dijkstra<Dimension extends number>(
    { edges }: IGraph<Dimension>,
    v_s: Vertex,
    v_t: Vertex,
    costMap: CostMap<Dimension, bigint>,
): Result<bigint, string> {
    const heap = new FibonacciHeap<bigint, Vertex>();
    const costs: Record<Vertex, bigint> = {};

    costs[v_s] = 0n;
    heap.insert(0n, v_s);

    while (!heap.isEmpty()) {
        const min = heap.extractMinimum()!;
        const cost = min.key;
        const from = min.value!;

        const costOfFrom = costs[from];
        if (costOfFrom < cost) {
            continue;
        }

        const outEdges = edges.get(from);
        if (outEdges === undefined) {
            // There's no edges from vertex 'from'.
            continue;
        }

        for (const outEdge of outEdges) {
            const cost = outEdge.cost;
            const to = outEdge.getOpponent(from);

            const newCost = costMap.read(cost) + costOfFrom;
            const costOfTo = costs[to];
            if (costOfTo === undefined || newCost < costOfTo) {
                costs[to] = newCost;
                heap.insert(newCost, to);
            }
        }
    }

    const cost = costs[v_t];
    if (cost === undefined) {
        return err(`There's any found path from ${v_s} to ${v_t}.`);
    } else {
        return ok(cost);
    }
}
