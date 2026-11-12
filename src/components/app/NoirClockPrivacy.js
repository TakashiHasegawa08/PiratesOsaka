import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import Title from "../Title";

function NoirClockPrivacy() {
  document.title = "Noir Clock プライバシーポリシー | 株式会社PO";

  return (
    <div id="privacyPage">
      <Header />
      <div className="contents_inner">
        <Title>Privacy Policy</Title>

        <div className="layout">
          <div className="postBox">
            <div className="postWrap" style={{ display: "block" }}>
              <article className="privacyArticle">
                <h2>Noir Clock プライバシーポリシー</h2>
                <p>制定日：2026年10月27日</p>
                <p>運営者：株式会社PO</p>
                <p>
                  Noir Clock（以下「本アプリ」）では、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。
                </p>

                <h3>1. 取得する情報について</h3>
                <p>
                  本アプリは、氏名、メールアドレス、住所、電話番号など、個人を特定できる情報を開発者が取得することはありません。
                </p>
                <p>
                  本アプリの表示設定（時計のデザイン、カラー、表示形式など）は、ユーザーの端末内にのみ保存されます。
                </p>

                <h3>2. 時刻情報の利用について</h3>
                <p>
                  本アプリは、時計を表示するために端末のシステム時刻およびタイムゾーン設定を利用します。これらの情報は端末内でのみ処理され、開発者のサーバーへ送信、収集することはありません。
                </p>

                <h3>3. 購入・広告について</h3>
                <p>
                  本アプリは買い切り型の有料アプリです。購入および決済は Apple の App Store を通じて行われ、開発者がユーザーの Apple ID やアカウント情報、支払い情報を取得することはありません。
                </p>
                <p>
                  現在、本アプリでは広告の表示および追加のアプリ内課金を行っていません。
                </p>

                <h3>4. アクセス解析について</h3>
                <p>
                  現在、本アプリでは第三者のアクセス解析サービスを利用していません。また、トラッキングを目的とした情報の取得も行っていません。
                </p>

                <h3>5. 第三者への情報提供について</h3>
                <p>
                  本アプリは、ユーザーの設定内容を第三者へ提供または販売することはありません。ただし、法令に基づく場合はこの限りではありません。
                </p>

                <h3>6. データの管理について</h3>
                <p>
                  本アプリの表示設定は、アプリを削除すると端末から削除されます。
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
                  制定日：2026年10月27日
                  <br />
                  Noir Clock
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

export default NoirClockPrivacy;
