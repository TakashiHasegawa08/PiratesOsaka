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
      // 現在の投稿を取得
      const apiUrl = `https://pirates-osaka.com/wp-json/wp/v2/posts?_embed&slug=${slug}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.length > 0) {
        const currentPost = data[0];
        setPost(currentPost); // 現在の投稿をセット

        const currentDate = currentPost.date;

        // 前の投稿（現在より古い投稿を降順で1件取得）
        const prevRes = await fetch(
          `https://pirates-osaka.com/wp-json/wp/v2/posts?_embed&per_page=1&order=desc&orderby=date&before=${currentDate}`
        );
        const prevData = await prevRes.json();
        setPrevPost(prevData.length > 0 ? prevData[0] : null);

        // 次の投稿（現在より新しい投稿を昇順で1件取得）
        const nextRes = await fetch(
          `https://pirates-osaka.com/wp-json/wp/v2/posts?_embed&per_page=1&order=asc&orderby=date&after=${currentDate}`
        );
        const nextData = await nextRes.json();
        setNextPost(nextData.length > 0 ? nextData[0] : null);
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
      `<div className="responsive-video"><iframe $1></iframe></div>`
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

      <div className="contents_inner" id="blog">
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
