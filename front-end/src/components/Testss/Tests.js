import React, { useState, useEffect, useRef } from 'react';
import './Tests.scss';
import { Close, Quiz, ArrowDropDown } from '@mui/icons-material';
import DropDownMenu from '../Match/DropDownMenu';
import getCardsDataFromSet from '../../utils/getCardsDataFromSet';
import { useLocation, useNavigate } from 'react-router-dom';

const Tests = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleCloseButtonClick = () => {
        navigate(`/flashcard${location.search}`);
    };


    return (
        <div className="Tests">

            <div className="header-tests">
                <div className='button-test'>
                    <Quiz color="primary"></Quiz> <span>Kiểm tra</span>
                    <ArrowDropDown color="primary"></ArrowDropDown>
                </div>

                <div className="title-tests">
                    <p>0 / 20</p>
                    <p>Vocabulary English-English</p>
                </div>

                <div className="navigation">
                    <button className="close-button" onClick={handleCloseButtonClick}><Close /></button>
                </div>
            </div>

            <div className="tests-form">
                <p>Đây là phần câu hỏi</p>
                <p className='select-term'>Chọn thuật ngữ đúng</p>
                <div className="buttons-answer">
                    <div>
                        <button>Button 1</button>
                        <button>Button 2</button>
                    </div>
                    <div>
                        <button>Button 3</button>
                        <button>Button 4</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tests;
