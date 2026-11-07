import { PageHeader, Icon } from "./Interface";
import { useF1Data } from "../api";
import Loader from "./Loader";

const Schedule = () => {
  const { data, error } = useF1Data("current.json");
  const schedule = (data?.RaceTable.Races ?? []).map((race) => ({
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
      <PageHeader
        title="Schedule"
        description="Grand Prix dates, circuits, and race times."
      />
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
              <span className="eyebrow">RACE CALENDAR</span>
              <h2>
                {data.RaceTable.season || new Date().getFullYear()} race
                calendar
              </h2>
            </div>
            <span className="count-badge">ROUNDS 10–18</span>
          </div>
          <div className="schedule-grid">
            {schedule.slice(9, 18).map((race) => {
              const date = new Date(`${race.date}T12:00:00Z`);
              return (
                <article
                  className="schedule-card ScheduleListContainer"
                  key={race.round}
                >
                  <div className="schedule-card-top">
                    <span className="eyebrow">
                      ROUND {String(race.round).padStart(2, "0")}
                    </span>
                    <Icon name="flag" />
                  </div>
                  <div className="schedule-date">
                    <strong>
                      {date.toLocaleDateString("en-GB", { day: "2-digit" })}
                    </strong>
                    <span>
                      {date.toLocaleDateString("en-GB", { month: "short" })}
                      <br />
                      {date.getFullYear()}
                    </span>
                  </div>
                  <h2>{race.race}</h2>
                  <p>{race.circuit}</p>
                  <div className="schedule-card-footer">
                    <span>
                      {race.city}, {race.country}
                    </span>
                    <span>
                      {race.time ? `${race.time.slice(0, 5)} UTC` : "Time TBC"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
export default Schedule;
