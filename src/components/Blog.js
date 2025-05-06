// Blog.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Pagination from "./Pagination";
import Sidebar from "./Sidebar";
import PostCard from "./PostCard";
import Title from "./Title";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  document.title = "Blog | 株式会社パイレーツ大阪";

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get("category");
    if (categoryId) {
      setSelectedCategory(categoryId);
      fetchPostsByCategory(categoryId, currentPage);
    } else {
      fetchPosts(currentPage);
    }
  }, [location.search, currentPage]);

  const fetchCategories = async () => {
    try {
      // 環境変数を削除し、API URL を直接指定
      const apiUrl = `https://pirates-osaka.com/wp-json/wp/v2/categories`;
      console.log("Fetching categories from:", apiUrl); // デバッグ用

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPosts = async (page) => {
    try {
      // 環境変数を削除し、API URL を直接指定
      const apiUrl = `https://pirates-osaka.com/wp-json/wp/v2/posts?_embed&per_page=20&page=${page}`;
      console.log("Fetching posts from:", apiUrl); // デバッグ用

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const total = response.headers.get("X-WP-TotalPages");
      setTotalPages(Number(total));
      const data = await response.json();
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchPostsByCategory = async (categoryId, page) => {
    try {
      // 環境変数を削除し、API URL を直接指定
      const apiUrl = `https://pirates-osaka.com/wp-json/wp/v2/posts?_embed&per_page=20&page=${page}&categories=${categoryId}`;
      console.log("Fetching posts by category from:", apiUrl); // デバッグ用

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const total = response.headers.get("X-WP-TotalPages");
      setTotalPages(Number(total));
      const data = await response.json();
      setFilteredPosts(data);
    } catch (error) {
      console.error("Error fetching posts by category:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (selectedCategory) {
      fetchPostsByCategory(selectedCategory, page);
    } else {
      fetchPosts(page);
    }
  };

  return (
    <div id="blogPage">
      <Header />
      <div className="contents_inner">
        <Title>
          Bl<span className="oTxt">O</span>g{" "}
          {selectedCategory && (
            <span>
              -{" "}
              {
                categories.find(
                  (category) => category.id === Number(selectedCategory)
                )?.name
              }
            </span>
          )}
        </Title>
        <div className="layout">
          <div className="postBox">
            <div className="postWrap">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <div className="paginationWrap">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
          <Sidebar categories={categories} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Blog;
