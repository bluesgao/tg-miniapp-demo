import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  NavBar,
  Card,
  Button,
  SpinLoading,
  Empty,
  ConfigProvider,
  Grid,
  Divider
} from "antd-mobile";
import {
  ExclamationTriangleOutline,
  HistogramOutline
} from "antd-mobile-icons";

function CryptoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crypto, setCrypto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const tg = window.Telegram.WebApp;

    // 让小程序自动全屏展开
    tg.expand();

    // 获取主题
    setTheme(tg.colorScheme);

    // 监听主题变化
    tg.onEvent("themeChanged", () => {
      setTheme(tg.colorScheme);
    });
  }, []);

  useEffect(() => {
    const fetchCryptoDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // 尝试获取详细信息
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        );

        if (response.ok) {
          const data = await response.json();
          setCrypto(data);
        } else {
          throw new Error('获取详细信息失败');
        }
      } catch (err) {
        console.error('Error fetching crypto detail:', err);
        setError('获取详细信息时出错，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCryptoDetail();
    }
  }, [id]);

  // 格式化价格显示
  const formatPrice = (price) => {
    if (!price) return "$0.00";
    if (price < 1) {
      return `$${price.toFixed(6)}`;
    } else if (price < 100) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(2)}`;
    }
  };

  // 格式化市值显示
  const formatMarketCap = (marketCap) => {
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
  };

  // 获取价格变化颜色
  const getPriceChangeColor = (change) => {
    return change >= 0 ? '#4CAF50' : '#F44336';
  };

  // 格式化百分比
  const formatPercentage = (value) => {
    if (!value) return "0.00%";
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  // 处理返回操作
  const handleBack = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: theme === "dark" ? "#007AFF" : "#007AFF",
            colorBackground: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
            colorText: theme === "dark" ? "#fff" : "#000",
          },
        }}
      >
        <div style={{
          backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}>
          <SpinLoading style={{ marginBottom: "16px" }} />
          <div>正在加载详细信息...</div>
        </div>
      </ConfigProvider>
    );
  }

  if (error || !crypto) {
    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: theme === "dark" ? "#007AFF" : "#007AFF",
            colorBackground: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
            colorText: theme === "dark" ? "#fff" : "#000",
          },
        }}
      >
        <div style={{
          backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}>
          <ExclamationTriangleOutline style={{ fontSize: "48px", color: "#F44336", marginBottom: "16px" }} />
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            {error || "未找到该虚拟货币信息"}
          </div>
          <Button
            color="primary"
            size="large"
            onClick={handleBack}
          >
            返回列表
          </Button>
        </div>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: theme === "dark" ? "#007AFF" : "#007AFF",
          colorBackground: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
          colorText: theme === "dark" ? "#fff" : "#000",
        },
      }}
    >
      <div style={{
        backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
        minHeight: "100vh"
      }}>
        {/* Header */}
        <NavBar
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: theme === "dark" ? "#2d2d2d" : "#fff",
            borderBottom: `1px solid ${theme === "dark" ? "#444" : "#e0e0e0"}`
          }}
          onBack={handleBack}
        >
          <div>
            <div style={{ fontSize: "18px", fontWeight: "600" }}>
              {crypto.name}
            </div>
            <div style={{ fontSize: "12px", color: theme === "dark" ? "#ccc" : "#666", marginTop: "2px" }}>
              {crypto.symbol.toUpperCase()}
            </div>
          </div>
        </NavBar>

        {/* Body */}
        <div style={{
          paddingTop: "calc(60px + env(safe-area-inset-top))",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
          minHeight: "100vh"
        }}>
          {/* 主要信息卡片 */}
          <Card style={{ margin: "16px", borderRadius: "12px" }}>
            {/* 币种图标和基本信息 */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
              <img
                src={crypto.image?.large || crypto.image?.small}
                alt={crypto.name}
                style={{
                  width: "64px",
                  height: "64px",
                  marginRight: "16px",
                  borderRadius: "50%"
                }}
              />
              <div style={{ flex: 1 }}>
                <h2 style={{
                  margin: "0 0 4px 0",
                  fontSize: "24px",
                  fontWeight: "bold"
                }}>
                  {crypto.name}
                </h2>
                <div style={{
                  fontSize: "16px",
                  color: theme === "dark" ? "#ccc" : "#666",
                  textTransform: "uppercase"
                }}>
                  {crypto.symbol}
                </div>
              </div>
            </div>

            {/* 当前价格 */}
            <div style={{
              textAlign: "center",
              marginBottom: "20px",
              padding: "16px",
              backgroundColor: theme === "dark" ? "#333" : "#f8f9fa",
              borderRadius: "8px"
            }}>
              <div style={{ fontSize: "14px", marginBottom: "8px", color: theme === "dark" ? "#ccc" : "#666" }}>
                当前价格
              </div>
              <div style={{
                fontSize: "32px",
                fontWeight: "bold",
                marginBottom: "8px"
              }}>
                {formatPrice(crypto.market_data?.current_price?.usd)}
              </div>
              <div style={{
                fontSize: "16px",
                color: getPriceChangeColor(crypto.market_data?.price_change_percentage_24h),
                fontWeight: "bold"
              }}>
                {formatPercentage(crypto.market_data?.price_change_percentage_24h)}
              </div>
            </div>

            {/* 价格变化统计 */}
            <Grid columns={3} gap={8} style={{ marginBottom: "20px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "12px", color: theme === "dark" ? "#ccc" : "#666", marginBottom: "4px" }}>
                  1小时
                </div>
                <div style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: getPriceChangeColor(crypto.market_data?.price_change_percentage_1h_in_currency?.usd)
                }}>
                  {formatPercentage(crypto.market_data?.price_change_percentage_1h_in_currency?.usd)}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "12px", color: theme === "dark" ? "#ccc" : "#666", marginBottom: "4px" }}>
                  24小时
                </div>
                <div style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: getPriceChangeColor(crypto.market_data?.price_change_percentage_24h)
                }}>
                  {formatPercentage(crypto.market_data?.price_change_percentage_24h)}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "12px", color: theme === "dark" ? "#ccc" : "#666", marginBottom: "4px" }}>
                  7天
                </div>
                <div style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: getPriceChangeColor(crypto.market_data?.price_change_percentage_7d)
                }}>
                  {formatPercentage(crypto.market_data?.price_change_percentage_7d)}
                </div>
              </div>
            </Grid>
          </Card>

          {/* 市场数据 */}
          <Card style={{ margin: "16px", borderRadius: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
              <HistogramOutline style={{ marginRight: "8px" }} />
              <h3 style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "bold"
              }}>
                市场数据
              </h3>
            </div>

            <Grid columns={2} gap={16}>
              <div>
                <div style={{ fontSize: "12px", color: theme === "dark" ? "#ccc" : "#666", marginBottom: "4px" }}>
                  市值
                </div>
                <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {formatMarketCap(crypto.market_data?.market_cap?.usd)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: theme === "dark" ? "#ccc" : "#666", marginBottom: "4px" }}>
                  24h交易量
                </div>
                <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {formatMarketCap(crypto.market_data?.total_volume?.usd)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: theme === "dark" ? "#ccc" : "#666", marginBottom: "4px" }}>
                  流通供应量
                </div>
                <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {crypto.market_data?.circulating_supply?.toLocaleString() || "N/A"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: theme === "dark" ? "#ccc" : "#666", marginBottom: "4px" }}>
                  总供应量
                </div>
                <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {crypto.market_data?.total_supply?.toLocaleString() || "N/A"}
                </div>
              </div>
            </Grid>
          </Card>

          {/* 价格范围 */}
          <Card style={{ margin: "16px", borderRadius: "12px" }}>
            <h3 style={{
              margin: "0 0 16px 0",
              fontSize: "18px",
              fontWeight: "bold"
            }}>
              📈 价格范围
            </h3>

            <Grid columns={2} gap={16}>
              <div>
                <div style={{ fontSize: "12px", color: theme === "dark" ? "#ccc" : "#666", marginBottom: "4px" }}>
                  24h最高
                </div>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#4CAF50" }}>
                  {formatPrice(crypto.market_data?.high_24h?.usd)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: theme === "dark" ? "#ccc" : "#666", marginBottom: "4px" }}>
                  24h最低
                </div>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#F44336" }}>
                  {formatPrice(crypto.market_data?.low_24h?.usd)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: theme === "dark" ? "#ccc" : "#666", marginBottom: "4px" }}>
                  历史最高
                </div>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#4CAF50" }}>
                  {formatPrice(crypto.market_data?.ath?.usd)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: theme === "dark" ? "#ccc" : "#666", marginBottom: "4px" }}>
                  历史最低
                </div>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#F44336" }}>
                  {formatPrice(crypto.market_data?.atl?.usd)}
                </div>
              </div>
            </Grid>
          </Card>

          {/* 描述信息 */}
          {crypto.description?.en && (
            <Card style={{ margin: "16px", borderRadius: "12px" }}>
              <h3 style={{
                margin: "0 0 16px 0",
                fontSize: "18px",
                fontWeight: "bold"
              }}>
                📝 项目简介
              </h3>
              <div style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: theme === "dark" ? "#ccc" : "#333",
                maxHeight: "200px",
                overflow: "auto"
              }}>
                {crypto.description.en.replace(/<[^>]*>/g, '').substring(0, 500)}
                {crypto.description.en.length > 500 && "..."}
              </div>
            </Card>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
}

export default CryptoDetail;
