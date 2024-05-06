import React, { useEffect, useState } from "react";
import "./SearchResultsPage.scss";
import Header from "../Header/Header";
import SetItem from "./SetItem";
import axios from "axios";
import { Pagination } from "@mui/material";

const SearchResultsPage = () => {
  const [sets, setSets] = useState();
  const [page, setPage] = useState(0);
  const filterTitle = localStorage.getItem("filterTitle");
  const [totalPages, setTotalPages] = useState(0);

  const handleChangePage = (event, value) => {
    console.log(value);
    setPage(value - 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      let token = localStorage.getItem("token");
      // Kiểm tra xem token có tồn tại không
      if (!token) {
        throw new Error("Token không tồn tại trong localStorage");
      } else {
        try {
          // Thực hiện gọi API ở đây
          const response = await axios.get(
            `http://localhost:8080/api/set/title/${filterTitle}?page=${page}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSets(response.data.content);
          setTotalPages(response.data.totalPages);
          console.log(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách các set:", error.message);
        }
      }
    };

    fetchData();
    console.log(sets);
  }, [page]);

  return (
    <div className="search-results-page">
      <Header />
      <div className="search-results-page-container">
        <div className="search-results-page-header">
          Kết quả cho "{localStorage.getItem("filterTitle")}"
        </div>
        <div className="search-results-page-content">
          <span style={{ color: "#fff", fontSize: "1.5rem" }}>
            Danh sách học phần:
          </span>
          <div className="set-items">
            {sets &&
              sets.map((set) => (
                <SetItem
                  set_id={set.setId}
                  public={set.public}
                  ownerName={set.ownerName}
                  description={set.description}
                  title={set.title}
                  rating={set.rating}
                  username={set.user}
                />
              ))}
          </div>
        </div>
      </div>
      {totalPages > 1 && (
        <Pagination
          className="pagination"
          count={totalPages}
          color="primary"
          onChange={handleChangePage}
        />
      )}
    </div>
  );
};

export default SearchResultsPage;
