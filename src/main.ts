// import { solveMosp } from "./modules/graph/algorithm/mosp.ts";
import { solveFptasMosp } from "./modules/graph/algorithm/fptas_mosp.ts";
import { createRandomConnectedGraph } from "./modules/graph/createConnectedGraph.ts";
import { ICost } from "./modules/graph/types/mod.ts";
import { createVertex } from "./modules/graph/vertex.ts";

const PATH = "./result.csv";

const MAX_BIT_LENGTH = 200;
// const MAX_COST_VALUE = (0b1n << BigInt(MAX_BIT_LENGTH)) - 1n;

function main() {
    Deno.writeTextFile(
        PATH,
        "dimension, vertices, ave_degree, epsilon, mosp, fptas_mosp, cost_diff_%\n",
    );

    const vertices = 600;
    const aveDegree = 4;
    const numer = 2;

    for (let dimension = 128; dimension >= 2; dimension -= 2) {
        const evaluator = (c: ICost<typeof dimension>) =>
            c.values.reduce((acc, v) => acc >= v ? acc : v);

        // for (
        //     let vertices = 800;
        //     vertices >= 200;
        //     vertices -= 200
        // ) {
        //     for (let aveDegree = 6; aveDegree >= 3; aveDegree--) {
        // for (let numer = 2; numer <= 128; numer *= 4) {
        const denom = 5n;
        const round = 20;

        for (let i = 0; i < round; i++) {
            const { graph, start: v_s } =
                createRandomConnectedGraph(
                    dimension,
                    vertices,
                    {
                        aveDegree,
                        maxBitLength: MAX_BIT_LENGTH,
                    },
                );

            console.log(`round ${i + 1}`);
            const v_t = (() => {
                while (true) {
                    const v = createVertex(
                        Math.floor(Math.random() * vertices),
                    ).expect("Never failures.");

                    if (v !== v_s) {
                        return v;
                    }
                }
            })();

            // const timeMosp = new Date();
            // const pathMosp = solveMosp(graph, v_s, v_t, evaluator)
            //     .expect("Solve mosp error")
            // const timeEndMosp = new Date().getTime() - timeMosp.getTime()
            // console.log(`mosp: ${timeEndMosp}`);

            const timeFptas = new Date();
            const _ = solveFptasMosp(
                graph,
                v_s,
                v_t,
                evaluator,
                {
                    numer: BigInt(numer),
                    denom,
                },
            ).expect("Solve fptas-mosp error");
            const timeEndFptas = new Date().getTime() -
                timeFptas.getTime();
            console.log(`fptas_mosp: ${timeEndFptas}`);

            // const diff = evaluator(graph.getCostFromPath(pathFptas).expect(""))
            //     - evaluator(graph.getCostFromPath(pathMosp).expect(""))

            Deno.writeTextFile(
                PATH,
                `${dimension}, ${vertices}, ${aveDegree}, ${numer / Number(denom)
                }, ${timeEndFptas}\n`,
                { append: true },
            );
        }
        //         }
        //     }
        // }
    }
}

main();
