import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import '../../styles/Admin/UpdateUser.css';

const UpdateUser = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [formKey, setFormKey] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8081/users/all');
                const userOptions = response.data.map(user => ({
                    value: user.userid,
                    label: `${user.username} (ID: ${user.userid})`,
                }));
                setUsers(userOptions);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8081/users/update/${selectedUser}`, null, {
                params: {
                    newName,
                    newEmail,
                }
            });

            console.log('User Updated:', { selectedUser, newName, newEmail });
            console.log('API Response:', response.data);
            alert('User updated successfully!');

            setSelectedUser(null);
            setNewName('');
            setNewEmail('');

            setFormKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div className="update-user-container">
            <h2 className="update-user-title"><b>Update User</b></h2>
            <form onSubmit={handleSubmit} className="update-user-form">
                <label htmlFor="user-selection" className="update-user-label">Select User:</label>
                <Select
                    key={formKey}
                    id="user-selection"
                    name="user-selection"
                    value={users.find(user => user.value === selectedUser)}
                    onChange={(selectedOption) => setSelectedUser(selectedOption ? selectedOption.value : null)}
                    options={users}
                    placeholder="Search and select a user..."
                    className="update-user-select"
                    isClearable
                    required
                />
                <label htmlFor="user-name" className="update-user-label">New Name:</label>
                <input
                    type="text"
                    id="user-name"
                    name="user-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="update-user-input"
                    required
                />
                <label htmlFor="user-email" className="update-user-label">New Email:</label>
                <input
                    type="email"
                    id="user-email"
                    name="user-email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="update-user-input"
                    required
                />
                <button type="submit" className="update-user-button">Update User</button>
            </form>
        </div>
    );
};

export default UpdateUser;