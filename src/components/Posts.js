import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Header from "./Header";
import Footer from "./Footer";
import Pagination from "./Pagination";
import PostCard from "./PostCard";

// カスタム矢印コンポーネント
// カスタム「次へ」ボタンコンポーネント
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
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/posts?_embed&per_page=20&page=${page}`;
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
