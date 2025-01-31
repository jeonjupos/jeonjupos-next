import { authInstance } from "@/app/_api/setupAxios";

export const FOOD_CATEGORY_LIST_URL = "/food/category/list";
export const getFoodCategoryList = () => authInstance.get(FOOD_CATEGORY_LIST_URL);

export const FOOD_LIST_URL = "/food/list";
export const getFoodList = (foodcaegorypkey) => authInstance.get(`${FOOD_LIST_URL}?foodcategorypkey=${foodcaegorypkey}`);
