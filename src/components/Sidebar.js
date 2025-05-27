import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css'; // ✅ Import styles

const Sidebar = () => {
  const navigate = useNavigate();
  const menu = [
    { name: 'Dashboard', path: '/admin-dashboard' },
    { name: 'Manage Users', path: '/admin/users' },
    { name: 'Manage Staff', path: '/admin/staff' },
    { name: 'Manage Programs', path: '/admin/programs' },
    { name: 'Update Profile', path: '/admin/profile' }
  ];

  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      {menu.map((item, index) => (
        <div key={index} className="menu-item" onClick={() => navigate(item.path)}>
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
