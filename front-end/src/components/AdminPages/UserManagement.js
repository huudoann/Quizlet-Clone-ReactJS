import React, { useEffect, useState } from 'react';
import './UserManagement.scss';
import { Request } from '../../utils/axios';
import { endPoint } from '../../utils/api/endPoint';
import { TextField, Button } from '@mui/material';
import { toast, Toaster } from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [editUserId, setEditUserId] = useState(null);
    const [editUserDetails, setEditUserDetails] = useState({ username: '' });

    useEffect(() => {
        const getListUser = async () => {
            const response = await Request.Server.get(endPoint.getAllUsers());
            setUsers(response);
        }

        getListUser();
    }, [])

    const deleteUser = (userId, index) => {
        setDeleteIndex(index);
        setDeleteUserId(userId);
    }

    const confirmDeleteUser = async () => {
        let updatedUsers = [...users];
        updatedUsers.splice(deleteIndex, 1);
        setUsers(updatedUsers);
        setDeleteIndex(null);
        try {
            await Request.Server.delete(endPoint.deleteUserByUserId(deleteUserId));
            setUsers(prevUsers => prevUsers.filter(user => user.deleteUserId !== deleteUserId));
            return toast.success('Xóa thành công!', {
                position: "top-center"
            })
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setDeleteUserId(null);
        }
    }

    const cancelDeleteUser = () => {
        setDeleteIndex(null);
    }

    const editUser = (userId, index) => {
        setEditUserId(userId);
        setEditUserDetails(users[index]);
    }

    const saveEditedUser = async () => {
        try {
            await Request.Server.put(endPoint.updateUsernameByUserId(editUserId), { username: editUserDetails.username });
            const updatedUsers = users.map(user => {
                if (user.user_id === editUserId) {
                    return { ...user, username: editUserDetails.username };
                }
                return user;
            });
            setUsers(updatedUsers);
            return toast.success('Sửa thành công!', {
                position: "top-center"
            })
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setEditUserId(null);
            setEditUserDetails({ username: '' });
        }
    }

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditUserDetails({ ...editUserDetails, [name]: value });
    }

    return (
        <div className='user-management-page'>
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên người dùng</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Chỉnh sửa</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                {editUserId === user.user_id ? (
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        name="username"
                                        value={editUserDetails.username}
                                        onChange={handleEditInputChange}
                                    />
                                ) : (
                                    user.username
                                )}
                            </td>
                            <td>
                                {user.email}
                            </td>
                            <td>{user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}</td>
                            <td>
                                {user.role !== 'ADMIN' && (
                                    <>
                                        {editUserId === user.user_id ? (
                                            <Button onClick={saveEditedUser} style={{ border: '1px solid #aaa' }}>Lưu</Button>
                                        ) : (
                                            <>
                                                <Button className="edit" onClick={() => editUser(user.user_id, index)} style={{ backgroundColor: 'white', color: 'black', border: '1px solid #aaa', textTransform: 'none' }}>Sửa</Button>
                                                <Button className="del" onClick={() => deleteUser(user.user_id, index)} style={{ textTransform: 'none' }}>Xóa</Button>
                                            </>
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {deleteIndex !== null && (
                <div id="delete_form">
                    <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
                    <button onClick={confirmDeleteUser}>Xác nhận</button>
                    <button onClick={cancelDeleteUser}>Hủy</button>
                </div>
            )}
        </div>
    );
}

export default UserManagement;
