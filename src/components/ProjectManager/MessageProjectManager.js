import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/ProjectManager/MessagePM.css';

const MessageProjectManager = () => {
    const location = useLocation();
    const { username } = location.state || {};
    const [projectMessages, setProjectMessages] = useState({});

    useEffect(() => {
        if (username) {
            // Step 1: Fetch projects by username
            fetch(`http://localhost:8081/projects/by-username?username=${username}`)
                .then(response => response.json())
                .then(projects => {
                    // Step 2: Fetch messages for each project
                    const projectMessagesPromises = projects.map(project => {
                        return fetch(`http://localhost:8081/api/messages/getMessagesByReceiverName?receiverName=${username}&projectId=${project.projectId}`)
                            .then(response => response.json())
                            .then(messages => {
                                // Step 3: Filter messages where sender is in the teamMembers list
                                const filteredMessages = messages.filter(message =>
                                    project.teamMembers.some(member => member.username === message.sender.username)
                                );
                                return { projectName: project.projectName, messages: filteredMessages };
                            });
                    });

                    // Step 4: Wait for all fetch calls to complete and group messages by project
                    Promise.all(projectMessagesPromises)
                        .then(projectMessagesArray => {
                            const groupedMessages = {};
                            projectMessagesArray.forEach(({ projectName, messages }) => {
                                groupedMessages[projectName] = messages;
                            });
                            setProjectMessages(groupedMessages);
                        });
                })
                .catch(error => console.error('Error fetching projects:', error));
        }
    }, [username]);

    const handleDelete = (projectName, messageId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this message?");
        if (confirmDelete) {
            fetch(`http://localhost:8081/api/messages/delete/${messageId}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    setProjectMessages(prevProjectMessages => {
                        const updatedMessages = prevProjectMessages[projectName].filter(message => message.messageId !== messageId);
                        return { ...prevProjectMessages, [projectName]: updatedMessages };
                    });
                } else {
                    console.error('Error deleting the message');
                }
            })
            .catch(error => console.error('Error deleting the message:', error));
        }
    };

    return (
        <div id="message-page">
            <div id="message-container">
                <div id="message-title">Messages</div>
                {Object.keys(projectMessages).map(projectName => (
                    <div key={projectName} className="project-group">
                        <h3 className="project-name">{projectName}</h3>
                        <ul className="message-list">
                            {projectMessages[projectName].map((message) => (
                                <li key={message.messageId} className="message-item">
                                    <div className="message-item-header">
                                        <strong>From: </strong> {message.sender.username}
                                        <button className="message-delete-button" onClick={() => handleDelete(projectName, message.messageId)}>X</button>
                                    </div>
                                    <div className="message-body">
                                        <div className="message-subject"><strong>Subject: </strong>{message.subject}</div>
                                        <div><strong>Context: </strong>{message.context}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MessageProjectManager;