import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/Admin/AdminPage.css';

const AdminPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username, userId } = location.state || {};

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            navigate('/login');
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-navbar">
                <Link className="admin-nav-item" to="/admin/home" state={{ username, userId }}>Home</Link>
                <Link className="admin-nav-item" to="/admin/create-user" state={{ username, userId }}>Create User</Link>
                <Link className="admin-nav-item" to="/admin/update-user" state={{ username, userId }}>Update User</Link>
                <Link className="admin-nav-item" to="/admin/deactivate-user" state={{ username, userId }}>Manage User Status</Link>
                <Link className="admin-nav-item" to="/admin/create-client" state={{ username, userId }}>Create Client</Link>
                <Link className="admin-nav-item" to="/admin/create-project" state={{ username, userId }}>Create Project</Link>
                <Link className="admin-nav-item" to="/admin/assign-access-levels" state={{ username, userId }}>Assign Access Levels</Link>
                {/* <Link className="admin-nav-item" to="/admin/track-user-activity" state={{ username, userId }}>Track User Activity</Link> */}
                <Link className="admin-nav-item" to="/admin/reset-password-admin" state={{ username, userId }}>Reset Password</Link>
                <Link 
                    className="admin-logout-button" 
                    to="/login" 
                    onClick={handleLogout}
                >
                    Logout
                </Link>
            </div>
            <div className="admin-content">
                <Outlet context={{ username, userId }} />
            </div>
        </div>
    );
};

export default AdminPage;
