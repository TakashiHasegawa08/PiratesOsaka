import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import Title from "../Title";

function PocketSketchPrivacy() {
  document.title = "PocketSketch プライバシーポリシー | 株式会社PO";

  return (
    <div id="privacyPage">
      <Header />
      <div className="contents_inner">
        <Title>Privacy Policy</Title>

        <div className="layout">
          <div className="postBox">
            <div className="postWrap" style={{ display: "block" }}>
              <article className="privacyArticle">
                <h2>PocketSketch プライバシーポリシー</h2>
                <p>制定日：2026年7月15日</p>
                <p>運営者：株式会社PO</p>

                <h3>1. 取得する情報</h3>
                <p>
                  本アプリは、ユーザーが作成したスケッチ、描画操作、
                  ペンの設定等の情報を、アプリの機能を提供するために利用します。
                </p>

                <h3>2. 個人情報の収集について</h3>
                <p>
                  本アプリは、氏名、メールアドレス、電話番号、位置情報、
                  連絡先等の個人情報を独自に収集しません。
                </p>

                <h3>3. 端末内データの扱い</h3>
                <p>
                  本アプリで作成したスケッチおよび設定情報は、
                  原則としてユーザーの端末内に保存されます。
                  当社の外部サーバーへ送信することはありません。
                  アプリを削除した場合、端末内に保存されたデータが削除されることがあります。
                </p>

                <h3>4. アプリ内購入について</h3>
                <p>
                  本アプリでは、広告を非表示にする機能等の提供のために、
                  App Storeのアプリ内購入を使用します。
                  購入処理はAppleが提供する仕組みにより行われ、
                  当社がクレジットカード番号等の支払い情報を取得、
                  保存することはありません。
                  購入状態は、購入済み機能を有効化または復元する目的でのみ確認されます。
                </p>

                <h3>5. 広告配信について</h3>
                <p>
                  本アプリの無料版では、Google Mobile Ads SDKを利用して
                  広告を表示する場合があります。
                  広告配信事業者は、広告の配信、表示回数の測定、
                  不正行為の防止等のために、端末情報、広告識別子、
                  おおよその位置情報、アプリの利用状況等を取得する場合があります。
                  取得される情報および利用目的については、
                  Googleのプライバシーポリシーをご確認ください。
                </p>
                <p>
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    Google プライバシーポリシー
                  </a>
                </p>

                <h3>6. アクセス解析について</h3>
                <p>
                  本アプリは、当社独自のアクセス解析ツールを使用しません。
                </p>

                <h3>7. 第三者提供</h3>
                <p>
                  当社は、法令に基づく場合を除き、
                  本アプリを通じて取得した情報を第三者へ提供しません。
                  ただし、広告配信に伴う情報の取扱いについては、
                  前項に記載した広告配信事業者のポリシーが適用されます。
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

export default PocketSketchPrivacy;
