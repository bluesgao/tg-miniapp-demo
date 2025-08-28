// 格式化工具函数
export const formatUtils = {
    price: (price) => {
        if (!price) return "$0.00";
        if (price < 1) {
            return `$${price.toFixed(6)}`;
        } else if (price < 100) {
            return `$${price.toFixed(4)}`;
        } else {
            return `$${price.toFixed(2)}`;
        }
    },

    marketCap: (marketCap) => {
        if (!marketCap) return "$0";
        if (marketCap >= 1e12) {
            return `$${(marketCap / 1e12).toFixed(2)}T`;
        } else if (marketCap >= 1e9) {
            return `$${(marketCap / 1e9).toFixed(2)}B`;
        } else if (marketCap >= 1e6) {
            return `$${(marketCap / 1e6).toFixed(2)}M`;
        } else {
            return `$${marketCap.toLocaleString()}`;
        }
    },

    percentage: (value) => {
        if (!value) return "0.00%";
        return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
    },

    number: (num) => {
        if (!num) return "N/A";
        return num.toLocaleString();
    }
};
