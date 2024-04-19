import React, { useEffect, useState } from "react";
import "./SearchResultsPage.scss";
import Header from "../Header/Header";
import SetItem from "./SetItem";
import axios from "axios";

const SearchResultsPage = () => {
  const [sets, setSets] = useState();

  let filterTitle = localStorage.getItem('filterTitle');

  useEffect(() => {
    const fetchData = async () => {
      let token = localStorage.getItem('token');
      // Kiểm tra xem token có tồn tại không
      if (!token) {
        throw new Error('Token không tồn tại trong localStorage');
      } else {
        try {
          // Thực hiện gọi API ở đây
          const response = await axios.get(`http://localhost:8080/api/set/title/${filterTitle}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setSets(response.data);
        } catch (error) {
          console.error('Lỗi khi lấy danh sách các set:', error.message);
        }
      }
    };

    fetchData();
    console.log(sets);
  }, []);

  return (
    <div className="search-results-page">
      < Header />
      <div className="search-results-page-container">
        <div className="search-results-page-header">Kết quả cho "{localStorage.getItem('filterTitle')}"</div>
        <div className="search-results-page-content">
          <span style={{ color: '#fff', fontSize: '1.5rem' }}>Danh sách học phần:</span>
          <div className="set-items">
            {sets && sets.map((set) => (
              <SetItem
                set_id={set.set_id}
                title={set.title}
                rating={set.rating}
                username={set.user}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;