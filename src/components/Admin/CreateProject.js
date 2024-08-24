import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import '../../styles/Admin/CreateProject.css';

const CreateProject = () => {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [clientId, setClientId] = useState(null);
    const [projectManagerId, setProjectManagerId] = useState(null);
    const [clients, setClients] = useState([]);
    const [projectManagers, setProjectManagers] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get('http://localhost:8081/clients/all');
                const clientOptions = response.data.map(client => ({
                    value: client.clientId,
                    label: `${client.clientName} (ID: ${client.clientId})`
                }));
                setClients(clientOptions);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        const fetchProjectManagers = async () => {
            try {
                const response = await axios.get('http://localhost:8081/users/project-managers');
                const managerOptions = response.data.map(manager => ({
                    value: manager.userid,
                    label: `${manager.username} (ID: ${manager.userid})`
                }));
                setProjectManagers(managerOptions);
            } catch (error) {
                console.error('Error fetching project managers:', error);
            }
        };

        fetchClients();
        fetchProjectManagers();
    }, []);

    const resetForm = () => {
        setProjectName('');
        setProjectDescription('');
        setClientId(null);
        setProjectManagerId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const requestBody = {
                projectName,
                projectDetails: projectDescription,
                client: { clientId },
                projectManager: { userid: projectManagerId }
            };

            const response = await axios.post('http://localhost:8081/projects/create', requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Project Created:', requestBody);
            console.log('API Response:', response.data);
            alert('Project created successfully!');

            // Reset form fields after submission
            resetForm();
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <div className="create-project-container">
            <h2 className="create-project-title"><b>Create Project</b></h2>
            <form onSubmit={handleSubmit} className="create-project-form">
                <label htmlFor="client-select" className="create-project-label">Select Client:</label>
                <Select
                    id="client-select"
                    name="client-select"
                    value={clients.find(client => client.value === clientId)}
                    onChange={(selectedOption) => setClientId(selectedOption ? selectedOption.value : null)}
                    options={clients}
                    placeholder="Search and select a client..."
                    className="create-project-select"
                    isClearable
                    required
                />

                <label htmlFor="project-manager-select" className="create-project-label">Select Project Manager:</label>
                <Select
                    id="project-manager-select"
                    name="project-manager-select"
                    value={projectManagers.find(manager => manager.value === projectManagerId)}
                    onChange={(selectedOption) => setProjectManagerId(selectedOption ? selectedOption.value : null)}
                    options={projectManagers}
                    placeholder="Search and select a project manager..."
                    className="create-project-select"
                    isClearable
                    required
                />

                <label htmlFor="project-name-field" className="create-project-label">Project Name:</label>
                <input
                    type="text"
                    id="project-name-field"
                    name="project-name-field"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="create-project-input"
                    required
                />

                <label htmlFor="project-description-field" className="create-project-label">Project Description:</label>
                <input
                    type="text"
                    id="project-description-field"
                    name="project-description-field"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="create-project-input"
                    required
                />

                <button type="submit" className="create-project-button">Create Project</button>
            </form>
        </div>
    );
};

export default CreateProject;
