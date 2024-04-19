import React, { useEffect, useState } from "react";
import './Folders.scss';
import { NavLink, Link, useLocation } from 'react-router-dom';
import Header from "../../Header/Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { Button, Input } from "@mui/material";

const Folders = () => {
    const location = useLocation()
    const [folders, setFolders] = useState([]);
    const [activeLink, setActiveLink] = useState('');
    const [username, setUserName] = useState();

    useEffect(() => {
        const fetchFolderData = async () => {
            let token = localStorage.getItem('token');
            const user_id = localStorage.getItem('user_id');
            const userName = localStorage.getItem('user_name');

            if (!token) {
                throw new Error('Token k ton tai');
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/folder/${user_id}/folders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("Lay folders thanh cong", response.data);
                setFolders(response.data);
                setUserName(userName);
            } catch (error) {
                console.log("Loi khi lay folders");
            }
        };

        fetchFolderData();
    }, [])

    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location.pathname]);

    return (
        <div className="folders">
            {<Header />}

            <div className='body-folders'>
                <div className='user-profile'>
                    <img src='https://e7.pngegg.com/pngimages/7/618/png-clipart-man-illustration-avatar-icon-fashion-men-avatar-face-fashion-girl-thumbnail.png' alt='Avatar' className='avatar' />
                    <span className='username'>{username}</span>
                </div>
                <div className='select-card'>
                    <NavLink to={`/sets`} className="term" activeclassname="active" style={{ textDecoration: 'none', color: 'inherit', marginRight: '0.5rem' }}><Button style={{ color: 'white' }}>Học phần</Button></NavLink>
                    <NavLink to={`/folders`} className="folder" activeclassname="active" style={{ textDecoration: 'none', color: 'inherit', marginRight: '0.5rem' }}><Button style={{ color: 'white' }}>Thư mục</Button></NavLink>
                </div>
                <div className='search-term'>
                    <Input type="text" placeholder="Tìm kiếm thư mục" style={{ width: '100%' }} />
                    <div className='icon-search'>
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                </div>

                <div className="folders-list">
                    {folders.length > 0 ? (
                        folders.map(folder => (
                            <Button key={folder.setId} className="folder-item">

                                <Link to={`/flashcard?set_id=${folder.setId}`} style={{ textDecoration: 'none', color: 'inherit' }}
                                    onClick={() => localStorage.setItem('flashcardTitle', folder.title)}>
                                    <h3>{folder.title}</h3>
                                </Link>
                            </Button>
                        ))
                    ) : (
                        <p style={{ color: '#fff', fontSize: '2rem' }}>Bạn chưa tạo thư mục nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Folders;