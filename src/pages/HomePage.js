import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  NavBar,
  Button,
  SpinLoading,
  ErrorBlock,
  Toast,
  PullToRefresh
} from "antd-mobile";

// 导入组件
import CryptoCard from '../components/CryptoCard';
import MarketOverview from '../components/MarketOverview';
import SearchAndFilter from '../components/SearchAndFilter';
import ErrorPage from '../components/ErrorPage';
import FooterInfo from '../components/FooterInfo';



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
        setError('网络连接异常，无法获取加密货币数据。请检查网络设置或稍后重试。');
        console.error('All APIs failed');
      }

    } catch (err) {
      setError('服务器响应异常，请稍后重试。如果问题持续存在，请联系技术支持。');
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

  // 处理重新加载
  const handleRetry = () => {
    setError(null);
    fetchCryptoData(true);
  };

  return (
    <div style={{
      backgroundColor: "#f5f5f5",
      minHeight: "100vh"
    }}>
      {/* 导航栏 */}
      <NavBar
        style={{
          backgroundColor: "#fff"
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
          {/* 错误页面 */}
          {error && !loading && (
            <ErrorPage
              error={error}
              onRetry={handleRetry}
              onRefresh={handleManualRefresh}
            />
          )}

          {/* 正常内容 */}
          {!error && (
            <>
              {/* 市场概览 */}
              {!loading && cryptoData.length > 0 && (
                <MarketOverview cryptoData={cryptoData} />
              )}

              {/* 搜索和过滤 */}
              {!loading && cryptoData.length > 0 && (
                <div style={{
                  backgroundColor: '#fff',
                  margin: '0 16px 12px',
                  borderRadius: '8px',
                  padding: '12px'
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
                  <ErrorBlock
                    title={
                      searchQuery
                        ? `未找到包含"${searchQuery}"的加密货币`
                        : "暂无虚拟货币数据"
                    }
                    description="请尝试调整搜索条件或刷新数据"
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
            </>
          )}

          {/* 底部信息 */}
          <FooterInfo
            onRefresh={handleManualRefresh}
            onClose={() => window.Telegram?.WebApp?.close()}
          />
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
          block shape='rounded' color='primary'
          onClick={handleManualRefresh}
          loading={loading}
        >
          刷新
        </Button>
      </div>
    </div>
  );
}

export default HomePage;
