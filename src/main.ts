// import { solveMosp } from "./modules/graph/algorithm/mosp.ts";
import { solveFptasMosp } from "./modules/graph/algorithm/fptas_mosp.ts";
import { solveMosp } from "./modules/graph/algorithm/mosp.ts";
import { createRandomConnectedGraph } from "./modules/graph/createConnectedGraph.ts";
import { ICost } from "./modules/graph/types/mod.ts";
import { createVertex } from "./modules/graph/vertex.ts";

const PATH = "./result.csv";

const MAX_BIT_LENGTH = 1000;
// const MAX_COST_VALUE = (0b1n << BigInt(MAX_BIT_LENGTH)) - 1n;

function main() {
    Deno.writeTextFile(
        PATH,
        "dimension,vertices,ave_degree,epsilon,time_mosp,time_fptas,eval_mosp,eval_fptas\n",
    );

    const aveDegree = 4;
    // const numer = 2;
    const vertices = 1000;
    const dimension = 8;

    // for (let dimension = 60; dimension >= 10; dimension -= 10) {
    const evaluator = (c: ICost<typeof dimension>) =>
        c.values.reduce((acc, v) => acc >= v ? acc : v);

    // for (
    //     let vertices = 2000;
    //     vertices >= 200;
    //     vertices -= 200
    // ) {
    // for (let aveDegree = 8; aveDegree > 2; aveDegree--) {
    for (let numer = 98; numer >= 2; numer -= 16) {
        const denom = 5n;
        const round = 100;

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
            const timeEndFptas = new Date().getTime() -
                timeFptas.getTime();
            console.log(`fptas_mosp: ${timeEndFptas}`);

            Deno.writeTextFile(
                PATH,
                `${dimension}, ${vertices}, ${aveDegree}, ${numer / Number(denom)
                }, ${timeEndMosp}, ${timeEndFptas}, ${
                    evaluator(graph.getCostFromPath(pathMosp).expect(""))
                }, ${evaluator(graph.getCostFromPath(pathFptas).expect(""))}\n`,
                { append: true },
            );
        }
    }
    // }
    // }
    // }
}

main();
