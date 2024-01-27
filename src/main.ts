import { solveMosp } from "./modules/graph/algorithm/mosp.ts";
import { BigIntMath } from "./modules/utils/bigint.ts";
import { solveFptasMosp } from "./modules/graph/algorithm/fptas_mosp.ts";
import { measurePerformance } from "./modules/utils/performance.ts";
import { createRandomConnectedGraph } from "./modules/graph/createConnectedGraph.ts";
import { ICost } from "./modules/graph/types/mod.ts";
import { createVertex } from "./modules/graph/vertex.ts";
import { range } from "./modules/utils/range.ts";

const PATH = "./result.txt";

function main() {
    const evaluator = <T extends number>(cost: ICost<T>) =>
        BigIntMath.max(...cost.values);

    Deno.writeTextFile(
        PATH,
        "dimension, vertices, ave_degree, epsilon, mosp, fptas_mosp",
    );

    for (let dimension = 2; dimension < 17; dimension++) {
        for (
            let vertices = 2500;
            vertices <= 160000;
            vertices *= 2
        ) {
            for (let aveDegree = 2; aveDegree <= 16; aveDegree += 2) {
                for (
                    let maxBitLength = 200;
                    maxBitLength <= 2000;
                    maxBitLength += 200
                ) {
                    const { graph, start: v_s } = createRandomConnectedGraph(
                        dimension,
                        vertices,
                        {
                            aveDegree: aveDegree,
                            maxBitLength: maxBitLength,
                        },
                    );

                    for (let numer = 1; numer <= 20; numer++) {
                        const denom = 20n;

                        const times = {
                            mosp: 0,
                            fptas: 0,
                        };
                        const round = 100;

                        for (const _ of range(round)) {
                            const v_t = createVertex(
                                Math.floor(Math.random() * vertices),
                            ).expect("Never failures.");

                            times.mosp += measurePerformance(() =>
                                solveMosp(graph, v_s, v_t, evaluator)
                                    .expect(
                                        "Solve mosp error",
                                    )
                            );

                            times.fptas += measurePerformance(() =>
                                solveFptasMosp(graph, v_s, v_t, evaluator, {
                                    numer: BigInt(numer),
                                    denom,
                                }).expect(
                                    "Solve fptas-mosp error",
                                )
                            );
                        }

                        Deno.writeTextFile(
                            PATH,
                            `${dimension}, ${vertices}, ${aveDegree}, ${
                                numer / Number(denom)
                            }, ${times.mosp / round}, ${times.fptas / round}`,
                            { append: true },
                        );
                    }
                }
            }
        }
    }
}

main();
