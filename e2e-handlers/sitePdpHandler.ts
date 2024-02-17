import { scrollToElement } from "../utils/scroll";
import { Page } from "@playwright/test";

export const mstuPdpHandler = async (page: Page, url: string) => {
  try {
    await page.goto(url, { waitUntil: "networkidle" });

    await scrollToElement(page, 10);

    await scrollToElement(page, 1);

    const productData = await page.evaluate(() => {
      const name = document.querySelector(
        ".prdDescription .xans-element- .item_list span"
      )!.textContent;
      const price = (document.querySelector("#span_product_price_sale") ||
        document.querySelector("#span_product_price_text"))!.textContent?.split(
        "원"
      )[0];
      const description = `${
        document.querySelector(".prd_info_tab li pre")!.textContent
      }\n${
        document.querySelectorAll(".prd_info_tab li > .tab_wrap")[1]!
          .textContent
      }`;

      const color = Array.from(
        document.querySelectorAll("#product_option_id1 > option")
      )
        .filter(
          // 排除預設兩個
          (el, idx) => idx > 1
        )
        .map((el) => {
          const val = el.getAttribute("value");
          return val?.split("*")[0];
        })
        .join(" / ");

      const size = (function (d: string) {
        const result: string[] = [];
        if (d.includes("FREE")) {
          return "FREE";
        }
        if (d.includes("S ")) {
          result.push("S");
        }
        if (d.includes("M ")) {
          result.push("M");
        }
        if (d.includes("L ")) {
          result.push("L");
        }
        return result.join(" / ");
      })(description);

      const images = Array.from(
        document.querySelectorAll("#prdDetailContentLazy img")
      )
        .map(
          //@ts-ignore
          (imgEl) => imgEl.src
        )
        .filter(
          (src, idx) =>
            !src.includes(".gif") && !src.includes("data:image/png;base64")
        )
        .join(" \n");

      const productImage = Array.from(
        document.querySelectorAll("#prdDetailContentLazy img")
      )
        .map(
          //@ts-ignore
          (imgEl) => imgEl.src
        )
        .filter(
          (src, idx) =>
            !src.includes(".gif") && !src.includes("data:image/png;base64")
        )[0];

      return {
        name,
        price,
        description,
        productImage,
        color,
        size,
        images,
      };
    });

    // console.log({ data });

    const result = {
      url,
      brand: "mstu",
      ...productData,
    };

    return result;
  } catch (err) {
    console.log(url);
    return null;
  }
};

export const hifiPdpHandler = async (page: Page, url: string) => {
  try {
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() =>
      window.scrollTo({ behavior: "smooth", top: document.body.scrollHeight })
    );
    await page.waitForTimeout(2000);
    await page.evaluate(() =>
      window.scrollTo({ behavior: "smooth", top: document.body.scrollHeight })
    );
    await page.waitForTimeout(2000);

    const productData = await page.evaluate(() => {
      const name = document.querySelector(
        "#mun_information .mun-detail-desc span"
      )!.textContent;
      const price = document.querySelector(
        "#span_product_price_text"
      )!.textContent;
      const description = `${
        document.querySelectorAll("#mun_information .mun-detail-desc span")[2]
          .textContent
      }\n${document.querySelector("#mun_tap .mun-tap-desc")!.textContent}`;

      const color = Array.from(
        document.querySelectorAll('select[option_sort_no="1"] > option')
      )
        .filter((el) => el.getAttribute("value")?.indexOf("*") === -1)
        .map((el) => {
          const originElText = el.getAttribute("value");
          const color = originElText!.split("(")[1].split(")")[0];
          return color;
        })
        .join(" / ");
      const size =
        Array.from(
          document.querySelectorAll('select[option_sort_no="2"] > option')
        )
          .filter((el) => el.getAttribute("value")?.indexOf("*") === -1)
          .map((el) => el.getAttribute("value"))
          .join(" / ") || "OS (Free)";

      const images = Array.from(
        document.querySelectorAll("#mun_productDetail > img")
      )
        .map(
          //@ts-ignore
          (imgEl) => imgEl.src
        )
        // 因為第一張是宣導圖片，不是產品圖片
        .filter((_, idx) => idx >= 1)
        .join(" \n");

      const productImage = Array.from(
        document.querySelectorAll("#mun_productDetail > img")
      ).map(
        //@ts-ignore
        (imgEl) => imgEl.src
      )[1];

      return {
        name,
        price,
        description,
        color,
        size,
        productImage,
        images,
      };
    });

    const result = {
      url,
      brand: "HIFIFNK",
      ...productData,
    };
    return result;
  } catch (err) {
    console.error(url);
    return null;
  }
};

