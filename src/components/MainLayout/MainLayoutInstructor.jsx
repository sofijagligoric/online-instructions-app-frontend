import React, { useState } from "react";
import { Layout, Menu, Button, Drawer } from "antd";
import {
  HomeOutlined,
  FormOutlined,
  MenuOutlined,
  UserOutlined,
  PoweroffOutlined,
  BookOutlined,
  ScheduleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./MainLayout.css";
import Footer from "../Footer/Footer";
// import { useAuth } from "../components/AuthContext";

const { Header, Content } = Layout;

function MainLayoutInstructor() {
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

  const selectedKey =
    location.pathname === "/instructor"
      ? "/instructor/home"
      : location.pathname;
  const renderMenu = () => (
    <Menu selectedKeys={[selectedKey]} mode="inline" onClick={handleMenuClick}>
      <Menu.Item key="/instructor/home" icon={<HomeOutlined />}>
        Home
      </Menu.Item>

      <Menu.Item key="/instructor/users" icon={<UsergroupAddOutlined />}>
        Users
      </Menu.Item>

      <Menu.Item key="/instructor/adverts" icon={<ScheduleOutlined />}>
        Adverts
      </Menu.Item>
      <Menu.Item key="/instructor/resources" icon={<BookOutlined />}>
        Resources
      </Menu.Item>

      <Menu.Item key="/instructor/discusion" icon={<FormOutlined />}>
        Discusion
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
          <Link to="/instructor/home">
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
            icon={<UserOutlined />}
            onClick={() => navigate("/instructor/myProfile")}
          />
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
        {/* <Footer role={currentUser.role} /> */}
        <Footer role="instructor" />
      </Layout>
    </Layout>
  );
}

export default MainLayoutInstructor;
