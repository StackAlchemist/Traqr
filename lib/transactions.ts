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

export const getTopMerchants = async () => {
    const response = await api.get("/transactions/top-merchants")
    return response.data
  }
  
  export const getBiggestTransaction = async () => {
    const response = await api.get("/transactions/biggest")
    return response.data
  }
  
  export const getMonthlyComparison = async () => {
    const response = await api.get("/transactions/monthly-comparison")
    return response.data
  }
  
  export const getHeatmap = async () => {
    const response = await api.get("/transactions/heatmap")
    return response.data
  }