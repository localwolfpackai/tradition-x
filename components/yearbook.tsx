import Image from "next/image";

/**
 * GALLERY — the vintage Tradition XI poster, framed as the centerpiece (one frame for now).
 * Uses next/image so the 3.5 MB source gets served as a ~150 KB WebP on phones.
 */
export default function Yearbook() {
  return (
    <section id="yearbook" className="sec yearbook">
      <div className="sec-inner sec-inner-narrow">
        <div className="sec-head">
          <h2 className="sec-title">
            The <em>Gallery</em>
          </h2>
        </div>

        <figure className="poster">
          <div className="poster-frame">
            <Image
              src="/yearbook.png"
              alt="Tradition XI — vintage collage: the boys, the bear, the Cadillac, Denver"
              width={1041}
              height={1481}
              priority={false}
              sizes="(min-width: 1024px) 540px, (min-width: 560px) 60vw, 92vw"
              className="poster-img"
            />
          </div>
          <figcaption className="poster-cap">
            <span>Tradition · XI</span>
            <em>Denver · MMXXVI</em>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
