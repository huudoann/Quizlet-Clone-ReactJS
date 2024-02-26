import getCardsDataFromSet from '../../utils/requestCard';

const flashcards = await getCardsDataFromSet();
console.log(flashcards)


const flashcardDemoData = {
    subject: 'English Vocabulary',
    flashcards,
    creator: { name: 'test', avatar: 'https://via.placeholder.com/40' },
};

export default flashcardDemoData;