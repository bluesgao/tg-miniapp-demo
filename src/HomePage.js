import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  NavBar,
  Card,
  Button,
  SpinLoading,
  Empty,
  Toast,
  ConfigProvider,
  SearchBar,
  Tag,
  PullToRefresh
} from "antd-mobile";
import {
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
  }
};

// 价格变化指示器组件
const PriceChangeIndicator = ({ value, size = "small" }) => {
  const color = value >= 0 ? '#4CAF50' : '#F44336';

  return (
    <div style={{
      color,
      fontSize: size === 'large' ? '14px' : '12px',
      fontWeight: 'bold',
      textAlign: 'center'
    }}>
      {formatUtils.percentage(value)}
    </div>
  );
};

// 加密货币卡片组件
const CryptoCard = ({ crypto, onClick }) => {
  const isPositive = crypto.price_change_percentage_24h >= 0;

  return (
    <Card
      style={{
        margin: '6px 16px',
        borderRadius: '8px',
        border: `1px solid ${isPositive ? '#4CAF5020' : '#F4433620'}`,
        backgroundColor: isPositive ? '#4CAF5005' : '#F4433605'
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
        {/* 图标和基本信息 */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <img
            src={crypto.image}
            alt={crypto.name}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              marginRight: "10px",
              border: "2px solid #e0e0e0"
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/32x32?text=' + crypto.symbol.charAt(0).toUpperCase();
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '2px'
            }}>
              <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                {crypto.name}
              </span>
              {crypto.market_cap_rank && (
                <Tag color="primary" fill="outline" size="small">
                  #{crypto.market_cap_rank}
                </Tag>
              )}
            </div>
            <div style={{ fontSize: "11px", color: "#666", textTransform: "uppercase" }}>
              {crypto.symbol}
            </div>
          </div>
        </div>

        {/* 价格信息 */}
        <div style={{ textAlign: "right", minWidth: "90px" }}>
          <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "2px" }}>
            {formatUtils.price(crypto.current_price)}
          </div>
          <PriceChangeIndicator value={crypto.price_change_percentage_24h} />
        </div>
      </div>

      {/* 市场数据 */}
      <div style={{
        padding: "6px 10px",
        borderTop: "1px solid #f0f0f0",
        fontSize: "11px",
        color: "#666",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <span>市值: {formatUtils.marketCap(crypto.market_cap)}</span>
        <span>24h量: {formatUtils.marketCap(crypto.total_volume)}</span>
      </div>
    </Card>
  );
};

// 市场概览组件
const MarketOverview = ({ cryptoData }) => {
  const totalMarketCap = cryptoData.reduce((sum, crypto) => sum + (crypto.market_cap || 0), 0);
  const positiveCount = cryptoData.filter(crypto => crypto.price_change_percentage_24h >= 0).length;
  const negativeCount = cryptoData.length - positiveCount;

  return (
    <div style={{ padding: '12px 16px' }}>
      <Card style={{
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ padding: '12px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
            市场概览
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>总市值</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                {formatUtils.marketCap(totalMarketCap)}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>上涨</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#4CAF50' }}>
                {positiveCount}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>下跌</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#F44336' }}>
                {negativeCount}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// 搜索和过滤组件
const SearchAndFilter = ({ onSearch, onFilterChange, activeFilter }) => {
  const filters = [
    { key: 'all', label: '全部' },
    { key: 'gainers', label: '涨幅榜' },
    { key: 'losers', label: '跌幅榜' },
    { key: 'top', label: '市值榜' }
  ];

  return (
    <div>
      {/* 搜索框 */}
      <div style={{
        marginBottom: '12px'
      }}>
        <SearchBar
          placeholder="搜索加密货币名称或符号..."
          onSearch={onSearch}
          style={{
            '--border-radius': '8px',
            '--background-color': '#f8f9fa',
            '--border': '2px solid #007AFF',
            '--font-size': '14px',
            '--padding': '10px 12px'
          }}
        />
      </div>

      {/* 过滤按钮 */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {filters.map(filter => (
          <Button
            key={filter.key}
            size="small"
            fill={activeFilter === filter.key ? "solid" : "outline"}
            onClick={() => onFilterChange(filter.key)}
            style={{
              whiteSpace: 'nowrap',
              borderRadius: '6px',
              fontWeight: '500',
              minWidth: '70px',
              justifyContent: 'center',
              fontSize: '12px',
              padding: '6px 8px'
            }}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

// 主组件
function HomePage() {
  const [user, setUser] = useState(null);
  const [cryptoData, setCryptoData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // eslint-disable-line no-unused-vars
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  // Telegram WebApp 初始化
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.expand();
      tg.ready();

      // 获取用户信息
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }
    }
  }, []);

  // 获取加密货币数据
  const fetchCryptoData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
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
        console.log('Primary API failed, trying backup...');
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
          console.log('Backup API also failed');
        }
      }

      if (data) {
        setCryptoData(data);
        setFilteredData(data);
        if (!showLoading) {
          Toast.show({
            content: '数据已更新',
            position: 'center'
          });
        }
      } else {
        setError('无法获取加密货币数据，请检查网络连接后重试');
        console.error('All APIs failed');
      }

    } catch (err) {
      setError('获取加密货币数据时出错，请稍后重试');
      console.error('Error fetching crypto data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // 初始加载和自动刷新
  useEffect(() => {
    fetchCryptoData();

    // 每5分钟自动刷新数据
    const interval = setInterval(() => fetchCryptoData(false), 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchCryptoData]);

  // 搜索和过滤逻辑
  useEffect(() => {
    let filtered = [...cryptoData];

    // 搜索过滤
    if (searchQuery) {
      filtered = filtered.filter(crypto =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 分类过滤
    switch (activeFilter) {
      case 'gainers':
        filtered = filtered.filter(crypto => crypto.price_change_percentage_24h > 0);
        break;
      case 'losers':
        filtered = filtered.filter(crypto => crypto.price_change_percentage_24h < 0);
        break;
      case 'top':
        filtered = filtered.sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0));
        break;
      default:
        break;
    }

    setFilteredData(filtered);
  }, [cryptoData, searchQuery, activeFilter]);

  // 处理搜索
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  // 处理过滤
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // 处理下拉刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCryptoData(false);
  };

  // 处理加密货币点击
  const handleCryptoClick = (cryptoId) => {
    navigate(`/crypto/${cryptoId}`);
  };

  // 处理手动刷新
  const handleManualRefresh = () => {
    fetchCryptoData(false);
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
              加密货币行情
            </div>
            {user && (
              <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                欢迎, {user.first_name}!
              </div>
            )}
          </div>
        </NavBar>

        {/* 主要内容 */}
        <div style={{
          minHeight: "100vh"
        }}>
          <PullToRefresh onRefresh={handleRefresh}>
            {/* 错误提示 */}
            {error && (
              <div style={{ padding: "16px" }}>
                <Card style={{
                  backgroundColor: "#ffebee",
                  color: "#c62828",
                  textAlign: "center",
                  borderRadius: '12px'
                }}>
                  <div style={{ marginBottom: '12px' }}>{error}</div>
                  <Button
                    size="small"
                    color="primary"
                    onClick={handleManualRefresh}
                  >
                    重试
                  </Button>
                </Card>
              </div>
            )}

            {/* 市场概览 */}
            {!loading && !error && cryptoData.length > 0 && (
              <MarketOverview cryptoData={cryptoData} />
            )}

            {/* 搜索和过滤 */}
            {!loading && !error && cryptoData.length > 0 && (
              <div style={{
                backgroundColor: '#fff',
                margin: '0 16px 12px',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: '#333'
                }}>
                  搜索和筛选
                </div>
                <SearchAndFilter
                  onSearch={handleSearch}
                  onFilterChange={handleFilterChange}
                  activeFilter={activeFilter}
                />
              </div>
            )}

            {/* 加密货币列表 */}
            <div>
              {loading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <SpinLoading style={{ marginBottom: "16px" }} />
                  <div>正在加载加密货币数据...</div>
                </div>
              ) : filteredData.length === 0 ? (
                <Empty
                  description={
                    searchQuery
                      ? `未找到包含"${searchQuery}"的加密货币`
                      : "暂无虚拟货币数据"
                  }
                  style={{ padding: "40px 0" }}
                />
              ) : (
                <div>
                  {filteredData.map((crypto) => (
                    <CryptoCard
                      key={crypto.id}
                      crypto={crypto}
                      onClick={() => handleCryptoClick(crypto.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 底部信息 */}
            <div style={{
              textAlign: "center",
              padding: "20px 16px",
              fontSize: "12px",
              color: "#666",
              borderTop: "1px solid #e0e0e0",
              marginTop: "20px"
            }}>
              <div style={{ marginBottom: "8px" }}>
                数据来源: CoinGecko API
              </div>
              <div style={{ marginBottom: "16px" }}>
                数据每5分钟自动更新
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <Button
                  size="small"
                  fill="outline"
                  onClick={() => window.Telegram?.WebApp?.close()}
                >
                  关闭小程序
                </Button>
                <Button
                  size="small"
                  fill="outline"
                  onClick={handleManualRefresh}
                >
                  刷新数据
                </Button>
              </div>
            </div>
          </PullToRefresh>
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
            onClick={handleManualRefresh}
            loading={loading}
          >
            <LoopOutline style={{ fontSize: '16px' }} />
          </Button>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default HomePage;
