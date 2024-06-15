import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  SettingOutlined,
  ContactsOutlined,
  DollarOutlined,
  HistoryOutlined,
  TeamOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Button, Flex, Layout, Menu, theme } from "antd";
import "./Dashboard.scss";
import logoDark from "./../../assets/Logo_Dark.png";
import logoLight from "./../../../public/images/Logo_Light.png";
import getDate from "../utils/Date";
import StudentDetail from "./studentDetail";
import FeeManagement from "./FeeManagement";
import TransactionsHistory from "./TransactionsHistory";

const { Header, Sider, Content } = Layout;

function Dashboard() {
  // useStates
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState({ key: "1" });
  const [currentDate, setCurrentDate] = useState(getDate());

  const siderItems = [
    {
      key: "1",
      icon: <DollarOutlined />,
      label: "Fees",
    },
    {
      key: "2",
      icon: <HistoryOutlined />,
      label: "History",
    },
    {
      key: "3",
      icon: <TeamOutlined />,
      label: "Student Details",
    },
    {
      key: "4",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "5",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      key: "6",
      icon: <UserOutlined />,
      label: "My Account",
    },
  ];

  const contentItems = [
    {
      key: "1",
      componentItem: <FeeManagement />,
    },
    {
      key: "2",
      componentItem: <TransactionsHistory />,
    },
    {
      key: "3",
      componentItem: <StudentDetail />,
    },
  ];

  const onMenuItemClick = (props) => {
    setCurrentPage({
      key: props.key,
    });
    console.currentPage;
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ height: "100vh", minHeight: 100 }}
      >
        <div className="demo-logo-vertical">
          <img src={logoDark} width={100} height={100} />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={siderItems}
          onClick={onMenuItemClick}
        />
      </Sider>
      <Layout
        style={{
          height: "100vh",
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignContent: "center",
            width: "100%",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div className="header-title-container">
            {siderItems
              .filter((items) => items.key === currentPage.key)
              .map((item) => {
                return (
                  <div key={item.key} className="header-title-label">
                    {item.label}
                  </div>
                );
              })}
            <div>{currentDate}</div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 50,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {contentItems
            .filter((item) => item.key === currentPage.key)
            .map((item) => {
              return (
                <React.Fragment key={item.key}>
                  {item.componentItem}
                </React.Fragment>
              );
            })}
        </Content>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
