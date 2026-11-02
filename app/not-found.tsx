import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-7xl bg-paper px-4 py-16 md:px-6">
      <h1 className="text-3xl md:text-4xl">Page not found</h1>
      <p className="prose-text mt-3 max-w-2xl text-lg text-foreground/90">
        There is nothing at this address. Try the{" "}
        <Link href="/" className="underline underline-offset-2">simulator</Link> or the{" "}
        <Link href="/learn" className="underline underline-offset-2">lessons</Link>.
      </p>
    </div>
  );
}
