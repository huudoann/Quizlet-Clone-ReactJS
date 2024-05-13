import React, { useEffect, useState } from 'react'
import "./SetManager.scss"
import { Request } from '../../utils/axios'
import { endPoint } from '../../utils/api/endPoint'
import { useNavigate } from 'react-router-dom'
import { Pagination, Button } from '@mui/material'
import { Toaster, toast } from 'react-hot-toast'

const SetManager = () => {
    const [sets, setSets] = useState([])
    const [deletingIndex, setDeletingIndex] = useState(null)
    const [deteleSetId, setSetId] = useState(null)
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [selectedType, setSelectedType] = useState('public');
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra nếu có toast trong session storage
        const toastData = sessionStorage.getItem('toast');
        if (toastData) {
            const toastObject = JSON.parse(toastData);
            // Hiển thị toast
            toast.success(toastObject.message, {
                position: toastObject.position
            });
            // Xóa toast khỏi session storage
            sessionStorage.removeItem('toast');
        }
    }, []);

    useEffect(() => {
        const getListSets = async () => {
            const response = await Request.Server.get(`http://localhost:8080/api/set/get-all-sets?page=${page}`);
            console.log(response)
            setSets(response.content)
            setTotalPages(response.totalPages);
        }

        getListSets()
    }, [page, selectedType])

    const updateSetsList = (updatedSet) => {
        return (
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên học phần</th>
                        <th>Loại học phần</th>
                        <th>Ngày tạo</th>
                        <th>Lần sửa cuối</th>
                        <th>Mô tả</th>
                        <th>Chỉnh sửa</th>
                    </tr>
                </thead>
                <tbody>
                    {updatedSet.map((set, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{set.title}</td>
                            <td>{set.public ? "Công khai" : "Riêng tư"}</td>
                            <td>{new Date(set.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                            <td>{new Date(set.updatedAt || set.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                            <td>{set.description}</td>
                            <td>
                                <div className="edit-delete-buttons">
                                    <Button className="edit" onClick={() => editSet(set)} style={{ backgroundColor: 'white', color: 'black', border: '1px solid #aaa', textTransform: 'none' }}>Sửa</Button>
                                    <Button className="del" onClick={() => showDeleteForm(set, index)} style={{ textTransform: 'none' }}>Xóa</Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    const handleChangePage = (event, value) => {
        console.log(value);
        setPage(value - 1);
    }

    const editSet = (set) => {
        localStorage.setItem('set_id', set.set_id);
        localStorage.setItem('user_id', set.user_id);
        localStorage.setItem('public', set.public);
        localStorage.setItem('flashcardTitle', set.title);
        localStorage.setItem('description', set.description);
        navigate('/edit-set')
    }

    const showDeleteForm = (set, index) => {
        setDeletingIndex(index)
        setSetId(set.set_id)
    }

    const deleteSet = async () => {
        const updatedSet = [...sets]
        updatedSet.splice(deletingIndex, 1)
        setSets(updatedSet)
        updateSetsList(updatedSet)
        setDeletingIndex(null)
        try {
            console.log(deteleSetId)
            await Request.Server.delete(endPoint.deleteSetBySetId(deteleSetId))
            setSets(prevExams => prevExams.filter(set => set.deteleSetId !== deteleSetId))
            return toast.success('Xóa thành công!', {
                position: "top-center"
            })
        } catch (error) {
            console.error('Error deleting set:', error)
        } finally {
            setSetId(null) // Ẩn form xác nhận xóa sau khi xác nhận
        }
    }

    return (
        <div className="sets-management-page">
            <Toaster />
            <ul id="exam_list">
                {updateSetsList(sets)}
            </ul>
            {deletingIndex !== null && (
                <div id="delete_form" className="delete-dialog">
                    <p>Bạn có chắc chắn muốn xóa học phần này không?</p>
                    <button onClick={deleteSet}>Có</button>
                    <button onClick={() => setDeletingIndex(null)}>Không</button>
                </div>
            )}

            {totalPages > 1 && (
                <Pagination className="pagination"
                    count={totalPages}
                    color="primary"
                    onChange={handleChangePage}
                />
            )}
        </div>
    )

}

export default SetManager