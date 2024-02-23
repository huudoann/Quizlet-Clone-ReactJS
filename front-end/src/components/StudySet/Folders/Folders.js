import React from "react";
import './Folders.scss';
import { Link } from 'react-router-dom';
import Header from "../../Header/Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

const Folders = () => {
    return (
        <div className="folders">
            {<Header />}

            <div className='body-folders'>
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
                    <input type="text" placeholder="Tìm kiếm thư mục" />
                    {/* <div className='icon-search'>
                        <FontAwesomeIcon icon={faSearch} />
                    </div> */}
                </div>
                <div className='folder-card'>
                    <div className="number-term">Số học phần</div>
                    <div className="folder-name">
                        <FontAwesomeIcon icon={faFolder} className='faFolder' />
                        Tên thư mục
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Folders;