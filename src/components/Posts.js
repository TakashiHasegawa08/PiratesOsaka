import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Header from "./Header";
import Footer from "./Footer";

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/posts?_embed&per_page=20`;

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
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    fetchPosts();
  }, []);

  // Slickスライダー設定
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // PC版のスライド数
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768, // SP版の設定
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "30px", // 両側のスライドが少し見える
        },
      },
    ],
  };

  return (
    <div>
      {/* 共通ヘッダー */}
      <Header />

      {/* キービジュアル（Slickスライダー） */}
      <div className="key-visual">
        <Slider {...sliderSettings}>
          <div className="kv_slider">
            <img src="/img/PO_KV_slider01.jpg" alt="スライダー画像1" />
          </div>
          <div className="kv_slider">
            <img src="/img/PO_KV_slider02.jpg" alt="スライダー画像2" />
          </div>
          <div className="kv_slider">
            <img src="/img/PO_KV_slider03.jpg" alt="スライダー画像3" />
          </div>
          <div className="kv_slider">
            <img src="/img/PO_KV_slider04.jpg" alt="スライダー画像4" />
          </div>
        </Slider>
      </div>

      {/* 全投稿一覧（20記事） */}
      <div className="contents_inner">
        <h2 className="">すべての投稿 (最新20件)</h2>
        {posts.map((post) => {
          // サムネイル画像の取得
          const thumbnailUrl =
            post._embedded &&
            post._embedded["wp:featuredmedia"] &&
            post._embedded["wp:featuredmedia"][0]?.source_url;

          // 投稿日を取得
          const formattedDate = new Date(post.date).toLocaleDateString(
            "ja-JP",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          );

          // カテゴリーを取得
          const categories =
            post._embedded &&
            post._embedded["wp:term"] &&
            post._embedded["wp:term"][0]; // 0番目はカテゴリー情報
          const categoryLinks =
            categories &&
            categories.map((category) => (
              <a
                key={category.id}
                href={`/category/${category.slug}`}
                rel="category"
              >
                {category.name}
              </a>
            ));

          return (
            <div key={post.id} style={{ marginBottom: "20px" }}>
              {thumbnailUrl && (
                <Link to={`/post/${post.slug}`}>
                  <div className="image-wrapper">
                    <img
                      src={thumbnailUrl}
                      alt={post.title.rendered}
                      style={{
                        width: "150px",
                        height: "auto",
                        marginBottom: "10px",
                      }}
                    />
                  </div>
                </Link>
              )}
              <h2>
                <Link to={`/post/${post.slug}`}>{post.title.rendered}</Link>
              </h2>
              <p dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
              <p>投稿日: {formattedDate}</p>
              <p>カテゴリー: {categoryLinks ? categoryLinks : "未分類"}</p>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
}

export default Posts;
