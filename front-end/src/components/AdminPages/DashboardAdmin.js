import React, { useState, useEffect } from 'react';
import './DashboardAdmin.scss';
import SetManager from './SetManager';
import FolderManager from './FolderManager'
import UserManagement from './UserManagement';
import AdminNavBar from '../AdminPages/AdminNavBar';
import { Toaster, toast } from 'react-hot-toast'

const DashboardAdmin = () => {
    const [currentPage, setCurrentPage] = useState('sets-management');

    const navigate = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className='dashboard_admin'>
            <Toaster />
            <div className='navigation'>
                <AdminNavBar />
            </div>
            <div className='auth-tabs'>
                <button className={`inline-heading ${currentPage === 'sets-management' ? 'active' : ''}`} onClick={() => navigate('sets-management')}>Quản lý danh sách học phần</button>
                <button className={`inline-heading ${currentPage === 'folders-management' ? 'active' : ''}`} onClick={() => navigate('folders-management')}>Quản lý danh sách thư mục</button>
                <button className={`inline-heading ${currentPage === 'user-management' ? 'active' : ''}`} onClick={() => navigate('user-management')}>Quản lý người dùng</button>
            </div>
            {currentPage === 'sets-management' && <SetManager />}
            {currentPage === 'folders-management' && <FolderManager />}
            {currentPage === 'user-management' && <UserManagement />}
        </div>
    );
}

export default DashboardAdmin;
