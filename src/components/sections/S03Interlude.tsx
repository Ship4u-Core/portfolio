import { interlude } from "@/content/sections";
import { WireStatic } from "@/components/scenes/WireStatic";

/**
 * 03 INTERLUDE. The single WebGL moment; a breath between the work and the
 * process. No header, no section code. The static wireframe is always in
 * the markup; WireObject (Phase 4) mounts over it on capable desktops.
 */
export function S03Interlude() {
  return (
    <section
      id="interlude"
      aria-label="Interlude: system geometry"
      className="doc-section relative h-[100svh] min-h-[560px] overflow-hidden"
      data-section="03"
      data-cursor="ORBIT"
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        data-wire-mount
      >
        <WireStatic className="h-[min(64svh,64vw)] w-[min(64svh,64vw)]" />
      </div>

      <div className="container-doc absolute inset-x-0 bottom-0 pb-10 md:pb-14">
        <p className="serif-h2 max-w-[26ch]" data-interlude-line>
          {interlude.line}
        </p>
        <p className="mono mt-5 leading-relaxed">{interlude.caption}</p>
      </div>
    </section>
  );
}
