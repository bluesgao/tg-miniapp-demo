import React from 'react';
import { ErrorBlock, Button } from 'antd-mobile';

// 错误页面组件
const ErrorPage = ({ error, onRetry, onRefresh }) => {
    return (
        <div style={{
            padding: '20px 16px',
            minHeight: '40vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px'
            }}>
                {/* 错误块 */}
                <ErrorBlock
                    title="数据加载失败"
                    description={error || '无法获取加密货币数据，请检查网络连接后重试'}
                    style={{
                        marginBottom: '20px'
                    }}
                />

                {/* 操作按钮 */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Button
                        color="primary"
                        size="middle"
                        onClick={onRetry}
                        style={{
                            minWidth: '120px'
                        }}
                    >
                        重新加载
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
