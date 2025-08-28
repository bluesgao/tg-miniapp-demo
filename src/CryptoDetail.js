import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  NavBar,
  Card,
  Button,
  SpinLoading,
  ConfigProvider,
  Grid,
  Divider,
  Toast
} from "antd-mobile";
import {
  LeftOutline,
  LoopOutline
} from "antd-mobile-icons";


// 格式化工具函数
const formatUtils = {
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

// 价格变化组件
const PriceChangeIndicator = ({ value, size = "small" }) => {
  const color = value >= 0 ? '#4CAF50' : '#F44336';

  return (
    <div style={{
      color,
      fontSize: size === 'large' ? '16px' : '14px',
      fontWeight: 'bold',
      textAlign: 'center'
    }}>
      {formatUtils.percentage(value)}
    </div>
  );
};

// 融合的币种信息和价格卡片组件
const CryptoInfoCard = ({ crypto }) => {
  const currentPrice = crypto.market_data?.current_price?.usd;
  const priceChange24h = crypto.market_data?.price_change_percentage_24h;

  return (
    <Card style={{
      margin: '16px',
      borderRadius: '12px',
      backgroundColor: '#fff',
      color: '#333'
    }}>
      <div style={{ padding: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* 左侧：币种图标和基本信息 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1
          }}>
            <img
              src={crypto.image?.large || crypto.image?.small}
              alt={crypto.name}
              style={{
                width: "48px",
                height: "48px",
                marginRight: "12px",
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.3)"
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/48x48?text=' + crypto.symbol.charAt(0).toUpperCase();
              }}
            />
            <div>
              <h2 style={{
                margin: "0 0 2px 0",
                fontSize: "20px",
                fontWeight: "bold",
                color: '#333'
              }}>
                {crypto.name}
              </h2>
              <div style={{
                fontSize: "14px",
                color: "#666",
                textTransform: "uppercase",
                fontWeight: "500"
              }}>
                {crypto.symbol}
              </div>
              {crypto.market_cap_rank && (
                <div style={{
                  backgroundColor: '#f0f0f0',
                  color: '#666',
                  padding: '2px 6px',
                  borderRadius: '8px',
                  fontSize: '10px',
                  display: 'inline-block',
                  marginTop: '4px'
                }}>
                  排名 #{crypto.market_cap_rank}
                </div>
              )}
            </div>
          </div>

          {/* 右侧：价格信息 */}
          <div style={{
            textAlign: 'left',
            minWidth: '100px'
          }}>
            <div style={{
              fontSize: '22px',
              fontWeight: 'bold',
              marginBottom: '4px',
              color: '#333'
            }}>
              {formatUtils.price(currentPrice)}
            </div>
            <PriceChangeIndicator value={priceChange24h} size="small" />
          </div>
        </div>
      </div>
    </Card>
  );
};

