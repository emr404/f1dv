import { PageHeader, ReportCard, EmptyState } from "./Interface";
import { useF1Data } from "../api";
import Loader from "./Loader";

const raceStart = (race) =>
  Date.parse(`${race.date}T${race.time || "00:00:00Z"}`);

const Schedule = () => {
  const { data, error } = useF1Data("current.json");
  const now = Date.now();
  const schedule = (data?.RaceTable.Races ?? [])
    .filter((race) => raceStart(race) > now)
    .sort((a, b) => raceStart(a) - raceStart(b))
    .map((race) => ({
      date: race.date,
      race: race.raceName,
      time: race.time,
      round: race.round,
      circuit: race.Circuit.circuitName,
      country: race.Circuit.Location.country,
      city: race.Circuit.Location.locality,
    }));
  return (
    <div className="ScheduleContainer">
      <PageHeader title="Schedule" />
      {error ? (
        <p role="alert" className="error-message">
          {error}
        </p>
      ) : !data ? (
        <Loader />
      ) : (
        <>
          <div className="schedule-intro">
            <div>
              <h2>
                {data.RaceTable.season || new Date().getFullYear()} upcoming
                races
              </h2>
            </div>
            <span className="count-badge">{schedule.length} UPCOMING</span>
          </div>
          {!schedule.length ? (
            <EmptyState title="No upcoming races">
              There are no more scheduled races this season.
            </EmptyState>
          ) : (
            <div className="schedule-grid">
              {schedule.map((race) => (
                <ReportCard
                  key={race.round}
                  className="schedule-card ScheduleListContainer"
                  label="UPCOMING RACE"
                  context={`Round ${race.round}`}
                  title={race.race}
                  subtitle={
                    <>
                      {race.circuit}
                      <br />
                      {race.city}, {race.country}
                    </>
                  }
                  tags={[
                    {
                      icon: "schedule",
                      label: new Date(
                        `${race.date}T12:00:00Z`,
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }),
                    },
                    {
                      label: race.time
                        ? `${race.time.slice(0, 5)} UTC`
                        : "Time TBC",
                    },
                  ]}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Schedule;
