import React from 'react';
import { Card, Grid } from 'antd-mobile';
import PriceChangeIndicator from './PriceChangeIndicator';

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
        <div style={{ padding: '8px 16px' }}>
            <div style={{
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 'bold'
            }}>
                近期波动
            </div>
            <Grid columns={3} gap={6}>
                {stats.map((stat, index) => (
                    <Card key={index} style={{
                        borderRadius: '4px',
                        textAlign: 'center',
                        padding: '8px'
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

export default PriceStats;
