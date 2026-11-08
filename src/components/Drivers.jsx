import { useState } from "react";
import { Bar, pointsChart } from "../charts";
import { useF1Data } from "../api";
import {
  PageHeader,
  ReportCard,
  Panel,
  Stat,
  Position,
  Icon,
  EmptyState,
} from "./Interface";
import Autocomplete from "./Autocomplete";
import Loader from "./Loader";

const Drivers = () => {
  const [search, setSearch] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [query, setQuery] = useState(null);
  const { data: driverData, error: driversError } = useF1Data(
    "drivers.json?limit=100&offset=0",
  );
  const drivers = (driverData?.DriverTable.Drivers ?? [])
    .map((driver) => ({
      id: driver.driverId,
      label: `${driver.givenName} ${driver.familyName}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const { data: seasonsData, error: seasonsError } = useF1Data(
    selectedDriver
      ? `drivers/${encodeURIComponent(selectedDriver.id)}/seasons.json?limit=100`
      : null,
  );
  const seasons = (seasonsData?.SeasonTable.Seasons ?? [])
    .map(({ season }) => season)
    .sort((a, b) => Number(b) - Number(a));
  const selectedYear = seasons.includes(String(year))
    ? String(year)
    : (seasons[0] ?? "");
  const handleSearch = (value) => {
    setSearch(value);
    setSelectedDriver(null);
  };
  const handleSelect = (driver) => {
    setSearch(driver.label);
    setSelectedDriver(driver);
    setYear(new Date().getFullYear());
  };
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
      nationality: result.Driver.nationality,
    })),
  );
  const handleChange = (event) =>
    setYear(event.target.value || new Date().getFullYear());
  const handleClick = (event) => {
    event.preventDefault();
    if (selectedDriver && selectedYear)
      setQuery(
        `${selectedYear}/drivers/${encodeURIComponent(selectedDriver.id)}/results.json?limit=100`,
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
          <span id="driver-name-label">Driver:</span>
          <Autocomplete
            suggestions={drivers}
            value={search}
            onChange={handleSearch}
            onSelect={handleSelect}
          />
        </label>
        <label htmlFor="driver-year">
          Select Year
          <select
            id="driver-year"
            value={selectedYear}
            onChange={handleChange}
            disabled={!seasons.length}
          >
            {!seasons.length && (
              <option value="">
                {!selectedDriver
                  ? "Choose a driver first"
                  : seasonsData
                    ? "No seasons available"
                    : "Loading seasons…"}
              </option>
            )}
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
          disabled={!selectedDriver || !selectedYear}
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
          Search for a driver, choose a season and click GO to explore their
          race by race performance.
        </EmptyState>
      ) : (
        <>
          {activeDriver.slice(0, 1).map((driver) => (
            <ReportCard
              key={driver.season}
              className="driver-profile"
              label="DRIVER PROFILE"
              context={driver.season}
              title={`${driver.fname} ${driver.lname}`}
              subtitle={
                <>
                  {driver.car}
                  {driver.nationality && (
                    <>
                      <span>•</span>
                      {driver.nationality}
                    </>
                  )}
                </>
              }
              tags={[
                { icon: "flag", label: `Races: ${activeDriver.length}` },
                { label: `Season: ${driver.season}` },
              ]}
            />
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
            <div
              className="table-scroll"
              role="region"
              aria-label="Race history"
              tabIndex={0}
            >
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
