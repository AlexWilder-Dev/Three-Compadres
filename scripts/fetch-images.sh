#!/usr/bin/env bash
# Downloads the venue's photos into public/images/site/.
# Tries the full-size original first (size suffix removed), then the listed size.
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p public/images/site

urls=(
  "https://threecompadres.co.uk/wp-content/uploads/2026/07/Screenshot-2026-07-05-at-15.49.56-1024x796.png"
  "https://threecompadres.co.uk/wp-content/uploads/2026/07/IMG_2505-683x1024.jpg"
  "https://threecompadres.co.uk/wp-content/uploads/2026/07/IMG_2588-1024x683.jpg"
  "https://threecompadres.co.uk/wp-content/uploads/2026/07/IMG_2604-683x1024.jpg"
  "https://threecompadres.co.uk/wp-content/uploads/2026/07/unnamed-1024x768.webp"
  "https://threecompadres.co.uk/wp-content/uploads/2026/07/IMG_2436-1024x683.jpg"
  "https://threecompadres.co.uk/wp-content/uploads/2026/07/IMG_2414-683x1024.jpg"
)

for url in "${urls[@]}"; do
  full=$(echo "$url" | sed -E 's/-[0-9]+x[0-9]+(\.[a-z]+)$/\1/')
  name=$(basename "$full")
  if curl -fsSL "$full" -o "public/images/site/$name"; then
    echo "full size  $name"
  elif curl -fsSL "$url" -o "public/images/site/$(basename "$url")"; then
    echo "listed     $(basename "$url")"
  else
    echo "FAILED     $url" >&2
  fi
done
