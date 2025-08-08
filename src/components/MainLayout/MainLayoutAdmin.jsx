import React, { useState} from "react";
import { Layout, Menu, Button, Drawer } from "antd";
import {
  HomeOutlined,
  FormOutlined,
  MenuOutlined,
  UsergroupAddOutlined,
  PoweroffOutlined,
  BookOutlined,
  ExclamationCircleOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./MainLayout.css";
import Footer from "../Footer/Footer";
// import { useAuth } from "../components/AuthContext";

const { Header, Content } = Layout;

function MainLayoutAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  // const { logout } = useAuth();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setDrawerVisible(false);
  };

  /*   const handleLogOut = async () => {
    try {
      await authService.logout();
      logout();
      navigate("/home");
    } catch (err) {
      console.error("Greška pri logoutu:", err);
    }
  }; */

  const renderMenu = () => (
    <Menu
      selectedKeys={[location.pathname]}
      mode="inline"
      onClick={handleMenuClick}
    >
      <Menu.Item key="/admin/home" icon={<HomeOutlined />}>
        Home
      </Menu.Item>

      <Menu.Item key="/admin/users" icon={<UsergroupAddOutlined />}>
        Users
      </Menu.Item>

      <Menu.Item key="/admin/adverts" icon={<ScheduleOutlined />}>
        Adverts
      </Menu.Item>
      <Menu.Item key="/admin/resources" icon={<BookOutlined />}>
        Resources
      </Menu.Item>

      <Menu.Item key="/admin/discusion" icon={<FormOutlined />}>
        Discusion
      </Menu.Item>
      <Menu.Item key="/admin/reports" icon={<ExclamationCircleOutlined />}>
        Reports
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "transparent" }}>
      <Header className="custom-header">
        <div className="header-left">
          <Button
            className="menu-toggle"
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
          />
          <Link to="/admin/home">
            <img
              src="/logo-blue.png"
              alt="Logo"
              className="header-logo clickable-logo"
            />
          </Link>
        </div>

        <div className="header-right">
          {/* <Button
            className="user_button"
            icon={<PoweroffOutlined />}
            onClick={handleLogOut}
          /> */}
          <Button
            className="user_button"
            icon={<PoweroffOutlined />}
            onClick={() => navigate("/login")}
          />
        </div>
      </Header>
      <Drawer
        title="Navigacija"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="drawer-layout-style"
      >
        {renderMenu()}
      </Drawer>

      <Layout className="site-layout">
        <Content style={{ minHeight: "280px" }}>
          <Outlet />
        </Content>
        <Footer role="admin" />
      </Layout>
    </Layout>
  );
}

export default MainLayoutAdmin;
