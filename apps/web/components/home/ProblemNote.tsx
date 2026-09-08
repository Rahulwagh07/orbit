import { Reveal } from "./Reveal";

export function ProblemNote() {
  return (
    <section className="mt-6 max-w-md">
      <Reveal>
        <p className="text-[15.5px] leading-relaxed text-muted">
          <span className="text-ink">I once downloaded a 4 GB installer just to peek at one file,</span>{" "}
          and my fans ran the whole time. That download is the part Orbit skips.
        </p>
      </Reveal>
    </section>
  );
}
