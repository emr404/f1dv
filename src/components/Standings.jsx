import { useState } from "react";
import { StandingsPointsShare } from "./RadialCharts";
import { useF1Data, useSeasons } from "../api";
import Loader from "./Loader";
import { PageHeader, Panel, Position, Icon } from "./Interface";

const Standings = () => {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const { seasons: seasonList, error: seasonsError } = useSeasons();
  const { data, error } = useF1Data(`${year}/driverStandings.json`);
  const raceEvent = (data?.StandingsTable.StandingsLists ?? []).flatMap(
    (race) =>
      race.DriverStandings.map((driver) => ({
        name: driver.Driver.familyName,
        fname: driver.Driver.givenName,
        points: driver.points,
        position: driver.position,
        car: driver.Constructors[0]?.name,
        number: driver.Driver.permanentNumber,
      })),
  );
  const handleChange = (event) =>
    setYear(event.target.value || new Date().getFullYear());
  return (
    <div className="StandingsContainer">
      <PageHeader title="Standings" />
      <div className="filter-bar Season">
        <div className="filter-intro">
          <Icon name="standings" />
          <span>
            Season: <strong>{year}</strong>
          </span>
        </div>
        <label htmlFor="standings-year">
          Select Year:
          <select id="standings-year" value={year} onChange={handleChange}>
            {seasonList.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error || seasonsError ? (
        <p role="alert" className="error-message">
          {error || seasonsError}
        </p>
      ) : !data ? (
        <Loader />
      ) : (
        <>
          <div
            className="podium-grid"
            role="region"
            aria-label="Top three drivers"
            tabIndex={0}
          >
            {raceEvent.slice(0, 3).map((driver, index) => (
              <div
                key={driver.position}
                className={`podium-card podium-${index}`}
              >
                <span className="podium-watermark" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="eyebrow">
                  {index === 0
                    ? "CHAMPIONSHIP LEADER"
                    : `POSITION ${index + 1}`}
                </span>
                <h2>
                  {driver.fname} <strong>{driver.name}</strong>
                </h2>
                <div className="podium-footer">
                  <span>{driver.car}</span>
                  <strong>
                    {driver.points}
                    <small> PTS</small>
                  </strong>
                </div>
              </div>
            ))}
          </div>
          <StandingsPointsShare key={year} drivers={raceEvent} />
          <Panel
            title="Driver standings"
            aside={
              <span className="count-badge">{raceEvent.length} DRIVERS</span>
            }
          >
            <div
              className="table-scroll"
              role="region"
              aria-label="Driver standings"
              tabIndex={0}
            >
              <table>
                <thead>
                  <tr>
                    <th scope="col">POS</th>
                    <th scope="col">DRIVER</th>
                    <th scope="col">CONSTRUCTOR</th>
                    <th scope="col">NO.</th>
                    <th scope="col" className="points-cell">
                      POINTS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {raceEvent.map((driver) => (
                    <tr className="DriversList" key={driver.position}>
                      <td>
                        <Position value={driver.position} />
                      </td>
                      <td>
                        <span className="driver-name">
                          {driver.fname} <strong>{driver.name}</strong>
                        </span>
                      </td>
                      <td>
                        <span className="constructor-name">{driver.car}</span>
                      </td>
                      <td className="number-cell">{driver.number || "—"}</td>
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
export default Standings;
