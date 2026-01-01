"use client";

import React, { useEffect, useState } from "react";
import { Card, Row, Col, message, Spin, Tag, Table } from "antd";
import { api } from "../services/api"; 
import { Column } from '@ant-design/charts';

interface Summary {
  totalHouseholds: number;
  totalPersons: number;
  activeResidents: number;
  temporaryAbsentResidents: number;
  totalFees: number;
  totalReceivable: number;
  totalCollected: number;
  collectionRate: number;
}

interface FeePeriod {
  id: number;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface PeriodStat {
  periodId: number;
  periodName: string;
  status: string;
  totalReceivable: number;
  totalCollected: number;
  collectionRate: number;
}

interface HouseholdPaymentStat {
  householdId: number;
  householdCode: string;
  ownerName: string;
  apartmentInfo: string;
  totalReceivable: number;
  totalPaid: number;
  paymentRate: number;
}

interface Analytics {
  last5PeriodStats: PeriodStat[];
  bestPayingHousehold: HouseholdPaymentStat | null;
  worstPayingHousehold: HouseholdPaymentStat | null;
  previousPeriodName: string;
}

import { Statistic, Progress } from "antd";
import { HomeOutlined, UserOutlined, CalendarOutlined, TrophyOutlined, WarningOutlined, TeamOutlined, LoginOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<Summary | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState<FeePeriod | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fm = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy kỳ thu hiện tại (đang tiến hành)
        const periodRes = await api.get<FeePeriod>("/fee-periods/current");
        const period = periodRes.data;
        setCurrentPeriod(period);
        
        // Lấy báo cáo theo kỳ thu hiện tại
        const periodYm = period?.name || "";
        const res = await api.get<Summary>(`/reports/summary?periodYm=${encodeURIComponent(periodYm)}`);
        setData(res.data);
        
        // Lấy thống kê phân tích
        const analyticsRes = await api.get<Analytics>("/reports/analytics");
        setAnalytics(analyticsRes.data);
      } catch (err) {
        message.error("Lỗi tải dữ liệu tổng quan");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      'DRAFT': { color: 'default', label: 'Nháp' },
      'OPEN': { color: 'processing', label: 'Đang tiến hành' },
      'CLOSED': { color: 'success', label: 'Đã chốt' },
    };
    const config = statusMap[status] || { color: 'default', label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  // Cấu hình biểu đồ cột
  const chartData = analytics?.last5PeriodStats?.map(stat => ({
    period: stat.periodName,
    'Tỷ lệ thu': stat.collectionRate,
  })) || [];

  const chartConfig = {
    data: chartData,
    xField: 'period',
    yField: 'Tỷ lệ thu',
    color: '#1890ff',
    label: {
      text: (d: any) => `${d['Tỷ lệ thu']}%`,
      textBaseline: 'bottom' as const,
    },
    style: {
      radiusTopLeft: 4,
      radiusTopRight: 4,
    },
    axis: {
      y: {
        title: 'Tỷ lệ thu (%)',
        labelFormatter: (v: number) => `${v}%`,
      },
    },
  };

  return (
    <Spin spinning={loading}>
      {/* Row 1: Thống kê cơ bản */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Tổng số hộ" value={data?.totalHouseholds} prefix={<HomeOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
             <Statistic title="Tổng nhân khẩu" value={data?.totalPersons} prefix={<UserOutlined />} />
          </Card>
        </Col>
         <Col span={6}>
          <Card bordered={false}>
             <Statistic title="Khoản thu" value={data?.totalFees} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
             <Statistic 
               title="Kỳ thu hiện tại" 
               value={currentPeriod?.name || "Chưa có"} 
               prefix={<CalendarOutlined />}
               suffix={currentPeriod && getStatusTag(currentPeriod.status)}
             />
          </Card>
        </Col>
      </Row>

      {/* Row 1.5: Thống kê nhân khẩu theo trạng thái */}
      <h3>Thống kê nhân khẩu</h3>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card bordered={false} style={{ borderLeft: '4px solid #52c41a' }}>
            <Statistic 
              title="Nhân khẩu đang ở" 
              value={data?.activeResidents} 
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ borderLeft: '4px solid #faad14' }}>
            <Statistic 
              title="Nhân khẩu tạm vắng" 
              value={data?.temporaryAbsentResidents} 
              prefix={<LoginOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ borderLeft: '4px solid #1890ff' }}>
            <Statistic 
              title="Tổng cộng" 
              value={data?.totalPersons} 
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Row 2: Thống kê tài chính */}
      <h3>
        Tình hình thu phí {currentPeriod ? `- ${currentPeriod.name}` : ""} 
        {currentPeriod && <span style={{ marginLeft: 8 }}>{getStatusTag(currentPeriod.status)}</span>}
      </h3>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card title="Tổng phải thu" bordered={false}>
             <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                {fm(data?.totalReceivable || 0)}
             </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Đã thu" bordered={false}>
             <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                {fm(data?.totalCollected || 0)}
             </div>
          </Card>
        </Col>
        <Col span={8}>
           <Card title="Tiến độ thu" bordered={false}>
              <Progress type="circle" percent={data?.collectionRate} width={80} />
           </Card>
        </Col>
      </Row>

      {/* Row 3: Biểu đồ thống kê 5 kỳ gần nhất */}
      <h3>Thống kê tỷ lệ thu phí 5 kỳ gần nhất</h3>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card bordered={false}>
            {chartData.length > 0 ? (
              <Column {...chartConfig} height={300} />
            ) : (
              <div style={{ textAlign: 'center', padding: 50, color: '#999' }}>
                Chưa có dữ liệu thống kê
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Row 4: Hộ khẩu đóng phí tốt nhất và kém nhất */}
      {analytics?.previousPeriodName && (
        <>
          <h3>Xếp hạng đóng phí - Kỳ {analytics.previousPeriodName}</h3>
          <Row gutter={16}>
            <Col span={12}>
              <Card 
                title={<span><TrophyOutlined style={{ color: '#52c41a', marginRight: 8 }} />Hộ đóng phí tốt nhất</span>}
                bordered={false}
                style={{ borderTop: '3px solid #52c41a' }}
              >
                {analytics.bestPayingHousehold ? (
                  <div>
                    <p><strong>Mã hộ:</strong> {analytics.bestPayingHousehold.householdCode}</p>
                    <p><strong>Chủ hộ:</strong> {analytics.bestPayingHousehold.ownerName}</p>
                    <p><strong>Căn hộ:</strong> {analytics.bestPayingHousehold.apartmentInfo}</p>
                    <p><strong>Tổng phải thu:</strong> {fm(analytics.bestPayingHousehold.totalReceivable)}</p>
                    <p><strong>Đã thanh toán:</strong> {fm(analytics.bestPayingHousehold.totalPaid)}</p>
                    <p>
                      <strong>Tỷ lệ:</strong> 
                      <Tag color="green" style={{ marginLeft: 8 }}>{analytics.bestPayingHousehold.paymentRate}%</Tag>
                    </p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#999' }}>Chưa có dữ liệu</div>
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card 
                title={<span><WarningOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />Hộ cần nhắc nhở đóng phí</span>}
                bordered={false}
                style={{ borderTop: '3px solid #ff4d4f' }}
              >
                {analytics.worstPayingHousehold ? (
                  <div>
                    <p><strong>Mã hộ:</strong> {analytics.worstPayingHousehold.householdCode}</p>
                    <p><strong>Chủ hộ:</strong> {analytics.worstPayingHousehold.ownerName}</p>
                    <p><strong>Căn hộ:</strong> {analytics.worstPayingHousehold.apartmentInfo}</p>
                    <p><strong>Tổng phải thu:</strong> {fm(analytics.worstPayingHousehold.totalReceivable)}</p>
                    <p><strong>Đã thanh toán:</strong> {fm(analytics.worstPayingHousehold.totalPaid)}</p>
                    <p>
                      <strong>Tỷ lệ:</strong> 
                      <Tag color="red" style={{ marginLeft: 8 }}>{analytics.worstPayingHousehold.paymentRate}%</Tag>
                    </p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#999' }}>Chưa có dữ liệu</div>
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Spin>
  );
};

export default Dashboard;