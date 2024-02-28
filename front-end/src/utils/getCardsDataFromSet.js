import axios from 'axios';


const getCardsDataFromSet = async () => {
    const set_id = 1; // chuyển thành set_id lấy từ fe khi user click chuột vào set đó
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