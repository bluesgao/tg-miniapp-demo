import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    NavBar,
    Button,
    Divider
} from "antd-mobile";

// 导入组件
import CryptoInfoCard from '../components/CryptoInfoCard';
import PriceStats from '../components/PriceStats';
import MarketData from '../components/MarketData';
import PriceRange from '../components/PriceRange';
import ProjectDescription from '../components/ProjectDescription';
import ErrorPage from '../components/ErrorPage';
import DataLoading from '../components/DataLoading';

// 主组件
function DetailPage() {
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
            setError('网络连接异常，无法获取数据。请检查网络设置或稍后重试。');
            setCrypto(null);
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
                        {crypto?.name || "加密货币详情"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                        {crypto?.symbol?.toUpperCase() || ""}
                    </div>
                </div>
            </NavBar>

            {/* 主要内容 */}
            <div style={{
                minHeight: "100vh"
            }}>
                {/* 加载状态 */}
                {loading ? (
                    <DataLoading
                        title="正在加载详细信息"
                        description="请稍候，正在获取加密货币详情..."
                    />
                ) : (
                    <>
                        {/* 错误状态 */}
                        {error || !crypto ? (
                            <ErrorPage
                                error={error || "未找到该虚拟货币信息"}
                                onRetry={handleRefresh}
                            />
                        ) : (
                            <>
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
                            </>
                        )}
                    </>
                )}
            </div>

            {/* 悬浮按钮 - 只在没有错误时显示 */}
            {crypto != null && (
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
                        style={{
                            height: '32px',
                            width: '60px',
                            fontSize: '12px',
                            padding: '0'
                        }}
                    >
                        首页
                    </Button>

                    {/* 刷新按钮 */}
                    <Button
                        block shape='rounded' color='primary'
                        onClick={handleRefresh}
                        loading={refreshing}
                        style={{
                            height: '32px',
                            width: '60px',
                            fontSize: '12px',
                            padding: '0'
                        }}
                    >
                        {refreshing ? '刷新中' : '刷新'}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default DetailPage;
