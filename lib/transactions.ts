import { api } from "./api";

export const getTransactions = async () => {
    const response = await api.get("/transactions");
    return response.data;
}

export const getAIInsight = async () => {
    const response = await api.get("/transactions/ai-insight")
    return response.data;
}