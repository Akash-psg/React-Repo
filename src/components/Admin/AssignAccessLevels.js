import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import '../../styles/Admin/AssignAccessLevels.css'; 

const AssignAccessLevels = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [existingRole, setExistingRole] = useState('');
    const [newRole, setNewRole] = useState('');
    const [formKey, setFormKey] = useState(0); // Key for forcing re-render

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8081/users/all');
                const userOptions = response.data.map(user => ({
                    value: user.userid,
                    label: `${user.username} (ID: ${user.userid})`,
                    role: user.role // Store the role in the options
                }));
                setUsers(userOptions);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleUserChange = (selectedOption) => {
        setSelectedUser(selectedOption ? selectedOption.value : null);
        setExistingRole(selectedOption ? selectedOption.role : '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userIdNumber = parseInt(selectedUser);
    
        try {
            const response = await axios.put(`http://localhost:8081/users/assign-role/${userIdNumber}`, {
                newRole: newRole
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Access Levels Assigned:', { userId: userIdNumber, existingRole, newRole });
            console.log('API Response:', response.data);
            alert('Access level assigned successfully!');
            
            // Reset all fields
            setSelectedUser(null);
            setExistingRole('');
            setNewRole('');

            // Update key to force re-render
            setFormKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error('Error assigning access levels:', error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                console.error('Request data:', error.request);
            }
        }
    };
    
    return (
        <div className="assign-access-container">
            <h2 className="assign-access-title"><b>Assign Access Levels</b></h2>
            <form onSubmit={handleSubmit} className="assign-access-form">
                <label htmlFor="user-select" className="assign-access-label">Select User:</label>
                <Select
                    key={formKey} // Key prop to force re-render
                    id="user-select"
                    name="user-select"
                    value={users.find(user => user.value === selectedUser)}
                    onChange={handleUserChange}
                    options={users}
                    placeholder="Search and select a user..."
                    className="assign-access-select"
                    isClearable
                    required
                />

                <label htmlFor="existing-role" className="assign-access-label">Existing Role:</label>
                <input
                    type="text"
                    id="existing-role"
                    name="existing-role"
                    value={existingRole}
                    className="assign-access-input"
                    readOnly
                />

                <label htmlFor="new-role" className="assign-access-label">New Role:</label>
                <select
                    id="new-role"
                    name="new-role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="assign-access-select"
                    required
                >
                    <option value="" disabled>Select New Role</option>
                    <option value="admin">Admin</option>
                    <option value="project_manager">Project Manager</option>
                    <option value="team_member">Team Member</option>
                </select>

                <button type="submit" className="assign-access-button">Assign Role</button>
            </form>
        </div>
    );
};

export default AssignAccessLevels;