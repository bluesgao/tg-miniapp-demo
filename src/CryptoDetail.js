import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faExclamationTriangle, faSpinner, faChartBar } from "@fortawesome/free-solid-svg-icons";

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
      <div
        style={{
          backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
          color: theme === "dark" ? "#fff" : "#000",
          minHeight: "100vh",
          padding: "16px",
          paddingTop: "max(16px, env(safe-area-inset-top))",
          paddingBottom: "max(16px, env(safe-area-inset-bottom))",
          paddingLeft: "max(16px, env(safe-area-inset-left))",
          paddingRight: "max(16px, env(safe-area-inset-right))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        <FontAwesomeIcon icon={faSpinner} size="2x" style={{ marginBottom: "16px", animation: "spin 1s linear infinite" }} />
        <div>正在加载详细信息...</div>
      </div>
    );
  }

  if (error || !crypto) {
    return (
      <div
        style={{
          backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
          color: theme === "dark" ? "#fff" : "#000",
          minHeight: "100vh",
          padding: "16px",
          paddingTop: "max(16px, env(safe-area-inset-top))",
          paddingBottom: "max(16px, env(safe-area-inset-bottom))",
          paddingLeft: "max(16px, env(safe-area-inset-left))",
          paddingRight: "max(16px, env(safe-area-inset-right))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        <FontAwesomeIcon icon={faExclamationTriangle} size="2x" style={{ marginBottom: "16px", color: "#F44336" }} />
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          {error || "未找到该虚拟货币信息"}
        </div>
        <button
          onClick={handleBack}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px 32px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: theme === "dark" ? "#007AFF" : "#007AFF",
            color: "#fff",
            fontSize: "17px",
            fontWeight: "600",
            cursor: "pointer",
            minHeight: "50px",
            minWidth: "160px",
            touchAction: "manipulation",
            transition: "all 0.2s ease",

          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.02)";

          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";

          }}
          onMouseDown={(e) => {
            e.target.style.transform = "scale(0.98)";
          }}
          onMouseUp={(e) => {
            e.target.style.transform = "scale(1.02)";
          }}
        >
          <FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: "8px", fontSize: "16px" }} />
          返回列表
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
        color: theme === "dark" ? "#fff" : "#000",
        minHeight: "100vh",
        boxSizing: "border-box",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >


      {/* Header */}
      <header style={{
        backgroundColor: theme === "dark" ? "#2d2d2d" : "#fff",
        padding: "16px",
        paddingTop: "max(16px, env(safe-area-inset-top))",
        paddingLeft: "max(16px, env(safe-area-inset-left))",
        paddingRight: "max(16px, env(safe-area-inset-right))",
        borderBottom: `1px solid ${theme === "dark" ? "#444" : "#e0e0e0"}`,
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: "flex",
          alignItems: "center"
        }}>
          {/* iOS风格返回按钮 */}
          <button
            onClick={handleBack}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "8px 12px",
              borderRadius: "0",
              border: "none",
              backgroundColor: "transparent",
              color: theme === "dark" ? "#007AFF" : "#007AFF",
              fontSize: "17px",
              fontWeight: "400",
              cursor: "pointer",
              marginRight: "8px",
              minHeight: "44px",
              minWidth: "60px",
              touchAction: "manipulation",
              transition: "opacity 0.2s ease",
              position: "relative"
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = "0.7";
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = "1";
            }}
            onMouseDown={(e) => {
              e.target.style.opacity = "0.5";
            }}
            onMouseUp={(e) => {
              e.target.style.opacity = "0.7";
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: "4px", fontSize: "16px" }} />
            <span style={{
              fontSize: "17px",
              fontWeight: "400",
              lineHeight: "1.2"
            }}>
              返回
            </span>
          </button>

          {/* 标题区域 */}
          <div style={{
            flex: 1,
            minWidth: 0,
            textAlign: "center",
            marginRight: "68px" // 为返回按钮预留空间，保持标题居中
          }}>
            <h1 style={{
              margin: 0,
              fontSize: "17px",
              fontWeight: "600",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: theme === "dark" ? "#fff" : "#000",
              lineHeight: "1.2"
            }}>
              {crypto.name}
            </h1>
            <div style={{
              fontSize: "13px",
              color: theme === "dark" ? "#8E8E93" : "#8E8E93",
              marginTop: "2px",
              fontWeight: "400"
            }}>
              {crypto.symbol.toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main style={{
        flex: 1,
        padding: "16px",
        paddingBottom: "max(16px, env(safe-area-inset-bottom))",
        paddingLeft: "max(16px, env(safe-area-inset-left))",
        paddingRight: "max(16px, env(safe-area-inset-right))",
        overflowY: "auto"
      }}>
        {/* 主要信息卡片 */}
        <div style={{
          backgroundColor: theme === "dark" ? "#2d2d2d" : "#fff",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "16px"
        }}>
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
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "12px",
            marginBottom: "20px"
          }}>
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
          </div>
        </div>

        {/* 市场数据 */}
        <div style={{
          backgroundColor: theme === "dark" ? "#2d2d2d" : "#fff",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "16px"
        }}>
          <h3 style={{
            margin: "0 0 16px 0",
            fontSize: "18px",
            fontWeight: "bold"
          }}>
            <FontAwesomeIcon icon={faChartBar} style={{ marginRight: "8px" }} />
            市场数据
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "16px"
          }}>
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
          </div>
        </div>

        {/* 价格范围 */}
        <div style={{
          backgroundColor: theme === "dark" ? "#2d2d2d" : "#fff",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "16px"
        }}>
          <h3 style={{
            margin: "0 0 16px 0",
            fontSize: "18px",
            fontWeight: "bold"
          }}>
            📈 价格范围
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "16px"
          }}>
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
          </div>
        </div>

        {/* 描述信息 */}
        {crypto.description?.en && (
          <div style={{
            backgroundColor: theme === "dark" ? "#2d2d2d" : "#fff",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "16px"
          }}>
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
          </div>
        )}
      </main>
    </div>
  );
}

export default CryptoDetail;
