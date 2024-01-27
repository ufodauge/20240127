import { err, ok, Result } from "../utils/result.ts";
import { Vertex } from "./types/mod.ts";

export function createVertex(value: number): Result<Vertex, string> {
    if (Number.isInteger(value)) {
        return ok(value as Vertex);
    } else {
        return err("Value should be an integer.");
    }
}
