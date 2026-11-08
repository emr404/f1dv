import { useMemo, useState } from "react";
import { MixedChart, pointsChart } from "../charts";
import { EmptyState, Icon, Panel } from "./Interface";

const positionValue = (value) =>
  Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : null;
const positionLabel = (value) =>
  positionValue(value) ? `P${Number(value)}` : "Not recorded";
const metricDefinitions = [
  { id: "points", label: "Race points", style: "bar" },
  { id: "finish", label: "Classified finish", style: "finish" },
  { id: "grid", label: "Starting grid", style: "grid" },
  { id: "cumulative", label: "Cumulative race points", style: "cumulative" },
];

const raceHighlight = {
  id: "raceHighlight",
  beforeDatasetsDraw(chart, args, options) {
    const index = chart.getActiveElements()[0]?.index ?? options.index;
    const count = chart.data.labels?.length ?? 0;
    if (index < 0 || index >= count || !chart.chartArea) return;
    const {
      ctx,
      chartArea,
      scales: { x },
    } = chart;
    const center = x.getPixelForValue(index);
    const left =
      index > 0 ? (x.getPixelForValue(index - 1) + center) / 2 : chartArea.left;
    const right =
      index < count - 1
        ? (x.getPixelForValue(index + 1) + center) / 2
        : chartArea.right;
    const start = Math.max(chartArea.left, left);
    const end = Math.min(chartArea.right, right);
    ctx.save();
    ctx.fillStyle = "rgba(232, 39, 39, 0.08)";
    ctx.fillRect(
      start,
      chartArea.top,
      end - start,
      chartArea.bottom - chartArea.top,
    );
    ctx.restore();
  },
};

