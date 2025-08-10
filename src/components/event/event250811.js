import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import { Helmet } from "react-helmet";

function Event250811() {
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
          <h1 className="eventTitle">
            <img
              src="/img/PM_rogo_02.png"
              alt="Playing Music 〜T.HASE 生誕祭 50th Anniversary〜"
            />
          </h1>

          <p className="eventLead">
            バンドセッションを自由にプレイするライブイベントが開催決定！
          </p>

          <div className="eventInfoWrap">
            <p className="eventInfo">
              日時：2025年 8/11（月・祝）
              <br />
              PM18時開演（16時Open 本編20時まで）
              <br />
              20時過ぎからフリーセッション
            </p>
            <p className="eventInfo">
              場所：ORB 池尻大橋
              <br />
              <span className="little">
                〒153-0044 東京都目黒区大橋２丁目１−１ ラウンドステージ松見坂 B1
              </span>
            </p>
            <p className="eventInfo">
              入場料：¥2,000
              <br />
              お酒など飲み物・食べたいものは持ち込みをお願いします。
              <br />
              ソフトドリンク少しと、簡単な軽食は用意がございます。
            </p>
            <p className="eventInfo">
              出演バンド：
              <br />
              ◎輪音
              <br />
              ◎パブロハニー
              <br />
              ◎USB
              <br />
              <a
                href="https://ragamuffin-band.tokyo/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ◎ラガマフィン
              </a>
              <br />
            </p>
          </div>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.884732284756!2d139.68724796259136!3d35.655211472481234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018f55129ba89cb%3A0xd96804cabde9ca24!2sORB!5e0!3m2!1sja!2sjp!4v1754104095029!5m2!1sja!2sjp"
              style={{
                border: 0,
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Event250811;
