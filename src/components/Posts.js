import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import KV from "./KV";
import Title from "./Title";
import { useLocation } from "react-router-dom";
import ScrollFadein from "./ScrollFadein";
import { Canvas } from "@react-three/fiber";
// import Particles from "./Particles";
// import Particles from "./Particles";
// import Pagination from "./Pagination";
// import PostCard from "./PostCard";
// import * as THREE from "three";
// import Slider from "react-slick";
// import { div } from "framer-motion/client";

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
  const [bgImage, setBgImage] = useState("/img/BG_line_PC.png");
  const [kvBgImage, setKvBgImage] = useState("/img/space_pc.png");
  // const scrollRef = useRef(0);

  // useEffect(() => {
  //   fetchPosts(currentPage);
  // }, [currentPage]);

  // const fetchPosts = async (page) => {
  //   try {
  //     const apiUrl = `https://pirates-osaka.com/wp-json/wp/v2/posts?_embed&per_page=20&page=${page}`;

  //     console.log("Fetching posts from:", apiUrl); // デバッグ用ログ

  //     const response = await fetch(apiUrl);

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const total = response.headers.get("X-WP-TotalPages");
  //     setTotalPages(Number(total));

  //     const data = await response.json();
  //     setPosts(data);
  //   } catch (error) {
  //     console.error("Error fetching posts:", error);
  //     alert("記事データの取得に失敗しました。管理者にお問い合わせください。");
  //   }
  // };

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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Pirate Osaka | 株式会社パイレーツ大阪";

    const cf7Script = document.createElement("script");
    cf7Script.src =
      "https://pirates-osaka.com/wp-content/plugins/contact-form-7/includes/js/index.js";
    cf7Script.async = true;
    document.body.appendChild(cf7Script);

    const recaptchaScript = document.createElement("script");
    recaptchaScript.src = "https://www.google.com/recaptcha/api.js";
    recaptchaScript.async = true;
    recaptchaScript.defer = true;
    document.body.appendChild(recaptchaScript);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let token = "";
    if (window.location.hostname === "localhost") {
      token = "test-token";
    } else if (window.grecaptcha) {
      try {
        token = await window.grecaptcha.execute(
          "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
          { action: "submit" }
        );
      } catch (error) {
        setMessage("reCAPTCHAの取得に失敗しました。");
        return;
      }
    } else {
      setMessage("reCAPTCHAがロードされていません。");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("your-name", formData.name);
    formPayload.append("your-email", formData.email);
    formPayload.append("your-message", formData.message);
    formPayload.append("g-recaptcha-response", token);

    try {
      const response = await fetch(
        "https://pirates-osaka.com/wp-json/contact-form-7/v1/contact-forms/67/feedback",
        {
          method: "POST",
          body: formPayload,
        }
      );
      const result = await response.json();
      setMessage(
        result.status === "mail_sent"
          ? "お問い合わせが送信されました。"
          : "送信に失敗しました。"
      );
    } catch (error) {
      setMessage("エラーが発生しました。");
    }
  };

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100); // ページ描画が落ち着いた後にスクロール
      }
    }
  }, [location]);

  useEffect(() => {
    const updateBackground = () => {
      if (window.innerWidth <= 768) {
        setBgImage("/img/BG_line_sp.png");
      } else {
        setBgImage("/img/BG_line_PC.png");
      }
    };

    // 初期実行
    updateBackground();

    // リサイズ監視
    window.addEventListener("resize", updateBackground);

    return () => {
      window.removeEventListener("resize", updateBackground);
    };
  }, []);

  useEffect(() => {
    const updateBg = () => {
      const isMobile = window.innerWidth <= 768;
      setKvBgImage(isMobile ? "/img/space_sp.png" : "/img/space_pc.png");
    };

    updateBg(); // 初回実行
    window.addEventListener("resize", updateBg);
    return () => window.removeEventListener("resize", updateBg);
  }, []);

  const headerRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      const target = document.getElementById("intro");
      const elements = document.querySelectorAll(".js-header-fadein");

      if (!target || elements.length === 0) return;

      const rect = target.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const triggerPoint =
        window.innerWidth <= 768 ? viewportHeight * 0.8 : viewportHeight * 0.7;

      // すでにある fade-in 処理
      elements.forEach((el) => {
        if (rect.top <= triggerPoint) {
          el.classList.add("show");
        } else {
          el.classList.remove("show");
        }
      });

      // ← 追加するこの部分が KV に vanish クラスを制御
      const kvElement = document.querySelector("#KV.js_kv");
      if (kvElement) {
        if (rect.top <= triggerPoint) {
          kvElement.classList.add("vanish");
        } else {
          kvElement.classList.remove("vanish");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 初回実行

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const target = document.querySelector(".catchCopy");

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const triggerPoint = window.innerHeight * 0.3;

      if (scrollY >= triggerPoint) {
        target.classList.add("show");
      } else {
        target.classList.remove("show");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 初期実行

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="TopPage">
      <section id="KV" className="js_kv">
        {" "}
        <div
          className="kv-bg"
          style={{
            backgroundImage: `url(${kvBgImage})`,
          }}
        >
          <p className="topName">Pirates Osaka</p>
          <p className="catchCopy">Be Unique!</p>
          <div className="canvasBoard">
            <Canvas camera={{ position: [0, 0, 20], fov: 1500 }}>
              <ambientLight intensity={2.0} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} />
              <hemisphereLight intensity={1.0} groundColor="white" />
              <KV />
              {/* <Particles
                scrollY={scrollRef}
                maxScroll={window.innerHeight * 2}
              /> */}
            </Canvas>
          </div>{" "}
          <div className="topArrow">
            <img src="/img/PO_topArrow.svg" alt="" />
          </div>
        </div>
      </section>
      <div
        className="TopPageBG header-fadein js-header-fadein"
        style={{ backgroundImage: `url("${bgImage}")` }}
      ></div>{" "}
      <div className="header-fadein js-header-fadein">
        <Header />
      </div>
      <ScrollFadein />
      <div className="TopWrap scrollContainer">
        {/* イントロ */}
        <section id="intro">
          <div className="contents_inner">
            <h1 className="topTitle">
              Pirates <span className="oTxt">O</span>saka
            </h1>
            <p className="catchLead js-fadein">
              私たちは、<span className="red">WEBサイト</span>や
              <span className="red">WEBアプリ</span>の制作を中心に、
              <br className="PC-only" />
              広告の<span className="red">グラフィックデザイン</span>
              までを手がける
              <br className="PC-only" />
              クリエイティブエージェンシーです。
              <br className="" />
              <br className="" />
              「かっこいい」や「使いやすい」にくわえて
              <br className="PC-only" />
              見る人の記憶に残る、
              <span className="bold">ちょっと変わった、おもしろい</span>
              ものを。
              <br className="" />
              <br className="" />
              <span className="bold">遊び心</span>と
              <span className="bold">アイデア</span>を大切にしながら、
              <br className="" />
              <span className="red">Be Unique!</span>
              をモットーに、
              <br className="PC-only" />
              私たちは日々、モノづくりに取り組んでいます。
            </p>
          </div>
        </section>
        {/* プロジェクト */}
        <section id="project">
          <div className="contents_inner">
            <Title>
              Pr<span className="oTxt">O</span>ject
            </Title>
            <div className="contentAll">
              <div className="contentBoxWrap">
                {/* TaskTime */}
                <div className="contentBox Box1 js-fadein">
                  <div className="visual">
                    <a
                      href="https://tasktime.tech/trial/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hoverEffect"
                    >
                      <img src="/img/board_TT.jpg" alt="" />
                    </a>
                  </div>
                  <p className="name">
                    TaskTime｜チームのためのタスク・スケジュール・カレンダー管理アプリ
                  </p>
                  <p className="lead">
                    <span className="red">
                      スケジュール×工数管理のカレンダーアプリ『TaskTime』
                    </span>
                    をリリースしました！タスクもスケジュールも、ガントチャートで一元管理。チーム全体の予定と作業時間を「見える化」して、ムダを削減、効率UP！
                    <span className="red">無料</span>
                    で使える、シンプルなのに高機能なタスク管理ツールをぜひご体験ください。
                  </p>
                  <p className="lead">
                    <span className="subLead">＊開発技術・要件＊</span>
                    <br />
                    <span className="bold">フロントエンド：</span>
                    <span className="red">React</span>
                    <br />
                    <span className="ex">
                      ・React DnD によるドラッグ＆ドロップ対応
                      <br />
                      ・react-datepicker を用いた日付選択
                      <br />
                      ・GSAP + ScrollTrigger によるアニメーション表現
                      <br />
                      ・Three.js (@react-three/fiber) による3Dロゴ演出
                      <br />
                    </span>
                  </p>
                  <p className="lead">
                    <span className="bold">バックエンド：</span>
                    <span className="red">Firebase</span>
                    <br />
                    <span className="ex">
                      ・Firestore：リアルタイムデータベース
                      <br />
                      ・Authentication：Googleログイン対応
                      <br />
                      ・Cloud
                      Functions：管理者によるユーザー作成やメール送信処理
                      <br />
                      ・Storage：アセット管理 Hosting：デプロイ先として使用
                      <br />
                    </span>
                  </p>
                  <p className="lead">
                    主な機能 <br />
                    <span className="ex">
                      ・プロジェクト／タスク登録＆編集（ガントチャート形式）
                      <br />
                      ・担当者別の工数（時間）入力と集計
                      <br />
                      ・管理者ダッシュボード、メンバーの招待と認証管理
                      <br />
                      ・セキュリティに配慮したログイン機能（Firebase
                      Authentication 採用）
                    </span>
                  </p>
                </div>
              </div>
              <div className="contentBoxWrap">
                <div className="contentBox js-fadein">
                  <div className="visual">
                    <img src="/img/board_TT.jpg" alt="" />
                  </div>
                  <p className="name">
                    TaskTime｜チームのためのタスク・スケジュール・カレンダー管理アプリ
                  </p>
                  <p className="lead">
                    スケジュール×工数管理アプリ『TaskTime』をリリースしました！タスクもスケジュールも、ガントチャートで一元管理。チーム全体の予定と作業時間を「見える化」して、ムダを削減、効率UP！無料で使える、シンプルなのに高機能なタスク管理ツールをぜひご体験ください。
                  </p>
                </div>
                <div className="contentBox js-fadein">
                  <div className="visual">
                    <img src="/img/board_TT.jpg" alt="" />
                  </div>
                  <p className="name">
                    TaskTime｜チームのためのタスク・スケジュール・カレンダー管理アプリ
                  </p>
                  <p className="lead">
                    スケジュール×工数管理アプリ『TaskTime』をリリースしました！タスクもスケジュールも、ガントチャートで一元管理。チーム全体の予定と作業時間を「見える化」して、ムダを削減、効率UP！無料で使える、シンプルなのに高機能なタスク管理ツールをぜひご体験ください。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="add">
          <div className="contents_inner">
            <p className="catchLead">
              仕事のご相談やグラフィックデザインなどの制作事例をご覧になりたい方は
              <br className="" />
              <a href="#form">お問い合わせ</a>からお気軽にご連絡ください。
            </p>
          </div>
        </section>

        {/* スタッフ紹介 */}
        <section id="profile">
          <div className="contents_inner">
            <Title>
              Pr<span className="oTxt">O</span>file
            </Title>
            <div className="profileBox">
              <ul className="profileWrap">
                {/* 01　長谷川 */}
                <li className="profileList js-fadein">
                  <picture className="visual">
                    <img src="/img/PO_staff00.png" alt="" />
                  </picture>
                  <div className="exWrap">
                    <p className="credit">Producer</p>
                    <p className="name">長谷川 崇＠T.HASE</p>
                    <p className="nameEn">Hasegawa Takashi</p>
                    <p className="txt">
                      自己紹介文自己紹介文自己紹介文自己紹介文 自己紹介文
                      自己紹介文 自己紹介文 自己紹介文 自己紹介文 自己紹介文
                      自己紹介文
                    </p>
                  </div>
                </li>
                {/* 02　ハンザキシンタロウ */}
                <li className="profileList js-fadein">
                  <picture className="visual">
                    <img src="/img/PO_staff01.png" alt="" />
                  </picture>
                  <div className="exWrap">
                    <p className="credit">Creative Director</p>
                    <p className="name">ハンザキシンタロウ</p>
                    <p className="nameEn">Shintaro Hanzaki</p>
                    <p className="txt">coming soon!!!</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* アナウンス */}
        <section id="announce">
          <div className="contents_inner">
            <Title>
              Ann<span className="oTxt">O</span>unce
            </Title>
            <div className="contentBoxWrap wrap02">
              <div className="contentBox Box1">
                <a href="https://iwashiz.com/" className="addBanner">
                  <img src="/img/announce01.jpg" alt="" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 会社概要／問い合わせ */}
        <section id="companyProfilePage">
          <div className="contents_inner">
            <Title>
              C<span className="oTxt">O</span>mpany
            </Title>

            <div className="company-profile js-fadein">
              <div className="profile-item">
                <div className="tag">Company Name</div>
                <div className="content">株式会社パイレーツ大阪</div>
              </div>

              <div className="profile-item">
                <div className="tag">Representative</div>
                <div className="content">長谷川 崇</div>
              </div>

              <div className="profile-item">
                <div className="tag">Established</div>
                <div className="content">2008年 8月12日</div>
              </div>
              <div className="profile-item">
                <div className="tag">Number of employees</div>
                <div className="content">2名</div>
              </div>

              <div className="profile-item">
                <div className="tag">Business Description</div>
                <div className="content">
                  <ul>
                    <li>・WEBサイト・アプリ制作</li>
                    <li>・グラフィックデザイン制作</li>
                    <li>・イラストレーション制作</li>
                    <li>・広告企画全般のプランニング</li>
                    <li>・音楽制作・プロデュース業務</li>
                    <li>・出版事業</li>
                    <li>・イベント制作</li>
                    <li>・映像制作 ほか</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form" id="form">
              <Title>
                C<span className="oTxt">O</span>ntact Us
              </Title>
              <form onSubmit={handleSubmit}>
                <div className="formWrap">
                  <p>
                    <span className="tag">お名前（必須）</span>
                    <br />
                    <input
                      type="text"
                      id="your-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </p>
                </div>

                <div className="formWrap">
                  <p>
                    <span className="tag">メールアドレス（必須）</span>
                    <br />
                    <input
                      type="email"
                      id="your-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </p>
                </div>

                <div className="formWrap">
                  <p>
                    <span className="tag">メッセージ本文</span>
                    <br />
                    <textarea
                      id="your-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </p>
                </div>

                <div className="formWrap">
                  <div
                    className="g-recaptcha"
                    // data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // テスト用キー　 本番環境時に変更
                    data-sitekey="6LcV_SMaAAAAAI3PxzsZ9Ad3RkdPb-jqzrpz25w8" // 本番
                    data-size="invisible"
                  ></div>
                </div>

                <button type="submit">送信</button>
              </form>
              <p className="recaptcha-note">
                このサイトは reCAPTCHA によって保護されています。
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  プライバシーポリシー
                </a>{" "}
                と
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  利用規約
                </a>{" "}
                が適用されます。
              </p>
              {message && <p className="message">{message}</p>}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Posts;
