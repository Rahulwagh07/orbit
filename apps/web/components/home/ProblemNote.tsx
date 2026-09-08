import { Reveal } from "./Reveal";

export function ProblemNote() {
  return (
    <section className="mt-6 max-w-md">
      <Reveal>
        <p className="text-[15.5px] leading-relaxed text-muted">
          <span className="text-ink">A 4 GB installer to preview one file.</span> Fans on,
          battery gone. That&apos;s the whole problem.
        </p>
      </Reveal>
    </section>
  );
}
