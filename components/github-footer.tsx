import Link from "next/link"

const GITHUB_URL = "https://github.com/alkaifaftab000"

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.334-5.466-5.931 0-1.31.468-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.628-5.476 5.922.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

/**
 * variant="default" → horizontal footer bar (for public pages via root layout)
 * variant="sidebar" → compact block in the admin sidebar
 */
export function GitHubFooter({ variant = "default" }: { variant?: "default" | "sidebar" }) {
  if (variant === "sidebar") {
    return (
      <div className="p-4 border-t border-gray-800">
        <Link
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200 group"
          aria-label="View on GitHub"
        >
          <GitHubIcon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-gray-500 group-hover:text-gray-300 leading-tight">
              Made with <span className="text-pink-400">💖</span> by
            </span>
            <span className="text-sm font-semibold text-gray-300 group-hover:text-white truncate leading-tight">
              alkaifaftab000
            </span>
          </div>
        </Link>
        <p className="mt-1 px-4 text-xs text-gray-600 group-hover:text-gray-500">
          ⭐ Star it on GitHub!
        </p>
      </div>
    )
  }

  // Default: full-width footer bar
  return (
    <footer className="w-full border-t border-border bg-background/80 backdrop-blur-sm py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          Made with <span className="text-pink-500 text-base">💖</span> by
        </span>
        <Link
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-orange-600 transition-all duration-200 group"
          aria-label="View alkaifaftab000 on GitHub"
        >
          <GitHubIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          <span>alkaifaftab000</span>
        </Link>
        <span className="hidden sm:inline text-border">·</span>
        <span className="text-xs sm:text-sm">
          If you like it, please give it a{" "}
          <span className="text-yellow-500 font-semibold">⭐</span>
        </span>
      </div>
    </footer>
  )
}
