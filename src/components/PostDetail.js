import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar"; // Sidebarコンポーネントをインポート

function PostDetail() {
  const { slug } = useParams(); // URLからslugを取得
  const [post, setPost] = useState(null); // 現在の投稿データ
  const [categories, setCategories] = useState([]); // 全カテゴリー
  const [loading, setLoading] = useState(true); // ローディング状態
  const [error, setError] = useState(null); // エラー状態
  const [prevPost, setPrevPost] = useState(null); // 前の投稿
  const [nextPost, setNextPost] = useState(null); // 次の投稿

  useEffect(() => {
    fetchPost(); // 投稿を取得
    fetchCategories(); // 全カテゴリーを取得
  }, [slug]);

  const fetchPost = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/posts?_embed&slug=${slug}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.length > 0) {
        setPost(data[0]); // 現在の投稿をセット

        // 前後の投稿を取得
        const prevNextApiUrl = `${process.env.REACT_APP_API_BASE_URL}/posts?_embed&per_page=2&order=asc&orderby=date&exclude=${data[0].id}`;
        const prevNextResponse = await fetch(prevNextApiUrl);
        const prevNextData = await prevNextResponse.json();

        // 前後の投稿をセット
        setPrevPost(prevNextData[0] || null);
        setNextPost(prevNextData[1] || null);
      } else {
        setError("Post not found.");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/categories`;
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

  if (loading) {
    return (
      <div>
        <Header />
        <div>Loading...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div>Error: {error}</div>
        <Footer />
      </div>
    );
  }

  const thumbnailUrl =
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "/img/postDummy.jpg";

  const formattedDate = new Date(post.date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const renderPostContent = () => {
    const content = post.content.rendered;

    // YouTube埋め込みをレスポンシブ対応にするため、iframeをラップ
    const responsiveContent = content.replace(
      /<iframe([^>]*)><\/iframe>/g,
      `<div class="responsive-video"><iframe $1></iframe></div>`
    );

    return (
      <div
        className="bologContents"
        dangerouslySetInnerHTML={{ __html: responsiveContent }}
      />
    );
  };

  return (
    <div id="blogPage">
      <Header />

      <div className="contents_inner">
        <div className="layout">
          <div className="postBox">
            <div className="">
              <h1 className="">{post.title.rendered}</h1>
              <div className="image-wrapper">
                <img
                  className="post-thumbnail"
                  src={thumbnailUrl}
                  alt={post.title.rendered || "No Image Available"}
                />
              </div>
              <p className="postDate">{formattedDate}</p>
              <p className="postCategory">
                {post._embedded?.["wp:term"]?.[0]?.map((category) => (
                  <Link
                    key={category.id}
                    to={`/blog?category=${category.slug}`}
                    className="postCategoryLink"
                  >
                    {category.name}
                  </Link>
                )) || "未分類"}
              </p>
              {renderPostContent()}

              {/* 前後の投稿ナビゲーション */}
              <div className="postNavigation">
                {prevPost && (
                  <Link to={`/post/${prevPost.slug}`} className="prevPost link">
                    &lt; 前の投稿: {prevPost.title.rendered}
                  </Link>
                )}
                {nextPost && (
                  <Link to={`/post/${nextPost.slug}`} className="nextPost link">
                    次の投稿: {nextPost.title.rendered} &gt;
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Sidebarコンポーネントを使用 */}
          <Sidebar
            categories={categories}
            onCategoryClick={(category) =>
              console.log("Clicked category:", category)
            }
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PostDetail;
