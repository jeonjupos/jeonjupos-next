import { authInstance } from "@/app/_api/setupAxios";

export const ORDER_INFO_URL = "/order/info";
export const getOrderInfo = (storetablepkey) => authInstance.get(`${ORDER_INFO_URL}?storetablepkey=${storetablepkey}`);

export const ORDER_FOOD_LIST_URL = '/order/food/list';
export const getOrderFoodList = (orderinfopkey) => authInstance.get(`${ORDER_FOOD_LIST_URL}?orderinfopkey=${orderinfopkey}`);

export const FIRST_ORDER_URL = '/order/first';
export const firstOrder = (payload) => authInstance.post(FIRST_ORDER_URL, payload);

export const RE_ORDER_URL = '/order/re';
export const reOrder = (payload) => authInstance.post(RE_ORDER_URL, payload);

export const PAY_URL = '/payment';
export const payment = (payload) => authInstance.post(PAY_URL, payload);