export const autumnPdpHandler = async (page: Page, url: string) => {
  try {
    await page.goto(url, { waitUntil: "networkidle" });
    // 先選擇顏色，才會出現尺寸
    await page.selectOption("#product_option_id1", { index: 2 });
    await scrollToElement(page, 1);

    const productData = await page.evaluate(() => {
      const name = document.querySelector(".headingArea h2")!.textContent;
      const isProProduct = name!.includes("made");
      const price = (document.querySelector("#span_product_price_sale") ||
        document.querySelector("#span_product_price_text"))!.textContent?.split(
        " "
      )[1];
      const description = `${
        document.querySelector(".simple_desc")!.textContent
      }`;

      const color = Array.from(
        document.querySelectorAll("#product_option_id1 > option")
      )
        .filter(
          // 排除預設兩個
          (el, idx) => idx > 1
        )
        .map((el) => {
          const val = el.getAttribute("value");
          return val?.split("*")[0];
        })
        .join(" / ");

      const size = Array.from(
        document.querySelectorAll("#product_option_id2 > option")
      )
        .filter((el) => el.getAttribute("value")?.indexOf("*") === -1)
        .map((el) => el.getAttribute("value"))
        .join(" / ");

      const images = Array.from(document.querySelectorAll(".cont img"))
        .map(
          //@ts-ignore
          (imgEl) => imgEl.src
        )
        // filter 掉最後一張圖片
        .slice(0, -1)
        .join(" \n");

      const productImage = Array.from(
        document.querySelectorAll(".cont img")
      ).map(
        //@ts-ignore
        (imgEl) => imgEl.src
      )[isProProduct ? 1 : 0];

      return {
        name,
        price,
        description,
        color,
        size,
        images,
        productImage,
      };
    });

    const result = {
      url,
      brand: "Autumn",
      ...productData,
    };
    return result;
  } catch (err) {
    console.log(url);
    return null;
  }
};

export const laRoomPdpHandler = async (page: Page, url: string) => {
  await page.goto(url, { waitUntil: "networkidle", timeout: 600000 });
  // 先選擇顏色，才會出現尺寸
  await page.selectOption("#product_option_id1", { index: 2 });
  await scrollToElement(page, 1);

  const productData = await page.evaluate(() => {
    const name = document.querySelector(
      "#mun_information .mun-detail-desc > span"
    )!.textContent;

    const price = (document.querySelector("#span_product_price_sale") ||
      document.querySelector("#span_product_price_text"))!.textContent?.split(
      " "
    )[0];
    const description = `${
      document.querySelector("#mun_tap .mun-tap-desc table")!.textContent
    }`;

    const color = Array.from(
      document.querySelectorAll('[option_title="색상"] > option')
    )
      .filter(
        // 排除預設兩個
        (el, idx) => idx > 1
      )
      .map((el) => {
        const val = el.getAttribute("value");
        return val?.split("*")[0];
      })
      .join(" / ");

    const size = Array.from(
      document.querySelectorAll('[option_title="사이즈"] > option')
    )
      .filter((el) => el.getAttribute("value")?.indexOf("*") === -1)
      .map((el) => el.getAttribute("value"))
      .join(" / ");

    const images = Array.from(
      document.querySelectorAll("#mun_productDetail img")
    )
      .map(
        //@ts-ignore
        (imgEl) => imgEl.src
      )
      .join(" \n");

    const productImage = Array.from(
      document.querySelectorAll("#mun_productDetail img")
    ).map(
      //@ts-ignore
      (imgEl) => imgEl.src
    )[0];

    return {
      name,
      price,
      description,
      color,
      size,
      images,
      productImage,
    };
  });

  const result = {
    url,
    brand: "la-room",
    ...productData,
  };
  // console.log("la-room", { result });

  return result;
};

