export function measurePerformance(test: () => void): number {
    const start = new Date().getTime();
    test();
    const time = new Date().getTime() - start;

    return time;
}
