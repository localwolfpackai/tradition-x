import Image from "next/image";

/**
 * YEARBOOK — frames the vintage Tradition XI poster as the centerpiece.
 * Uses next/image so the 3.5 MB source gets served as a ~150 KB WebP on phones.
 */
export default function Yearbook() {
  return (
    <section id="yearbook" className="sec yearbook">
      <div className="sec-inner sec-inner-narrow">
        <div className="sec-head">
          <div className="sec-eyebrow">The Yearbook</div>
          <h2 className="sec-title">
            One <em>Frame</em>
          </h2>
          <p className="sec-sub">
            We&apos;re all a little handicapped if you think about it.
          </p>
        </div>

        <figure className="poster">
          <div className="poster-frame">
            <Image
              src="/yearbook.png"
              alt="Tradition XI — vintage collage: the boys, the bear, the Cadillac, Colorado Springs"
              width={1041}
              height={1481}
              priority={false}
              sizes="(min-width: 1024px) 540px, (min-width: 560px) 60vw, 92vw"
              className="poster-img"
            />
          </div>
          <figcaption className="poster-cap">
            <span>Tradition · XI</span>
            <em>Colorado Springs · MMXXVI</em>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
