import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import Title from "../Title";

function MiniStickPrivacy() {
  document.title = "MiniStick プライバシーポリシー | 株式会社PO";

  return (
    <div id="privacyPage">
      <Header />
      <div className="contents_inner">
        <Title>Privacy Policy</Title>

        <div className="layout">
          <div className="postBox">
            <div className="postWrap" style={{ display: "block" }}>
              <article className="privacyArticle">
                <h2>MiniStick プライバシーポリシー</h2>
                <p>制定日：2026年10月14日</p>
                <p>運営者：株式会社PO</p>
                <p>
                  MiniStick（以下「本アプリ」）では、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。
                </p>

                <h3>1. 取得する情報について</h3>
                <p>
                  本アプリは、氏名、メールアドレス、住所、電話番号など、個人を特定できる情報を取得しません。
                </p>
                <p>
                  本アプリ内でユーザーが入力・記録したデータは、アプリの機能を提供するためにユーザーの端末内に保存されます。
                </p>
                <p>
                  これらのデータを開発者のサーバーへ送信、収集することはありません。
                </p>

                <h3>2. データの利用について</h3>
                <p>
                  本アプリ内で入力・記録されたデータは、本アプリの機能を提供する目的でのみ使用されます。
                </p>
                <p>
                  開発者がこれらのデータを閲覧、収集、利用することはありません。
                </p>

                <h3>3. 第三者への情報提供について</h3>
                <p>
                  本アプリは、ユーザーが入力した情報を第三者へ提供または販売することはありません。
                </p>

                <h3>4. 広告について</h3>
                <p>
                  現在、本アプリには第三者による広告配信サービスを使用していません。
                </p>
                <p>
                  広告配信サービス等を導入する場合には、本プライバシーポリシーを改定し、必要に応じて取得する情報およびその利用目的を明示します。
                </p>

                <h3>5. アクセス解析について</h3>
                <p>
                  現在、本アプリでは第三者のアクセス解析サービスを利用していません。
                </p>

                <h3>6. データの管理について</h3>
                <p>本アプリのデータはユーザーの端末内で管理されます。</p>
                <p>
                  アプリを削除した場合、端末内に保存されている本アプリのデータも削除される場合があります。
                </p>
                <p>
                  重要なデータについては、ユーザー自身の責任において管理してください。
                </p>

                <h3>7. プライバシーポリシーの変更について</h3>
                <p>
                  本アプリの機能追加、使用するサービスの変更、法令その他の必要に応じて、本プライバシーポリシーを変更することがあります。
                </p>
                <p>
                  変更後のプライバシーポリシーは、本ページに掲載した時点から適用されます。
                </p>

                <h3>8. お問い合わせ</h3>
                <p>
                  本アプリおよび本プライバシーポリシーに関するお問い合わせは、開発者Webサイトのお問い合わせ窓口よりお願いいたします。
                  <br />
                  株式会社PO
                  <br />
                  <a href="/#contact" className="link">
                    お問い合わせフォームはこちら
                  </a>
                </p>

                <p style={{ marginTop: "28px" }}>
                  制定日：2026年10月14日
                  <br />
                  MiniStick
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

export default MiniStickPrivacy;
