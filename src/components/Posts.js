import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Header from "./Header";
import Footer from "./Footer";
import Pagination from "./Pagination";
import PostCard from "./PostCard";
import KV from "./KV";
import Title from "./Title";

// カスタム矢印コンポーネント
const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <p className="arrowText">
        <img src="/img/slick_arrow02.svg" alt="次へ" />
      </p>
    </div>
  );
};

const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <p className="arrowText">
        <img src="/img/slick_arrow01.svg" alt="前へ" />
      </p>
    </div>
  );
};

function Posts() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page) => {
    try {
      // 環境変数を削除してURLを直接指定
      const apiUrl = `https://pirates-osaka.com/wp-json/wp/v2/posts?_embed&per_page=20&page=${page}`;

      console.log("Fetching posts from:", apiUrl); // デバッグ用ログ

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const total = response.headers.get("X-WP-TotalPages");
      setTotalPages(Number(total));

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      alert("記事データの取得に失敗しました。管理者にお問い合わせください。");
    }
  };

  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "30px",
        },
      },
    ],
  };

  return (
    <div>
      <Header />
      <div className="contents_inner">
        <Title>Pirate Osaka</Title>
      </div>
      <KV />

      <div className="key-visual">
        <Slider {...sliderSettings}>
          <div className="kv_slider">
            <a href="/music">
              <img src="/img/PO_KV_slider01.jpg" alt="スライダー画像1" />
            </a>
          </div>
          <div className="kv_slider">
            <a
              href="https://iwashiz.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/img/PO_KV_slider03.jpg" alt="スライダー画像3" />
            </a>
          </div>

          <div className="kv_slider">
            <a
              href="https://piratesbooks.lovesick.jp/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/img/PO_KV_slider02.jpg" alt="スライダー画像2" />
            </a>
          </div>
        </Slider>
      </div>

      <div className="contents_inner">
        <h2 className="oswald_600">Blog</h2>
        <div className="postWrap">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <Footer />
    </div>
  );
}

export default Posts;
