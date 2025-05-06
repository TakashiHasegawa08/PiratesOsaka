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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  document.title = "Illustration Works | 株式会社パイレーツ大阪";

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const fetchPosts = async (pageNumber) => {
    try {
      // const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/portfolio?per_page=30&page=${pageNumber}&_embed`;
      const apiUrl = `https://pirates-osaka.com/wp-json/wp/v2/portfolio?per_page=30&page=${pageNumber}&_embed`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPosts((prev) => [...prev, ...data]);

      if (data.length < 20) {
        setHasMore(false); // データが30件未満なら終了
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (image) => {
    const scrollbarWidth = getScrollbarWidth();
    setScrollPos(window.pageYOffset);
    document.body.style.overflow = "hidden";
    document.body.style.marginRight = `${scrollbarWidth}px`;
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    document.body.style.overflow = "";
    document.body.style.marginRight = "";
    window.scrollTo(0, scrollPos);
    setModalIsOpen(false);
    setSelectedImage(null);
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
    setLoading(true);
    setPage((prev) => prev + 1);
  };

  return (
    <div id="illustPage">
      <Header />
      <main>
        <div className="contents_inner">
          <Title>Illustration</Title>
          <div className="creditWrap">
            <p className="credit">Illustration by</p>
            <div className="T_HASE_rogo">
              <img
                src="/img/music_img/T_HASE_rogo_300px.jpg"
                alt="T.HASE logo"
              />
            </div>
          </div>
          <div className="gallery">
            {posts.map((post) => {
              const thumbnailUrl =
                post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes
                  ?.thumbnail?.source_url;
              const fullImageUrl =
                post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
              const altText =
                post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text;

              // ★ 画像がない場合はスキップ！
              if (!thumbnailUrl) return null;

              return (
                <div key={post.id} className="list js-scroll">
                  <div
                    className="gallery-item"
                    onClick={() => openModal({ fullImageUrl, altText })}
                  >
                    <img src={thumbnailUrl} alt={altText} />
                  </div>
                </div>
              );
            })}
          </div>

          <div id="load-more-container">
            {hasMore && !loading && (
              <button id="more-button" onClick={loadMorePosts}>
                view more images
                <img
                  src="/img/illustrationWorks_img/more_arrow.svg"
                  alt="開く"
                />
              </button>
            )}
            {hasMore && loading && (
              <p className="loading-message">読み込み中...</p> // ←追加
            )}
          </div>
        </div>

        {loading && <p className="loading">Loading...</p>}

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
