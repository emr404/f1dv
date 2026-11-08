import { useEffect, useState } from "react";
import { Line, pointsChart } from "../charts";
import { useF1Data, useSeasons } from "../api";
import Loader from "./Loader";
import {
  PageHeader,
  ReportCard,
  Panel,
  Stat,
  Position,
  Icon,
  EmptyState,
} from "./Interface";

const Result = () => {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [round, setRound] = useState("last");
  const { seasons: seasonList, error: seasonsError } = useSeasons();
  // One winner per race lists published rounds without downloading every driver result.
  const { data: publishedRounds, error: roundsError } = useF1Data(
    `${year}/results/1.json?limit=100`,
  );
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  const rounds = (publishedRounds?.RaceTable.Races ?? [])
    .filter((race) => race.Results?.length && race.date <= today)
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) || Number(a.round) - Number(b.round),
    );
  const selectedRound = round === "last" ? (rounds.at(-1)?.round ?? "") : round;
  const roundsReady = Boolean(publishedRounds && rounds.length);
  const [query, setQuery] = useState(null);
  const [initialLoadPending, setInitialLoadPending] = useState(true);

  useEffect(() => {
    if (!initialLoadPending || !publishedRounds) return;
    setInitialLoadPending(false);
    if (roundsReady && selectedRound) setQuery(`${year}/${selectedRound}`);
  }, [initialLoadPending, publishedRounds, roundsReady, selectedRound, year]);
  const applyQuery = (event) => {
    event.preventDefault();
    setInitialLoadPending(false);
    if (roundsReady && selectedRound) setQuery(`${year}/${selectedRound}`);
  };
  const { data, error, isFetching } = useF1Data(
    query ? `${query}/results.json` : null,
    {
      keepPreviousData: true,
    },
  );
  const races = data?.RaceTable.Races ?? [];
  const results = races.flatMap((race) =>
    race.Results.map((result) => ({
      position: result.position,
      num: result.Driver.permanentNumber,
      car: result.Constructor.name,
      points: result.points,
      name: result.Driver.givenName,
      surname: result.Driver.familyName,
    })),
  );
  const handleClick = (event) => {
    setInitialLoadPending(false);
    setRound(event.target.value);
  };
  const handleChange = (event) => {
    setInitialLoadPending(false);
    setYear(event.target.value || new Date().getFullYear());
    setRound("last");
  };
  const race = races[0];
  const winner = results[0];
  const plottedData = pointsChart(
    results.map((driver) => driver.surname),
    results.map((driver) => driver.points),
    results.map((driver) => driver.position),
  );
  return (
    <div
      className="ResultContainer"
      aria-busy={isFetching || (initialLoadPending && !roundsError)}
    >
      <PageHeader
        title="Race results"
        description="Race results and championship points."
      />
      <form className="filter-bar ResultSearch" onSubmit={applyQuery}>
        <div className="filter-intro">
          <Icon name="results" />
          <span>Race explorer</span>
        </div>
        <label htmlFor="result-season">
          Select Season:
          <select id="result-season" value={year} onChange={handleChange}>
            {seasonList.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="result-round">
          Select Round:
          <select
            id="result-round"
            value={roundsReady ? selectedRound : ""}
            onChange={handleClick}
            disabled={!roundsReady}
          >
            {!roundsReady && (
              <option value="">
                {publishedRounds ? "No published results" : "Loading rounds…"}
              </option>
            )}
            {rounds.map((race) => (
              <option key={race.round} value={race.round}>
                Round {race.round} · {race.raceName}
              </option>
            ))}
          </select>
        </label>
        <button
          className="primary-button"
          type="submit"
          disabled={!roundsReady}
        >
          GO <Icon name="arrow" size={17} />
        </button>
      </form>
      {isFetching && data && (
        <p className="update-status" role="status">
          Updating results…
        </p>
      )}
      {error || seasonsError || roundsError ? (
        <p role="alert" className="error-message">
          {error || seasonsError || roundsError}
        </p>
      ) : initialLoadPending ? (
        <Loader />
      ) : !query ? (
        <EmptyState title={rounds.length ? "Choose a race" : "No results yet"}>
          {rounds.length
            ? "Select a season and round, then click GO to see the results."
            : "No race results have been published for this season. Choose an earlier season."}
        </EmptyState>
      ) : !data ? (
        <Loader />
      ) : !race ? (
        <div className="empty-state">
          <h2>No results found</h2>
          <p>Choose another season or round to explore.</p>
        </div>
      ) : (
        <>
          <ReportCard
            label="RACE REPORT"
            context={race.season}
            title={race.raceName}
            titleClassName="RaceName"
            subtitle={
              <>
                {race.Circuit?.circuitName}
                <span>•</span>
                {race.Circuit?.Location.country}
              </>
            }
            tags={[
              { icon: "flag", label: `Round: ${race.round}` },
              {
                label: new Date(`${race.date}T12:00:00Z`).toLocaleDateString(
                  "en-GB",
                  { day: "2-digit", month: "long", year: "numeric" },
                ),
              },
            ]}
          />
          <div className="stats-strip">
            <Stat
              label="RACE WINNER"
              value={winner ? `${winner.name} ${winner.surname}` : "—"}
              detail={winner?.car}
            />
            <Stat
              label="WINNING POINTS"
              value={winner?.points}
              detail="Championship points"
            />
            <Stat
              label="ON THE GRID"
              value={results.length}
              detail="Drivers classified"
            />
            <Stat
              label="SEASON"
              value={race.season}
              detail={`Round ${race.round}`}
            />
          </div>
          <Panel
            title="Points distribution"
            subtitle="How the race translated into championship points"
            aside={
              <span className="chart-key">
                <i /> Points
              </span>
            }
          >
            <div className="chart-wrap">
              <Line
                role="img"
                aria-label="Points by driver for the race result"
                data={plottedData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </Panel>
          <Panel
            title="Race results"
            subtitle="The complete finishing order"
            aside={
              <span className="count-badge">{results.length} DRIVERS</span>
            }
            className="classification-panel"
          >
            <div
              className="table-scroll"
              role="region"
              aria-label="Race results"
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
                  {results.map((driver) => (
                    <tr
                      key={driver.position}
                      className={`DriversList ${["gold", "silver", "bronze"][Number(driver.position) - 1] || ""}`}
                    >
                      <td>
                        <Position value={driver.position} />
                      </td>
                      <td>
                        <span className="driver-name">
                          {driver.name} <strong>{driver.surname}</strong>
                        </span>
                      </td>
                      <td>
                        <span className="constructor-name">{driver.car}</span>
                      </td>
                      <td className="number-cell">{driver.num || "—"}</td>
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
export default Result;
