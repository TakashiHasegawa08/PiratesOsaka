import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  arrows: false,
};

const KVSlider = () => {
  return (
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
            href="https://geminids2.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/img/PO_KV_slider04.jpg" alt="スライダー画像4" />
          </a>
        </div>
        <div className="kv_slider">
          <a
            href="https://piratesbooks.lovesick.jp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/img/PO_KV_slider02.jpg" alt="スライダー画像3" />
          </a>
        </div>
      </Slider>
    </div>
  );
};

export default KVSlider;

//　ページに実装する際に追加
// import KVSlider from "./KVSlider";
// function YourPage() {
//   return (
//     <>
//       <KVSlider />
//     </>
//   );
// }