export default function SeasonPerformance({ races }) {
  const timeline = useMemo(() => {
    let cumulative = 0;
    return [...races]
      .sort((a, b) => Number(a.round) - Number(b.round))
      .map((race) => {
        const points = Number(race.points) || 0;
        cumulative = Math.round((cumulative + points) * 1000) / 1000;
        return {
          ...race,
          points,
          grid: positionValue(race.grid),
          finish: positionValue(race.position),
          cumulative,
        };
      });
  }, [races]);
  const hasGrid = timeline.some((race) => race.grid !== null);
  const [metrics, setMetrics] = useState({
    points: true,
    finish: true,
    grid: hasGrid,
    cumulative: false,
  });
  const [range, setRange] = useState("all");
  const [selectedRound, setSelectedRound] = useState(null);
  const [hoveredRound, setHoveredRound] = useState(null);
  const visibleRaces = useMemo(
    () => (range === "all" ? timeline : timeline.slice(-Number(range))),
    [timeline, range],
  );
  const inspectedRace =
    visibleRaces.find(
      (race) => race.round === (hoveredRound ?? selectedRound),
    ) ?? visibleRaces.at(-1);
  const inspectedIndex = visibleRaces.indexOf(inspectedRace);
  const pinnedIndex = visibleRaces.findIndex(
    (race) => race.round === selectedRound,
  );
  const visibleMetricCount = Object.values(metrics).filter(Boolean).length;

  const chartData = useMemo(
    () => ({
      labels: visibleRaces.map((race) => `R${race.round}`),
      datasets: [
        {
          ...pointsChart(
            visibleRaces.map((race) => race.race),
            visibleRaces.map((race) => race.points),
            visibleRaces.map((race) => race.position),
          ).datasets[0],
          type: "bar",
          label: "Race points",
          yAxisID: "points",
          order: 3,
          borderWidth: 0,
          hoverBorderWidth: 0,
          maxBarThickness: 25,
          hidden: !metrics.points,
        },
        {
          type: "line",
          label: "Classified finish",
          data: visibleRaces.map((race) => race.finish),
          yAxisID: "positions",
          order: 0,
          borderColor: "#222228",
          backgroundColor: "#222228",
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#222228",
          borderWidth: 2,
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
          tension: 0,
          spanGaps: false,
          hidden: !metrics.finish,
        },
        {
          type: "line",
          label: "Starting grid",
          data: visibleRaces.map((race) => race.grid),
          yAxisID: "positions",
          order: 1,
          borderColor: "#a1a1ac",
          backgroundColor: "#a1a1ac",
          pointBackgroundColor: "#ffffff",
          pointStyle: "triangle",
          borderDash: [5, 4],
          borderWidth: 1.5,
          pointRadius: 3,
          pointHoverRadius: 6,
          tension: 0,
          spanGaps: false,
          hidden: !metrics.grid,
        },
        {
          type: "line",
          label: "Cumulative race points",
          data: visibleRaces.map((race) => race.cumulative),
          yAxisID: "points",
          order: 2,
          borderColor: "#a37a28",
          backgroundColor: "#a37a28",
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          tension: 0,
          hidden: !metrics.cumulative,
        },
      ],
    }),
    [visibleRaces, metrics],
  );

  const options = useMemo(
    () => ({
      maintainAspectRatio: false,
      animation: {
        duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : 250,
      },
      interaction: { mode: "index", intersect: false },
      onHover(event, elements) {
        setHoveredRound(
          elements.length
            ? (visibleRaces[elements[0].index]?.round ?? null)
            : null,
        );
      },
      onClick(event, elements) {
        if (elements.length)
          setSelectedRound(visibleRaces[elements[0].index]?.round ?? null);
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 14 },
        },
        points: {
          type: "linear",
          position: "left",
          min: 0,
          display: metrics.points || metrics.cumulative,
          title: {
            display: true,
            text: "Points",
            color: "#85858e",
            font: { size: 10 },
          },
          ticks: { maxTicksLimit: 7, precision: 1 },
        },
        positions: {
          type: "linear",
          position: "right",
          reverse: true,
          min: 1,
          max: Math.max(
            20,
            ...visibleRaces.flatMap((race) => [
              race.grid ?? 1,
              race.finish ?? 1,
            ]),
          ),
          display: metrics.finish || metrics.grid,
          title: {
            display: true,
            text: "Position · P1 at top",
            color: "#85858e",
            font: { size: 10 },
          },
          grid: { drawOnChartArea: false },
          ticks: {
            stepSize: 1,
            precision: 0,
            maxTicksLimit: 11,
            callback: (value) => `P${value}`,
          },
        },
      },
      plugins: {
        legend: { display: false },
        raceHighlight: {
          index: pinnedIndex >= 0 ? pinnedIndex : visibleRaces.length - 1,
        },
        tooltip: {
          callbacks: {
            title: (items) => visibleRaces[items[0]?.dataIndex]?.race ?? "",
            label: (item) =>
              `${item.dataset.label}: ${item.dataset.yAxisID === "positions" ? `P${item.parsed.y}` : `${item.parsed.y} pts`}`,
            footer: (items) => visibleRaces[items[0]?.dataIndex]?.status ?? "",
          },
        },
      },
    }),
    [visibleRaces, metrics, pinnedIndex],
  );

  const selectRace = (index) => {
    setSelectedRound(visibleRaces[index].round);
    setHoveredRound(null);
  };
  const movement =
    inspectedRace?.grid && inspectedRace?.finish
      ? inspectedRace.grid - inspectedRace.finish
      : null;

  return (
    <Panel
      title="Season performance explorer"
      subtitle="Points, starting positions and race finishes on one timeline."
      className="performance-panel"
      aside={<span className="count-badge">{timeline.length} RACES</span>}
    >
      {!timeline.length ? (
        <EmptyState title="No race data">
          Choose another driver or season to explore.
        </EmptyState>
      ) : (
        <>
          <div className="performance-toolbar">
            <div
              className="performance-metrics"
              role="group"
              aria-label="Chart metrics"
            >
              {metricDefinitions.map((metric) => (
                <button
                  key={metric.id}
                  type="button"
                  className={`performance-toggle ${metrics[metric.id] ? "is-selected" : ""}`}
                  aria-pressed={metrics[metric.id]}
                  disabled={
                    (metric.id === "grid" && !hasGrid) ||
                    (metrics[metric.id] && visibleMetricCount === 1)
                  }
                  title={
                    metric.id === "grid" && !hasGrid
                      ? "Starting positions are unavailable for this season"
                      : metrics[metric.id] && visibleMetricCount === 1
                        ? "Keep at least one metric visible"
                        : undefined
                  }
                  onClick={() =>
                    setMetrics((previous) => ({
                      ...previous,
                      [metric.id]: !previous[metric.id],
                    }))
                  }
                >
                  <span
                    className={`metric-swatch metric-${metric.style}`}
                    aria-hidden="true"
                  />
                  {metric.label}
                </button>
              ))}
            </div>
            <label className="performance-range">
              Race range
              <select
                value={range}
                onChange={(event) => {
                  setRange(event.target.value);
                  setSelectedRound(null);
                  setHoveredRound(null);
                }}
              >
                <option value="all">Full season</option>
                <option value="10">Last 10 races</option>
                <option value="5">Last 5 races</option>
              </select>
            </label>
          </div>
          <div
            className="performance-chart-scroll"
            role="region"
            aria-label="Season performance chart"
            tabIndex={0}
          >
            <div
              className="performance-chart"
              style={{ minWidth: Math.max(520, visibleRaces.length * 40) }}
              onMouseLeave={() => setHoveredRound(null)}
            >
              <MixedChart
                type="bar"
                role="img"
                aria-label="Driver race points, starting grid, classified finish and cumulative race points. Use the controls and race selector to inspect the data."
                data={chartData}
                options={options}
                plugins={[raceHighlight]}
              />
            </div>
          </div>
          <div className="performance-caption">
            <span>
              {[
                metrics.points || metrics.cumulative
                  ? "Points on the left"
                  : null,
                metrics.finish || metrics.grid
                  ? "Positions on the right"
                  : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
            <span>Hover or tap a race to inspect it</span>
          </div>
          <div className="race-inspector">
            <div className="inspector-heading">
              <div>
                <span className="eyebrow">
                  RACE DETAIL / ROUND {inspectedRace.round}
                </span>
                <h3>{inspectedRace.race}</h3>
                <p>
                  {new Date(
                    `${inspectedRace.date}T12:00:00Z`,
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="inspector-navigation">
                <button
                  type="button"
                  aria-label="Previous race"
                  disabled={inspectedIndex === 0}
                  onClick={() => selectRace(inspectedIndex - 1)}
                >
                  <Icon name="arrow" size={16} />
                </button>
                <label>
                  <span className="sr-only">Inspect race</span>
                  <select
                    value={inspectedRace.round}
                    onChange={(event) => {
                      setSelectedRound(event.target.value);
                      setHoveredRound(null);
                    }}
                  >
                    {visibleRaces.map((race) => (
                      <option key={race.round} value={race.round}>
                        Round {race.round} · {race.race}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  aria-label="Next race"
                  disabled={inspectedIndex === visibleRaces.length - 1}
                  onClick={() => selectRace(inspectedIndex + 1)}
                >
                  <Icon name="arrow" size={16} />
                </button>
              </div>
            </div>
            <dl className="inspector-values">
              <div>
                <dt>Starting grid</dt>
                <dd>{positionLabel(inspectedRace.grid)}</dd>
              </div>
              <div>
                <dt>Classified finish</dt>
                <dd>{positionLabel(inspectedRace.finish)}</dd>
              </div>
              <div>
                <dt>Positions gained</dt>
                <dd className={movement > 0 ? "positive-movement" : ""}>
                  {movement === null
                    ? "Not recorded"
                    : movement > 0
                      ? `+${movement}`
                      : movement}
                </dd>
              </div>
              <div>
                <dt>Race points</dt>
                <dd>{inspectedRace.points}</dd>
              </div>
              <div>
                <dt>Cumulative race points</dt>
                <dd>{inspectedRace.cumulative}</dd>
              </div>
              <div>
                <dt>Race status</dt>
                <dd className="inspector-status">
                  {inspectedRace.status || "Not recorded"}
                </dd>
              </div>
            </dl>
          </div>
          <p className="performance-note">
            Cumulative totals include Grand Prix race points only. Sprint points
            and championship adjustments are not included.
          </p>
        </>
      )}
    </Panel>
  );
}
