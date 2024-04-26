import React, { useState, useEffect } from 'react';
import './Sets.scss';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Header/Header';
import axios from 'axios';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input } from '@mui/material';
import { endPoint } from '../../../utils/api/endPoint';
import { Request } from '../../../utils/axios';

const Sets = () => {
    const [sets, setSets] = useState([]);
    const [filteredSets, setFilteredSets] = useState([]);
    const [username, setUserName] = useState();
    const location = useLocation();
    const navigate = useNavigate();

    const [activeLink, setActiveLink] = useState('');

    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location.pathname]);

    // Fetch sets data from API
    useEffect(() => {
        const fetchData = async () => {
            let token = localStorage.getItem('token');
            const userId = localStorage.getItem('user_id');
            const userName = localStorage.getItem('user_name');

            if (!token) {
                throw new Error('Token không tồn tại trong localStorage');
            } else {
                try {
                    const allSets = await axios.get(`http://localhost:8080/api/set/${userId}/sets`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setSets(allSets.data);
                    setUserName(userName);
                } catch (error) {
                    console.error('Lỗi khi lấy danh sách các set:', error.message);
                }
            }
        };

        fetchData();
    }, []);

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filtered = sets.filter(set => set.title.toLowerCase().includes(searchTerm));
        setFilteredSets(filtered);
    };

    const setsToDisplay = filteredSets.length > 0 ? filteredSets : sets;

    return (
        <div className="sets">
            <Header />
            <div className='body-sets'>
                <div className='user-profile'>
                    <img src='https://assets.quizlet.com/a/j/dist/app/i/animals/111.f9dd73353feb908.jpg' alt='Avatar' className='avatar' />
                    <span className='username'>{username}</span>
                </div>
                <div className='select-card'>
                    <NavLink to={`/sets`} className="term" activeclassname="active" style={{ textDecoration: 'none', color: 'inherit', marginRight: '0.5rem' }}><Button style={{ color: 'white' }}>Học phần</Button></NavLink>
                    <NavLink to={`/folders`} className="folder" activeclassname="active" style={{ textDecoration: 'none', color: 'inherit', marginRight: '0.5rem' }}><Button style={{ color: 'white' }}>Thư mục</Button></NavLink>
                </div>
                <div className='search-term'>
                    <Input type="text" placeholder="Tìm kiếm học phần" style={{ width: '100%' }} onChange={handleSearch} />
                    <div className='icon-search'>
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                </div>

                <div className="sets-list">
                    {setsToDisplay.length > 0 ? (
                        setsToDisplay.map(set => (
                            <Button
                                key={set.setId}
                                className="set-item-button"
                                onClick={() => {
                                    localStorage.setItem('flashcardTitle', set.title);
                                    localStorage.setItem('set_id', set.setId);
                                    localStorage.setItem('description', set.description)
                                    localStorage.setItem('public', set.public);
                                    navigate('/flashcard');
                                }}
                                style={{ textTransform: 'none' }}
                            >
                                <span>{set.termCount} {set.termCount > 1 ? 'Terms' : 'Term'}</span>
                                <br></br>
                                <h3>{set.title}</h3>
                            </Button>
                        ))
                    ) : (
                        <p style={{ color: '#fff', fontSize: '2rem' }}>Không tìm thấy kết quả phù hợp.</p>
                    )}
                </div>
            </div>
        </div>
    );

}

export default Sets;
