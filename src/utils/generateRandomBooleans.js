/**
 * 生成一個指定長度的布林陣列，其中包含指定數量的隨機位置的 true，其餘為 false。
 *
 * @param {number} num      陣列中 true 的數量；必須 <= length。
 * @param {number} length   陣列的長度。
 * @returns {boolean[]}     包含 num 個 true 和 (length - num) 個 false 的隨機排列的布林陣列。
 */
export default function generateRandomBooleans(num, length) {
  if (num > length) {
    throw new Error('num 必須小於等於 length');
  }

  // 建立一個包含 num 個 true 和 length - num 個 false 的陣列
  let result = Array(num)
    .fill(true)
    .concat(Array(length - num).fill(false));

  // 使用 Fisher-Yates 洗牌算法打亂陣列
  for (let i = result.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]; // 交換元素
  }

  return result;
}
