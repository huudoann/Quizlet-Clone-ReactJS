import React, { useState, useEffect } from 'react';
import './Sets.scss';
import { Link, useLocation } from 'react-router-dom';
import Header from '../../Header/Header';

const Sets = () => {
    // sửa UI
    // code dựa trên data fake

    const [sets, setSets] = useState([]);

    //biến State để kiểm soát việc gọi API
    const location = useLocation();

    useEffect(() => {

        const params = new URLSearchParams(location.search);
        const setsParam = params.get('sets');

        if (setsParam) {
            const parsedSets = JSON.parse(decodeURIComponent(setsParam));
            setSets(parsedSets);
        }

        else {
            console.log("useEffect hadn't run")
        }

    }, [location.search]);

    return (
        <div className="sets">
            <Header />
            <div className='body-sets'>
                <div className='user-profile'>
                    <img src='https://e7.pngegg.com/pngimages/7/618/png-clipart-man-illustration-avatar-icon-fashion-men-avatar-face-fashion-girl-thumbnail.png' alt='Avatar' className='avatar' />
                    <span className='username'>Tên người dùng</span>
                </div>
                <div className='select-card'>
                    <Link to="/sets" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                        <div className='term'>Học phần</div>
                    </Link>
                    <Link to="/folders" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                        <div className='folder'>Thư mục</div>
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
                            <div key={set.setId} className="set-item">
                                {/* Link to Flashcard page with set_id */}
                                <Link to={`/flashcard?set_id=${set.setId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <h3>{set.title}</h3>
                                </Link>
                            </div>
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