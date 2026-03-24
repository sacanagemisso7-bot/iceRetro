"use client";

import { useEffect, useState } from "react";

type StylePhoto = {
  src: string;
  alt: string;
  kicker: string;
  title: string;
  description: string;
  tone: string;
  featured?: boolean;
};

type StyleGalleryProps = {
  photos: StylePhoto[];
};

export function StyleGallery({ photos }: StyleGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const activePhoto = openIndex === null ? null : photos[openIndex];
  const activeIndex = openIndex === null ? 0 : openIndex;

  const closeGallery = () => setOpenIndex(null);
  const showPrevious = () =>
    setOpenIndex((current) => (current === null ? photos.length - 1 : (current - 1 + photos.length) % photos.length));
  const showNext = () =>
    setOpenIndex((current) => (current === null ? 0 : (current + 1) % photos.length));

  useEffect(() => {
    if (openIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeGallery();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openIndex, photos.length]);

  return (
    <>
      <div className="style-grid">
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            className={`style-tile style-tile-image style-tile-button style-tone-${photo.tone}${photo.featured ? " style-tile-featured" : ""}`}
            onClick={() => setOpenIndex(index)}
            aria-label={`Abrir imagem ${photo.title}`}
          >
            <span className="style-tile-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="style-tile-open">Clique para ampliar</span>
            <img src={photo.src} alt={photo.alt} />

            <div className="style-tile-content">
              <p className="style-tile-kicker">{photo.kicker}</p>
              <h4 className="style-tile-title">{photo.title}</h4>
              <p className="style-tile-copy">{photo.description}</p>
            </div>
          </button>
        ))}
      </div>

      {activePhoto ? (
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={activePhoto.title} onClick={closeGallery}>
          <div className="gallery-modal-shell" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="gallery-close-button" onClick={closeGallery} aria-label="Fechar galeria">
              Fechar
            </button>

            <div className="gallery-modal-media">
              <img src={activePhoto.src} alt={activePhoto.alt} />
            </div>

            <div className="gallery-modal-body">
              <p className="gallery-modal-kicker">{activePhoto.kicker}</p>
              <div className="gallery-modal-head">
                <h4>{activePhoto.title}</h4>
                <span>
                  {activeIndex + 1} / {photos.length}
                </span>
              </div>
              <p className="gallery-modal-copy">{activePhoto.description}</p>

              <div className="gallery-modal-actions">
                <button type="button" className="gallery-nav-button" onClick={showPrevious}>
                  Anterior
                </button>
                <button type="button" className="gallery-nav-button" onClick={showNext}>
                  Proxima
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
