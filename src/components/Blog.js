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
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/categories`
      );
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
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/posts?_embed&per_page=20&page=${page}`
      );
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
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/posts?_embed&per_page=20&page=${page}&categories=${categoryId}`
      );
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
          Blog{" "}
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
          <Sidebar categories={categories} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Blog;
