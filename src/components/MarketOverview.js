import React from 'react';
import { Card } from 'antd-mobile';
import { formatUtils } from './formatUtils';

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
                color: 'white',
                border: 'none'
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

export default MarketOverview;
