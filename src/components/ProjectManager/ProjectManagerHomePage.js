import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/ProjectManager/ProjectManagerHomePage.css';

const ProjectManagerHomePage = () => {
    const location = useLocation();
    const { username } = location.state || {};
    const [userDetails, setUserDetails] = useState(null);
    const [data, setData] = useState([]);
    const [dataType, setDataType] = useState('actions');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTeamMembers, setFilteredTeamMembers] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8081/users/by-username?username=${username}`);
                const data = await response.json();
                console.log('Project Manager Details:', data);
                setUserDetails(data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (username) {
            fetchUserDetails();
        }
    }, [username]);

    const fetchData = async (apiUrl, type) => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            console.log(`${type} data:`, data);
            setData(data);
            setDataType(type);
            setCurrentPage(1);

            if (type === 'team-members') {
                setFilteredTeamMembers(data);
            } else if (type === 'tasks') {
                setFilteredTasks(data);
            } else if (type === 'clients') {
                setFilteredClients(data);
            } else if (type === 'projects') {
                setFilteredProjects(data);
            }
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        if (dataType === 'team-members') {
            setFilteredTeamMembers(
                data.filter(member =>
                    member.username.toLowerCase().includes(query)
                )
            );
        } else if (dataType === 'tasks') {
            setFilteredTasks(
                data.filter(task =>
                    task.taskName.toLowerCase().includes(query)
                )
            );
        } else if (dataType === 'clients') {
            setFilteredClients(
                data.filter(client =>
                    client.clientName.toLowerCase().includes(query)
                )
            );
        } else if (dataType === 'projects') {
            setFilteredProjects(
                data.filter(project =>
                    project.projectName.toLowerCase().includes(query)
                )
            );
        }
        setCurrentPage(1); // Reset to the first page
    };

    const renderData = () => {
        if (dataType === 'actions') {
            return (
                <div className="pm-actions-text">
                    <p>
                        As a project manager, you will be able to securely log in, reset passwords, manage client information including project details, completed tasks, and effort invested. You will have the authority to add team members to projects, assign tasks using historical data for effort prediction, and ensure the right resources are allocated for project success.
                    </p>
                </div>
            );
        }

        if (!data) return null;

        const getCurrentData = () => {
            if (dataType === 'team-members') {
                return filteredTeamMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            } else if (dataType === 'tasks') {
                return filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            } else if (dataType === 'clients') {
                return filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            } else if (dataType === 'projects') {
                return filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            }
        };

        const totalPages = Math.ceil((dataType === 'team-members' ? filteredTeamMembers.length : dataType === 'tasks' ? filteredTasks.length : dataType === 'clients' ? filteredClients.length : filteredProjects.length) / itemsPerPage);

        const renderPagination = () => (
            <div className="pagination-controls">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>{currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        );

        return (
            <>
                <input
                    type="text"
                    placeholder={`Search by ${dataType === 'team-members' ? 'name' : dataType === 'tasks' ? 'task name' : dataType === 'clients' ? 'client name' : 'project name'}`}
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pm-search-box"
                />
                <table>
                    <thead>
                        <tr>
                            {dataType === 'team-members' && (
                                <>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                </>
                            )}
                            {dataType === 'tasks' && (
                                <>
                                    <th>Task Name</th>
                                    <th>Assigned To</th>
                                    <th>Project Name</th>
                                    <th>Task Details</th>
                                    <th>Milestone</th>
                                    <th>Due Date</th>
                                </>
                            )}
                            {dataType === 'clients' && (
                                <>
                                    <th>Client Name</th>
                                    <th>Client Email</th>
                                    <th>Description</th>
                                </>
                            )}
                            {dataType === 'projects' && (
                                <>
                                    <th>Project Name</th>
                                    <th>Project Description</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {getCurrentData().length > 0 ? (
                            getCurrentData().map(item => (
                                <tr key={item.userid || item.taskId || item.clientId || item.projectId}>
                                    {dataType === 'team-members' && (
                                        <>
                                            <td>{item.username}</td>
                                            <td>{item.email}</td>
                                            <td>{item.role}</td>
                                            <td>{item.status}</td>
                                        </>
                                    )}
                                    {dataType === 'tasks' && (
                                        <>
                                            <td>{item.taskName}</td>
                                            <td>{item.assignedTo.username}</td>
                                            <td>{item.project.projectName}</td>
                                            <td>{item.taskDetails}</td>
                                            <td>{item.milestone.milestoneName}</td>
                                            <td>{new Date(item.dueDate).toLocaleDateString()}</td>
                                        </>
                                    )}
                                    {dataType === 'clients' && (
                                        <>
                                            <td>{item.clientName}</td>
                                            <td>{item.clientEmail}</td>
                                            <td>{item.clientDescription}</td>
                                        </>
                                    )}
                                    {dataType === 'projects' && (
                                        <>
                                            <td>{item.projectName}</td>
                                            <td>{item.projectDetails}</td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={dataType === 'tasks' ? 6 : dataType === 'projects' ? 2 : 4}>No {dataType} found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {renderPagination()}
            </>
        );
    };

    return (
        <div className="pm-home-container">
            <h2>Welcome Project Manager</h2>
            {userDetails ? (
                <p>Welcome, {userDetails.username}</p>
            ) : (
                <p>Loading user details...</p>
            )}
            <div className="pm-actions-container">
                <button onClick={() => setDataType('actions')}>Actions</button>
                <button onClick={() => fetchData(`http://localhost:8081/projects/by-username?username=${username}`, 'projects')}>View all projects</button>
                <button onClick={() => fetchData(`http://localhost:8081/users/clients-by-manager?managerName=${username}`, 'clients')}>View all clients</button>
                <button onClick={() => fetchData(`http://localhost:8081/users/tasks-by-manager?managerName=${username}`, 'tasks')}>View all tasks</button>
            </div>
            <div className="pm-data-container">
                <h3><u>{`Viewing ${dataType}`}</u></h3>
                {renderData()}
            </div>
        </div>
    );
};

export default ProjectManagerHomePage;
