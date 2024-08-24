import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/TeamMember/Message.css';

const Message = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Use the navigate hook
    const projectManagerName = location.state?.projectManagerName || '';
    const projectManagerId = location.state?.projectManagerId || null;
    const senderId = location.state?.senderId || null;

    const [subject, setSubject] = useState('Task Milestone Updated');
    const [messageContent, setMessageContent] = useState('The task has been moved to a new milestone.');
    const [sender, setSender] = useState('');
    const [receiver, setReceiver] = useState(projectManagerName || 'Unknown Receiver');

    useEffect(() => {
        const fetchSenderName = async () => {
            try {
                const response = await fetch(`http://localhost:8081/users/${senderId}`);
                const data = await response.json();
                setSender(data.username); // Assuming the API returns the username
            } catch (error) {
                console.error('Error fetching sender name:', error);
            }
        };

        fetchSenderName();
    }, [senderId]);

    const handleMessageSubmit = async () => {
        if (!sender || !receiver || !subject || !messageContent) {
            alert('Please fill in all fields');
            return;
        }

        const newMessage = {
            sender: { userid: senderId },
            receiver: { userid: projectManagerId },
            subject: subject,
            context: messageContent,
            date: new Date().toISOString()
        };

        try {
            const response = await fetch('http://localhost:8081/api/messages/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMessage)
            });

            if (response.ok) {
                alert('Message sent successfully!');
                setMessageContent(''); // Clear the message content
                setSubject(''); // Clear the subject
            } else {
                alert('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        }
    };

    // Function to handle the go back navigation
    const handleGoBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <div className="message-container" id="messageContainer">
            <h1 className="message-title">Send a Message</h1>

            <div className="message-form" id="messageForm">
                <div className="form-group" id="senderGroup">
                    <label htmlFor="senderInput">Sender:</label>
                    <input
                        type="text"
                        id="senderInput"
                        value={sender}
                        disabled
                        className="form-input"
                    />
                </div>
                <div className="form-group" id="receiverGroup">
                    <label htmlFor="receiverInput">Receiver:</label>
                    <input
                        type="text"
                        id="receiverInput"
                        value={receiver}
                        disabled
                        className="form-input"
                    />
                </div>
                <div className="form-group" id="subjectGroup">
                    <label htmlFor="subjectInput">Subject:</label>
                    <input
                        type="text"
                        id="subjectInput"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group" id="messageContentGroup">
                    <label htmlFor="messageContentInput">Message:</label>
                    <textarea
                        id="messageContentInput"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        className="form-textarea"
                    />
                </div>
                <button id="submitMessageButton" onClick={handleMessageSubmit} className="submit-button">Send</button>
            </div>

            <button className="go-back-button" onClick={handleGoBack}>← Go Back</button>
        </div>
    );
};

export default Message;
