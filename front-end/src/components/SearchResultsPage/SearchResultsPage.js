import React, { useEffect, useState } from "react";
import "./SearchResultsPage.scss";
import Header from "../Header/Header";
import SetItem from "./SetItem";

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
  // const [sets, setSets] = useState();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:8080/api/set/get-all-sets`
  //       );
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const data = await response.json();
  //       setSets(data);
  //     } catch (error) {
  //       console.error("Lỗi khi lấy dữ liệu exam-result:", error.message);
  //     }
  //   };
  //   fetchData();
  //   console.log(sets);
  // }, []);

  return (
    <div className="search-results-page">
      < Header />
      <div className="search-results-page-container">
        <div className="search-results-page-header">Kết quả cho "vocab"</div>
        <div className="search-results-page-content">
          Học phần
          <div className="set-items">
            {sets.map((set) => (
              <SetItem
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