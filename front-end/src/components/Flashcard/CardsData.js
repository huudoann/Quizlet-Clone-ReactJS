import getCardsDataFromSet from '../../utils/requestCard';

// const flashcards = await getCardsDataFromSet();
// console.log(flashcards)


const CardsData = {
    subject: 'English Vocabulary',
    flashcards: [{ id: 1, front_text: 'Dog', back_text: 'A housekeeper' },
    { id: 2, front_text: 'Cat', back_text: 'A lazy animal' },
    { id: 3, front_text: 'Monkey', back_text: 'An animal can climb trees' }
    ],
    creator: { name: 'test', avatar: 'https://via.placeholder.com/40' },
};

export default CardsData;
