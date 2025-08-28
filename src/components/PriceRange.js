import React from 'react';
import { Card, Grid } from 'antd-mobile';
import { formatUtils } from './formatUtils';

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
        <div style={{ padding: '8px 16px' }}>
            <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '14px',
                fontWeight: 'bold'
            }}>
                价格范围
            </h3>

            <Grid columns={2} gap={6}>
                {ranges.map((range, index) => (
                    <Card key={index} style={{
                        borderRadius: '4px',
                        padding: '8px'
                    }}>
                        <div style={{
                            marginBottom: '4px'
                        }}>
                            <span style={{ fontSize: '10px', color: '#666' }}>
                                {range.label}
                            </span>
                        </div>
                        <div style={{
                            fontSize: '13px',
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

export default PriceRange;
