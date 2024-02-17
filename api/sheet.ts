import axios from "axios";
import type { ProductData } from "@/type";

const SHEET_API_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzKw-UTVFBta7842vVe47ZJkWIO3Y_zQhHsB3of6t7Tw7kThpD4a-b_fAMi9SOgwpagrQ/exec";

export const postToStagingSheet = async (data: ProductData) => {
  try {
    await axios.post(SHEET_API_ENDPOINT, data);
  } catch (error) {
    console.error(error);
  }
};
