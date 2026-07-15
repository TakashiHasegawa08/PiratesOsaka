import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import Title from "../Title";

function GuitapPrivacy() {
  document.title = "Guitap プライバシーポリシー | 株式会社PO";

  return (
    <div id="privacyPage">
      <Header />
      <div className="contents_inner">
        <Title>Privacy Policy</Title>

        <div className="layout">
          <div className="postBox">
            <div className="postWrap" style={{ display: "block" }}>
              <article className="privacyArticle">
                <h2>Guitap プライバシーポリシー</h2>
                <p>制定日：2026年6月16日</p>
                <p>運営者：株式会社PO</p>

                <h3>1. 取得する情報</h3>
                <p>
                  本アプリは、ユーザーの演奏操作に応じてギター音を再生するアプリです。
                  演奏操作に関する情報は、アプリ内での音声再生のためにのみ利用されます。
                </p>

                <h3>2. 個人情報の収集について</h3>
                <p>
                  本アプリは、氏名、メールアドレス、電話番号、位置情報、連絡先等の
                  個人情報を収集しません。
                </p>

                <h3>3. 端末内データの扱い</h3>
                <p>
                  本アプリの演奏操作や設定に関する情報は、端末内で処理されます。
                  外部サーバーへ送信することはありません。
                </p>

                <h3>4. マイク・録音機能について</h3>
                <p>
                  本アプリは、端末のマイクを使用した録音機能を提供しません。
                  ユーザーの音声を録音、保存、送信することはありません。
                </p>

                <h3>5. アプリ内購入について</h3>
                <p>
                  本アプリでは、追加機能の利用のためにApp
                  Storeのアプリ内購入を使用します。購入処理はAppleが提供する仕組みにより行われ、当社がクレジットカード番号等の支払い情報を取得、保存することはありません。購入状態は、アプリ内で機能を有効化する目的でのみ確認されます。
                </p>

                <h3>6. 広告・解析ツールについて</h3>
                <p>
                  本アプリは、広告配信SDKおよびアクセス解析ツールを使用しません。
                </p>

                <h3>7. 第三者提供</h3>
                <p>
                  本アプリは、取得した情報を第三者に提供することはありません。
                </p>

                <h3>8. お問い合わせ</h3>
                <p>
                  本ポリシーに関するお問い合わせは以下までお願いいたします。
                  <br />
                  株式会社PO
                  <br />
                  <a href="/#contact" className="link">
                    お問い合わせフォームはこちら
                  </a>
                </p>

                <h3>9. 改定</h3>
                <p>
                  本ポリシーは必要に応じて改定されることがあります。
                  改定後は本ページにて告知します。
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

export default GuitapPrivacy;
