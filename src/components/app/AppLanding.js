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

                  {/* 03 EnglishTraining */}
                  <div className="app_content">
                    <h2>EnglishTraining</h2>
                    <div className="app_icon">
                      <img
                        src="/img/app/EnglishMEMO_icon.png"
                        alt="EnglishTraining"
                      />
                    </div>
                    <Link to="/app/englishtraining" className="linkBtn link">
                      プライバシーポリシー
                    </Link>
                  </div>

                  {/* 04 DrinkCTRL */}
                  <div className="app_content">
                    <h2>DrinkCTRL</h2>
                    <div className="app_icon">
                      <img src="/img/app/DrinkCTRL_icon.png" alt="DrinkCTRL" />
                    </div>
                    <Link to="/app/drinkctrl" className="linkBtn link">
                      プライバシーポリシー
                    </Link>
                  </div>

                  {/* 05 MiniStick */}
                  <div className="app_content">
                    <h2>MiniStick</h2>
                    <div className="app_icon">
                      <img src="/img/app/MiniStick_icon.png" alt="MiniStick" />
                    </div>
                    <Link to="/app/ministick" className="linkBtn link">
                      プライバシーポリシー
                    </Link>
                  </div>

                  {/* 06 Noir Calendar */}
                  <div className="app_content">
                    <h2>Noir Calendar</h2>
                    <div className="app_icon">
                      <img
                        src="/img/app/NoirCalendar_icon.png"
                        alt="Noir Calendar"
                      />
                    </div>
                    <Link to="/app/noircalendar" className="linkBtn link">
                      プライバシーポリシー
                    </Link>
                  </div>

                  {/* 07 Noir Player */}
                  <div className="app_content">
                    <h2>Noir Player</h2>
                    <div className="app_icon">
                      <img
                        src="/img/app/NoirPlayer_icon.png"
                        alt="Noir Player"
                      />
                    </div>
                    <Link to="/app/noirplayer" className="linkBtn link">
                      プライバシーポリシー
                    </Link>
                  </div>

                  {/* 08 Noir Clock */}
                  <div className="app_content">
                    <h2>Noir Clock</h2>
                    <div className="app_icon">
                      <img
                        src="/img/app/noir_clock_icon_square_512.png"
                        alt="Noir Clock"
                      />
                    </div>
                    <Link to="/app/noirclock" className="linkBtn link">
                      プライバシーポリシー
                    </Link>
                  </div>

                  {/* 09 CineTone Camera */}
                  <div className="app_content">
                    <h2>CineTone Camera</h2>
                    <div className="app_icon">
                      <img
                        src="/img/app/Cine_AppIcon.png"
                        alt="CineTone Camera"
                      />
                    </div>
                    <Link to="/app/cinetone" className="linkBtn link">
                      プライバシーポリシー
                    </Link>
                  </div>

                  {/* 10 PocketSketch */}
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

                  {/* 11 SoundSketch */}
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
