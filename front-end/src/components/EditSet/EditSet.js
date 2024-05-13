import React, { useState, useEffect } from 'react';
import './EditSet.scss';
import Header from '../Header/Header';
import { Link, useNavigate } from 'react-router-dom';
import { Box, TextField, IconButton, Button } from '@mui/material';
import { endPoint } from '../../utils/api/endPoint';
import { Request } from '../../utils/axios';
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';

const EditSet = () => {
    const [isPrivateSelected, setIsPrivateSelected] = useState(false); // State cho nút private
    const [isPublicSelected, setIsPublicSelected] = useState(false); // State cho nút public
    const [sttCount, setSttCount] = useState('1'); // Biến đếm số thứ tự
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [flashcardTitle, setFlashcardTitle] = useState('');
    const [flashcardDescription, setFlashcardDescription] = useState('');
    const [flashcardsArray, setFlashcardsArray] = useState([]);
    const navigate = useNavigate()
    const [numberOfOldCard, serNumberOfOldCard] = useState(0)
    const [set_id, setSetId] = useState('');
    const [token, setToken] = useState('');
    const [isClickAddCard, setIsClickAddCard] = useState(false);
    const [editCards, setEditCards] = useState([])
    const [isPublic, setIsPublic] = useState('false');
    const role = localStorage.getItem('role')

    console.log({ isPublic });
    // console.log({ flashcardsArray });
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

                const flashcardsData = await Request.Server.get(endPoint.getAllCardsInSet(set_id));
                const flashcardsArray = Object.values(flashcardsData.content);
                setFlashcardsArray(flashcardsArray);
                const title = localStorage.getItem('flashcardTitle');
                const description = localStorage.getItem('description');
                console.log(localStorage);
                setIsPublic(localStorage.public)
                setFlashcardDescription(description);
                setFlashcardTitle(title);
                serNumberOfOldCard(flashcardsArray.length)
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
    }, []);

    useEffect(() => {
        setSttCount(flashcardsArray.length + 1);
    }, [flashcardsArray]);

    const addInputElement = () => {
        const newCard = {
            front_text: "",
            back_text: "",
            card_id: Date.now(),
            is_known: 'false',
            updated_at: Date.now()
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
        const card = flashcardsArray[index];

        const updatedCard = {
            ...card,
            [part]: event.target.value
        };

        // Check if card with the same card_id already exists in editCards array
        if (!editCards.some(existingCard => existingCard.card_id === card.card_id)) {
            // If not present, update the editCards array with the updated card object
            setEditCards(prevEditCards => [...prevEditCards, updatedCard]);
        } else {
            // If already present, find and update the card in the editCards array
            setEditCards(prevEditCards => prevEditCards.map(prevCard => {
                return prevCard.card_id === updatedCard.card_id ? updatedCard : prevCard;
            }));
        }

        const newInputs = flashcardsArray.map((flashcard, i) => {
            if (i === index) {
                return { ...flashcard, [part]: event.target.value };
            }
            return flashcard;
        });
        setFlashcardsArray(newInputs);
    };

    // Hàm xử lý khi click vào nút private
    const handlePrivateClick = () => {
        // setIsPrivateSelected(true); // Đặt trạng thái của nút private thành true
        // setIsPublicSelected(false); // Đặt trạng thái của nút public thành false
        setIsPublic('false')
    };

    // Hàm xử lý khi click vào nút public
    const handlePublicClick = () => {
        // setIsPublicSelected(true); // Đặt trạng thái của nút public thành true
        // setIsPrivateSelected(false); // Đặt trạng thái của nút private thành false
        setIsPublic('true')
    };

    //post dữ liệu về BE
    const handleCompletedButtonClick = async () => {
        addCard(isClickAddCard);
        if (isClickAddCard) {
            const numberOfNewCard = flashcardsArray.length - numberOfOldCard
            flashcardsArray.slice(0, numberOfNewCard).forEach(async (card, index) => {
                const updateCardApiUrl = `http://localhost:8080/api/card/edit/${card.card_id}`;
                const responseCard = await axios.put(updateCardApiUrl, { front_text: card.front_text, back_text: card.back_text }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log({ responseCard })
            })
            if (role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/flashcard');
            }
        } else {
            editCards.forEach(async (card, index) => {
                const updateCardApiUrl = `http://localhost:8080/api/card/edit/${card.card_id}`;
                const responseCard = await axios.put(updateCardApiUrl, { front_text: card.front_text, back_text: card.back_text }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log({ responseCard })
            })
            if (role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/flashcard');
            }
        }

        // update cập nhập thông tin, mô tả, quyền truy cập
        const updateDataEditSet = {
            title: flashcardTitle,
            description: flashcardDescription,
            public: isPublic // Sử dụng giá trị is_public được lưu trong state
        }
        console.log(updateDataEditSet);
        try {
            const updateData = Request.Server.put(endPoint.editSetBySetId(set_id), updateDataEditSet)

        } catch (error) {
            console.error('Lỗi khi cập nhật set:', error.message);
            throw error;
        }
    }

    return (
        <div className='edit-set'>
            {<Header />}
            <div className="body">
                <div className="toolbar">
                    {role === 'ADMIN' ? (
                        <Link to='/admin' style={{ color: 'inherit', textDecoration: 'inherit' }}>
                            <span className='return-to-the-module'>
                                <IconButton
                                    aria-label="arrow" size="large"
                                    className="arrow-icon">
                                    <ArrowBack fontSize="inherit" />
                                </IconButton>
                                Trở về trang admin
                            </span>
                        </Link>
                    ) : (
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
                    )}
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
                        onChange={(e) => setFlashcardTitle(e.target.value)}
                    />
                    <TextField
                        className='add-description'
                        label="Thêm mô tả"
                        variant="outlined"
                        value={flashcardDescription}
                        onChange={(e) => setFlashcardDescription(e.target.value)}
                    />
                </Box>
                <div className='private-public'>
                    <span className='selecte-private-public'>Chọn quyền truy cập: </span>
                    <Button
                        className={`private ${isPublic === "false" ? 'selected' : ''}`}
                        onClick={handlePrivateClick}
                        variant="contained">
                        Riêng tư
                    </Button>
                    <Button
                        className={`public ${isPublic === "true" ? 'selected' : ''}`}
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

            </div>
        </div>
    );
}

export default EditSet; 