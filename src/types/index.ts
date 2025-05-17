import createClient from "openapi-fetch";
import type { paths as domainPaths } from "./domain_service/api";
import type { paths as userPaths } from "./user_service/api";

export const userApi = createClient<userPaths>({
  baseUrl: process.env.USER_SERVICE,
  headers: {
    Accept: "application/json",
    "X-App-Key": process.env.USER_SERVICE_API_KEY,
  },
});

export const domainApi = createClient<domainPaths>({
  baseUrl: process.env.DOMAIN_SERVICE,
  headers: {
    Accept: "application/json",
    "X-App-Key": process.env.DOMAIN_SERVICE_API_KEY,
  },
});
