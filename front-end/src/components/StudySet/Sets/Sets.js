import React, { useState, useEffect } from 'react';
import './Sets.scss';
import { Link, useLocation } from 'react-router-dom';
import Header from '../../Header/Header';
import axios from 'axios';

const Sets = () => {
    // sửa UI
    // code dựa trên data fake


    const [sets, setSets] = useState([]);
    const [username, setUserName] = useState();
    const location = useLocation()

    const [activeLink, setActiveLink] = useState('');

    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        const fetchData = async () => {
            let token = localStorage.getItem('token');
            const userId = localStorage.getItem('user_id');
            const userName = localStorage.getItem('user_name');

            // Kiểm tra xem token có tồn tại không
            if (!token) {
                throw new Error('Token không tồn tại trong localStorage');
            } else {
                try {
                    // Thực hiện gọi API ở đây
                    const response = await axios.get(`http://localhost:8080/api/set/${userId}/sets`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setSets(response.data);
                    setUserName(userName);
                } catch (error) {
                    console.error('Lỗi khi lấy danh sách các set:', error.message);
                }
            }
        };

        fetchData();
    }, []);

    return (
        <div className="sets">
            <Header />
            <div className='body-sets'>
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
                    <input type="text" placeholder="Tìm kiếm học phần" />
                    {/* <div className='icon-search'>
                        <FontAwesomeIcon icon={faSearch} />
                    </div> */}
                </div>

                <div className="sets-list">
                    {sets.length > 0 ? (
                        sets.map(set => (
                            <button
                                key={set.setId}
                                className="set-item-button"
                                onClick={() => {
                                    localStorage.setItem('flashcardTitle', set.title);
                                    window.location.href = `/flashcard?set_id=${set.setId}`;
                                }}
                            >
                                <h3>{set.title}</h3>
                            </button>
                        ))
                    ) : (
                        <p>Không có sets nào được tìm thấy.</p>
                    )}
                </div>
            </div>
        </div>
    );

}

export default Sets;