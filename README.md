# Gold Karat Rate Calculator – Blog assets (images)

This repo holds blog images used by the main app. The main app loads them via **GitHub raw URLs**—no copy step, no files in the main project.

## URLs used by the blog

The main app’s `blogs/data/*.json` point to:

- **Base:** `https://raw.githubusercontent.com/gns088/GoldKaratRateCalculatorData/main/`
- **Images:** `images/gold-purity.jpg`, `images/22k-gold-calculator.jpg`, `images/916-hallmark.jpg`, `images/making-charges.jpg`, `images/24k-vs-22k.jpg`, `images/war-gold-silver.jpg`
- **Icons:** `icons/icon-512x512.png`

Push changes here; the blog will show the new images as soon as the raw URLs resolve (use branch `main`).

## Folder structure

- **`images/`** – Blog post images (same filenames as in the table above).
- **`icons/`** – `icon-512x512.png` (optional, for understanding-karat-rates post).

Placeholder files are included. Replace with real assets and push to this repo.

## Setup (one-time)

If you are cloning this repo into the main project (folder is gitignored there):

```bash
# From main project root
git clone git@github.com:gns088/GoldKaratRateCalculatorData.git GoldKaratRateCalculatorData
```

To connect an existing folder to this remote:

```bash
cd GoldKaratRateCalculatorData
git init
git remote add origin git@github.com:gns088/GoldKaratRateCalculatorData.git
git branch -M main
# Then add, commit, and push
```
