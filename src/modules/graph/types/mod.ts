export type IFixedLengthArray<T, Length extends number> = Length extends 0
    ? never[]
    : { 0: T; length: Length } & T[];

export interface ICost<Dimension extends number> {
    readonly values: IFixedLengthArray<bigint, Dimension>;

    /**
     * Add values for each elements, and returns copied values.
     *
     * @param target Another array
     */
    toAdded(
        target: ICost<Dimension>,
    ): ICost<Dimension>;

    /**
     * Subtract values for each elements, and returns copied values.
     *
     * @param target Another array
     */
    toSubtracted(
        target: ICost<Dimension>,
    ): ICost<Dimension>;

    map(
        op: (v: bigint, i: number) => bigint,
    ): ICost<Dimension>;

    /**
     * Returns summation of the costs.
     */
    sum(): bigint;

    /**
     * @param target Another cost.
     */
    isGeq(target: ICost<Dimension>): boolean;

    /**
     * @param target Another cost.
     */
    isLeq(target: ICost<Dimension>): boolean;

    /**
     * @param target Another cost.
     */
    isDominatedBy(target: ICost<Dimension>): boolean;
}

declare const SYM_VERTEX: unique symbol;
export type Vertex = number & {
    [SYM_VERTEX]: never;
};

export interface IEdge<Dimension extends number> {
    readonly vertices: readonly [Vertex, Vertex];
    readonly cost: ICost<Dimension>;

    getOpponent(vertex: Vertex): Vertex;
}

export interface IGraph<Dimension extends number> {
    /**
     * Edge sets by mapped a from-vertex.
     */
    readonly edges: Map<Vertex, Set<IEdge<Dimension>>>;
    readonly dimension: Dimension;

    addEdge(edge: IEdge<Dimension>): this;

    hasEdgeOf(vertices: [Vertex, Vertex]): boolean;

    clone(): IGraph<Dimension>;
}

export interface IDirectedGraph<Dimension extends number>
    extends IGraph<Dimension> {
    getOutDegree(vertex: Vertex): number;
    // getInDegree(vertex: Vertex) : number;
}
