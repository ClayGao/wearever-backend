import fs from "fs";

export function exportArrayToJsonFile(array: any[], filename: string) {
  // 將數組轉換為 JSON 格式的字符串
  const jsonString = JSON.stringify(array, null, 2);

  // 使用 fs.writeFile 方法將 JSON 字符串寫入文件
  fs.writeFile(filename, jsonString, "utf8", function (err) {
    if (err) {
      console.log("發生錯誤:", err);
    } else {
      console.log("文件已保存:", filename);
    }
  });
}
