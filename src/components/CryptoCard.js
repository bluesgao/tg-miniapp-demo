import React from 'react';
import { Card, Tag } from 'antd-mobile';
import { formatUtils } from './formatUtils';
import PriceChangeIndicator from './PriceChangeIndicator';

// 加密货币卡片组件
const CryptoCard = ({ crypto, onClick }) => {

    return (
        <Card
            style={{
                margin: '6px 16px',
                borderRadius: '8px',
                backgroundColor: '#fff'
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

export default CryptoCard;
