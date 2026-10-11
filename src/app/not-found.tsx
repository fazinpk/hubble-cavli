import ButtonLink from "@components/ui/button-link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-semibold tracking-wider text-brand uppercase">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold text-navy">Page not found</h1>
      <p className="mt-3 text-muted">
        The page you are looking for doesn&apos;t exist or has moved.
      </p>
      <ButtonLink href="/#modules" className="mt-8">
        Browse modules
      </ButtonLink>
    </div>
  );
}
