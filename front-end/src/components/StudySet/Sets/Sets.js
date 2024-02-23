import React, { useState } from 'react';
import './Sets.scss';
import Header from '../../Header/Header';

const Sets = () => {
    // sửa UI
    // code dựa trên data fake


    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
    const [isLibraryMenuOpen, setIsLibraryMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const toggleFolderDialog = () => {
        setIsFolderDialogOpen(!isFolderDialogOpen);
    }

    const toggleLibraryMenu = () => {
        setIsLibraryMenuOpen(!isLibraryMenuOpen);
    }


    return (
        <div className="sets">
            {<Header/>}
            <div className='body-sets'>
                <div className='user-profile'>
                    <img src='https://e7.pngegg.com/pngimages/7/618/png-clipart-man-illustration-avatar-icon-fashion-men-avatar-face-fashion-girl-thumbnail.png' alt='Avatar' className='avatar' />
                    <span className='username'>Tên người dùng</span>
                </div>
                <div className='select-card'>
                    <div className='term'>Học phần</div>
                    <div className='folder'>Thư mục</div>
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