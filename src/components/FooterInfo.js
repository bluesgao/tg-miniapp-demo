import React from 'react';
import { Button } from 'antd-mobile';

// 底部信息组件
const FooterInfo = ({ onRefresh, onClose }) => {
    return (
        <div style={{
            textAlign: "center",
            padding: "16px",
            fontSize: "12px",
            color: "#666",
            marginTop: "16px",
            backgroundColor: "#fff"
        }}>
            <div style={{
                marginBottom: "12px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px"
            }}>
                <span style={{
                    fontWeight: "500"
                }}>
                    CoinGecko API
                </span>
                <span style={{
                    opacity: "0.8"
                }}>
                    数据每5分钟自动更新
                </span>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "8px"
            }}>
                <Button
                    size="small"
                    fill="outline"
                    onClick={onClose}
                    style={{
                        minWidth: "100px",
                        borderRadius: "16px"
                    }}
                >
                    关闭小程序
                </Button>
            </div>
        </div>
    );
};

export default FooterInfo;
