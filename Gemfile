source "https://rubygems.org"

# The `github-pages` gem pins Jekyll and every plugin to the exact versions
# GitHub Pages itself runs. Building with it means the GitHub Actions workflow
# produces the same output the legacy Pages build did — no surprises.
# To move to a newer Jekyll later, drop this line and uncomment the block below.
gem "github-pages", group: :jekyll_plugins

# --- Newer Jekyll (opt-in, not active) -------------------------------------
# gem "jekyll", "~> 4.3"
# group :jekyll_plugins do
#   gem "jekyll-paginate"
#   gem "jekyll-sitemap"
#   gem "jekyll-gist"
#   gem "jekyll-feed"
#   gem "jemoji"
# end
# ---------------------------------------------------------------------------

# Needed to run `jekyll serve` on Ruby 3.x, which no longer bundles webrick.
gem "webrick", "~> 1.8"

# Windows / JRuby timezone data
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem "wdm", "~> 0.1.1", platforms: [:mingw, :mswin, :x64_mingw]
