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

export type Product = {
  _id: string;            // 商品 ID，類型為字串
  isAlreadyInSheet?: boolean;  // 是否已經在表單中的標誌，類型為布林值
  link: string;           // 商品連結，類型為字串
  previewImg: string;     // 商品預覽圖片連結，類型為字串
  name: string;           // 商品名稱，類型為字串
  brand: string;          // 商品品牌，類型為字串
  createdAt: string;      // 商品創建日期，類型為字串
};
