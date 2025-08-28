import React from 'react';
import { formatUtils } from './formatUtils';

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

export default PriceChangeIndicator;
