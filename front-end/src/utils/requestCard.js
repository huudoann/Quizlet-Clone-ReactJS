import axios from 'axios';


const getCardsDataFromSet = async () => {
    const set_id = 1; // chuyển thành set_id lấy từ fe khi user click chuột vào set đó
    let token = localStorage.getItem('token'); // Thay đổi từ localStorage sang sessionStorage

    try {
        // Kiểm tra xem token có tồn tại không
        if (!token) {
            throw new Error('Token không tồn tại trong sessionStorage'); // Thay đổi từ localStorage sang sessionStorage
        }

        const response = await axios.get(`http://localhost:8080/${set_id}/cards`, {
            headers: {
                'Authorization': `Bearer ${token}` // Gửi token giống như Bearer Token
            }
        });


        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
        throw error;
    }
};

export default getCardsDataFromSet;