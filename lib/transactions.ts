import { api } from "./api";

export const getTransactions = async () => {
    const response = await api.get("/transactions");
    return response.data;
}

export const getAIInsight = async () => {
    const response = await api.get("/transactions/ai-insight")
    return response.data;
}

export const getTopCategories = async () => {
    const response = await api.get("/transactions/top-categories");
    return response.data;
}

export const getRecentTransactions = async () => {
    const response = await api.get("/transactions/recent");
    return response.data;
}

export const getChartData = async () => {
    const response = await api.get("/transactions/chart");
    return response.data;
}