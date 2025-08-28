import React from 'react';
import { SpinLoading } from 'antd-mobile';

// 数据加载组件
const DataLoading = ({
    title = "正在加载数据",
    description = "请稍候，正在获取最新的行情数据...",
    minHeight = "200px"
}) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            minHeight: minHeight
        }}>
            <SpinLoading
                style={{
                    marginBottom: "16px",
                    fontSize: "24px"
                }}
            />
            <div style={{
                fontSize: "16px",
                fontWeight: "500",
                color: "#333",
                marginBottom: "8px"
            }}>
                {title}
            </div>
            {/* <div style={{
                fontSize: "14px",
                color: "#666",
                textAlign: "center"
            }}>
                {description}
            </div> */}
        </div>
    );
};

export default DataLoading;
