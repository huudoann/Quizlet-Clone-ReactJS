import React, { useEffect, useState } from 'react'
import "./SetManager.scss"
import { Request } from '../../utils/axios'
import { endPoint } from '../../utils/api/endPoint'
import { useNavigate } from 'react-router-dom'
import { Button, Pagination } from '@mui/material'

const FolderManager = () => {
    const [folders, setFolders] = useState([])
    const [deletingIndex, setDeletingIndex] = useState(null)
    const [deleteFolderId, setFolderId] = useState(null)
    console.log(folders)
    const navigate = useNavigate();
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const getListFolders = async () => {
            const response = await Request.Server.get(`http://localhost:8080/api/folder/get-all-folders?page=${page}`)
            console.log(response)
            setFolders(response.content)
            setTotalPages(response.totalPages);
        }
        getListFolders()
    }, [page])

    const addExam = async () => {

    }

    const updateFoldersList = (updatedFolder) => {
        return (
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên thư mục</th>
                        <th>Ngày tạo</th>
                        <th>Mô tả</th>
                        <th>Chỉnh sửa</th>
                    </tr>
                </thead>
                <tbody>
                    {updatedFolder.map((folder, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{folder.title}</td>
                            <td>{new Date(folder.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                            <td>{folder.description}</td>
                            <td>
                                <div className="edit-delete-buttons">
                                    <button className="edit" onClick={() => editExam(folder)}>Sửa</button>
                                    <button className="del" onClick={() => showDeleteForm(folder, index)}>Xóa</button>
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

    const editExam = (folder) => {
        localStorage.setItem('set_id', folder.set_id);
        localStorage.setItem('public', folder.public);
        localStorage.setItem('user_id', folder.user_id);
        localStorage.setItem('flashcardTitle', folder.title);
        localStorage.setItem('description', folder.description);
        navigate('/forder-set')
    }

    const showDeleteForm = (folder, index) => {
        setDeletingIndex(index)
        setFolderId(folder.set_id)
    }

    const deleteSet = async () => {
        const updatedFolder = [...folders]
        updatedFolder.splice(deletingIndex, 1)
        setFolders(updatedFolder)
        updateFoldersList(updatedFolder)
        setDeletingIndex(null)
        try {
            console.log(deleteFolderId)
            await Request.Server.delete(endPoint.deleteSetBySetId(deleteFolderId))
            setFolders(prevExams => prevExams.filter(folder => folder.deleteFolderId !== deleteFolderId))
        } catch (error) {
            console.error('Error deleting folder:', error)
        } finally {
            setFolderId(null) // Ẩn form xác nhận xóa sau khi xác nhận
        }
    }

    return (
        <div className="sets-management-page">
            <div className="create-container">
                <div className="button-container">
                    <Button onClick={addExam} variant="contained" color='success' style={{ justifyItems: 'right' }}>Tạo thư mục</Button>
                </div>
            </div>
            <ul id="exam_list">
                {updateFoldersList(folders)}
            </ul>

            {deletingIndex !== null && (
                <div id="delete_form" className="delete-dialog">
                    <p>Bạn có chắc chắn muốn xóa thư mục này không?</p>
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

export default FolderManager