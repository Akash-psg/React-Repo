import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Home/LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <header className="landing-header">
            <div className="landing-overlay"></div>
            <div className="landing-content">
                <h1 id="landing-title">Welcome to Task Management System</h1>
                <p id="landing-description">Manage your tasks efficiently and effectively</p>
                <button id="get-started-button" className="landing-button" onClick={() => navigate('/login')}>Get Started → </button>
            </div>
        </header>
    );
};

export default LandingPage;
