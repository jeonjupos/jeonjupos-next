import { authInstance } from "@/app/_api/setupAxios";

export const STORE_TABLE_URL = "/store-table/list";
export const getStoreTable = () => authInstance.get(STORE_TABLE_URL);
