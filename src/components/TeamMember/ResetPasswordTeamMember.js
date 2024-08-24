import React, { useState } from 'react';
import { useLocation,useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../../styles/TeamMember/ResetPasswordTeamMember.css';

const ResetPasswordAdmin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { username } = location.state || {};
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            const errorMessage = 'New password and confirm password do not match.';
            setMessage(errorMessage);
            alert(errorMessage);
            return;
        }

        try {
            // Fetch user by username
            const userResponse = await axios.get('http://localhost:8081/users/by-username', {
                params: { username }
            });

            const user = userResponse.data;

            // Check if old password is correct
            if (user.password !== oldPassword) {
                const errorMessage = 'Old password is incorrect.';
                setMessage(errorMessage);
                alert(errorMessage);
                return;
            }

            // Reset the password
            const resetResponse = await axios.put(`http://localhost:8081/users/${user.userid}/password`, null, {
                params: { newPassword }
            });

            const successMessage = 'Password has been successfully reset.';
            setMessage(successMessage);
            alert(successMessage);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');

            console.log('Response Data:', resetResponse.data);

        } catch (error) {
            const errorMessage = 'An error occurred while resetting the password.';
            setMessage(errorMessage);
            alert(errorMessage);
            console.error(errorMessage, error);
        }
    };

    const handleGoBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <div className="reset-password-container">
            <h2 className="reset-password-title"><b>Reset Password</b></h2>
            <form onSubmit={handleResetPassword} className="reset-password-form">
                <label htmlFor="reset-old-password" className="reset-password-label">Old Password:</label>
                <input
                    type="password"
                    id="reset-old-password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="reset-password-input"
                    required
                />
                <label htmlFor="reset-new-password" className="reset-password-label">New Password:</label>
                <input
                    type="password"
                    id="reset-new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="reset-password-input"
                    required
                />
                <label htmlFor="reset-confirm-password" className="reset-password-label">Confirm Password:</label>
                <input
                    type="password"
                    id="reset-confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="reset-password-input"
                    required
                />
                <button type="submit" className="reset-password-button">Reset Password</button>
            </form>
            {message && <p className="reset-message">{message}</p>}
            <button className="go-back-button-tm" onClick={handleGoBack}>← Go Back</button>
        </div>
    );
};

export default ResetPasswordAdmin;
