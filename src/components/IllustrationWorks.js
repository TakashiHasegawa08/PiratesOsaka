import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Header from "./Header";
import Footer from "./Footer";

Modal.setAppElement("#root"); // アプリのルート要素を指定

function IllustrationWorks() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const fetchPosts = async (page) => {
    try {
      const apiUrl =
        process.env.NODE_ENV === "development"
          ? `http://localhost:10039/wp-json/wp/v2/portfolio?per_page=50&page=${page}&_embed`
          : `https://pirates-osaka.com/wp-json/wp/v2/portfolio?per_page=50&page=${page}&_embed`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        if (response.status === 400) {
          setHasMore(false);
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } else {
        const data = await response.json();
        setPosts((prevPosts) => [...prevPosts, ...data]);
        if (data.length < 50) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  const loadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div>
      <Header />
      <main>
        {/* <h1>Illustration Works</h1> */}
        <div className="contents-inner">
          <div className="gallery">
            {posts.map((post) => {
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
                <div key={post.id} className="list">
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
        </div>
        {loading && <p>Loading...</p>}
        {hasMore && !loading && (
          <div id="load-more-container">
            <button id="load-more" onClick={loadMore}>
              <p>and more…</p>
              <img
                src="/img/illustrationWorks_img/more_arrow.svg"
                alt="and more"
              />
            </button>
          </div>
        )}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Image Modal"
          className="modal-content"
          overlayClassName="modal-overlay"
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
