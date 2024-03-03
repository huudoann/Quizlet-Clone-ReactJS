import React from "react";
import "./Tos.scss";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Tos = () => {
    return (
        <div className="tos">
            <Header />
            
            <h1>Điều khoản sử dụng</h1>
            <h2>1. Chấp nhận điều khoản</h2>
            <p>
                Khi bạn sử dụng trang web của chúng tôi, bạn đồng ý với các điều khoản dịch vụ của chúng tôi.
                Vui lòng đọc kỹ các điều khoản dưới đây.
            </p>
            <h2>2. Cập nhật</h2>
            <p>
                Chúng tôi có thể cập nhật hoặc thay đổi các điều khoản dịch vụ này mà không cần thông báo trước.
                Bạn nên kiểm tra điều khoản dịch vụ này thường xuyên để cập nhật thông tin mới nhất.
            </p>
            <h2>3. Liên kết đến trang web của bên thứ ba</h2>
            <p>
                Trang web của chúng tôi có thể chứa liên kết đến các trang web của bên thứ ba hoặc dịch vụ không thuộc quyền quản lý của chúng tôi.
                Chúng tôi không chịu trách nhiệm về nội dung, chính sách bảo mật hoặc các hoạt động của bất kỳ trang web hoặc dịch vụ nào không thuộc quyền quản lý của chúng tôi.
            </p>
            <h2>4. Liên hệ</h2>
            <p>
                Nếu bạn có bất kỳ câu hỏi nào về các điều khoản dịch vụ này, vui lòng liên hệ với chúng tôi.
            </p>

            <Footer />
        </div>
    );
}

export default Tos;