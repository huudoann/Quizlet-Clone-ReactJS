import React, { useEffect, useState } from "react";
import './Folders.scss';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import Header from "../../Header/Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { Button, Input, Pagination } from "@mui/material";

const Folders = () => {
    const location = useLocation()
    const [folders, setFolders] = useState([]);
    const [filteredFolders, setFilteredFolders] = useState([]);
    const [activeLink, setActiveLink] = useState('');
    const [username, setUserName] = useState();
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const navigate = useNavigate()

    useEffect(() => {
        setActiveLink(location.pathname);
        localStorage.removeItem('folder_id');
        localStorage.removeItem('folderTitle');
        localStorage.removeItem('flashcardTitle');
        localStorage.removeItem('set_id');
        localStorage.removeItem('description');
        localStorage.removeItem('public');
        localStorage.removeItem('review_id');
    }, []);

    useEffect(() => {
        const fetchFolderData = async () => {
            let token = localStorage.getItem('token');
            const user_id = localStorage.getItem('user_id');
            const userName = localStorage.getItem('user_name');

            if (!token) {
                throw new Error('Token k ton tai');
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/folder/${user_id}/folders?page=${page}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("Lay folders thanh cong", response.data);
                setFolders(response.data);
                setUserName(userName);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.log("Loi khi lay folders");
            }
        };

        fetchFolderData();
    }, [page])

    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location.pathname]);

    const handleFolderClick = (folder) => {
        localStorage.setItem('folder_id', folder.folderId);
        localStorage.setItem('folderTitle', folder.title);
        navigate(`/folder-page`);
    }

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filtered = folders.filter(folder => folder.title.toLowerCase().includes(searchTerm));
        setFilteredFolders(filtered);
    };

    const handleChangePage = (event, value) => {
        console.log(value);
        setPage(value - 1);
    }

    const foldersToDisplay = filteredFolders.length > 0 ? filteredFolders : folders;


    return (
        <div className="folders">
            {<Header />}

            <div className='body-folders'>
                <div className='user-profile'>
                    <img src='https://assets.quizlet.com/a/j/dist/app/i/animals/111.f9dd73353feb908.jpg' alt='Avatar' className='avatar' />
                    <span className='username'>{username}</span>
                </div>
                <div className='select-card'>
                    <NavLink to={`/sets`} className="term" activeclassname="active" style={{ textDecoration: 'none', color: 'inherit', marginRight: '0.5rem' }}><Button style={{ color: 'white' }}>Học phần</Button></NavLink>
                    <NavLink to={`/folders`} className="folder" activeclassname="active" style={{ textDecoration: 'none', color: 'inherit', marginRight: '0.5rem' }}><Button style={{ color: 'white' }}>Thư mục</Button></NavLink>
                </div>
                <div className='search-term'>
                    <Input type="text" placeholder="Tìm kiếm thư mục" style={{ width: '100%' }} onChange={handleSearch} />
                    <div className='icon-search'>
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                </div>

                <div className="folders-list">

                    {foldersToDisplay.length > 0 ? (
                        foldersToDisplay.map(folder => (
                            <Button
                                key={folder.folderId}
                                className="folder-item"
                                onClick={() => {
                                    handleFolderClick(folder);
                                }}
                                style={{ textTransform: 'none' }}
                            >
                                <h3>{folder.title}</h3>
                            </Button>
                        ))
                    ) : (
                        <p style={{ color: '#fff', fontSize: '2rem' }}>Không tìm thấy kết quả phù hợp.</p>
                    )}
                    {totalPages > 1 && (
                        <Pagination className="pagination"
                            count={totalPages}
                            color="primary"
                            onChange={handleChangePage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Folders;