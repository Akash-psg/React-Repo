import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/TeamMember/TeamMember.css';

const TeamMemberPage = () => {
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
        <div className="tm-container">
            <div className="tm-navbar">
                <Link className="tm-nav-item" to="/team-member/home" state={{ username, userId }}>Home</Link>
                <Link className="tm-nav-item" to="/team-member/task-dashboard" state={{ username, userId }}>Task Dashboard</Link>
                <Link className="tm-nav-item" to="/team-member/message" state={{ username, userId }}>Message</Link>
                <Link className="tm-nav-item" to="/team-member/reset-password" state={{ username, userId }}>Reset Password</Link>
                <button 
                    className="tm-logout-button" 
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
            <div className="tm-content">
                <Outlet context={{ username, userId }} />
            </div>
        </div>
    );
};

export default TeamMemberPage;