export const veryYouPdpHandler = async (page: Page, url: string) => {
  await page.goto(url, { waitUntil: "networkidle", timeout: 600000 });
  // 先選擇顏色，才會出現尺寸
  await page.selectOption("#product_option_id1", { index: 2 });
  await scrollToElement(page, 1);

  const productData = await page.evaluate(() => {
    const name = document.querySelector("h1.name")!.textContent;

    const price = (document.querySelector("#span_product_price_sale") ||
      document.querySelector("#span_product_price_text"))!.textContent?.split(
      " "
    )[0];
    const description = `${document.querySelector(".sizetip")!.textContent}`;

    const color = Array.from(
      document.querySelectorAll("#product_option_id1 > option")
    )
      .filter(
        // 排除預設兩個
        (el, idx) => idx > 1
      )
      .map((el) => {
        const val = el.getAttribute("value");
        return val?.split("*")[0];
      })
      .join(" / ");

    const size = Array.from(
      document.querySelectorAll("#product_option_id2 > option")
    )
      .filter((el) => el.getAttribute("value")?.indexOf("*") === -1)
      .map((el) => el.getAttribute("value"))
      .join(" / ");

    const images = Array.from(
      document.querySelectorAll("#prdDetailContent img")
    )
      .map(
        //@ts-ignore
        (imgEl) => imgEl.src
      )
      .join(" \n");

    const productImage = Array.from(
      document.querySelectorAll("#prdDetailContent img")
    ).map(
      //@ts-ignore
      (imgEl) => imgEl.src
    )[0];

    return {
      name,
      price,
      description,
      color,
      size,
      images,
      productImage,
    };
  });

  const result = {
    url,
    brand: "veryu",
    ...productData,
  };

  return result;
};

export const room203PdpHandler = async (page: Page, url: string) => {
  await page.goto(url, { waitUntil: "networkidle", timeout: 600000 });
  // 先選擇顏色，才會出現尺寸
  await page.selectOption("#product_option_id1", { index: 2 });
  await scrollToElement(page, 1);

  const productData = await page.evaluate(() => {
    const name = document.querySelector(
      ".xans-product .xans-record- span"
    )!.textContent;

    const price = (document.querySelector("#span_product_price_sale") ||
      document.querySelector("#span_product_price_text"))!.textContent;
    const description = `${
      document.querySelectorAll(".edb-img-tag-w")[1].textContent
    }`;

    const color = Array.from(
      document.querySelectorAll('[option_title="Color"] > option')
    )
      .filter(
        // 排除預設兩個
        (el, idx) => idx > 1
      )
      .map((el) => {
        const val = el.getAttribute("value");
        return val?.split("*")[0];
      })
      .join(" / ");

    const size = Array.from(
      document.querySelectorAll('[option_title="Size"] > option')
    )
      .filter((el) => el.getAttribute("value")?.indexOf("*") === -1)
      .map((el) => el.getAttribute("value"))
      .join(" / ");

    const images = Array.from(
      document.querySelectorAll(".edibot-product-detail img")
    )
      .map(
        //@ts-ignore
        (imgEl) => imgEl.src
      )
      .join(" \n");

    const productImage = Array.from(
      document.querySelectorAll(".edibot-product-detail img")
    ).map(
      //@ts-ignore
      (imgEl) => imgEl.src
    )[0];

    return {
      name,
      price,
      description,
      color,
      size,
      images,
      productImage,
    };
  });

  const result = {
    url,
    brand: "room203",
    ...productData,
  };

  return result;
};

export const newCheapChicPdpHandler = async (page: Page, url: string) => {
  await page.goto(url, { waitUntil: "networkidle", timeout: 600000 });
  // 先選擇顏色，才會出現尺寸
  // await page.selectOption("#product_option_id1", { index: 2 });
  await scrollToElement(page, 1);

  const productData = await page.evaluate(() => {
    const productDetailWrapper = document.querySelector('.shopProductOptionListDiv')!
    const colorSelector = productDetailWrapper.querySelectorAll('.customSelectDiv')[0];
    const sizeSelector = productDetailWrapper.querySelectorAll('.customSelectDiv')[1];

    const colorsArr = colorSelector ? Array.from(colorSelector.querySelectorAll('.custom-select-option')).map(el=>el.textContent).filter(text => text !== '선택하세요.') : []
    const sizesArr = sizeSelector ? Array.from(sizeSelector.querySelectorAll('.custom-select-option')).map(el=>el.textContent).filter(text => text !== '선택하세요.') : []

    const name = document.querySelector(
      "#shopProductName"
    )!.textContent;

    const price = (document.querySelector("#span_product_price_sale") ||
      document.querySelector("#shopProductPrice"))!.textContent;
    const description = `${
      document.querySelectorAll("#productDescriptionDetailPage")[1].textContent
    }`;

    const color = colorsArr.join(" / ");
    const size = sizesArr.join(" / ");

    const images = Array.from(
      document.querySelectorAll("#productDescriptionDetailPage img")
    )
      .map(
        //@ts-ignore
        (imgEl) => imgEl.src
      )
      .join(" \n");

    const productImage = Array.from(
      document.querySelectorAll("#productDescriptionDetailPage img")
    ).map(
      //@ts-ignore
      (imgEl) => imgEl.src
    )[0];

    return {
      name,
      price,
      description,
      color,
      size,
      images,
      productImage,
    };
  });

  const result = {
    url,
    brand: "new-cheap-chic",
    ...productData,
  };

  return result;
}