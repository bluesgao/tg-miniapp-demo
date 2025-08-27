import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faSpinner, faChartBar } from "@fortawesome/free-solid-svg-icons";

function HomePage() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tg = window.Telegram.WebApp;

    // 让小程序自动全屏展开
    tg.expand();

    // 获取用户信息
    if (tg.initDataUnsafe?.user) {
      setUser(tg.initDataUnsafe.user);
    }

    // 获取主题
    setTheme(tg.colorScheme);

    // 监听主题变化
    tg.onEvent("themeChanged", () => {
      setTheme(tg.colorScheme);
    });
  }, []);

  // 获取加密货币数据
  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiEndpoints = [
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false',
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,cardano,solana,polkadot&vs_currencies=usd&include_24hr_change=true&include_market_cap=true'
      ];

      let data = null;

      try {
        const response = await fetch(apiEndpoints[0], {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; CryptoApp/1.0)'
          }
        });

        if (response.ok) {
          data = await response.json();
        }
      } catch (err) {
        // API调用失败，继续尝试下一个
      }

      if (!data) {
        try {
          const response = await fetch(apiEndpoints[1], {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (compatible; CryptoApp/1.0)'
            }
          });

          if (response.ok) {
            const simpleData = await response.json();
            data = Object.keys(simpleData).map(id => ({
              id: id,
              symbol: id,
              name: id.charAt(0).toUpperCase() + id.slice(1),
              image: `https://assets.coingecko.com/coins/images/1/large/${id}.png`,
              current_price: simpleData[id].usd,
              market_cap: simpleData[id].usd_market_cap,
              total_volume: simpleData[id].usd_24h_vol || 0,
              price_change_percentage_24h: simpleData[id].usd_24h_change || 0
            }));
          }
        } catch (err) {
          // 备用API调用失败
        }
      }

      if (data) {
        setCryptoData(data);
      } else {
        setError('无法获取加密货币数据，请检查网络连接后重试');
        console.error('All APIs failed');
      }

    } catch (err) {
      setError('获取加密货币数据时出错，请稍后重试');
      console.error('Error fetching crypto data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();

    // 每5分钟自动刷新数据
    const interval = setInterval(fetchCryptoData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (price < 1) {
      return `$${price.toFixed(6)}`;
    } else if (price < 100) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(2)}`;
    }
  };

  const formatMarketCap = (marketCap) => {
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

  const getPriceChangeColor = (change) => {
    return change >= 0 ? '#4CAF50' : '#F44336';
  };

  const handleCryptoClick = (cryptoId) => {
    navigate(`/crypto/${cryptoId}`);
  };

  return (
    <div
      style={{
        backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
        color: theme === "dark" ? "#fff" : "#000",
        minHeight: "100vh",
        minHeight: "100dvh",
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
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <h2 style={{
                margin: "0",
                color: theme === "dark" ? "#fff" : "#333",
                fontSize: "20px",
                fontWeight: "600"
              }}>
                虚拟货币实时数据
              </h2>
              <button
                onClick={fetchCryptoData}
                disabled={loading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: theme === "dark" ? "#3d3d3d" : "#f8f9fa",
                  color: theme === "dark" ? "#fff" : "#333",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  width: "36px",
                  height: "36px",
                  touchAction: "manipulation",

                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = theme === "dark" ? "#4d4d4d" : "#e9ecef";
                    e.target.style.transform = "scale(1.1)";

                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = theme === "dark" ? "#3d3d3d" : "#f8f9fa";
                  e.target.style.transform = "scale(1)";

                }}
              >
                <FontAwesomeIcon
                  icon={faArrowsRotate}
                  style={{
                    color: theme === "dark" ? "#fff" : "#333",
                    transform: loading ? "rotate(360deg)" : "rotate(0deg)",
                    transition: "transform 0.8s linear",
                    fontSize: "18px"
                  }}
                />
              </button>
            </div>
            {user && (
              <p style={{
                margin: "10px 0 0 0",
                fontSize: "14px",
                color: theme === "dark" ? "#ccc" : "#666"
              }}>
                欢迎, <b>{user.first_name}</b>!
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Body List */}
      <main style={{
        flex: 1,
        padding: "16px",
        paddingTop: "calc(80px + max(16px, env(safe-area-inset-top)))",
        paddingBottom: "max(16px, env(safe-area-inset-bottom))",
        paddingLeft: "max(16px, env(safe-area-inset-left))",
        paddingRight: "max(16px, env(safe-area-inset-right))",
        overflowY: "auto"
      }}>








        {error && (
          <div style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "8px",
            marginBottom: "16px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}



        {/* 加密货币列表 */}
        <div style={{ marginBottom: "20px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <FontAwesomeIcon icon={faSpinner} size="lg" style={{ marginBottom: "10px", animation: "spin 1s linear infinite" }} />
              <div>正在加载加密货币数据...</div>
            </div>
          ) : cryptoData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <FontAwesomeIcon icon={faChartBar} size="lg" style={{ marginBottom: "10px", color: theme === "dark" ? "#666" : "#999" }} />
              <div>暂无虚拟货币数据</div>
            </div>
          ) : (
            <div>
              {cryptoData.map((crypto, index) => (
                <div
                  key={crypto.id}
                  onClick={() => handleCryptoClick(crypto.id)}
                  style={{
                    backgroundColor: theme === "dark" ? "#2d2d2d" : "#fff",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "12px",


                    cursor: "pointer",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    touchAction: "manipulation"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";

                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";

                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    {/* 左侧：图标和名称 */}
                    <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        style={{
                          width: "32px",
                          height: "32px",
                          marginRight: "12px",
                          borderRadius: "50%",
                          flexShrink: 0
                        }}
                      />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          marginBottom: "4px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>
                          {crypto.name}
                        </div>
                        <div style={{
                          fontSize: "12px",
                          color: theme === "dark" ? "#ccc" : "#666",
                          textTransform: "uppercase",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>
                          {crypto.symbol}
                        </div>
                      </div>
                    </div>

                    {/* 右侧：价格和变化 */}
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "8px" }}>
                      <div style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        marginBottom: "4px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}>
                        {formatPrice(crypto.current_price)}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: getPriceChangeColor(crypto.price_change_percentage_24h),
                        fontWeight: "bold",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}>
                        {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                        {crypto.price_change_percentage_24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* 市值信息 */}
                  <div style={{
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: `1px solid ${theme === "dark" ? "#444" : "#e0e0e0"}`,
                    fontSize: "12px",
                    color: theme === "dark" ? "#ccc" : "#666",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    市值: {formatMarketCap(crypto.market_cap)} | 24h交易量: {formatMarketCap(crypto.total_volume)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部信息 */}
        <div style={{
          textAlign: "center",
          padding: "16px",
          borderTop: `1px solid ${theme === "dark" ? "#444" : "#e0e0e0"}`,
          fontSize: "12px",
          color: theme === "dark" ? "#ccc" : "#666"
        }}>
          <div>数据来源: CoinGecko API</div>
          <div>数据每5分钟自动更新</div>
          <div style={{ marginTop: "10px" }}>
            <button
              style={{
                padding: "12px 20px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: theme === "dark" ? "#666" : "#ddd",
                color: theme === "dark" ? "#fff" : "#333",
                fontSize: "14px",
                cursor: "pointer",
                minHeight: "44px", // 触摸友好
                minWidth: "100px",
                touchAction: "manipulation" // 优化触摸体验
              }}
              onClick={() => window.Telegram.WebApp.close()}
            >
              关闭小程序
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
