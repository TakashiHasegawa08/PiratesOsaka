// Sidebar.js
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Sidebar({ categories }) {
  const navigate = useNavigate();
  const [featuredPosts, setFeaturedPosts] = useState([]);

  useEffect(() => {
    fetchFeaturedPosts();
  }, []);

  const fetchFeaturedPosts = async () => {
    try {
      const response = await fetch(
        // "http://localhost:10009/wp-json/wp/v2/posts?meta_key=is_featured&meta_value=1"
        "http://localhost:10028/wp-json/wp/v2/posts?meta_key=is_featured&meta_value=1"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch featured posts");
      }
      const data = await response.json();
      setFeaturedPosts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/blog?category=${category.id}`);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h4> カテゴリー </h4>{" "}
        <ul className="tagWrap">
          {" "}
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => handleCategoryClick(category)}
                className="postCategoryLink"
              >
                {" "}
                {category.name}{" "}
              </button>{" "}
            </li>
          ))}{" "}
        </ul>{" "}
      </div>{" "}
      <div className="sidebar-section">
        <h4> 注目の記事 </h4>{" "}
        <ul className="pickupWrap">
          {" "}
          {featuredPosts.map((post) => (
            <li key={post.id}>
              <Link to={`/post/${post.slug}`}> {post.title.rendered} </Link>{" "}
            </li>
          ))}{" "}
        </ul>{" "}
      </div>{" "}
    </div>
  );
}

export default Sidebar;
