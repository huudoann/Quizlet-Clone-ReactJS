import React, { useState, useEffect } from 'react';
import './EditSet.scss';
import Header from '../Header/Header';
import { Link, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, TextField, IconButton, Button } from '@mui/material';
import axios from 'axios';
import { ArrowBack } from '@mui/icons-material';

const EditSet = () => {
    const [isPrivateSelected, setIsPrivateSelected] = useState(false); // State cho nút private
    const [isPublicSelected, setIsPublicSelected] = useState(false); // State cho nút public
    const [inputElements, setInputElements] = useState([]);
    const [sttCount, setSttCount] = useState(1); // Biến đếm số thứ tự
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate()

    //post dữ liệu về BE
    // const handleCreateButtonClick = async () => {
    //     const isPublic = isPublicSelected;

    //     const setData = {
    //         title,
    //         description,
    //         is_public: isPublic
    //     };

    //     const createSetApiUrl = 'http://localhost:8080/api/set/create-set';
    //     const token = localStorage.getItem('token'); // Lấy token từ local storage

    //     if (!token) {
    //         throw new Error('Token không tồn tại trong localStorage');
    //     }

    //     try {
    //         const response = await axios.post(createSetApiUrl, setData, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}` // Thêm token vào header Authorization
    //             }
    //         });
    //         console.log('Tạo học phần thành công:', response.data);


    //         const set_id = response.data.set_id; // Lưu set_id từ phản hồi
    //         console.log(set_id)

    //         // Gửi dữ liệu các cards
    //         const cardData = inputElements.map(input => ({
    //             front_text: input.content1,
    //             back_text: input.content2,
    //             is_known: false
    //         }));

    //         console.log(cardData)

    //         const createCardApiUrl = `http://localhost:8080/${set_id}/create_card`;
    //         // const responseCard = await axios.post(createCardApiUrl, cardData, {
    //         //     headers: {
    //         //         'Authorization': `Bearer ${token}`
    //         //     }
    //         // });

    //         cardData.map(async (card) => {
    //             const responseCard = await axios.post(createCardApiUrl, card, {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`
    //                 }
    //             });
    //             console.log(responseCard)
    //         })

    //         //chuyển về trang có set_id đó
    //         navigate(`/flashcard?set_id=${set_id}`)

    //         return

    //         // console.log('Tạo card thành công:', responseCard.data);

    //         // return responseCard.data;
    //     } catch (error) {
    //         console.error('Lỗi khi tạo:', error.message);
    //         throw error;
    //     }

    // };

    // Hàm xử lý khi click vào nút private
    const handlePrivateClick = () => {
        setIsPrivateSelected(true); // Đặt trạng thái của nút private thành true
        setIsPublicSelected(false); // Đặt trạng thái của nút public thành false
    };

    // Hàm xử lý khi click vào nút public
    const handlePublicClick = () => {
        setIsPublicSelected(true); // Đặt trạng thái của nút public thành true
        setIsPrivateSelected(false); // Đặt trạng thái của nút private thành false
    };

    useEffect(() => {
        setSttCount(inputElements.length + 1);
    }, [inputElements]);

    const addInputElement = () => {
        setInputElements(prevInputs => [...prevInputs, { id: Date.now(), content1: '', content2: '', stt: sttCount }]);
    };

    const handleInputChange = (id, part, event) => {
        const newInputs = inputElements.map(input => {
            if (input.id === id) {
                return { ...input, [part]: event.target.value };
            }
            return input;
        });
        setInputElements(newInputs);
    };

    const removeInputElement = (id) => {
        setInputElements(prevInputs => {
            // Lọc bỏ ô nhập có id trùng khớp
            const updatedInputs = prevInputs.filter(input => input.id !== id);
            // Cập nhật lại số thứ tự cho các ô nhập còn lại
            return updatedInputs.map((input, index) => ({ ...input, stt: index + 1 }));
        });
    };

    return (
        <div className='edit-set'>
            {<Header />}
            <div className="body">
                <div className="toolbar">
                    <Link to='/flashcard' style={{ color: 'inherit', textDecoration: 'inherit' }}>
                        <span className='return-to-the-module'>
                            <IconButton
                                aria-label="arrow" size="large"
                                className="arrow-icon">
                                <ArrowBack fontSize="inherit" />
                            </IconButton>
                            Trở về học phần
                        </span>
                    </Link>
                    <div>
                        <Button variant="contained" className='completed' >
                            Hoàn tất
                        </Button>
                    </div>
                </div>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off">

                    <TextField
                        className='enter-title'
                        label="Nhập tiêu đề"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        className='add-description'
                        label="Thêm mô tả"
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Box>
                <div className='private-public'>
                    <span className='selecte-private-public'>Chọn quyền truy cập: </span>
                    <Button
                        className={`private ${isPrivateSelected ? 'selected' : ''}`}
                        onClick={handlePrivateClick}
                        variant="contained">
                        Riêng tư
                    </Button>
                    <Button
                        className={`public ${isPublicSelected ? 'selected' : ''}`}
                        onClick={handlePublicClick}
                        variant="contained">
                        Công khai
                    </Button>
                </div>
                <div className='card'>
                    {inputElements.map(input => (
                        <div key={input.id} className="item-card">
                            <input
                                type="text"
                                placeholder="STT"
                                value={input.stt}
                                readOnly
                                className="stt-input"
                            />
                            <TextField
                                className="input-terms"
                                label="Thuật ngữ"
                                variant="standard"
                                value={input.content1}
                                onChange={(e) => handleInputChange(input.id, "content1", e)}
                            />
                            {/* <input
                                    type="text"
                                    placeholder="Thuật ngữ"
                                    value={input.content1}
                                    onChange={(e) => handleInputChange(input.id, "content1", e)}
                                    className="input-terms"
                                /> */}
                            <TextField
                                className="input-define"
                                label="Định nghĩa"
                                variant="standard"
                                value={input.content2}
                                onChange={(e) => handleInputChange(input.id, "content2", e)}
                            />
                            {/* <input
                                    type="text"
                                    placeholder="Định nghĩa"
                                    value={input.content2}
                                    onChange={(e) => handleInputChange(input.id, "content2", e)}
                                    className="input-define"
                                /> */}
                            <IconButton
                                aria-label="delete" size="large"
                                className="delete-icon"
                                onClick={() => removeInputElement(input.id)}>
                                <DeleteIcon fontSize="inherit" />
                            </IconButton>
                        </div>
                    ))}
                </div>
                <Button variant="contained"
                    onClick={() => { addInputElement(); setSttCount(prevCount => prevCount + 1); }}
                    className="add-card-button"
                >
                    + Thêm thẻ
                </Button>
            </div>
        </div>
    );
}

export default EditSet; 