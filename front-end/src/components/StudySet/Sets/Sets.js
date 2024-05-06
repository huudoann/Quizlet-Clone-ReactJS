import React, { useState, useEffect } from 'react';
import './Sets.scss';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Header/Header';
import axios from 'axios';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input } from '@mui/material';
import { Pagination } from "@mui/material";

const Sets = () => {
    const [sets, setSets] = useState([]);
    const [filteredSets, setFilteredSets] = useState([]);
    const [username, setUserName] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

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
                    const allSets = await axios.get(`http://localhost:8080/api/set/${userId}/sets?page=${page}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setSets(allSets.data.content);
                    console.log(allSets.data);
                    console.log('totalPages:' + totalPages);
                    setTotalPages(allSets.data.totalPages);
                    setUserName(userName);
                } catch (error) {
                    console.error('Lỗi khi lấy danh sách các set:', error.message);
                }
            }
        };

        fetchData();
    }, [page]);

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filtered = sets.filter(set => set.title.toLowerCase().includes(searchTerm));
        setFilteredSets(filtered);
    };

    const handleChangePage = (event, value) => {
        console.log(value);
        setPage(value - 1);
    }

    const setsToDisplay = filteredSets.length > 0 ? filteredSets : sets;

    const handleClickSetItem = async (set) => {

        const userInfo = await axios.get(`http://localhost:8080/api/user/username/${set.ownerName}`);
        localStorage.setItem('ownerId', userInfo.data.user_id)
        localStorage.setItem('flashcardTitle', set.title);
        localStorage.setItem('set_id', set.setId);
        localStorage.setItem('description', set.description)
        localStorage.setItem('public', set.public);
        navigate('/flashcard');

    }

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
                                    handleClickSetItem(set);
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
                {totalPages > 1 && (
                    <Pagination className="pagination"
                    count={totalPages}
                    color="primary"
                    onChange={handleChangePage}
                />
                )}
            </div>
        </div>
    );

}

export default Sets;
