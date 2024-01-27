import { ICost, IGraph, Vertex } from "../types/mod.ts";
import { err, ok, Result } from "../../utils/result.ts";
import { dijkstra } from "./dijkstra.ts";
import { CostMap } from "./costMap.ts";
import { solveMosp } from "./mosp.ts";

export const solveFptasMosp = <Dimension extends number>(
    graph: IGraph<Dimension>,
    v_s: Vertex,
    v_t: Vertex,
    evaluator: (cost: ICost<Dimension>) => bigint,
    epsilon: { numer: bigint; denom: bigint },
): Result<Vertex[], string> => {
    const dijkstraResult = dijkstra(
        graph,
        v_s,
        v_t,
        new CostMap((c) => c.sum()),
    );
    if (dijkstraResult.isErr()) {
        return err(`There's no path from ${v_s} to ${v_t}`);
    }

    const C = dijkstraResult.value;
    if (C === 0n) {
        return ok([]);
    }

    const K_numer = BigInt(graph.dimension * graph.edges.size) * epsilon.denom;
    const K_denom = epsilon.numer * C;

    for (const edgeSet of graph.edges.values()) {
        for (const edge of edgeSet) {
            if (edge.cost.values.some((v) => v > C)) {
                edgeSet.delete(edge);
            }
        }
    }

    return solveMosp(graph, v_s, v_t, evaluator, {
        costMap: new CostMap((cost) => cost.map((c) => K_numer * c / K_denom)),
    });
};
