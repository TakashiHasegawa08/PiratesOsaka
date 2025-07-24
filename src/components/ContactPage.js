import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Title from "./Title";
import ContactForm from "./ContactForm";

function ContactPage() {
  useEffect(() => {
    document.title = "お問い合わせ | 株式会社パイレーツ大阪";

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
    }

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
    }
  }, []);

  return (
    <div id="contactPage">
      <Header />
      <main>
        <div className="contents_inner">
          <Title>
            C<span className="oTxt">O</span>ntact Us
          </Title>
          <div className="leadWrap">
            <p className="lead">
              WEBサイト・アプリケーションの制作についてご相談がある方は、
              <br className="PC-only" />
              お気軽にお問い合わせください。
            </p>
            <p className="sub">
              対応可能な技術領域：HTML / CSS / JavaScript / PHP / WordPress /
              React / Firebase ほか
            </p>
          </div>
          <ContactForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ContactPage;
