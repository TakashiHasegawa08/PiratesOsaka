import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Sidebar({ categories }) {
  const navigate = useNavigate();
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("useEffect が実行されました");
    fetchFeaturedPosts();
  }, []);

  const fetchFeaturedPosts = async () => {
    try {
      console.log("API へリクエストを送信中...");
      const response = await fetch(
        "https://pirates-osaka.com/wp-json/custom/v1/featured-posts"
      );

      console.log("API レスポンスステータス:", response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("取得したデータ:", data);

      setFeaturedPosts(data);
    } catch (error) {
      console.error("Error fetching featured posts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/blog?category=${category.id}`);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h4>カテゴリー</h4>
        <ul className="tagWrap">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => handleCategoryClick(category)}
                className="postCategoryLink"
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section">
        <h4>注目の記事</h4>
        {loading ? (
          <p>データ取得中...</p>
        ) : error ? (
          <p style={{ color: "red" }}>エラー: {error}</p>
        ) : featuredPosts.length === 0 ? (
          <p>注目の記事がありません。</p>
        ) : (
          <ul className="pickupWrap">
            {featuredPosts
              .filter(
                (post) => post.is_featured === "1" || post.is_featured === 1
              ) // "1" か 1 の両方に対応
              .map((post) => (
                <li key={post.id}>
                  <Link to={`/post/${post.slug}`}>{post.title}</Link>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
