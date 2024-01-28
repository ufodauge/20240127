import { solveMosp } from "./modules/graph/algorithm/mosp.ts";
import { solveFptasMosp } from "./modules/graph/algorithm/fptas_mosp.ts";
import { createRandomConnectedGraph } from "./modules/graph/createConnectedGraph.ts";
import { ICost } from "./modules/graph/types/mod.ts";
import { createVertex } from "./modules/graph/vertex.ts";

const PATH = "./result.csv";

function main() {
    Deno.writeTextFile(
        PATH,
        "dimension, vertices, ave_degree, maxBitLength, epsilon, mosp, fptas_mosp, diff_cost\n",
    );

    for (let dimension = 8; dimension >= 2; dimension -= 2) {
        const evaluator = (c: ICost<typeof dimension>) =>
            c.values.reduce((acc, v) => acc >= v ? acc : v);

        for (
            let vertices = 800;
            vertices >= 200;
            vertices -= 200
        ) {
            for (let aveDegree = 5; aveDegree >= 3; aveDegree--) {
                for (
                    let maxBitLength = 800;
                    maxBitLength >= 200;
                    maxBitLength -= 200
                ) {
                    for (let numer = 1; numer <= 5; numer++) {
                        const denom = 20n;
                        const round = 20;

                        for (let i = 0; i < round; i++) {
                            const { graph, start: v_s } = createRandomConnectedGraph(
                                dimension,
                                vertices,
                                {
                                    aveDegree: aveDegree,
                                    maxBitLength: maxBitLength,
                                },
                            );

                            console.log(`round ${i + 1}`)
                            const v_t = (() => {
                                while (true) {
                                    const v = createVertex(
                                        Math.floor(Math.random() * vertices),
                                    ).expect("Never failures.")

                                    if (v !== v_s) {
                                        return v
                                    }
                                }
                            })()

                            const timeMosp = new Date();
                            const pathMosp = solveMosp(graph, v_s, v_t, evaluator)
                                .expect("Solve mosp error")
                            const timeEndMosp = new Date().getTime() - timeMosp.getTime()
                            console.log(`mosp: ${timeEndMosp}`);

                            const timeFptas = new Date();
                            const pathFptas = solveFptasMosp(
                                graph,
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

                            const diff = evaluator(graph.getCostFromPath(pathFptas).expect(""))
                                - evaluator(graph.getCostFromPath(pathMosp).expect(""))

                            Deno.writeTextFile(
                                PATH,
                                `${dimension}, ${vertices}, ${aveDegree}, ${maxBitLength}, ${numer / Number(denom)
                                }, ${timeEndMosp}, ${timeEndFptas}, ${diff}\n`,
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
