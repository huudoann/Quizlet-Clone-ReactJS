import axios from 'axios';


const getCardsDataFromSet = async (set_id) => {
    let token = localStorage.getItem('token');

    try {
        // Kiểm tra xem token có tồn tại không
        if (!token) {
            window.location.href("/login")
            return null
            // throw new Error('Token không tồn tại trong localStorage');
        }

        const response = await axios.get(`http://localhost:8080/${set_id}/cards`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });


        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
        throw error;
    }
};

export default getCardsDataFromSet;