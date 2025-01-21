// src/components/Contact.js
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function Contact() {
    return ( <
        div > {
            /* 共通ヘッダー */
        } <
        Header / >

        {
            /* ページコンテンツ */
        } <
        main className = "contents_inner" >
        <
        h1 > お問い合わせ < /h1> <
        p > 以下のフォームからお問い合わせください。 < /p>

        {
            /* WordPressのショートコードを埋め込む部分 */
        } <
        div dangerouslySetInnerHTML = {
            {
                __html: '[contact-form-7 id="67" title="お問い合わせ"]',
            }
        } >
        <
        /div> < /
        main >

        {
            /* 共通フッター */
        } <
        Footer / >
        <
        /div>
    );
}

export default Contact;