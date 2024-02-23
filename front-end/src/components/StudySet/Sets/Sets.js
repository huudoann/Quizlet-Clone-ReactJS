import React, { useState } from 'react';
import './Sets.scss';
import { Link } from 'react-router-dom';
import Header from '../../Header/Header';

const Sets = () => {
    // sửa UI
    // code dựa trên data fake

    return (
        <div className="sets">
            {<Header />}
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
            </div>
        </div>
    );

}

export default Sets;