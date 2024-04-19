import React, { useState, useEffect } from 'react';
import './EditSet.scss';
import Header from '../Header/Header';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, TextField, IconButton, Button } from '@mui/material';
import getCardsDataFromSet from '../../utils/getCardsDataFromSet';
import axios from 'axios';
import { ArrowBack } from '@mui/icons-material';

const EditSet = () => {
    const [isPrivateSelected, setIsPrivateSelected] = useState(false); // State cho nút private
    const [isPublicSelected, setIsPublicSelected] = useState(false); // State cho nút public
    const [sttCount, setSttCount] = useState('1'); // Biến đếm số thứ tự
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [flashcardTitle, setFlashcardTitle] = useState('');
    const [flashcardDescription, setFlashcardDescription] = useState('');
    const [flashcardsArray, setFlashcardsArray] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [cardIdToDelete, setCardIdToDelete] = useState(null);
    const location = useLocation();
    const navigate = useNavigate()
    const [set_id, setSetId] = useState('');
    const [token, setToken] = useState('');
    const [isClickAddCard, setIsClickAddCard] = useState(false);

    // console.log({ flashcardsArray });
    //gọi API lấy tất cả thẻ theo set_id
    useEffect(() => {
        const fetchData = async () => {
            try {
                const set_id = localStorage.getItem('set_id');
                if (!set_id) {
                    console.error('Không tìm thấy set_id trong URL');
                    return;
                } else {
                    setSetId(set_id);
                }

                const flashcardsData = await getCardsDataFromSet(set_id);
                const flashcardsArray = Object.values(flashcardsData.content);
                setFlashcardsArray(flashcardsArray);
                console.log("flashcardsArray", flashcardsArray);
                console.log(localStorage);
                const title = localStorage.getItem('flashcardTitle');
                const description = localStorage.getItem('description');
                setFlashcardDescription(description);
                console.log("aaa", description);
                setFlashcardTitle(title);
                console.log(title);

                const token = localStorage.getItem('token'); // Lấy token từ local storage
                if (!token) {
                    window.location.href = "/login"
                    return null
                } else {
                    setToken(token);
                }

            } catch (error) {
                console.error('Error fetching flashcards:', error);
            }
        };

        fetchData();
    }, [location.search]);

    useEffect(() => {
        setSttCount(flashcardsArray.length + 1);
    }, [flashcardsArray]);

    const addInputElement = () => {
        const newCard = {
            front_text: "",
            back_text: "",
            card_id: Date.now(),
            is_known: 'false'
        }
        setFlashcardsArray(prevInputs => [...prevInputs, newCard]);

    };

    const addCard = async (isClickAddCard) => {
        if (isClickAddCard) {
            const createCardApiUrl = `http://localhost:8080/api/card/${set_id}/create_card`;
            console.log("them", flashcardsArray[flashcardsArray.length - 1]);
            const newCard = await axios.post(createCardApiUrl, flashcardsArray[flashcardsArray.length - 1], {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log({ newCard });
            setFlashcardsArray(prevInputs => [...prevInputs, newCard.data]);
        } else {
            return
        }
    }



    const handleInputChange = (index, part, event) => {
        const newInputs = flashcardsArray.map((flashcard, i) => {
            if (i === index) {
                return { ...flashcard, [part]: event.target.value };
            }
            return flashcard;
        });
        setFlashcardsArray(newInputs);
    };

    const removeInputElement = (id) => {
        setFlashcardsArray(prevInputs => {
            // Lọc bỏ ô nhập có id trùng khớp
            const updatedInputs = prevInputs.filter(input => input.id !== id);
            // Cập nhật lại số thứ tự cho các ô nhập còn lại
            return updatedInputs.map((input, index) => ({ ...input, stt: index + 1 }));
        });
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false);
    };



    //post dữ liệu về BE
    const handleCompletedButtonClick = async () => {
        console.log({ token });
        addCard(isClickAddCard);
        flashcardsArray.forEach(async (card, index) => {
            const updateCardApiUrl = `http://localhost:8080/api/card/edit/${card.card_id}`;
            const responseCard = await axios.put(updateCardApiUrl, { front_text: card.front_text, back_text: card.back_text }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log({ responseCard })
        })
        navigate(`/flashcard`)
    }


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

    //Gọi API xóa thẻ
    const handleDeleteConfirmation = async (cardId) => {
        setShowConfirmation(true);
        setCardIdToDelete(cardId);
    };

    const handleConfirmDelete = async () => {
        setShowConfirmation(false);
        try {
            const response = await axios.delete(`http://localhost:8080/api/card/${cardIdToDelete}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                // Thực hiện các thao tác cập nhật giao diện sau khi xóa thẻ thành công
                console.log('Thẻ đã được xóa thành công');
                console.log(flashcardsArray);
                // Cập nhật danh sách thẻ sau khi xóa
                const updatedFlashcards = flashcards.filter(card => card.card_id !== cardIdToDelete);
                setFlashcards(updatedFlashcards);
            } else {
                console.error('Lỗi khi xóa thẻ:', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi khi gửi request xóa thẻ:', error.message);
        }
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
                        <Button variant="contained" className='completed' onClick={() => {
                            handleCompletedButtonClick()
                        }}>
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
                        value={flashcardTitle}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        className='add-description'
                        label="Thêm mô tả"
                        variant="outlined"
                        value={flashcardDescription}
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
                    {
                        flashcardsArray.map((flashcard, index) => (
                            <div key={index} className="item-card">
                                <input
                                    type="text"
                                    placeholder="STT"
                                    value={index + 1}
                                    className="stt-input"
                                />
                                <TextField
                                    className="input-terms"
                                    label="Thuật ngữ"
                                    variant="standard"
                                    value={flashcard.front_text}
                                    onChange={(e) => handleInputChange(index, 'front_text', e)}
                                />
                                <TextField
                                    className="input-define"
                                    label="Định nghĩa"
                                    variant="standard"
                                    onChange={(e) => handleInputChange(index, 'back_text', e)}
                                    value={flashcard.back_text}
                                />
                                <IconButton
                                    aria-label="delete" size="large"
                                    className="delete-icon"
                                    onClick={() => handleDeleteConfirmation(flashcard.card_id)}>
                                    <DeleteIcon fontSize="inherit" />
                                </IconButton>
                            </div>
                        ))
                    }

                </div>
                <Button variant="contained"
                    onClick={() => {
                        addInputElement();
                        setSttCount(prevCount => prevCount + 1);
                        setIsClickAddCard(true);
                    }}
                    className="add-card-button"
                >
                    + Thêm thẻ
                </Button>
                {showConfirmation && (
                    <div>
                        <div className="overlay"></div>
                        <div className="confirmation-box">
                            <div className="message">Bạn có chắc chắn muốn xóa không?</div>
                            <div className="button-container">
                                <button onClick={handleConfirmDelete}>Xác nhận</button>
                                <button onClick={handleCancelDelete}>Hủy bỏ</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditSet; 