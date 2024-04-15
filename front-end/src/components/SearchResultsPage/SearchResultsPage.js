import React, { useEffect, useState } from "react";
import "./SearchResultsPage.scss";
import Header from "../Header/Header";
import SetItem from "./SetItem";
import axios from "axios";

const sets = [
  {
    title: "vocab",
    numberOfWords: "6",
    rating: "4",
    username: "Nguyen Quoc Khanh"
  },
  {
    title: "vocab",
    numberOfWords: "12",
    rating: "5",
    username: "Nguyen Van Hai"
  },
  {
    title: "vocab",
    numberOfWords: "12",
    rating: "5",
    username: "Nguyen Van Hai"
  },
  {
    title: "vocab",
    numberOfWords: "12",
    rating: "5",
    username: "Nguyen Van Hai"
  }
]


const SearchResultsPage = () => {
  const [sets, setSets] = useState();

  useEffect(() => {
    const fetchData = async () => {
      let token = localStorage.getItem('token');

      // Kiểm tra xem token có tồn tại không
      if (!token) {
        throw new Error('Token không tồn tại trong localStorage');
      } else {
        try {
          // Thực hiện gọi API ở đây
          const response = await axios.get(`http://localhost:8080/api/set/get-all-sets`, {
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
  }, []);

  return (
    <div className="search-results-page">
      < Header />
      <div className="search-results-page-container">
        <div className="search-results-page-header">Kết quả cho "vocab"</div>
        <div className="search-results-page-content">
          Học phần
          <div className="set-items">
            {sets && sets.map((set) => (
              <SetItem
                key={set.id} // Đảm bảo sử dụng key duy nhất cho mỗi phần tử trong map
                title={set.title}
                numberOfWords={set.numberOfWords}
                rating={set.rating}
                username={set.username}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;