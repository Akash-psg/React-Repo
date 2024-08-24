import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/TeamMember/TeamMemberHomePage.css';

const TeamMemberHomePage = () => {
    const location = useLocation();
    const { username } = location.state || {};
    const [userDetails, setUserDetails] = useState(null);
    const [data, setData] = useState([]);
    const [dataType, setDataType] = useState('actions');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8081/users/by-username?username=${username}`);
                const data = await response.json();
                console.log('Team Member Details:', data);
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

            if (type === 'projects') {
                setFilteredProjects(data);
            } else if (type === 'clients') {
                setFilteredClients(data);
            } else if (type === 'tasks') {
                setFilteredTasks(data);
            }
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        if (dataType === 'projects') {
            setFilteredProjects(
                data.filter(project =>
                    project.projectName.toLowerCase().includes(query)
                )
            );
        } else if (dataType === 'clients') {
            setFilteredClients(
                data.filter(client =>
                    client.clientName.toLowerCase().includes(query)
                )
            );
        } else if (dataType === 'tasks') {
            setFilteredTasks(
                data.filter(task =>
                    task.taskName.toLowerCase().includes(query)
                )
            );
        }
        setCurrentPage(1); // Reset to the first page
    };

    const renderData = () => {
        if (dataType === 'actions') {
            return (
                <div className="tm-actions-text">
                    <p>
                        As a team member, you can view assigned projects, track your tasks, communicate with project managers, and access important client information. Stay organized and collaborate effectively with your team for successful project completion.
                    </p>
                </div>
            );
        }

        if (!data) return null;

        const getCurrentData = () => {
            if (dataType === 'projects') {
                return filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            } else if (dataType === 'clients') {
                return filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            } else if (dataType === 'tasks') {
                return filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            }
        };

        const totalPages = Math.ceil((dataType === 'projects' ? filteredProjects.length : dataType === 'clients' ? filteredClients.length : filteredTasks.length) / itemsPerPage);

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
                    placeholder={`Search by ${dataType === 'projects' ? 'project name' : dataType === 'clients' ? 'client name' : 'task name'}`}
                    value={searchQuery}
                    onChange={handleSearch}
                    className="tm-search-box"
                />
                <table>
                    <thead>
                        <tr>
                            {dataType === 'projects' && (
                                <>
                                    <th>Project Name</th>
                                    <th>Project Description</th>
                                </>
                            )}
                            {dataType === 'clients' && (
                                <>
                                    <th>Client Name</th>
                                    <th>Client Email</th>
                                    <th>Description</th>
                                </>
                            )}
                            {dataType === 'tasks' && (
                                <>
                                    <th>Task Name</th>
                                    <th>Project Name</th>
                                    <th>Task Details</th>
                                    <th>Due Date</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {getCurrentData().length > 0 ? (
                            getCurrentData().map(item => (
                                <tr key={item.projectId || item.clientId || item.taskId}>
                                    {dataType === 'projects' && (
                                        <>
                                            <td>{item.projectName}</td>
                                            <td>{item.projectDetails}</td>
                                        </>
                                    )}
                                    {dataType === 'clients' && (
                                        <>
                                            <td>{item.clientName}</td>
                                            <td>{item.clientEmail}</td>
                                            <td>{item.clientDescription}</td>
                                        </>
                                    )}
                                    {dataType === 'tasks' && (
                                        <>
                                            <td>{item.taskName}</td>
                                            <td>{item.project.projectName}</td>
                                            <td>{item.taskDetails}</td>
                                            <td>{new Date(item.dueDate).toLocaleDateString()}</td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={dataType === 'tasks' ? 4 : dataType === 'projects' ? 2 : 3}>No {dataType} found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {renderPagination()}
            </>
        );
    };

    return (
        <div className="tm-home-container">
            <h2>Welcome Team Member</h2>
            {userDetails ? (
                <p>Welcome, {userDetails.username}</p>
            ) : (
                <p>Loading user details...</p>
            )}
            <div className="tm-actions-container">
                <button onClick={() => setDataType('actions')}>Actions</button>
                <button onClick={() => fetchData(`http://localhost:8081/projects/assigned-to?username=${username}`, 'projects')}>View My Projects</button>
                <button onClick={() => fetchData(`http://localhost:8081/users/clients-for-team-member?username=${username}`, 'clients')}>View My Clients</button>
                <button onClick={() => fetchData(`http://localhost:8081/users/tasks-for-team-member?username=${username}`, 'tasks')}>View My Tasks</button>
            </div>
            <div className="tm-data-container">
                <h3><u>{`Viewing ${dataType}`}</u></h3>
                {renderData()}
            </div>
        </div>
    );
};

export default TeamMemberHomePage;
