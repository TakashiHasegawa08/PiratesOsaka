import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Title from "./Title";
import { Helmet } from "react-helmet";

function Event() {
  return (
    <div id="eventPage">
      <Helmet>
        <title>Event | 株式会社パイレーツ大阪</title>
        <meta property="og:title" content="Event | 株式会社パイレーツ大阪" />
        <meta
          property="og:description"
          content="イベント情報をご紹介します。"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pirates-osaka.com/event" />
        <meta
          property="og:image"
          content="https://pirates-osaka.com/img/event_ogp.jpg"
        />
        <meta property="og:site_name" content="株式会社パイレーツ大阪" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <Header />

      <main className="contents_inner">
        {/* <Title>
          Event <span className="oTxt">P</span>age
        </Title> */}

        <div className="eventContainer">
          <h1
            className="eventTitle"
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            イベント名（タイトル）
          </h1>

          <p className="eventLead">
            ここにリード文が入ります。イベントの概要や魅力を簡潔に紹介します。
          </p>

          <p className="eventInfo">
            ここに詳細情報テキストが入ります。日程、場所、参加方法など、イベントに関する具体的な情報を記載します。
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Event;
