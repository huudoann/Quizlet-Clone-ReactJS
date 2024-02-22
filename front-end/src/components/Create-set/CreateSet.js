import React, { useState, useEffect } from 'react';
import './CreateSet.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faBell, faUser, faStickyNote, faFolder, faUsers } from '@fortawesome/free-solid-svg-icons'; // Import các icon từ thư viện Font Awesome
import Header from '../Header/Header';

const CreateSet = () => {
    // thay navbar
    // sửi lại UI (navbar, nút tạo, thêm private public, các thuật ngữ cách nhau ra)
    // logic tạo

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
            <Header />
            
            <body>
                <div className="body">
                    <div className="toolbar">
                        <span className='create-a-new-course'>Tạo học phần mới</span>
                        <button className='bt-create'>Tạo</button>
                    </div>
                    <div className='enter-title'>
                        <input type="text" placeholder="Nhập tiêu đề" />
                    </div>
                    <div className='add-description'>
                        <input type="text" placeholder="Thêm mô tả..." />
                    </div>
                    <div className='private-public'>
                        <span className='selecte-private-public'>Chọn quyền truy cập: </span>
                        <button className='private'>Riêng tư</button>
                        <button className='public'>Công khai</button>
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
                                <input
                                    type="text"
                                    placeholder="Thuật ngữ"
                                    value={input.content1}
                                    onChange={(e) => handleInputChange(input.id, "content1", e)}
                                    className="input-terms"
                                />
                                <input
                                    type="text"
                                    placeholder="Định nghĩa"
                                    value={input.content2}
                                    onChange={(e) => handleInputChange(input.id, "content2", e)}
                                    className="input-define"
                                />
                                <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    className="delete-icon"
                                    onClick={() => removeInputElement(input.id)}
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => { addInputElement(); setSttCount(prevCount => prevCount + 1); }}
                        className="add-card-button"
                    >
                        Thêm thẻ
                    </button>
                </div>
            </body>
        </div>
    );
}

export default CreateSet;
