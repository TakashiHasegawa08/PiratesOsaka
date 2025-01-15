import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function PostDetail() {
  const { slug } = useParams(); // URLからslugを取得
  const [post, setPost] = useState(null); // 投稿データを管理
  const [loading, setLoading] = useState(true); // ローディング状態を管理
  const [error, setError] = useState(null); // エラー状態を管理

  useEffect(() => {
    async function fetchPost() {
      try {
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/posts?_embed&slug=${slug}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.length > 0) {
          setPost(data[0]); // APIレスポンスの最初の投稿データをセット
        } else {
          setError("Post not found."); // 該当する投稿がない場合のエラーメッセージ
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error.message); // エラーをステートに保存
      } finally {
        setLoading(false); // ローディングを完了
      }
    }

    fetchPost();
  }, [slug]);

  useEffect(() => {
    // 画像にオーバーレイを動的に追加
    const images = document.querySelectorAll(".contents_inner img");

    images.forEach((img) => {
      // WordPressのmax-width: 900pxを解除
      img.style.maxWidth = "none";
      img.style.width = "100%";
      img.style.height = "auto";

      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      wrapper.style.display = "inline-block";
      wrapper.style.width = `${img.offsetWidth}px`;
      // wrapper.style.height = `${img.offsetHeight}px`;
      wrapper.style.height = `auto`;

      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);

      const overlay = document.createElement("div");
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(195, 195, 195,1)"; // 半透明のグレー
      overlay.style.pointerEvents = "none";
      overlay.style.zIndex = "1";

      wrapper.appendChild(overlay);
    });
  }, [post]); // 投稿データが更新されたときに実行

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
    post &&
    post._embedded &&
    post._embedded["wp:featuredmedia"] &&
    post._embedded["wp:featuredmedia"][0].source_url;

  return (
    <div>
      <Header />
      <div className="contents_inner">
        <h1>{post.title.rendered}</h1>
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={post.title.rendered}
            style={{ width: "100%", height: "auto" }}
          />
        )}
        <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      </div>
      <Footer />
    </div>
  );
}

export default PostDetail;
