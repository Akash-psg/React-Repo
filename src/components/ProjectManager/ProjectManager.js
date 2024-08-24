import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/ProjectManager/ProjectManager.css';

const ProjectManagerPage = () => {
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
        <div className="pm-container">
            <div className="pm-navbar">
                <Link className="pm-nav-item" to="/project-manager/Home" state={{ username, userId }}>Home</Link>
                <Link className="pm-nav-item" to="/project-manager/reset-password" state={{ username, userId }}>Reset Password</Link>
                <Link className="pm-nav-item" to="/project-manager/add-team-members" state={{ username, userId }}>Add Team Members to Projects</Link>
                <Link className="pm-nav-item" to="/project-manager/assign-task" state={{ username, userId }}>Assign Tasks to Team Members</Link>
                <Link className="pm-nav-item" to="/project-manager/track-user-activity" state={{ username, userId }}>Track User Activity</Link>
                <Link className="pm-nav-item" to="/project-manager/message-project-manager" state={{ username, userId }}>Message</Link>
                <button 
                    className="pm-logout-button" 
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
            <div className="pm-content">
                <Outlet context={{ username, userId }} />
            </div>
        </div>
    );
};

export default ProjectManagerPage;