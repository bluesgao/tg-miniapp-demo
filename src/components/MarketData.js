import React from 'react';
import { Card, Grid } from 'antd-mobile';
import { formatUtils } from './formatUtils';

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
        <div style={{ padding: '8px 16px' }}>
            <div style={{
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 'bold'
            }}>
                市场数据
            </div>

            <Grid columns={2} gap={6}>
                {marketData.map((item, index) => (
                    <Card key={index} style={{
                        borderRadius: '4px',
                        padding: '8px'
                    }}>
                        <div style={{
                            marginBottom: '4px'
                        }}>
                            <span style={{ fontSize: '10px', color: '#666' }}>
                                {item.label}
                            </span>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
                            {item.value}
                        </div>
                    </Card>
                ))}
            </Grid>
        </div>
    );
};

export default MarketData;
