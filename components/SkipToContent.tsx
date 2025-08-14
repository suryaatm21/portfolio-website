export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-brand-cta text-white px-4 py-2 rounded-md font-medium transition-all focus:ring-2 focus:ring-brand-cta focus:ring-offset-2"
    >
      Skip to main content
    </a>
  )
}
