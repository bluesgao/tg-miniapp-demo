import React from 'react';
import { ErrorBlock, Button } from 'antd-mobile';

// 错误页面组件
const ErrorPage = ({ error, onRetry }) => {
    return (
        <div style={{
            padding: '20px 16px',
            minHeight: '30vh',
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
                    description=""
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
                        size="small"
                        shape='rounded'
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
