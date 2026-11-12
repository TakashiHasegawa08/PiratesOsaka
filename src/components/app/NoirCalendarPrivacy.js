import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import Title from "../Title";

function NoirCalendarPrivacy() {
  document.title = "Noir Calendar プライバシーポリシー | 株式会社PO";

  return (
    <div id="privacyPage">
      <Header />
      <div className="contents_inner">
        <Title>Privacy Policy</Title>

        <div className="layout">
          <div className="postBox">
            <div className="postWrap" style={{ display: "block" }}>
              <article className="privacyArticle">
                <h2>Noir Calendar プライバシーポリシー</h2>
                <p>制定日：2026年10月21日</p>
                <p>運営者：株式会社PO</p>
                <p>
                  Noir Calendar（以下「本アプリ」）では、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。
                </p>

                <h3>1. 取得する情報について</h3>
                <p>
                  本アプリは、氏名、メールアドレス、住所、電話番号など、個人を特定できる情報を開発者が取得することはありません。
                </p>
                <p>
                  本アプリの表示設定（週の始まり、キーカラーなど）は、ユーザーの端末内に保存されます。
                </p>

                <h3>2. カレンダーへのアクセスについて</h3>
                <p>
                  本アプリは、予定の表示・追加・編集を行うため、ユーザーの許可を得た上で端末のカレンダー（iOSの「カレンダー」アプリに登録された予定）にアクセスします。
                </p>
                <p>
                  カレンダーの予定は端末内でのみ処理され、開発者のサーバーへ送信、収集することはありません。また、広告配信事業者を含む第三者へ提供することもありません。
                </p>
                <p>
                  カレンダーへのアクセス許可は、端末の「設定」アプリからいつでも変更できます。
                </p>

                <h3>3. 広告について</h3>
                <p>
                  本アプリでは、Google LLC が提供する広告配信サービス「Google AdMob」を利用しています。
                </p>
                <p>
                  Google AdMob は、広告の配信・効果測定・不正防止のために、端末やアプリの情報（IPアドレス、端末の種類、OSのバージョン、広告の表示・タップ状況など）を取得する場合があります。取得された情報は、Google のプライバシーポリシーに基づいて取り扱われます。
                </p>
                <p>
                  欧州経済領域（EEA）など同意が必要な地域では、Google の同意管理ツールにより、広告に関する同意確認画面が表示される場合があります。
                </p>
                <p>
                  詳しくは以下をご確認ください。
                  <br />
                  <a
                    href="https://policies.google.com/privacy"
                    className="link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google プライバシーポリシー
                  </a>
                  <br />
                  <a
                    href="https://policies.google.com/technologies/ads"
                    className="link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google の広告に関するポリシー
                  </a>
                </p>
                <p>
                  Pro版を購入した場合、本アプリは広告を一切読み込みません。
                </p>

                <h3>4. アプリ内課金について</h3>
                <p>
                  本アプリでは、Apple の App Store を通じて Pro版（買い切り）を販売しています。
                </p>
                <p>
                  購入手続きはすべて Apple によって行われ、開発者がユーザーの支払い情報（クレジットカード情報など）を取得することはありません。本アプリは、Pro版の購入状態を確認するためにのみ App Store の購入情報を利用します。
                </p>

                <h3>5. アクセス解析について</h3>
                <p>
                  現在、本アプリでは第三者のアクセス解析サービスを利用していません。
                </p>

                <h3>6. 第三者への情報提供について</h3>
                <p>
                  本アプリは、ユーザーのカレンダーの予定や設定内容を、第三者へ提供または販売することはありません。ただし、法令に基づく場合はこの限りではありません。
                </p>

                <h3>7. データの管理について</h3>
                <p>
                  カレンダーの予定は、iOSの「カレンダー」に保存されており、本アプリを削除しても予定は削除されません。
                </p>
                <p>
                  本アプリの表示設定は、アプリを削除すると端末から削除されます。
                </p>

                <h3>8. プライバシーポリシーの変更について</h3>
                <p>
                  本アプリの機能追加、使用するサービスの変更、法令その他の必要に応じて、本プライバシーポリシーを変更することがあります。
                </p>
                <p>
                  変更後のプライバシーポリシーは、本ページに掲載した時点から適用されます。
                </p>

                <h3>9. お問い合わせ</h3>
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
                  制定日：2026年10月21日
                  <br />
                  Noir Calendar
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

export default NoirCalendarPrivacy;
