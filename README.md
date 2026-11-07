# Formula One Data Visualizer (F1DV)

## About

F1DV is a web application that enables users dynamically get schedules, results and standings of current and previous Formula One Races from an API and display them into different charts and graphs. Users are also able to search up drivers, view their results and filter the results by the season which they raced.

## Tools Used

- ReactJS
- SCSS
- ChartJS

## Deployment

Check it out [Here](https://f1dv.netlify.app)

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
http://localhost:4173. Static hosting must serve `index.html` for client routes
such as `/Drivers`, `/Standings`, and `/Schedule`.

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
