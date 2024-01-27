import { FibonacciHeap } from "npm:@tyriar/fibonacci-heap";

import { Cost } from "../cost.ts";
import { ICost, IGraph, Vertex } from "../types/mod.ts";
import { err, ok, Result } from "../../utils/result.ts";
import { Label } from "./label.ts";
import { CostMap } from "./costMap.ts";

export function solveMosp<D extends number>(
    { edges, dimension }: IGraph<D>,
    v_s: Vertex,
    v_t: Vertex,
    evaluator: (cost: ICost<D>) => bigint,
    options?: {
        costMap?: CostMap<D, ICost<D>>;
    },
): Result<Vertex[], string> {
    const costMap = options?.costMap ?? new CostMap((c) => c);

    const heap = new FibonacciHeap<bigint, Label<D>>();
    const labelMap: Record<Vertex, Label<D>[]> = {};
    edges.forEach((_, k) => labelMap[k] = []);

    const zeroLabel = new Label(new Cost(dimension), v_s, undefined);
    heap.insert(0n, zeroLabel);
    labelMap[v_s].push(zeroLabel);

    while (heap.size() > 0) {
        const currentLabel = heap.extractMinimum()?.value!;

        const edgesFromCurrent = edges.get(currentLabel.vertex);
        if (edgesFromCurrent === undefined) {
            continue;
        }

        for (const edgeFromCurrent of edgesFromCurrent) {
            const newCost = currentLabel.cost.toAdded(
                costMap.read(edgeFromCurrent.cost),
            );
            const to = edgeFromCurrent.getOpponent(currentLabel.vertex);

            const labelsOfTo = labelMap[to];

            if (!labelsOfTo.some(({ cost }) => cost.isLeq(newCost))) {
                const newLabel = new Label(newCost, to, currentLabel);
                heap.insert(evaluator(newCost), newLabel);
                labelsOfTo.push(newLabel);
            }
        }
    }

    const labelsOfTerminate = labelMap[v_t];
    if (labelsOfTerminate) {
        const label = labelsOfTerminate.reduce((l_1, l_2) =>
            evaluator(l_1.cost) > evaluator(l_2.cost) ? l_2 : l_1
        );
        const path = label.constructPath();

        return ok(path);
    } else {
        return err("Failed to construct paths");
    }
}
