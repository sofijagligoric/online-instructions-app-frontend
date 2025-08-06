import React, { useState } from 'react';
import "./Advert.css";
import { Menu, Dropdown, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

const Advert = ({ advert, currentUser, backgroundColor }) => {
  const isOwner = currentUser?.id === advert.authorId;
  const isAdmin = currentUser?.role === 'admin';
  const [showMenu, setShowMenu] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const canDelete = isOwner || isAdmin;

 const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

   const closeMenu = () => {
    setShowMenu(false);
  };

  const handleDelete = () => {
    alert('Advert deleted.');
  };

  const handleEdit = () => {
    alert('Edit advert.');
  };

  const handleReport = () => {
    alert('Advert reported.');
  };

    const menu = (
    <Menu>
      {isOwner && <Menu.Item key="edit" onClick={handleEdit}>Edit</Menu.Item>}
      {canDelete && <Menu.Item key="delete" onClick={handleDelete}>Delete</Menu.Item>}
      {!isAdmin && <Menu.Item key="report" onClick={handleReport}>Report</Menu.Item>}
    </Menu>
  ); 

  return (
    <div className="advert-card" style={{ backgroundColor }}>
      <div className="advert-header">
        <div className="advert-info">
          <p>{advert.date || '01.02.2025.'}</p>
          <p>@{advert.authorUsername || 'korisnik1'}</p>
        </div>
       {/*  <div className="menu-wrapper" tabIndex={0} onBlur={closeMenu}>
          <button className="dots-button" onClick={toggleMenu}>⋯</button>
          {showMenu && (
            <div className="advert-menu">
              {isOwner && <div onClick={handleEdit}>Uredi</div>}
              {canDelete && <div onClick={handleDelete}>Obriši</div>}
              {!canDelete && <div onClick={handleReport}>Prijavi</div>}
            </div>
          )}
        </div> */}
         <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
          <Button  className="custom-dropdown-button" shape="circle" icon={<EllipsisOutlined />} />
        </Dropdown>
      </div>

      <div className="advert-title">
        <h3>{advert.title}</h3>
      </div>

      <div
        className={`advert-description ${showFullDesc ? 'full' : ''}`}
        onClick={() => setShowFullDesc(!showFullDesc)}
      >
        <p>{advert.description}</p>
        {!showFullDesc && <span className="more-text">...more</span>}
      </div>

      <div className="advert-contact-info">
        <p>Contact:</p>
        <p>{advert.contact || '065/821-158'}</p>
      </div>
    </div>
  );
};

export default Advert;