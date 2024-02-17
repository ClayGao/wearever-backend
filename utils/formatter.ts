// 如果沒有 https，就加上
export const formatterSrcWithHttps = (src: string) => {
  return src.startsWith("http") ? src : `https:${src}`;
};

//去除 Product Array 中的重複元素
// export const uniqueItems = (items) => {
//   const seenUniq = {};
//   return items.filter((item) => {
//     // 以什麼來判斷是否為重複
//     const conditionTarget = item.previewImg;
//     if (seenUniq[conditionTarget]) {
//       return false;
//     } else {
//       seenUniq[conditionTarget] = true;
//       return true;
//     }
//   });
// };

export const uniqueItems = (items: { previewImg: string; link: string; name?:string }[]) => {
  const previewImgSet = new Set();
  const linkSet = new Set();
  const nameSet = new Set();

  return items.filter((item) => {
    if (previewImgSet.has(item.previewImg) || linkSet.has(item.link) || nameSet.has(item.name)) {
      return false;
    }

    previewImgSet.add(item.previewImg);
    linkSet.add(item.link);
    nameSet.add(item.name);
    return true;
  });
};
