export const APP_CONFIG = {
  name: process.env.APP_NAME || "Next.js Starter Kit",
  url: process.env.APP_URL || "http://localhost:3000",
  description: "Modern, secure, and scalable Next.js starter kit",
  version: "1.0.0",
} as const;

export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  maxPageSize: 100,
  pageSizeOptions: [10, 20, 50, 100],
} as const;

export const TODO_CONFIG = {
  maxTitleLength: 255,
  maxDescriptionLength: 1000,
  defaultStatus: "pending",
  defaultPriority: "medium",
} as const;