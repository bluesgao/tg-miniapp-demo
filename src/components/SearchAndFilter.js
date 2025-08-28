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
                    placeholder="搜索加密货币名称或符号"
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
                {filters.map(filter => {
                    const isActive = activeFilter === filter.key;
                    return (
                        <Button
                            key={filter.key}
                            size="small"
                            fill={isActive ? "solid" : "outline"}
                            onClick={() => onFilterChange(filter.key)}
                            style={{
                                whiteSpace: 'nowrap',
                                borderRadius: '4px',
                                fontWeight: '500',
                                width: '60px',
                                height: '32px',
                                justifyContent: 'center',
                                fontSize: '12px',
                                padding: '6px 8px',
                                border: isActive ? '1px solid #007AFF' : '1px solid #e5e5e5',
                                backgroundColor: isActive ? '#007AFF' : '#fff',
                                color: isActive ? '#fff' : '#333'
                            }}
                        >
                            {filter.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};

export default SearchAndFilter;
