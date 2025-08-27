import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  NavBar,
  List,
  Card,
  Button,
  SpinLoading,
  Empty,
  Toast,
  ConfigProvider
} from "antd-mobile";
import { LoopOutline } from "antd-mobile-icons";

function HomePage() {
  const [user, setUser] = useState(null);

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
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#007AFF",
          colorBackground: "#f5f5f5",
          colorText: "#000",
        },
      }}
      appearance="light"
    >
      <div style={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        minHeight: "100dvh"
      }}>
        {/* Header */}
        <NavBar
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: "#fff",
            borderBottom: "1px solid #e0e0e0"
          }}
          backArrow={false}
          right={
            <Button
              fill="none"
              size="small"
              loading={loading}
              onClick={fetchCryptoData}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                padding: 0
              }}
            >
              <LoopOutline />
            </Button>
          }
        >
          <div>
            <div style={{ fontSize: "18px", fontWeight: "600" }}>
              虚拟货币实时数据
            </div>
            {user && (
              <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                欢迎, {user.first_name}!
              </div>
            )}
          </div>
        </NavBar>

        {/* Body List */}
        <div style={{
          paddingTop: "calc(45px + env(safe-area-inset-top))",
          minHeight: "100vh"
        }}>
          {error && (
            <div style={{ padding: "16px" }}>
              <Card style={{ backgroundColor: "#ffebee", color: "#c62828", textAlign: "center" }}>
                {error}
              </Card>
            </div>
          )}

          {/* 加密货币列表 */}
          <div>
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <SpinLoading style={{ marginBottom: "16px" }} />
                <div>正在加载加密货币数据...</div>
              </div>
            ) : cryptoData.length === 0 ? (
              <Empty
                description="暂无虚拟货币数据"
                style={{ padding: "40px 0" }}
              />
            ) : (
              <List>
                {cryptoData.map((crypto, index) => (
                  <List.Item
                    key={crypto.id}
                    onClick={() => handleCryptoClick(crypto.id)}
                    arrow={false}
                    style={{
                      marginBottom: "8px",
                      borderRadius: "12px",
                      overflow: "hidden"
                    }}
                    prefix={
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%"
                        }}
                      />
                    }
                    title={
                      <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                        {crypto.name}
                      </div>
                    }
                    description={
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {crypto.symbol.toUpperCase()}
                      </div>
                    }
                    extra={
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                          {formatPrice(crypto.current_price)}
                        </div>
                        <div style={{
                          fontSize: "12px",
                          color: getPriceChangeColor(crypto.price_change_percentage_24h),
                          fontWeight: "bold"
                        }}>
                          {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                          {crypto.price_change_percentage_24h.toFixed(2)}%
                        </div>
                      </div>
                    }
                  >
                    <div style={{
                      marginTop: "8px",
                      paddingTop: "8px",
                      fontSize: "12px",
                      color: "#666"
                    }}>
                      市值: {formatMarketCap(crypto.market_cap)} | 24h交易量: {formatMarketCap(crypto.total_volume)}
                    </div>
                  </List.Item>
                ))}
              </List>
            )}
          </div>

          {/* 底部信息 */}
          <div style={{
            textAlign: "center",
            borderTop: "1px solid #e0e0e0",
            fontSize: "12px",
            color: "#666"
          }}>
            <div>数据来源: CoinGecko API</div>
            <div>数据每5分钟自动更新</div>
            <div style={{ marginTop: "10px" }}>
              <Button
                size="small"
                fill="outline"
                onClick={() => window.Telegram.WebApp.close()}
              >
                关闭小程序
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default HomePage;
