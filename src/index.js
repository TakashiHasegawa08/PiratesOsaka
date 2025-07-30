import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Posts from "./components/Posts"; // トップページ
import PostDetail from "./components/PostDetail"; // 個別投稿
import Music from "./components/Music";
import IllustrationWorks from "./components/IllustrationWorks";
import Blog from "./components/Blog";
import ContactPage from "./components/ContactPage";
import Event from "./components/Event";
// import CompanyProfile from "./components/CompanyProfile";
import "./components/styles/styles.scss";

function App() {
  return (
    // 本番環境・ローカル環境と、ステージング環境（サブディレクトリ）   <Router basename="/test01">
    <Router>
      <Routes>
        <Route path="/" element={<Posts />} /> {/* トップページ */}
        <Route path="/post/:slug" element={<PostDetail />} /> {/* 個別投稿 */}
        <Route path="/music" element={<Music />} /> {/* Musicページ */}
        <Route path="/illustrationWorks" element={<IllustrationWorks />} />{" "}
        {/* IllustrationWorksページ */}
        <Route path="/blog" element={<Blog />} /> {/* blogページ */}
        <Route path="/contact" element={<ContactPage />} />{" "}
        <Route path="/event" element={<Event />} /> {/* ⭐️ 追加 */}
        {/* お問い合わせページ */}
      </Routes>
    </Router>
  );
}

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
