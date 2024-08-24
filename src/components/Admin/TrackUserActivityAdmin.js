import React, { useState, useEffect } from 'react';
import '../../styles/Admin/TrackUserActivityAdmin.css';

const TrackUserActivityAdmin = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await fetch('http://localhost:8081/users/team-members');
                const data = await response.json();
                setTeamMembers(data);
            } catch (error) {
                console.error('Error fetching team members:', error);
            }
        };

        fetchTeamMembers();
    }, []);

    const handleTrack = async () => {
        if (selectedUser) {
            try {
                const response = await fetch(`http://localhost:8081/tasks/by-username/${selectedUser}`);
                const data = await response.json();
                setActivities(data);
            } catch (error) {
                console.error('Error fetching user activities:', error);
            }
        }
    };

    return (
        <div id="track-activity-container">
            <h1 id="track-activity-title">Track User Activity</h1>
            <div id="track-form-group">
                <label htmlFor="userSelect" id="track-label">Select User</label>
                <select
                    id="userSelect"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    required
                >
                    <option value="">Select a user</option>
                    {teamMembers.map(member => (
                        <option key={member.userid} value={member.username}>
                            {member.username}
                        </option>
                    ))}
                </select>
                <button id="trackButton" onClick={handleTrack}>Track</button>
            </div>
            <div id="activityContainer">
                {activities.length > 0 ? (
                    activities.map((activity, index) => (
                        <div key={index} className="track-activity-card">
                            {/* Project Details */}
                            <h3 className="card-title">Project: {activity.project.projectName}</h3>
                            <p><strong>Description:</strong> {activity.project.projectDetails}</p>
                            {/* Task Details */}
                            <h3 className="task-title">Task: {activity.taskName}</h3>
                            <p className="task-details"><strong>Task Description:</strong> {activity.taskDetails}</p>
                            <p className="task-details"><strong>Start Date:</strong> {new Date(activity.startDate).toLocaleDateString()}</p>
                            <p className="task-details"><strong>Due Date:</strong> {new Date(activity.dueDate).toLocaleDateString()}</p>
                            {/* Milestone Details */}
                            <h4 className="milestone-title">Milestone: {activity.milestone.milestoneName}</h4>
                            <p className="milestone-details">{activity.milestone.milestoneDescription}</p>
                        </div>
                    ))
                ) : (
                    <p>Select User to display activity</p>
                )}
            </div>
        </div>
    );
};

export default TrackUserActivityAdmin;
