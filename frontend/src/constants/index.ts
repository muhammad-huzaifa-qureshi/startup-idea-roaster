export const API_ENDPOINTS = {
    FASTAPI: process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000/api",
    N8N: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://your-n8n-instance.com/webhook/startuproaster",
};
export const BACKEND_MODES = {
    FASTAPI: "fastapi",
    N8N: "n8n",
} as const;

export type BackendMode = typeof BACKEND_MODES[keyof typeof BACKEND_MODES];

export const MIN_IDEA_LENGTH = 50;