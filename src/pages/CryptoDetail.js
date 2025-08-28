import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  NavBar,
  Button,
  SpinLoading,
  Divider,
  Toast
} from "antd-mobile";

// 导入组件
import CryptoInfoCard from '../components/CryptoInfoCard';
import PriceStats from '../components/PriceStats';
import MarketData from '../components/MarketData';
import PriceRange from '../components/PriceRange';
import ProjectDescription from '../components/ProjectDescription';





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
    );
  }

  // 错误状态
  if (error || !crypto) {
    return (
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
    );
  }

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
        <Button block shape='rounded' color='primary'
          onClick={handleBack}
        >
          首页
        </Button>

        {/* 刷新按钮 */}
        <Button
          block shape='rounded' color='primary'
          onClick={handleRefresh}
          loading={refreshing}
        >
          刷新
        </Button>
      </div>
    </div>
  );
}

export default CryptoDetail;
