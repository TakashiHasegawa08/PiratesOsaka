import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import Title from "../Title";
import { Link } from "react-router-dom";

function AppLanding() {
  document.title = "Apps | 株式会社PO";

  return (
    <div id="appPage">
      <Header />
      <div className="contents_inner">
        <Title>Apps</Title>

        <div className="layout">
          <div className="postBox">
            <div className="postWrap" style={{ display: "block" }}>
              <section className="appSection">
                <div className="app_content_wrap">
                  {/* 01 BuyCycle */}
                  <div className="app_content">
                    <h2>BuyCycle</h2>
                    <div className="app_icon">
                      <a
                        href="https://apps.apple.com/jp/app/buycycle/id6758200587"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src="/img/app/BC_thumb.png" alt="BuyCycle" />
                      </a>
                    </div>
                    <Link to="/app/buycycle" className="linkBtn link">
                      プライバシーポリシー
                    </Link>
                  </div>

                  {/* 02 Guitap */}
                  <div className="app_content">
                    <h2>Guitap</h2>
                    <div className="app_icon">
                      <a
                        href="https://apps.apple.com/jp/app/guitap-pocket-guitar/id6773235836"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src="/img/app/Gitap_icon.png" alt="Guitap" />
                      </a>
                    </div>
                    <Link to="/app/Guitap" className="linkBtn link">
                      プライバシーポリシー
                    </Link>
                  </div>

                  {/* 03 PocketSketch */}
                  <div className="app_content">
                    <h2>PocketSketch</h2>
                    <div className="app_icon">
                      <img
                        src="/img/app/PocketSketch_icon.png"
                        alt="PocketSketch"
                      />
                    </div>
                    <Link to="/app/PocketSketch" className="linkBtn link">
                      プライバシーポリシー
                    </Link>
                  </div>

                  {/* 04 SoundSketch */}
                  <div className="app_content">
                    <h2>SoundSketch</h2>
                    <div className="app_icon">
                      <img
                        src="/img/app/SoundSketch_icon.png"
                        alt="SoundSketch"
                      />
                    </div>
                    <Link to="/app/SoundSketch" className="linkBtn link">
                      プライバシーポリシー
                    </Link>
                  </div>

                  {/* 05 EnglishMEMO */}
                  <div className="app_content">
                    <h2>EnglishMEMO</h2>
                    <div className="app_icon">
                      <img
                        src="/img/app/EnglishMEMO_icon.png"
                        alt="EnglishMEMO"
                      />
                    </div>
                    <Link to="/app/englishmemo" className="linkBtn link">
                      プライバシーポリシー
                    </Link>
                  </div>
                </div>

                <hr style={{ margin: "28px 0" }} />
                <ul>
                  <li>開発者/運営：株式会社PO</li>
                  <li>
                    <a href="/#contact" className="link">
                      お問い合わせフォームはこちら
                    </a>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AppLanding;
