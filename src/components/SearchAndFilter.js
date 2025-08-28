import React from 'react';
import { SearchBar, Button } from 'antd-mobile';

// 搜索和过滤组件
const SearchAndFilter = ({ onSearch, onFilterChange, activeFilter }) => {
    const filters = [
        { key: 'all', label: '全部' },
        { key: 'gainers', label: '涨幅榜' },
        { key: 'losers', label: '跌幅榜' },
        { key: 'top', label: '市值榜' }
    ];

    return (
        <div>
            {/* 搜索框 */}
            <div style={{
                marginBottom: '12px'
            }}>
                <SearchBar
                    placeholder="搜索加密货币名称或符号..."
                    onSearch={onSearch}
                    style={{
                        '--border-radius': '8px',
                        '--background-color': '#f8f9fa',
                        '--border': '2px solid #007AFF',
                        '--font-size': '14px',
                        '--padding': '10px 12px'
                    }}
                />
            </div>

            {/* 过滤按钮 */}
            <div style={{
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                paddingBottom: '2px'
            }}>
                {filters.map(filter => (
                    <Button
                        key={filter.key}
                        size="small"
                        fill={activeFilter === filter.key ? "solid" : "outline"}
                        onClick={() => onFilterChange(filter.key)}
                        style={{
                            whiteSpace: 'nowrap',
                            borderRadius: '6px',
                            fontWeight: '500',
                            minWidth: '70px',
                            justifyContent: 'center',
                            fontSize: '12px',
                            padding: '6px 8px'
                        }}
                    >
                        {filter.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default SearchAndFilter;
