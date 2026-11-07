import { useState } from "react";
import { Bar, pointsChart } from "../charts";
import { useF1Data, useSeasons } from "../api";
import {
  PageHeader,
  Panel,
  Stat,
  Position,
  Icon,
  EmptyState,
} from "./Interface";
import Autocomplete from "./Autocomplete";
import Loader from "./Loader";

const Drivers = () => {
  const [state, setState] = useState("");
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [query, setQuery] = useState(null);
  const { seasons, error: seasonsError } = useSeasons();
  const { data: driverData, error: driversError } = useF1Data(
    "drivers.json?limit=100&offset=0",
  );
  const drivers =
    driverData?.DriverTable.Drivers.map((driver) => driver.driverId) ?? [];
  const { data, error } = useF1Data(query, { keepPreviousData: true });
  const activeDriver = (data?.RaceTable.Races ?? []).flatMap((race) =>
    race.Results.map((result) => ({
      race: race.raceName,
      points: result.points,
      position: result.position,
      season: race.season,
      car: result.Constructor.name,
      fname: result.Driver.givenName,
      lname: result.Driver.familyName,
    })),
  );
  const handleChange = (event) =>
    setYear(event.target.value || new Date().getFullYear());
  const handleClick = (event) => {
    event.preventDefault();
    if (state.trim())
      setQuery(
        `${year}/drivers/${encodeURIComponent(state.trim())}/results.json?limit=100`,
      );
  };
  const chartData = pointsChart(
    activeDriver.map((driver) => driver.race),
    activeDriver.map((driver) => driver.points),
    activeDriver.map((driver) => driver.position),
  );
  chartData.datasets[0].borderWidth = 0;
  chartData.datasets[0].hoverBorderWidth = 0;
  return (
    <div className="DriverContainer">
      <PageHeader
        title="Drivers"
        description="Explore driver performance by season."
      />
      <form className="filter-bar DriverSearch" onSubmit={handleClick}>
        <div className="filter-intro">
          <Icon name="drivers" />
          <span>Driver explorer</span>
        </div>
        <label htmlFor="driver-name">
          Last Name:
          <Autocomplete
            suggestions={drivers}
            value={state}
            onChange={setState}
          />
        </label>
        <label htmlFor="driver-year">
          Select Year
          <select id="driver-year" value={year} onChange={handleChange}>
            {seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </label>
        <button
          className="primary-button"
          type="submit"
          disabled={!state.trim()}
        >
          GO <Icon name="arrow" size={17} />
        </button>
      </form>
      {error || seasonsError || driversError ? (
        <p role="alert" className="error-message">
          {error || seasonsError || driversError}
        </p>
      ) : query && !data ? (
        <Loader />
      ) : !query ? (
        <EmptyState title="Meet the person behind the points">
          Search for a driver, choose a season, and click GO to explore their
          race by race performance.
        </EmptyState>
      ) : (
        <>
          {activeDriver.slice(0, 1).map((driver) => (
            <section className="driver-profile" key={driver.season}>
              <div className="driver-avatar" aria-hidden="true">
                {driver.fname[0]}
                {driver.lname[0]}
              </div>
              <div>
                <span className="eyebrow">
                  DRIVER PROFILE / {driver.season}
                </span>
                <h2>
                  Driver: {driver.fname} {driver.lname}
                </h2>
                <p>{driver.car}</p>
              </div>
              <span className="profile-season">{driver.season}</span>
            </section>
          ))}
          <div className="stats-strip">
            <Stat
              label="SEASON POINTS"
              value={activeDriver.reduce(
                (sum, driver) => sum + Number(driver.points),
                0,
              )}
              detail="Across all Grands Prix"
            />
            <Stat
              label="RACES"
              value={activeDriver.length}
              detail="Race appearances"
            />
            <Stat
              label="BEST FINISH"
              value={
                activeDriver.length
                  ? `P${Math.min(...activeDriver.map((driver) => Number(driver.position)))}`
                  : "—"
              }
              detail="Highest classification"
            />
          </div>
          <Panel
            title="A season in points"
            subtitle="Race by race championship contribution"
            aside={
              <span className="chart-key">
                <i /> Points
              </span>
            }
          >
            <div className="chart-wrap">
              <Bar
                role="img"
                aria-label="Points scored in each race of the selected season"
                data={chartData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </Panel>
          <Panel
            title="Race history"
            subtitle="Finishing positions and points by Grand Prix."
          >
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">POSITION</th>
                    <th scope="col">GRAND PRIX</th>
                    <th scope="col" className="points-cell">
                      POINTS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeDriver.map((driver) => (
                    <tr className="DriversList" key={driver.race}>
                      <td>
                        <Position value={driver.position} />
                      </td>
                      <td>
                        <strong>{driver.race}</strong>
                      </td>
                      <td className="points-cell">
                        <strong>{driver.points}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </>
      )}
    </div>
  );
};
export default Drivers;
