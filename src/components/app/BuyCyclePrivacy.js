import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import Title from "../Title";

function BuyCyclePrivacy() {
  document.title = "BuyCycle プライバシーポリシー | 株式会社PO";

  return (
    <div id="privacyPage">
      <Header />
      <div className="contents_inner">
        <Title>Privacy Policy</Title>

        <div className="layout">
          <div className="postBox">
            <div className="postWrap" style={{ display: "block" }}>
              <article className="privacyArticle">
                <h2>BuyCycle（買い物リスト）プライバシーポリシー</h2>
                <p>制定日：2026年1月22日</p>
                <p>運営者：株式会社PO</p>

                <h3>1. 取得する情報</h3>
                <p>
                  本アプリは、ユーザーの入力した買い物リスト等の情報をアプリ内で利用します。
                </p>

                <h3>2. 個人情報の収集について</h3>
                <p>
                  本アプリは、氏名、メールアドレス、電話番号、位置情報、連絡先等の
                  個人情報を収集しません。
                </p>

                <h3>3. 端末内データの扱い</h3>
                <p>
                  入力されたデータは端末内に保存され、外部サーバーへ送信しません。
                </p>

                <h3>4. 広告・解析ツールについて</h3>
                <p>
                  本アプリは、広告配信SDKおよびアクセス解析ツールを使用しません。
                </p>

                <h3>5. 第三者提供</h3>
                <p>取得した情報を第三者に提供することはありません。</p>

                <h3>6. お問い合わせ</h3>
                <p>
                  本ポリシーに関するお問い合わせは以下までお願いいたします。
                  <br />
                  株式会社PO
                  <br />
                  <a href="/#contact" className="link">
                    お問い合わせフォームはこちら
                  </a>
                </p>

                <h3>7. 改定</h3>
                <p>
                  本ポリシーは必要に応じて改定されることがあります。改定後は本ページにて告知します。
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BuyCyclePrivacy;
