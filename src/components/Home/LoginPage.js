import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Home/LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8081/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const user = await response.json();

                if (user.status === 'ACTIVE') {
                    console.log('Logged in user:', user);

                    switch (user.role) {
                        case 'ADMIN':
                            navigate('/admin/home', { state: { username: user.username, userId: user.id } });
                            break;
                        case 'PROJECT_MANAGER':
                            navigate('/project-manager/home', { state: { username: user.username } });
                            break;
                        case 'TEAM_MEMBER':
                            navigate('/team-member/home', { state: { username: user.username, userId: user.id } });
                            break;
                        default:
                            alert('Role not recognized.');
                            break;
                    }
                } else {
                    alert('Your account is inactive. Please contact support.');
                    setEmail('');
                    setPassword('');
                }
            } else {
                const errorMessage = await response.text();
                alert(errorMessage || 'Invalid email or password.');
                setEmail('');
                setPassword('');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Error logging in. Please try again later.');
            setEmail('');
            setPassword('');
        }
    };

    return (
        <div id="loginPageContainer">
            <div id="loginImageContainer"></div>
            <div id="loginFormContainer">
                <div id="welcomeMessage">
                    <h1>Welcome to TMS</h1>
                    <p>(Task Management System)</p>
                </div>
                <form id="loginForm" onSubmit={handleLogin}>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <button onClick={() => navigate('/forgot-password')} id="forgotPasswordLink">Forgot Password</button>
            </div>
        </div>
    );
};

export default LoginPage;