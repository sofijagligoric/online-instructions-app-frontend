import React, { useState } from "react";
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
  SettingOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./MainLayout.css";
import Footer from "../Footer/Footer";
// import { useAuth } from "../components/AuthContext";
import { useAuth } from "../AuthContext/AuthContext";
import authService from "../../services/auth.service";

const { Header, Content } = Layout;

function MainLayoutAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setDrawerVisible(false);
  };


 const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  const selectedKey =
    location.pathname === "/admin" ? "/admin/home" : location.pathname;

  const renderMenu = () => (
    <Menu
      /*   selectedKeys={[location.pathname]} */
      selectedKeys={[selectedKey]}
      mode="inline"
      onClick={handleMenuClick}
    >
    
      <Menu.Item key="/admin/reports" icon={<ExclamationCircleOutlined />}>
        Reports
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

      <Menu.Item key="/admin/discussion" icon={<FormOutlined />}>
        Discussion
      </Menu.Item>

       <Menu.Item key="/admin/settings" icon={<SettingOutlined />}>
        Settings
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
          <Link to="/admin/reports">
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
            onClick={handleLogout}
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
