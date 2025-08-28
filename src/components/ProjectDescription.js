import React from 'react';
import { Card, Toast } from 'antd-mobile';

// 项目描述组件
const ProjectDescription = ({ crypto }) => {
    const description = crypto.description?.en;

    if (!description) return null;

    const cleanDescription = description.replace(/<[^>]*>/g, '').substring(0, 300);
    const isTruncated = description.length > 300;

    return (
        <div style={{ padding: '8px 16px' }}>
            <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '14px',
                fontWeight: 'bold'
            }}>
                项目简介
            </h3>
            <Card style={{
                borderRadius: '4px',
                padding: '10px',
                backgroundColor: '#fff'
            }}>
                <div style={{
                    fontSize: '12px',
                    lineHeight: '1.4',
                    color: '#333'
                }}>
                    {cleanDescription}
                    {isTruncated && (
                        <span style={{ color: '#007AFF', cursor: 'pointer' }}
                            onClick={() => Toast.show('完整描述请访问官方网站')}>
                            ... 查看更多
                        </span>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ProjectDescription;
