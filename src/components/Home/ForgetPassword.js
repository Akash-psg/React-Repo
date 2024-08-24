import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Home/ForgetPassword.css';

const ForgetPassword = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate(); // Use the useNavigate hook for navigation

    const handleSendOtp = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8081/users/send_otp', { name, email });
            if (response.data.success) {
                setOtpSent(true);
                setMessage('OTP has been sent to your email.');
                alert('OTP sent successfully!');
            } else {
                setMessage('Failed to send OTP. Please check your email and try again.');
                alert('Failed to send OTP.');
            }
        } catch (error) {
            setMessage('An error occurred while sending OTP.');
            alert('Error sending OTP.');
            console.error('Error sending OTP:', error);
        }
    };

    const handleForgetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            const errorMessage = 'New password and confirm password do not match.';
            setMessage(errorMessage);
            alert(errorMessage);
            console.error(errorMessage);
            return;
        }

        try {
            const otpResponse = await axios.post('http://localhost:8081/users/validate_otp', {
                name,
                email,
                otp,
                newPassword
            });

            if (!otpResponse.data.success) {
                const errorMessage = 'Invalid OTP. Please try again.';
                setMessage(errorMessage);
                alert(errorMessage);
                console.error(errorMessage);
                return;
            }

            const successMessage = 'Password has been successfully reset.';
            setMessage(successMessage);
            alert(successMessage);
            console.log('Password reset successfully');


            setName('');
            setEmail('');
            setOtp('');
            setNewPassword('');
            setConfirmPassword('');

            // Redirect to home page after successful password reset
            navigate('/login'); // Change '/home' to your desired route

        } catch (error) {
            const errorMessage = 'Invalid OTP, Try Again';
            setMessage(errorMessage);
            alert(errorMessage);
            console.error(errorMessage, error);
        }
    };

    return (
        <div id="forget-password-main-container">
            <h1 id="forget-password-header">Forgot Password</h1>
            <form id="forget-password-form" onSubmit={otpSent ? handleForgetPassword : handleSendOtp}>
                <div className="forget-password-form-group-name" id="forget-password-group-name">
                    <label htmlFor="forget-name">Name</label>
                    <input 
                        type="text" 
                        id="forget-name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="forget-password-form-group-email" id="forget-password-group-email">
                    <label htmlFor="forget-email">Email</label>
                    <input 
                        type="email" 
                        id="forget-email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                {otpSent && (
                    <>
                        <div className="forget-password-form-group-otp" id="forget-password-group-otp">
                            <label htmlFor="forget-otp">OTP</label>
                            <input 
                                type="text" 
                                id="forget-otp" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="forget-password-form-group-new-password" id="forget-password-group-new-password">
                            <label htmlFor="forget-new-password">New Password</label>
                            <input 
                                type="password" 
                                id="forget-new-password" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="forget-password-form-group-confirm-password" id="forget-password-group-confirm-password">
                            <label htmlFor="forget-confirm-password">Confirm Password</label>
                            <input 
                                type="password" 
                                id="forget-confirm-password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                            />
                        </div>
                    </>
                )}
                <button type="submit" id="forget-password-submit-button">
                    {otpSent ? 'Reset Password' : 'Send OTP'}
                </button>
            </form>
            {message && <p id="forget-password-message">{message}</p>}
        </div>
    );
};

export default ForgetPassword;