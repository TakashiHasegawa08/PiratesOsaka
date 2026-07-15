import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Title from "./Title";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "", // 追加
    message: "",
  });
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage("reCAPTCHA認証が必要です。");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("your-name", formData.name);
    formPayload.append("your-email", formData.email);
    formPayload.append("your-company", formData.company); // 追加
    formPayload.append("your-message", formData.message);
    formPayload.append("g-recaptcha-response", token);

    try {
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

  return (
    <div className="contact-form" id="form">
      <form onSubmit={handleSubmit}>
        <div className="formWrap">
          <p>
            <span className="tag">お名前（必須）</span>
            <br />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </p>
        </div>

        <div className="formWrap">
          <p>
            <span className="tag">メールアドレス（必須）</span>
            <br />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </p>
        </div>

        <div className="formWrap">
          <p>
            <span className="tag">会社名（任意）</span>
            <br />
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
          </p>
        </div>

        <div className="formWrap">
          <p>
            <span className="tag">メッセージ本文</span>
            <br />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
            />
          </p>
        </div>

        <div className="formWrap">
          <ReCAPTCHA
            sitekey="6Le2ES4sAAAAAM-itrRzxzKt7tUJWk9nNjPZklsy"
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
        と{" "}
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
  );
};

export default ContactForm;
