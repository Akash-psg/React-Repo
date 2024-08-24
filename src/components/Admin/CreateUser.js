import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Admin/CreateUser.css';

const CreateUser = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');  // New state for status

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:8081/users/create', {
                username: name,
                email: email,
                role: role.toUpperCase(),
                status: status.toUpperCase(),  // Ensure status is sent correctly
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('API Response:', response.data);

            if (response.status === 201) {
                console.log('User Created:', { name, email, role, status });
                alert('User created successfully!');
                setName('');
                setEmail('');
                setRole('');
                setStatus('');  // Reset the status field
            } else {
                throw new Error(response.data.message || 'Unknown error occurred');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert(`Failed to create user. Error: ${error.response?.data?.message || error.message}`);
        }
    };
    
    return (
        <div id="createUserContainer">
            <h2 id="createUserTitle"><b>Create User</b></h2>
            <form id="createUserForm" onSubmit={handleSubmit}>
                <label htmlFor="createUserName" className="createUserLabel">Name:</label>
                <input
                    type="text"
                    id="createUserName"
                    name="user-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="createUserInput"
                    required
                />
                <label htmlFor="createUserEmail" className="createUserLabel">Email:</label>
                <input
                    type="email"
                    id="createUserEmail"
                    name="user-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="createUserInput"
                    required
                />
                <label htmlFor="createUserRole" className="createUserLabel">Role:</label>
                <select
                    id="createUserRole"
                    name="user-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="createUserSelect"
                    required
                >
                    <option value="" disabled>Choose Role</option>
                    <option value="ADMIN">Admin</option>
                    <option value="PROJECT_MANAGER">Project Manager</option>
                    <option value="TEAM_MEMBER">Team Member</option>
                </select>
                <label htmlFor="createUserStatus" className="createUserLabel">Status:</label>
                <select
                    id="createUserStatus"
                    name="user-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="createUserSelect"
                    required
                >
                    <option value="" disabled>Choose Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                </select>
                <button type="submit" className="createUserButton">Submit</button>
            </form>
        </div>
    );
};

export default CreateUser;
