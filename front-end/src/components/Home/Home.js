import React, { useState } from 'react';
import './Home.scss';
import { Link } from 'react-router-dom';

const Home = () => {
  // thêm logic của 2 nút
  // sửa img cho full trang

  return (

    <div className="home">
      <header>

        {/* Phần slash của Home trong trang Header.js và Quizlet trong trang Home.js đang đảo nhau để fake đăng nhập */}

        <Link to="/" style={{ color: 'inherit', textDecoration: 'inherit' }}>
          <div className="name-app">Quizlet</div>
        </Link>

        <div className="button-register-login">
          <Link to="/signup" style={{ color: 'inherit', textDecoration: 'inherit' }}>
            <button className="register-button">Đăng ký</button>
          </Link>
          <Link to="/login" style={{ color: 'inherit', textDecoration: 'inherit' }}>
            <button className="login-button">Đăng nhập</button>
          </Link>

        </div>
      </header>
      <main>
        <div className="content">
          <img src="https://images.prismic.io/quizlet-web/1691181762152_Full-BleedImage.png?auto=format%2Ccompress&fbclid=IwAR2oJ5iFzOhnD1WAjj3z647fps2FRJ4Q0Ln7jkkjjehj2NdvHArKDadWPJs" />
          <div className="overlay">
            <h1>Thẻ ghi nhớ kỹ thuật số và <br></br> các công cụ học tốt nhất</h1>
            <Link to="/signup" style={{ color: 'inherit', textDecoration: 'inherit' }}>
              <button>Đăng ký miễn phí</button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;