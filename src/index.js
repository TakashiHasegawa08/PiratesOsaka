import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Posts from "./components/Posts"; // トップページ
import PostDetail from "./components/PostDetail"; // 個別投稿
import Music from "./components/Music";
import IllustrationWorks from "./components/IllustrationWorks";
import Blog from "./components/Blog";
import ContactPage from "./components/ContactPage";
import Event250811 from "./components/event/event250811";
import Event260726_02 from "./components/event/event260726_02";
// import CompanyProfile from "./components/CompanyProfile";
import AppLanding from "./components/app/AppLanding";
import BuyCyclePrivacy from "./components/app/BuyCyclePrivacy";
import GuitapPrivacy from "./components/app/GuitapPrivacy";
import PocketSketchPrivacy from "./components/app/PocketSketchPrivacy";
import SoundSketchPrivacy from "./components/app/SoundSketchPrivacy";
import EnglishMEMOPrivacy from "./components/app/EnglishMEMOPrivacy";
import DrinkCTRLPrivacy from "./components/app/DrinkCTRLPrivacy";
import MiniStickPrivacy from "./components/app/MiniStickPrivacy";
import NoirCalendarPrivacy from "./components/app/NoirCalendarPrivacy";
import NoirPlayerPrivacy from "./components/app/NoirPlayerPrivacy";
import NoirClockPrivacy from "./components/app/NoirClockPrivacy";
import CineToneCameraPrivacy from "./components/app/CineToneCameraPrivacy";
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
        <Route path="/event/event250811" element={<Event250811 />} />
        <Route path="/event/event260726_02" element={<Event260726_02 />} />
        {/* ✅ App Store 審査用 */}
        <Route path="/app" element={<AppLanding />} />
        <Route path="/app/buycycle" element={<BuyCyclePrivacy />} />
        <Route path="/app/guitap" element={<GuitapPrivacy />} />
        <Route path="/app/PocketSketch" element={<PocketSketchPrivacy />} />
        <Route path="/app/SoundSketch" element={<SoundSketchPrivacy />} />
        <Route path="/app/englishtraining" element={<EnglishMEMOPrivacy />} />
        <Route path="/app/drinkctrl" element={<DrinkCTRLPrivacy />} />
        <Route path="/app/ministick" element={<MiniStickPrivacy />} />
        <Route path="/app/noircalendar" element={<NoirCalendarPrivacy />} />
        <Route path="/app/noirplayer" element={<NoirPlayerPrivacy />} />
        <Route path="/app/noirclock" element={<NoirClockPrivacy />} />
        <Route path="/app/cinetone" element={<CineToneCameraPrivacy />} />
      </Routes>
    </Router>
  );
}

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
