/** Moldura fina roxa em volta da página (some no celular), halos e granulado. */
export function Moldura() {
  return (
    <>
      <div className="pointer-events-none fixed inset-3 z-[45] hidden rounded-[28px] border border-roxo/40 lg:block" aria-hidden="true" />
      <div className="granulado" aria-hidden="true" />
    </>
  );
}
