import { chromium, Page } from "@playwright/test";
import {
  SITE_CONFIG,
  ALL_SITE_PAGES,
  PLAYWRIGHT_CONFIG,
} from "@/wearever.config";

import { exportArrayToJsonFile } from "../utils/file";
import { uniqueItems, formatterSrcWithHttps } from "../utils/formatter";
import { getTodayDate } from "../utils/getToday";

let ALL_PRODUCT_CARD = [] as any[];

const init = async () => {
  const browser = await chromium.launch({
    ...PLAYWRIGHT_CONFIG,
  });
  const page = await browser.newPage();
  return { page, browser };
};

const gotoAllProductPageWithPages = async (page: Page) => {
  for (const url of ALL_SITE_PAGES) {
    const config = SITE_CONFIG.find((site) => url.includes(site.domain));
    if (config) {
      for (let i = 1; i <= config.pagePagination; i++) {
        const pageQueryString = config.pageQueryString || "page";
        const qs = url.includes("?") ? `&${pageQueryString}=${i}` : `?${pageQueryString}=${i}`;
        const urlWithQs = `${url}${qs}`;
        try {
          await page.goto(urlWithQs, {
            timeout: 60000,
          });
          // await page.waitForLoadState("networkidle");
          await page.waitForTimeout(3000);
          await addProductCardToArray(page, urlWithQs);
        } catch(err) {
          console.error(err)
          console.error(`網站錯誤 ${urlWithQs}`);
          continue;
        }
      }
    }
  }
};

const addProductCardToArray = async (page: Page, url: string) => {
  const site = SITE_CONFIG.find((site) => url.includes(site.domain));
  if (!site) {
    console.error("找不到網站配置");
    return;
  }

  const cards = await page.locator(site.cardSelector).all();

  // 這裡負責處理 Product List 上每一個 Product 的內容，然後加到 Array
  for (const card of await cards) {
    await card.scrollIntoViewIfNeeded();
    // 如果 card 不包括連結，就不要
    if(await card.locator('a').count() === 0) continue
    const a = await card.locator("a").first();
    const img = await a.locator(site.previewImgSelector || 'img').first();
    const link = (await a.getAttribute("href"));
    if (!link) continue
    // TODO: 這裡的寫法其實是為了迎合 new cheap chic 那種把 div 作為 img 的寫法，找時間要重構
    const previewImg = (await img.getAttribute("src")) || (await img.getAttribute("imgsrc")) || "";
    const brand = site.name || "";
    const name = await card.locator(site.cartProductNameSelector || ".name").first().innerText();
    const productCard = {
      link: `${site.domain}${link}`,
      previewImg: formatterSrcWithHttps(previewImg),
      brand,
      ...(name && { name }),
      createdAt: getTodayDate(),
    };
    ALL_PRODUCT_CARD.push(productCard);
  }
  
};

export const getNewProducts = async () => {
  // 啟動瀏覽器
  const { page, browser } = await init();
  // 訪問目標網站
  await gotoAllProductPageWithPages(page);

  await browser.close();
   // 將數據轉換為 JSON 格式的字符串，輸出檔案
  await exportArrayToJsonFile(
    uniqueItems(ALL_PRODUCT_CARD),
    `product-${getTodayDate()}.json`
  );
  return ALL_PRODUCT_CARD;
  const uniqueAllProductCard = uniqueItems(ALL_PRODUCT_CARD);

  console.log("原數量:", ALL_PRODUCT_CARD.length);
  console.log(
    "移除了重複項目:",
    ALL_PRODUCT_CARD.length - uniqueAllProductCard.length
  );
  console.log("唯一數量:", uniqueAllProductCard.length);

  // 將數據轉換為 JSON 格式的字符串，輸出檔案
  // await exportArrayToJsonFile(
  //   uniqueItems(uniqueAllProductCard),
  //   `product-${getTodayDate()}.json`
  // );
  // 在這裡處理數據（比如保存到文件或數據庫）
  // 關閉瀏覽器
  await browser.close();
  return await uniqueAllProductCard;
};
