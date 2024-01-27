import { assertEquals } from "std/assert/assert_equals.ts";
import { Cost } from "../cost.ts";

Deno.test("Cost test", () => {
    assertEquals(Cost.fromValues(1n, 2n, 3n, 4n, 5n).values.length, 5);

    assertEquals(
        Cost.fromValues(1n, 2n, 3n).toAdded(Cost.fromValues(4n, 5n, 6n)),
        Cost.fromValues(5n, 7n, 9n),
    );

    assertEquals(
        Cost.fromValues(4n, 6n, 9n).toSubtracted(Cost.fromValues(1n, 9n, 2n)),
        Cost.fromValues(3n, -3n, 7n),
    );

    // isDominatedBy
    assertEquals(
        Cost.fromValues(4n, 6n, 9n).isDominatedBy(Cost.fromValues(1n, 9n, 2n)),
        false,
    );

    assertEquals(
        Cost.fromValues(1n, 2n, 3n).isDominatedBy(Cost.fromValues(4n, 6n, 9n)),
        false,
    );

    assertEquals(
        Cost.fromValues(4n, 6n, 9n).isDominatedBy(Cost.fromValues(1n, 2n, 3n)),
        true,
    );

    assertEquals(
        Cost.fromValues(4n, 6n, 9n).isDominatedBy(Cost.fromValues(4n, 6n, 9n)),
        false,
    );

    // Geq
    assertEquals(
        Cost.fromValues(4n, 6n, 9n).isGeq(Cost.fromValues(1n, 9n, 2n)),
        false,
    );

    assertEquals(
        Cost.fromValues(1n, 2n, 3n).isGeq(Cost.fromValues(4n, 6n, 9n)),
        false,
    );

    assertEquals(
        Cost.fromValues(4n, 6n, 9n).isGeq(Cost.fromValues(1n, 2n, 3n)),
        true,
    );

    assertEquals(
        Cost.fromValues(4n, 6n, 9n).isGeq(Cost.fromValues(4n, 6n, 9n)),
        true,
    );

    // Leq
    assertEquals(
        Cost.fromValues(4n, 6n, 9n).isLeq(Cost.fromValues(1n, 9n, 2n)),
        false,
    );

    assertEquals(
        Cost.fromValues(1n, 2n, 3n).isLeq(Cost.fromValues(4n, 6n, 9n)),
        true,
    );
    assertEquals(
        Cost.fromValues(4n, 6n, 9n).isLeq(Cost.fromValues(1n, 2n, 3n)),
        false,
    );

    assertEquals(
        Cost.fromValues(4n, 6n, 9n).isLeq(Cost.fromValues(4n, 6n, 9n)),
        true,
    );

    const other = Cost.fromValues(1n, 2n, 3n);
    assertEquals(
        Cost.fromValues(4n, 6n, 9n).values.map((v, i) => v * other.values[i]),
        Cost.fromValues(4n, 12n, 27n).values,
    );
});
