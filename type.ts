export type ProductData = {
  // 產品的名稱
  name: string;
  // 產品的售價
  price: string;
  // 產品的描述
  description: string;
  // 產品的顏色
  color: string;
  // 產品的尺寸
  size: string;
  // 產品的圖片叢集，主要以 /n 隔開
  images: string;
  // 產品的預覽圖，在 Sheet 預覽用
  productImage: string;
};
