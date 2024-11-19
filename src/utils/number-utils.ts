// NUMBER UTILITIES ---------------------------------------------------------

/**
 * Returns the absolute difference between two numbers.
 * 
 * @param {number} a - The first number.
 * 
 * @param {number} b - The second number.
 * 
 * @param {number} [max] - The maximum difference allowed.
 * 
 * @returns {number} The absolute difference between the two numbers.
 * 
 * @example
 * 
 * getDiffBetween(10, 5);
 * // returns 5
 */
function getDiffBetween(a: number, b: number, max?: number): number {

    const diff = Math.abs(a - b);
    return max ? Math.min(diff, max) : diff;
}

/**
 * Returns an array of numbers between two numbers.
 * 
 * @param {number} a - The first number.
 * 
 * @param {number} b - The second number.
 * 
 * @param {number} [maxLength=Infinity] - The maximum length of the array.
 * 
 * @param {number} [increment=1] - The increment between the numbers.
 * 
 * @returns {number[]} An array of numbers between the two input numbers.
 * 
 * @example
 * 
 * getRange(0, 10, 5);
 * // returns [0, 2, 4, 6, 8, 10]
 */
function getRange(a: number, b: number, maxLength: number = Infinity, increment: number = 1): number[] {

    const length = Math.min(maxLength, Math.floor(getDiffBetween(a, b) / increment) + 1);
    return Array.from({ length }, (_, i) => a + i * increment);
}

/**
 * Returns an intermediate number between two numbers based on the elapsed time.
 * 
 * @param {number} elapsedTime - The time elapsed since the start of the interval.
 * 
 * @param {number} intervalDuration - The total duration of the interval.
 * 
 * @param {number} start - The starting number.
 * 
 * @param {number} end - The ending number.
 * 
 * @returns {number} An intermediate number between the two input numbers.
 * 
 * @example
 * 
 * interpolateNumByTimeDiff(500, 1000, 0, 10);
 * // returns 5
 */
function interpolateNumByTimeDiff(elapsedTime: number, intervalDuration: number, start: number, end: number): number {
    const diff = end - start;
    const diffRatio = elapsedTime / intervalDuration;
    const intermediateNumber = start + diff * diffRatio;
    return intermediateNumber;
}

export { getDiffBetween, getRange, interpolateNumByTimeDiff };