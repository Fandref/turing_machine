/**
 * Create array with sequence from 'start' to 'end'
 *
 * @param {number} start Start value.
 * @param {number} end End value
 * @return {array} Array with sequence.
 */

export default function sequenceArray(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx);
}