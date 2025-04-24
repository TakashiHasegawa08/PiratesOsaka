import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Title from "./Title";

function CompanyProfile() {
  useEffect(() => {
    // ページタイトルを設定
    document.title = "会社概要 | 株式会社パイレーツ大阪";

    // CF7スクリプトの動的読み込み
    if (
      !document.querySelector(
        'script[src="http://localhost:10028/wp-content/plugins/contact-form-7/includes/js/index.js"]'
      )
    ) {
      const cf7Script = document.createElement("script");
      cf7Script.src =
        "http://localhost:10028/wp-content/plugins/contact-form-7/includes/js/index.js";
      cf7Script.async = true;
      document.body.appendChild(cf7Script);

      cf7Script.onload = () => {
        console.log("CF7スクリプトがロードされました");
      };
    }

    // reCAPTCHAスクリプトの動的読み込み
    if (
      !document.querySelector(
        'script[src="https://www.google.com/recaptcha/api.js"]'
      )
    ) {
      const recaptchaScript = document.createElement("script");
      recaptchaScript.src = "https://www.google.com/recaptcha/api.js";
      recaptchaScript.async = true;
      recaptchaScript.defer = true;
      document.body.appendChild(recaptchaScript);

      recaptchaScript.onload = () => {
        console.log("reCAPTCHAスクリプトがロードされました");
      };
    }

    return () => {
      // ロード済みのスクリプトは削除しない（必要なら削除処理を追加）
    };
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [message, setMessage] = useState(""); // メッセージ表示用

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let token = "";
    if (window.location.hostname === "localhost") {
      console.log("ローカル環境ではreCAPTCHAをスキップします");
      token = "test-token"; // ローカル環境用のトークン
    } else if (window.grecaptcha) {
      try {
        token = await window.grecaptcha.execute(
          "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", // テスト用サイトキー　 本番環境時に変更
          { action: "submit" }
        );
      } catch (error) {
        console.error("reCAPTCHAトークン取得エラー:", error);
        setMessage("reCAPTCHAの取得に失敗しました。後ほどお試しください。");
        return;
      }
    } else {
      setMessage("reCAPTCHAがロードされていません。");
      return;
    }

    console.log("取得したトークン:", token);

    const formPayload = new FormData();
    formPayload.append("your-name", formData.name);
    formPayload.append("your-email", formData.email);
    formPayload.append("your-message", formData.message);
    formPayload.append("g-recaptcha-response", token);

    const API_URL =
      // 本番環境時に変更
      "http://localhost:10028/wp-json/contact-form-7/v1/contact-forms/67/feedback";

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formPayload,
      });
      const result = await response.json();

      if (response.ok && result.status === "mail_sent") {
        setMessage("お問い合わせが送信されました。");
      } else {
        setMessage("送信に失敗しました。もう一度お試しください。");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("エラーが発生しました。後ほどお試しください。");
    }
  };

  return (
    <div id="companyProfilePage">
      <Header />
      <main>
        <div className="contents_inner">
          <Title>Company</Title>

          <div className="company-profile">
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
                  <li>・WEBサイト制作</li>
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
            <h2>Contact Us</h2>
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
                  data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // テスト用キー　 本番環境時に変更
                  data-size="invisible"
                ></div>
              </div>

              <button type="submit">送信</button>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CompanyProfile;
