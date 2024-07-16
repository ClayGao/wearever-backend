export type Item = {
  link: string;
  previewImg: string;
  name: string;
  createdAt: string;
};

// 回傳 B 有，A 沒有的元素
export const compareArrAndReturnNew = (
  arrayA: Item[],
  arrayB: Item[]
): Item[] => {
  return arrayB.filter((itemB) => {
    const isPreviewImgExist = arrayA.some(
      (itemA) => itemA.previewImg === itemB.previewImg
    );
    const isLinkExist = arrayA.some((itemA) => itemA.link === itemB.link);
    const isNameExist = arrayA.some((itemA) => itemA.name === itemB.name);
    return !isPreviewImgExist && !isLinkExist && !isNameExist;
  });
};
