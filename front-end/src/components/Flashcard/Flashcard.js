import React, { useState, useEffect } from 'react';
import './Flashcard.scss'
// import axios from 'axios';
// import {Link} from "react-router-dom";
// import {connect} from "react-redux";

const Flashcard = () => {
    const [cards, setCards] = useState([{ term: '', definition: '' }]);
    const [toggleTermDefinition, setToggleTermDefinition] = useState(true);
    const [activeCard, setActiveCard] = useState(0);
    const [progress, setProgress] = useState(0);
    const [total, setTotal] = useState(0);

    const nextCard = () => {
        let next = activeCard + 1;
        if (next > total) {
            next = 0;
        }
        setActiveCard(next);
    };

    const previousCard = () => {
        let previous = activeCard - 1;
        if (previous < 0) {
            previous = total;
        }
        setActiveCard(previous);
    };

    useEffect(() => {
        // Thực hiện các thao tác khi trạng thái thay đổi, tương tự như componentDidMount và componentDidUpdate trong class component
        // Ví dụ: Gọi API để lấy dữ liệu cards
        // axios.get(BASE_URL + '/api/studysets/studysetid/' + props.match.params.studysetid)
        //   .then((response) => {
        //     console.log(response.data.studyset.cards);
        //     setCards(response.data.studyset.cards);
        //     setTotal(response.data.studyset.cards.length - 1);
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   });
    }, []);

    return (
        <div className="game">
            {/*SIDEBAR*/}
            <div className="container gamebar-main-container">
                <div className="gamebar-content-container">
                    <div className="gamebar-header-container gamebar-containers">
                        <div className="settings-container content-containers">
                            <i className="fa" aria-hidden="true">&#9664;</i>
                            {/* <Link to={"/study-set/"+this.props.params.studysetid}> */}
                            <p>Back</p>
                            {/* </Link> */}
                        </div>
                    </div>
                    <div className="gamebar-header-container gamebar-containers">
                        <div className="gamebar-header settings-container">
                            <p>CARDS</p>
                        </div>

                        <div className="gamebar-footer-container">
                            <div className="progression-bar">
                                <div className="progression-total"></div>
                                <div style={{ width: ((this.state.activeCard + 1) / (this.state.total + 1) * 100 + '%') }} className="progression-progress"></div>

                            </div>
                            <label className="Input-Label">Progress</label>
                            {this.state.activeCard + 1} of {this.state.total + 1}
                            <div className="game-buttons">
                                <button className="Side-Button">&#9654; Play</button>
                                <button className="Side-Button">&#10542; Shuffle</button>
                                <button className="Side-Button Side-Button-Primary">&#8645; Options</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-container">
                <div className="card-flashcard">
                    <div onClick={() => setToggleTermDefinition(!toggleTermDefinition)}
                        className="cardtext flip-container">
                        <div className="flipper">
                            {
                                this.state.toggleTermDefinition ?
                                    <div>
                                        <div className="front"><div className="cardBackground"><h1>{this.state.cards[this.state.activeCard].term}</h1> </div> </div>
                                        <div className="back"><div className="cardBackground"><h1>{this.state.cards[this.state.activeCard].definition}</h1> </div></div>
                                    </div> :
                                    <div className="Flip-Card-Container">
                                        <div className="back"><div className="cardBackground"><h1>{this.state.cards[this.state.activeCard].term}</h1></div></div>
                                        <div className="back"><div className="cardBackground"><h1>{this.state.cards[this.state.activeCard].definition}</h1> </div></div>
                                    </div>
                            }
                        </div>

                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }} className="row">
                        <div className="col-md-2">
                            <svg viewBox="0 0 100 100" xmlns="http://w3.org/2000/svg">
                                <circle onClick={nextCard} cx="50" cy="25" r="25" />
                            </svg>
                        </div>
                        <div className="col-md-2">
                            <svg viewBox="0 0 100 100" xmlns="http://w3.org/2000/svg">
                                <circle onClick={previousCard} cx="50" cy="25" r="25" />
                            </svg>
                        </div>

                    </div>
                </div>



                {/* <svg viewBox="0 0 200 200" xmlns="http://w3.org/2000/svg">
        <circle cx="100" cy="50" r="50"/>
        </svg> */}
            </div>

        </div>
    )
}

function mapStateToProps(state) {
    console.log(state.auth.user.username)
    return {
        username: state.auth.user.username
    }
}

export default
    // connect(mapStateToProps, {toggleSignInModal})
    (Flashcard)
