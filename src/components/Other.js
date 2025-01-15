// src/components/Other.js
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function Other() {
  return (
    <div>
      {/* 共通ヘッダー */}
      <Header />

      {/* ページコンテンツ */}
      <main className="contents_inner">
        <h1>Other Page</h1>
        <p>このページは下層ページの雛形として使用できます。</p>
      </main>

      {/* 共通フッター */}
      <Footer />
    </div>
  );
}

export default Other;
