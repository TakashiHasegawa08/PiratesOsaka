import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import KV from "./KV";
import Title from "./Title";
import { useLocation } from "react-router-dom";
import ScrollFadein from "./ScrollFadein";
import { Canvas } from "@react-three/fiber";
import ReCAPTCHA from "react-google-recaptcha";
import { motion, useInView } from "framer-motion";
import TopPageBG from "./TopPageBG";
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
  const [showTopArrow, setShowTopArrow] = useState(true);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const [bgImage, setBgImage] = useState("/img/BG_line_PC.png");
  const [kvBgImage, setKvBgImage] = useState("/img/space_pc.png");
  // const scrollRef = useRef(0);

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

  const [token, setToken] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "株式会社PO";

    const cf7Script = document.createElement("script");
    cf7Script.src =
      "https://p-o.ltd/wp-content/plugins/contact-form-7/includes/js/index.js";
    cf7Script.async = true;
    document.body.appendChild(cf7Script);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (token) => {
    const formPayload = new FormData();
    formPayload.append("your-name", formData.name);
    formPayload.append("your-email", formData.email);
    formPayload.append("your-message", formData.message);
    formPayload.append("g-recaptcha-response", token);

    try {
      const response = await fetch(
        "https://p-o.ltd/wp-json/contact-form-7/v1/contact-forms/67/feedback",
        {
          method: "POST",
          body: formPayload,
        },
      );
      const result = await response.json();
      setMessage(
        result.status === "mail_sent"
          ? "お問い合わせが送信されました。"
          : "送信に失敗しました。",
      );
    } catch (error) {
      console.error("送信エラー:", error);
      setMessage("送信中にエラーが発生しました。");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("reCAPTCHA認証が必要です。");
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append("your-name", formData.name);
      formPayload.append("your-email", formData.email);
      formPayload.append("your-message", formData.message);
      formPayload.append("g-recaptcha-response", token);

      const res = await fetch(
        "https://p-o.ltd/wp-json/contact-form-7/v1/contact-forms/67/feedback",
        {
          method: "POST",
          body: formPayload,
        },
      );
      const result = await res.json();

      setMessage(
        result.status === "mail_sent"
          ? "お問い合わせが送信されました。"
          : "送信に失敗しました。",
      );
    } catch (err) {
      console.error(err);
      setMessage("送信中にエラーが発生しました。");
    }
  };

  const location = useLocation();

  useEffect(() => {
    const introEl = document.getElementById("intro");
    if (!introEl) return;

    const getIntroTop = () => {
      const rect = introEl.getBoundingClientRect();
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      return rect.top + y; // introの「ページ内」トップ座標
    };

    let introTop = getIntroTop();
    let rafId = null;

    const update = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;

      // ✅ introより上だけ表示
      setShowTopArrow(y < introTop);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        update();
      });
    };

    const onResize = () => {
      // レイアウト変化でintro位置がズレるので再計算
      introTop = getIntroTop();
      update();
    };

    // 初期化
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

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

  // useEffect(() => {
  //   const updateBackground = () => {
  //     if (window.innerWidth <= 768) {
  //       setBgImage("/img/BG_line_sp.png");
  //     } else {
  //       setBgImage("/img/BG_line_PC.png");
  //     }
  //   };

  //   // 初期実行
  //   updateBackground();

  //   // リサイズ監視
  //   window.addEventListener("resize", updateBackground);

  //   return () => {
  //     window.removeEventListener("resize", updateBackground);
  //   };
  // }, []);

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

  const MainTitle = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
      <div className="topTitle_wrap" ref={ref}>
        {/* <motion.h1
          className="topTitle"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          P <span className="oTxt">O</span>
        </motion.h1> */}
        {/* <p className="ja">株式会社PO</p> */}
      </div>
    );
  };

  useEffect(() => {
    document.body.classList.add("top-page");

    return () => {
      document.body.classList.remove("top-page");
    };
  }, []);

  return (
    <div className="TopPage" id="TOP">
      {/* <section id="KV" className="js_kv">
        {" "}
        <div
          className="kv-bg"
          style={{
            backgroundImage: `url(${kvBgImage})`,
          }}
        >
          <p className="topName">PO Co., Ltd.</p>
          <p className="catchCopy">Be Unique!</p>
          <div className="canvasBoard">
            <Canvas camera={{ position: [0, 0, 20], fov: 1500 }}>
              <ambientLight intensity={2.0} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} />
              <hemisphereLight intensity={1.0} groundColor="white" />
              <KV />
            </Canvas>
          </div>{" "}
        </div>
      </section> */}
      <section id="KV" className="js_kv">
        <div className="kv-bg">
          <p className="topName">PO Co., Ltd.</p>
          <p className="catchCopy">Be Unique!</p>
          <div className="canvasBoard">
            <Canvas camera={{ position: [0, 0, 20], fov: 1500 }}>
              <ambientLight intensity={2.0} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} />
              <hemisphereLight intensity={1.0} groundColor="white" />
              <KV />
            </Canvas>
          </div>
        </div>
      </section>
      {/* <div
        className="TopPageBG header-fadein js-header-fadein"
        style={{ backgroundImage: `url("${bgImage}")` }}
      ></div>{" "} */}
      <TopPageBG />
      <div className="header-fadein js-header-fadein">
        <Header />
      </div>
      <div className="header-fadein js-header-fadein">
        <a href="#TOP" className="topBtn">
          <p className="txt arrow">
            <img src="/img/topBtn.svg" alt="" />
          </p>
          <p className="txt">TOP</p>
        </a>
      </div>
      <ScrollFadein />
      {showTopArrow && (
        <a href="#intro" className="topArrow">
          <div className="inner">
            <p className="txt">Scroll</p>
            <picture className="arrow">
              <img src="/img/PO_topArrow.svg" alt="" />
            </picture>
          </div>
        </a>
      )}
      <div className="TopWrap scrollContainer">
        {/* イントロ */}
        <section id="intro">
          <div className="contents_inner">
            <MainTitle />
            <p className="catchLead js-fadein">
              株式会社
              <ruby>
                PO<rt>ピーオー</rt>
              </ruby>
              は、
              <br className="PC-only" />
              クリエイティブエージェンシーです。
              <br className="PC-only" />
              広告の<span className="red">グラフィックデザイン</span>
              や<br className="PC-only" />
              <span className="red">WEBサイト</span>・
              <span className="red">WEBアプリ</span>の制作を手掛けています。
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
                {/* プロジェクト01 TaskTime */}
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
                {/* プロジェクト02 ワタクシゴト */}
                <div className="contentBox Box1 js-fadein">
                  <div className="visual">
                    <a
                      href="https://www.watakushigoto.work/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hoverEffect"
                    >
                      <img src="/img/board_WM.jpg" alt="" />
                    </a>
                  </div>
                  <p className="name">ワタクシゴト（YouTubeチャンネル）</p>
                  <p className="lead">
                    <span className="red">「ワタシとシゴト」</span>
                    というテーマで1人のゲストをお迎えし、「この仕事を選んだきっかけ」や「どんな想いで現在に至ったのか」などを伺う
                    <span className="red">YouTubeチャンネルの制作・運営</span>
                    を行なっています。 <br className="" />
                    出演者の方々、それぞれの人生を「過去・いま・未来」の3つの視点から紐解き、一人ひとりのリアルなストーリーをお届けします。
                  </p>
                </div>
              </div>

              <div className="contentBoxWrap">
                {/* プロジェクト03 BuyCycle */}
                <div className="contentBox Box1 js-fadein">
                  <div className="visual">
                    <a
                      href="https://apps.apple.com/jp/app/buycycle/id6758200587"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hoverEffect"
                    >
                      <img src="/img/board_BC.jpg" alt="" />
                    </a>
                  </div>
                  <p className="name">BuyCycle 買い物iPhoneアプリ</p>
                  <p className="lead">
                    <span className="red">BuyCycle</span>
                    は、
                    <span className="red">毎日の買い物をシンプルに管理</span>
                    できるリストアプリです。
                    <br className="" />
                    「買うもの」と「家にあるもの」を分けて管理でき、ボタン操作やドラッグ操作で直感的に整理できます。毎日の小さな買い物を、迷わず、ストレスなく。常に自然になじむ買い物管理をサポートします。
                  </p>
                </div>
              </div>

              <div className="contentBoxWrap">
                {/* プロジェクト02 Geminids2 */}
                <div className="contentBox js-fadein">
                  <div className="visual">
                    <a
                      href="https://geminids2.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hoverEffect"
                    >
                      <img src="/img/board_Gemi.jpg" alt="" />
                    </a>
                  </div>
                  <div className="banner_exWrap">
                    <p className="name">Geminids2</p>
                    <p className="lead">
                      「宇宙でライブしたい！」がコンセプトのガールズボーカルユニット。T.HASEによるトータルプロデュース。
                    </p>
                  </div>
                </div>
                {/* プロジェクト03 Pirates Books */}
                <div className="contentBox js-fadein">
                  <div className="visual">
                    <a
                      href="https://piratesbooks.lovesick.jp/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hoverEffect"
                    >
                      <img src="/img/board_PB.jpg" alt="" />
                    </a>
                  </div>
                  <div className="banner_exWrap">
                    <p className="name">Pirates Books</p>
                    <p className="lead">
                      作家：黒澤優子　編集者：金川信亮　発行者：長谷川崇
                      によるユニットで本をつくりました。
                    </p>
                  </div>
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

        <section id="sugPage">
          <div className="contents_inner">
            <ul className="linkWrap">
              <li className="linkList">
                <a href="/music" className="sugPageLink hoverEffect">
                  <Title>Music</Title>
                  <picture className="icon">
                    <img src="/img/subpage01.svg" alt="" />
                  </picture>
                </a>
              </li>
              <li className="linkList">
                <a
                  href="/illustrationWorks"
                  className="sugPageLink hoverEffect"
                >
                  <Title>Illustration</Title>
                  <picture className="icon">
                    <img src="/img/subpage02.svg" alt="" />
                  </picture>
                </a>
              </li>
              <li className="linkList">
                <a href="/blog" className="sugPageLink hoverEffect">
                  <Title>Blog</Title>
                  <picture className="icon">
                    <img src="/img/subpage03.svg" alt="" />
                  </picture>
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* プロフィール */}
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
                      創り人。／
                      <a href="/music">Music Works</a>／
                      <a href="/illustrationWorks">Illustration Works</a>／
                      <a
                        href="https://geminids2.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Geminids2プロデューサー
                      </a>
                      ／
                      <a
                        href="http://goo.gl/e8qFP6"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        イラストのInstagram
                      </a>
                      ／
                      <a
                        href="https://x.gd/yDLUh"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        YouTube
                      </a>
                      ／
                      <a
                        href="https://x.gd/7VJSj"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ラガマフィン（バンド：Bass担当）
                      </a>
                      ／
                      <a
                        href="https://iwashiz.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        FCイワシーズ所属（フットサルチーム）
                      </a>
                      ／ガンバ大阪サポーター
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
                    <p className="name">ハンザキ</p>
                    <p className="nameEn">Hanzaki</p>
                    <p className="txt">デザイナー</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* アナウンス */}
        {/* <section id="announce">
          <div className="contents_inner">
            <Title>
              Ann<span className="oTxt">O</span>unce
            </Title>
            <div className="contentBoxWrap wrap02">
              <div className="contentBox Box1">
                <div className="visual">
                  <a
                    href="https://iwashiz.com/"
                    className="addBanner hoverEffect"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/img/announce01.jpg" alt="" />
                  </a>
                </div>
                <div className="banner_exWrap">
                  <p className="name">FCイワシーズ</p>
                  <p className="lead">
                    東京都品川区で活動している、初心者向けのフットサルチームです。メンバーを募集しているので、お気軽にお問い合わせください。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* 会社概要／問い合わせ */}
        <section id="companyProfilePage">
          <div className="contents_inner">
            <Title>
              C<span className="oTxt">O</span>mpany
            </Title>
            <div className="company-profile_wrap">
              <div className="company-profile js-fadein">
                <div className="profile-item">
                  <div className="tag">Company Name</div>
                  <br className="" />
                  <div className="content">
                    株式会社
                    <ruby>
                      PO<rt>ピーオー</rt>
                    </ruby>
                    <span className="sub">
                      （旧社名：株式会社パイレーツ大阪）
                    </span>
                  </div>
                </div>
                <br className="" />

                <div className="profile-item">
                  <div className="tag">Representative</div>
                  <br className="" />
                  <div className="content">長谷川 崇</div>
                </div>
                <br className="" />

                <div className="profile-item">
                  <div className="tag">Established</div>
                  <br className="" />
                  <div className="content">2008年 8月12日</div>
                </div>
                <br className="" />
                <div className="profile-item">
                  <div className="tag">Number of employees</div>
                  <br className="" />
                  <div className="content">2名</div>
                </div>
                <br className="" />

                <div className="profile-item">
                  <div className="tag">Business Description</div>
                  <br className="" />
                  <div className="content">
                    <ul>
                      <li>・WEBサイト・アプリ制作</li>
                      <li>・グラフィックデザイン制作</li>
                      <li>・イラストレーション制作</li>
                      <li>・広告企画全般のプランニング</li>
                      <li>・音楽制作・プロデュース業務</li>
                      <li>・出版事業</li>
                      <li>・イベント制作</li>
                      <li>・映像制作 他</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* Contact Form */}
            <div className="contact-formBox">
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
                    <ReCAPTCHA
                      sitekey="6Le2ES4sAAAAAM-itrRzxzKt7tUJWk9nNjPZklsy" // ←WEBサイトキー
                      onChange={(value) => setToken(value)}
                    />
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
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Posts;
