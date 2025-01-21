import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function PostCard({ post }) {
  const [excerptLength, setExcerptLength] = useState(100); // 初期値をPC用に設定

  // 画面幅に応じて文字数を変更
  useEffect(() => {
    const updateExcerptLength = () => {
      if (window.innerWidth <= 768) {
        setExcerptLength(50); // SP用
      } else {
        setExcerptLength(100); // PC用
      }
    };

    updateExcerptLength();
    window.addEventListener("resize", updateExcerptLength);
    return () => window.removeEventListener("resize", updateExcerptLength);
  }, []);

  const thumbnailUrl =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "/img/postDummy.jpg";

  const formattedDate = new Date(post.date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const categories = post._embedded?.["wp:term"]?.[0] || [];
  const categoryLinks = categories.map((category) => (
    <Link
      key={category.id}
      to={`/blog?category=${category.slug}`}
      className="postCategoryLink"
    >
      {category.name}
    </Link>
  ));

  // 文字数制限を適用した要約文
  const getExcerpt = () => {
    const plainText = post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, ""); // HTMLタグを削除
    return plainText.length > excerptLength
      ? plainText.substring(0, excerptLength) + "..."
      : plainText;
  };

  return (
    <div className="post">
      <Link to={`/post/${post.slug}`}>
        <div className="image-wrapper">
          <img
            src={thumbnailUrl}
            alt={post.title.rendered || "No Image Available"}
          />
        </div>

        <h3 className="title">
          <Link to={`/post/${post.slug}`}>{post.title.rendered}</Link>
        </h3>
        <div className="post-excerpt">
          <p>{getExcerpt()}</p>
        </div>
      </Link>
      <p className="postDate">{formattedDate}</p>
      <p className="postCategory">
        {categoryLinks.length > 0 ? categoryLinks : "未分類"}
      </p>
    </div>
  );
}

export default PostCard;
