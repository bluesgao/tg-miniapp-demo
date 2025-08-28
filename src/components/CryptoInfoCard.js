import React from 'react';
import { Card } from 'antd-mobile';
import { formatUtils } from './formatUtils';
import PriceChangeIndicator from './PriceChangeIndicator';

// 融合的币种信息和价格卡片组件
const CryptoInfoCard = ({ crypto }) => {
    const currentPrice = crypto.market_data?.current_price?.usd;
    const priceChange24h = crypto.market_data?.price_change_percentage_24h;

    return (
        <Card style={{
            margin: '8px 16px',
            borderRadius: '6px',
            backgroundColor: '#fff',
            color: '#333'
        }}>
            <div style={{ padding: '12px' }}>
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
                                width: "36px",
                                height: "36px",
                                marginRight: "8px",
                                borderRadius: "50%"
                            }}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/36x36?text=' + crypto.symbol.charAt(0).toUpperCase();
                            }}
                        />
                        <div>
                            <h2 style={{
                                margin: "0 0 1px 0",
                                fontSize: "16px",
                                fontWeight: "bold",
                                color: '#333'
                            }}>
                                {crypto.name}
                            </h2>
                            <div style={{
                                fontSize: "12px",
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
                                    padding: '1px 4px',
                                    borderRadius: '6px',
                                    fontSize: '9px',
                                    display: 'inline-block',
                                    marginTop: '2px'
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
                            fontSize: '18px',
                            fontWeight: 'bold',
                            marginBottom: '2px',
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

export default CryptoInfoCard;
