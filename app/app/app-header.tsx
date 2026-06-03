import Link from "next/link";

export function AppHeader() {
  return (
    <header className="appHeader">
      <Link href="/tonight" className="brand" aria-label="Forkcast home">
        <span className="brandMark" aria-hidden="true" />
        <span>
          <strong>Forkcast</strong>
          <small>Today&apos;s forecast.</small>
        </span>
      </Link>
    </header>
  );
}