// 价格变化统计组件
const PriceStats = ({ crypto }) => {
  const stats = [
    {
      label: '1小时',
      value: crypto.market_data?.price_change_percentage_1h_in_currency?.usd
    },
    {
      label: '24小时',
      value: crypto.market_data?.price_change_percentage_24h
    },
    {
      label: '7天',
      value: crypto.market_data?.price_change_percentage_7d
    }
  ];

  return (
    <div style={{ padding: '16px' }}>
      <div style={{
        marginBottom: '16px',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        近期变化
      </div>
      <Grid columns={3} gap={12}>
        {stats.map((stat, index) => (
          <Card key={index} style={{
            borderRadius: '8px',
            textAlign: 'center',
            padding: '12px'
          }}>

            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              {stat.label}
            </div>
            <PriceChangeIndicator value={stat.value} />
          </Card>
        ))}
      </Grid>
    </div>
  );
};

// 市场数据组件
const MarketData = ({ crypto }) => {
  const marketData = [
    {
      label: '市值',
      value: formatUtils.marketCap(crypto.market_data?.market_cap?.usd)
    },
    {
      label: '24h交易量',
      value: formatUtils.marketCap(crypto.market_data?.total_volume?.usd)
    },
    {
      label: '流通供应量',
      value: formatUtils.number(crypto.market_data?.circulating_supply)
    },
    {
      label: '总供应量',
      value: formatUtils.number(crypto.market_data?.total_supply)
    }
  ];

  return (
    <div style={{ padding: '16px' }}>
      <div style={{
        marginBottom: '16px',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        市场数据
      </div>

      <Grid columns={2} gap={12}>
        {marketData.map((item, index) => (
          <Card key={index} style={{
            borderRadius: '8px',
            padding: '12px'
          }}>
            <div style={{
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '12px', color: '#666' }}>
                {item.label}
              </span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {item.value}
            </div>
          </Card>
        ))}
      </Grid>
    </div>
  );
};

// 价格范围组件
const PriceRange = ({ crypto }) => {
  const ranges = [
    {
      label: '24h最高',
      value: crypto.market_data?.high_24h?.usd,
      color: '#4CAF50'
    },
    {
      label: '24h最低',
      value: crypto.market_data?.low_24h?.usd,
      color: '#F44336'
    },
    {
      label: '历史最高',
      value: crypto.market_data?.ath?.usd,
      color: '#4CAF50'
    },
    {
      label: '历史最低',
      value: crypto.market_data?.atl?.usd,
      color: '#F44336'
    }
  ];

  return (
    <div style={{ padding: '16px' }}>
      <h3 style={{
        margin: '0 0 16px 0',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        价格范围
      </h3>

      <Grid columns={2} gap={12}>
        {ranges.map((range, index) => (
          <Card key={index} style={{
            borderRadius: '8px',
            padding: '12px',
            border: `2px solid ${range.color}20`
          }}>
            <div style={{
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '12px', color: '#666' }}>
                {range.label}
              </span>
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: range.color
            }}>
              {formatUtils.price(range.value)}
            </div>
          </Card>
        ))}
      </Grid>
    </div>
  );
};

// 项目描述组件
const ProjectDescription = ({ crypto }) => {
  const description = crypto.description?.en;

  if (!description) return null;

  const cleanDescription = description.replace(/<[^>]*>/g, '').substring(0, 300);
  const isTruncated = description.length > 300;

  return (
    <div style={{ padding: '16px' }}>
      <h3 style={{
        margin: '0 0 16px 0',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        项目简介
      </h3>
      <Card style={{
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#333'
        }}>
          {cleanDescription}
          {isTruncated && (
            <span style={{ color: '#007AFF', cursor: 'pointer' }}
              onClick={() => Toast.show('完整描述请访问官方网站')}>
              ... 查看更多
            </span>
          )}
        </div>
      </Card>
    </div>
  );
};



// 主组件
function CryptoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crypto, setCrypto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Telegram WebApp 初始化
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.expand();
      tg.ready();
    }
  }, []);

  // 获取加密货币详情
  const fetchCryptoDetail = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; CryptoApp/1.0)'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCrypto(data);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error fetching crypto detail:', err);
      setError('获取详细信息时出错，请稍后重试');
      Toast.show({
        content: '网络连接失败，请检查网络设置',
        position: 'center'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCryptoDetail();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // 刷新数据
  const handleRefresh = () => {
    setRefreshing(true);
    fetchCryptoDetail(false);
  };

  // 返回首页
  const handleBack = () => {
    navigate("/");
  };

  // 加载状态
  if (loading) {
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

  // 错误状态
  if (error || !crypto) {
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "20px"
        }}>

          <div style={{
            marginBottom: "20px",
            textAlign: "center",
            fontSize: "16px"
          }}>
            {error || "未找到该虚拟货币信息"}
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <Button
              color="primary"
              size="large"
              onClick={handleBack}
            >
              返回列表
            </Button>
            <Button
              color="default"
              size="large"
              onClick={handleRefresh}
            >
              重试
            </Button>
          </div>
        </div>
      </ConfigProvider>
    );
  }

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
        minHeight: "100vh"
      }}>
        {/* 导航栏 */}
        <NavBar
          style={{
            backgroundColor: "#fff",
            borderBottom: "1px solid #e0e0e0"
          }}
          backArrow={false}
        >
          <div>
            <div style={{ fontSize: "18px", fontWeight: "600" }}>
              {crypto.name}
            </div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
              {crypto.symbol.toUpperCase()}
            </div>
          </div>
        </NavBar>

        {/* 主要内容 */}
        <div style={{
          minHeight: "100vh"
        }}>
          {/* 融合的币种信息和价格卡片 */}
          <CryptoInfoCard crypto={crypto} />

          {/* 价格变化统计 */}
          <PriceStats crypto={crypto} />

          <Divider style={{ margin: "0" }} />

          {/* 市场数据 */}
          <MarketData crypto={crypto} />

          <Divider style={{ margin: "0" }} />

          {/* 价格范围 */}
          <PriceRange crypto={crypto} />



          {/* 项目描述 */}
          <ProjectDescription crypto={crypto} />

          {/* 底部间距 */}
          <div style={{ height: "20px" }} />
        </div>

        {/* 悬浮按钮 */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 1000
        }}>
          {/* 返回首页按钮 */}
          <Button
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#007AFF',
              color: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
            onClick={handleBack}
          >
            <LeftOutline style={{ fontSize: '16px' }} />
          </Button>

          {/* 刷新按钮 */}
          <Button
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
            onClick={handleRefresh}
            loading={refreshing}
          >
            <LoopOutline style={{ fontSize: '16px' }} />
          </Button>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default CryptoDetail;
