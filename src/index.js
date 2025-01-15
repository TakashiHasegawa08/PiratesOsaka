import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Posts from "./components/Posts"; // トップページ
import PostDetail from "./components/PostDetail"; // 個別投稿
import Other from "./components/Other"; // Otherページ
import Music from "./components/Music"; // Musicページ
import IllustrationWorks from "./components/IllustrationWorks"; // IllustrationWorksページ
import "./components/styles/styles.scss";

function App() {
  return (
    // 本番環境・ローカル環境と、ステージング環境（サブディレクトリ）切り替え   <Router basename="/test01">
    <Router>
      <Routes>
        <Route path="/" element={<Posts />} /> {/* トップページ */}
        <Route path="/post/:slug" element={<PostDetail />} /> {/* 個別投稿 */}
        <Route path="/other" element={<Other />} /> {/* Otherページ */}
        <Route path="/music" element={<Music />} /> {/* Musicページ */}
        <Route path="/illustrationWorks" element={<IllustrationWorks />} />{" "}
        {/* IllustrationWorksページ */}
      </Routes>
    </Router>
  );
}

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
