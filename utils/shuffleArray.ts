export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    // 生成一個隨機索引
    const j = Math.floor(Math.random() * (i + 1));
    // 交換當前元素與隨機選擇的元素
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
