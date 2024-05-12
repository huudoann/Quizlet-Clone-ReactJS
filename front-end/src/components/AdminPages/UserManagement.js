import React, { useEffect, useState } from 'react';
import './UserManagement.scss';
import { Request } from '../../utils/axios';
import { endPoint } from '../../utils/api/endPoint';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [editUserId, setEditUserId] = useState(null);

    useEffect(() => {
        const getListUser = async () => {
            const response = await Request.Server.get(endPoint.getAllUsers());
            console.log(response);
            setUsers(response)
        }

        getListUser();
    }, [])

    const addUser = async () => {
        let username = document.getElementById('full_name').value;
        let password = username
        // let birthDate = document.getElementById('birth_date').value;
        // let studentId = document.getElementById('student_id').value;
        // let userClass = document.getElementById('class').value;

        if (username.trim() !== '') {
            setUsers(prevUsers => [...prevUsers, { username: username }]);
            const response = await Request.Server.post(endPoint.createUser(), {
                username,
                password
            });
        } else {
            alert('Vui lòng nhập đầy đủ thông tin người dùng.');
        }
    }

    //chua viet api cho sua username phia be
    const editUser = async (userId, index) => {
        setEditUserId(userId)
        let updatedUsers = [...users];
        let user = updatedUsers[index];
        let newUsername = prompt('Nhập tên mới:', user.username);
        // let birthDate = prompt('Nhập ngày sinh mới (YYYY-MM-DD):', user.birth);
        // let studentId = prompt('Nhập mã sinh viên mới:', user.id);
        // let userClass = prompt('Nhập lớp mới:', user.class);

        if (newUsername !== null) {
            updatedUsers[index] = { username: newUsername };
            setUsers(updatedUsers);
            // Gọi API edit người dùng với userId
            try {
                console.log(userId)
                await Request.Server.put(endPoint.editUser(userId), newUsername);
                setUsers(prevUsers => prevUsers.filter(user => user.editUserId !== editUserId));
            } catch (error) {
                console.error('Error edit user:', error);
            } finally {
                setEditUserId(null); // Ẩn form xác nhận xóa sau khi xác nhận
            }
        }
    }

    const deleteUser = (userId, index) => {
        setDeleteIndex(index); // Hiển thị form xác nhận xóa
        setDeleteUserId(userId); // set userId bị xóa
    }

    const confirmDeleteUser = async () => {
        let updatedUsers = [...users];
        updatedUsers.splice(deleteIndex, 1);
        setUsers(updatedUsers);
        setDeleteIndex(null); // Ẩn form xác nhận xóa sau khi xác nhận
        // Gọi API xóa người dùng với userId
        try {
            console.log(deleteUserId)
            await Request.Server.delete(endPoint.deleteUser(deleteUserId));
            setUsers(prevUsers => prevUsers.filter(user => user.deleteUserId !== deleteUserId));
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setDeleteUserId(null); // Ẩn form xác nhận xóa sau khi xác nhận
        }
    }

    const cancelDeleteUser = () => {
        setDeleteIndex(null); // Ẩn form xác nhận xóa nếu hủy
    }

    return (
        <div className='user-management-page'>
            <div className="create-container-user">
                <input type="text" id="full_name" placeholder="Username" />
                {/* <input type="date" id="birth_date" /> */}
                {/* <input type="text" id="student_id" placeholder="Mã sinh viên" /> */}
                {/* <input type="text" id="class" placeholder="Lớp" /> */}
                <button onClick={addUser}>Thêm người dùng</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên người dùng</th>
                        {/* <th>Ngày sinh</th>
                        <th>Mã sinh viên</th>
                        <th>Lớp</th> */}
                        <th>Chỉnh sửa</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{user.username}</td>
                            {/* <td>{user.birth}</td>
                            <td>{user.id}</td>
                            <td>{user.class}</td> */}
                            <td>
                                <button className="edit" onClick={() => editUser(user.userId, index)}>Sửa</button>
                                <button className="del" onClick={() => deleteUser(user.userId, index)}>Xóa</button>
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
