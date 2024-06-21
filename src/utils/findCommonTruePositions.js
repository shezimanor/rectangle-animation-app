/**
 * 比較兩個布林值陣列，回傳同時為 true 的索引值陣列。
 *
 * @param {boolean[]} arr1   第一個布林值陣列。
 * @param {boolean[]} arr2   第二個布林值陣列。
 * @returns {number[]}       包含兩個陣列中同時為 true 的索引值陣列。
 */
export default function findCommonTruePositions(arr1, arr2) {
  const minLength = Math.min(arr1.length, arr2.length);
  const result = [];

  for (let i = 0; i < minLength; i++) {
    if (arr1[i] === true && arr2[i] === true) {
      result.push(i);
    }
  }

  return result;
}
