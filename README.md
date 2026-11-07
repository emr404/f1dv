# Formula One Data Visualizer (F1DV)

## About

F1DV is a web application that enables users dynamically get schedules, results and standings of current and previous Formula One Races from an API and display them into different charts and graphs. Users are also able to search up drivers, view their results and filter the results by the season which they raced.

## Tools Used

- ReactJS
- SCSS
- ChartJS

## Deployment

GitHub Pages is configured for [emr404/f1dv](https://github.com/emr404/f1dv).

1. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Commit and push these changes to `master`.
3. The **Deploy to GitHub Pages** workflow builds and publishes the site. It can
   also be started manually from the **Actions** tab.

Once deployed, the site will be at **https://emr404.github.io/f1dv/**.

The workflow obtains the deployment base path from GitHub Pages configuration,
so asset paths also work if Pages later uses a custom domain. Navigation uses
hash routes such as `/f1dv/#/Drivers`, which support direct links and refreshes
without server rewrite rules.

To preview the GitHub Pages build locally:

```sh
npm run build:pages
npm run preview:pages
```

Open http://localhost:4173/f1dv/. The `:pages` scripts target this repository's
`/f1dv/` path; the normal development and build commands continue to use `/`.

# Getting Started

Use Node.js 22.12+ (Node 22) or Node.js 24+. Node.js 24 LTS is recommended.

From the project folder:

```sh
npm ci
npm start
```

Open http://localhost:3000. Stop the server with Ctrl+C.

## Checks and production build

```sh
npm run build
npm run preview
```

`npm run build` creates
production files in `build/`. `npm run preview` serves that build locally at
http://localhost:4173. Routes use URL fragments such as `/#/Drivers`, so any
static host can serve them without special fallback configuration.

## Maintenance

The app uses React 19, Vite, React Router 7, Chart.js 4, and Sass. npm is the package
manager; commit `package-lock.json` when updating dependencies.

F1 data now comes from [Jolpica's Ergast-compatible API](https://github.com/jolpica/jolpica-f1),
the replacement for the original Ergast service. An internet connection is needed
for race data and the Google Fonts used by the dashboard; system fonts are the
fallback when fonts are unavailable. The red, black, and white interface includes
responsive navigation, race summaries, points charts, classification tables,
championship podiums, and calendar cards. The presentation follows BoardUI's
compact navigation and typography, with dark accents and sharper cards,
implemented with the existing Sass stack. No BoardUI runtime package or plugin is required.

Year selectors default to the current calendar year, and race results start at
the most recent round dated today or earlier, displayed by its round number and
race name in the dropdown. Future-dated races are excluded from that list. Only calendar metadata loads before GO. Year options run from newest to oldest. Race and driver
results load only after GO is clicked; changing filters keeps the submitted results
visible until the next GO. Standings podium cards use gold, silver, and bronze backgrounds.
The outline helmet logo identifies the app, and the original red/black bouncing-bar
loader is retained. The top three
finishers have gold, silver, and bronze accents. Existing routes and the schedule
range are retained.
