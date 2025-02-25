import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Header from "./Header";
import Footer from "./Footer";
import Title from "./Title";

Modal.setAppElement("#root"); // アプリのルート要素を指定

function IllustrationWorks() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scrollPos, setScrollPos] = useState(0);
  document.title = "Illustration Works | 株式会社パイレーツ大阪";

  const [visiblePosts, setVisiblePosts] = useState(30);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const apiUrl =
        process.env.NODE_ENV === "development"
          ? `http://localhost:10039/wp-json/wp/v2/portfolio?per_page=50&_embed`
          : `https://pirates-osaka.com/illustrationWorks/wp-json/wp/v2/portfolio?per_page=50&_embed`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (image) => {
    const scrollbarWidth = getScrollbarWidth();
    setScrollPos(window.pageYOffset); // 現在のスクロール位置を保存
    document.body.style.overflow = "hidden"; // 背景を固定
    document.body.style.marginRight = `${scrollbarWidth}px`; // スクロールバー分調整
    setSelectedImage(image); // 画像データをセット
    setModalIsOpen(true); // モーダルを開く
  };

  const closeModal = () => {
    document.body.style.overflow = ""; // 背景スクロールを再有効化
    document.body.style.marginRight = ""; // スクロールバー調整解除
    window.scrollTo(0, scrollPos); // スクロール位置を復元
    setModalIsOpen(false); // モーダルを閉じる
    setSelectedImage(null); // 画像データをリセット
  };

  const getScrollbarWidth = () => {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll";
    document.body.appendChild(outer);

    const inner = document.createElement("div");
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  };

  const loadMorePosts = () => {
    setVisiblePosts((prev) => prev + 10);
  };

  return (
    <div id="illustPage">
      <Header />
      <main>
        <div className="contents_inner">
          <Title>Illustration Works</Title>
          <div className="gallery">
            {posts.slice(0, visiblePosts).map((post) => {
              const thumbnailUrl =
                post._embedded &&
                post._embedded["wp:featuredmedia"] &&
                post._embedded["wp:featuredmedia"][0]?.media_details?.sizes
                  ?.thumbnail?.source_url;
              const fullImageUrl =
                post._embedded &&
                post._embedded["wp:featuredmedia"] &&
                post._embedded["wp:featuredmedia"][0]?.source_url;
              const altText =
                post._embedded &&
                post._embedded["wp:featuredmedia"] &&
                post._embedded["wp:featuredmedia"][0]?.alt_text;

              return (
                <div key={post.id} className="list js-scroll">
                  {thumbnailUrl && (
                    <div
                      className="gallery-item"
                      onClick={() => openModal({ fullImageUrl, altText })}
                    >
                      <img src={thumbnailUrl} alt={altText} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div id="load-more-container">
            {visiblePosts < posts.length && (
              <button id="more-button" onClick={loadMorePosts}>
                view more images
                <img
                  src="/img/illustrationWorks_img/more_arrow.svg"
                  alt="開く"
                />
              </button>
            )}
          </div>
        </div>
        {loading && <p>Loading...</p>}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Image Modal"
          className="modal-content"
          overlayClassName={`modal-overlay ${modalIsOpen ? "open" : ""}`}
          shouldCloseOnOverlayClick={true}
        >
          <div className="modal-main">
            <div className="modal-main_inner">
              {selectedImage && (
                <>
                  <img
                    src={selectedImage.fullImageUrl}
                    alt={selectedImage.altText}
                  />
                  {selectedImage.altText && (
                    <p className="caption">{selectedImage.altText}</p>
                  )}
                </>
              )}
            </div>
            <button onClick={closeModal} className="btn-close">
              <img
                src="/img/illustrationWorks_img/modal_close.svg"
                alt="閉じる"
              />
            </button>
          </div>
        </Modal>
      </main>
      <Footer />
    </div>
  );
}

export default IllustrationWorks;
