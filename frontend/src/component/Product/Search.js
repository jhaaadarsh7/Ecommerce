
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Search.css";
import MetaData from "../layout/MetaData";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate(); // Use useNavigate for navigation

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/products/${keyword}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <>
    <MetaData tiile="Search a product -- Ecommrece"/>
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a product ..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </>
  );
};

export default Search;
