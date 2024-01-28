import { solveMosp } from "./modules/graph/algorithm/mosp.ts";
import { solveFptasMosp } from "./modules/graph/algorithm/fptas_mosp.ts";
import { measurePerformance } from "./modules/utils/performance.ts";
import { createRandomConnectedGraph } from "./modules/graph/createConnectedGraph.ts";
import { ICost } from "./modules/graph/types/mod.ts";
import { createVertex } from "./modules/graph/vertex.ts";

const PATH = "./result.csv";

function main() {
    Deno.writeTextFile(
        PATH,
        "dimension, vertices, ave_degree, maxBitLength, epsilon, mosp, fptas_mosp, cost\n",
    );

    for (let dimension = 8; dimension >= 2; dimension -= 2) {
        const evaluator = (c: ICost<typeof dimension>) =>
            c.values.reduce((acc, v) => acc >= v ? acc : v);

        for (
            let vertices = 800;
            vertices >= 200;
            vertices -= 200
        ) {
            for (let aveDegree = 6; aveDegree >= 3; aveDegree--) {
                for (
                    let maxBitLength = 800;
                    maxBitLength >= 200;
                    maxBitLength -= 200
                ) {
                    const { graph, start: v_s } = createRandomConnectedGraph(
                        dimension,
                        vertices,
                        {
                            aveDegree: aveDegree,
                            maxBitLength: maxBitLength,
                        },
                    );

                    for (let numer = 1; numer <= 5; numer++) {
                        const denom = 5n;
                        const round = 20;

                        for (let i = 0; i < round; i++) {
                            console.log(`round ${i + 1}`)
                            const v_t = createVertex(
                                Math.floor(Math.random() * vertices),
                            ).expect("Never failures.");

                            const cloned1 = graph.clone();
                            const timeMosp = new Date();
                            const resultMosp = solveMosp(cloned1, v_s, v_t, evaluator)
                                .expect("Solve mosp error")
                            const timeEndMosp = new Date().getTime() - timeMosp.getTime()
                            console.log(`mosp: ${timeEndMosp}`);

                            const cloned2 = graph.clone();

                            const timeFptas = new Date();
                            const resultFptas = solveFptasMosp(
                                cloned2,
                                v_s,
                                v_t,
                                evaluator,
                                {
                                    numer: BigInt(numer),
                                    denom,
                                },
                            ).expect("Solve fptas-mosp error");
                            const timeEndFptas = new Date().getTime() - timeFptas.getTime();
                            console.log(`fptas_mosp: ${timeEndFptas}`);

                            Deno.writeTextFile(
                                PATH,
                                `${dimension}, ${vertices}, ${aveDegree}, ${maxBitLength}, ${numer / Number(denom)
                                }, ${timeEndMosp}, ${timeEndFptas}\n`,
                                { append: true },
                            );
                        }
                    }
                }
            }
        }
    }
}

main();
