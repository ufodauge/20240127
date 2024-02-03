import { solveFptasMosp } from "./modules/graph/algorithm/fptas_mosp.ts";
import { solveMosp } from "./modules/graph/algorithm/mosp.ts";
import { createRandomConnectedGraph } from "./modules/graph/createConnectedGraph.ts";
import { ICost } from "./modules/graph/types/mod.ts";
import { createVertex } from "./modules/graph/vertex.ts";

const PATH = "./result.csv";
const AVE_DEGREE = 4;
// const maxBitLength = 200;

Deno.writeTextFile(
    PATH,
    "dimension,vertices,max_bit_length,epsilon,time_mosp,time_fptas,eval_mosp,eval_fptas\n",
);

for (let dimension = 10; dimension >= 10; dimension -= 2) {
    const evaluator = (c: ICost<typeof dimension>) =>
        c.values.reduce((acc, v) => acc >= v ? acc : v);

    for (
        let vertices = 1000;
        vertices >= 100;
        vertices -= 100
    ) {
        for (let numer = 1; numer <= 512; numer *= 2) {
            for (let maxBitLength = 500; maxBitLength >= 50; maxBitLength -= 50) {

                const denom = 5n;
                const round = 10;

                const { graph, start: v_s } = createRandomConnectedGraph(
                    dimension,
                    vertices,
                    {
                        aveDegree: AVE_DEGREE,
                        maxBitLength,
                    },
                );

                for (let i = 0; i < round; i++) {

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
                        `${dimension},${vertices},${maxBitLength},${numer / Number(denom)
                        },${timeEndMosp},${timeEndFptas},${evaluator(graph.getCostFromPath(pathMosp).expect(""))
                        },${evaluator(graph.getCostFromPath(pathFptas).expect(""))}\n`,
                        { append: true },
                    );

                }
            }
        }
    }
}
// }