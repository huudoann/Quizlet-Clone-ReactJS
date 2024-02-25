import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import './CreateSet.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faBell, faUser, faStickyNote, faFolder, faUsers } from '@fortawesome/free-solid-svg-icons'; // Import các icon từ thư viện Font Awesome
import Header from '../Header/Header';

const CreateSet = () => {
    // thay navbar
    // sửi lại UI (navbar, nút tạo, thêm private public, các thuật ngữ cách nhau ra)
    // logic tạo
    const [isPrivateSelected, setIsPrivateSelected] = useState(false); // State cho nút private
    const [isPublicSelected, setIsPublicSelected] = useState(false); // State cho nút public

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

    const [inputElements, setInputElements] = useState([]);
    const [sttCount, setSttCount] = useState(1); // Biến đếm số thứ tự

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
        <div className='create-set'>
            {<Header />}
            <body>
                <div className="body">
                    <div className="toolbar">

                        <span className='create-a-new-course'>Tạo học phần mới</span>
                        <div>
                            <Button variant="contained" className='bt-create'>Tạo</Button>
                        </div>
                    </div>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off">

                        <TextField className='enter-title' label="Nhập tiêu đề" variant="outlined" />
                        <TextField className='add-description' label="Thêm mô tả" variant="outlined" />
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
            </body>
        </div>
    );
}

export default CreateSet;
