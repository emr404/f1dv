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


