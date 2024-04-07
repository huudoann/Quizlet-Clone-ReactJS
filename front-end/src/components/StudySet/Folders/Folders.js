import React, { useEffect, useState } from "react";
import './Folders.scss';
import { Link, useLocation } from 'react-router-dom';
import Header from "../../Header/Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

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
                    <Link to="/sets" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                        <div className={`term ${activeLink === '/sets' ? 'active' : ''}`}>Học phần</div>
                    </Link>
                    <Link to="/folders" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                        <div className={`folder ${activeLink === '/folders' ? 'active' : ''}`}>Thư mục</div>
                    </Link>
                </div>
                <div className='search-term'>
                    <input type="text" placeholder="Tìm kiếm thư mục" />
                    <div className='icon-search'>
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                </div>

                <div className="folders-list">
                    {folders.length > 0 ? (
                        folders.map(folder => (
                            <div key={folder.setId} className="folder-item">
                                {/* Link to trang folder chứa các set của folder đó 
                                
                                
                                */}
                                <Link to={`/flashcard?set_id=${folder.setId}`} style={{ textDecoration: 'none', color: 'inherit' }}
                                    onClick={() => localStorage.setItem('flashcardTitle', folder.title)}>
                                    <h3>{folder.title}</h3>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>Không có folders nào được tìm thấy.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Folders;