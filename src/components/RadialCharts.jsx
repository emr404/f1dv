import { useMemo, useState } from "react";
import { Doughnut } from "../charts";
import { EmptyState, Panel } from "./Interface";

const number = (value) =>
  Number(value).toLocaleString("en-GB", { maximumFractionDigits: 3 });
const percentage = (value, total) =>
  `${number(total ? Math.round((value / total) * 1000) / 10 : 0)}%`;
const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function RadialChart({
  data,
  options,
  label,
  value,
  caption,
  detail,
  onLeave,
}) {
  return (
    <div className="radial-chart" onMouseLeave={onLeave}>
      <Doughnut role="img" aria-label={label} data={data} options={options} />
      <div className="radial-center" aria-hidden="true">
        <strong>{value}</strong>
        <span>{caption}</span>
        {detail && <small>{detail}</small>}
      </div>
    </div>
  );
}

function RadialLegend({
  items,
  activeIndex,
  selectedIndex,
  onSelect,
  onHover,
}) {
  return (
    <ul className="radial-legend" onMouseLeave={() => onHover(null)}>
      {items.map((item, index) => (
        <li key={item.label}>
          <button
            type="button"
            className={`radial-legend-row ${activeIndex === index ? "is-active" : ""}`}
            aria-pressed={selectedIndex === index}
            onClick={() => onSelect(index)}
            onMouseEnter={() => onHover(index)}
            onFocus={() => onHover(index)}
            onBlur={() => onHover(null)}
          >
            <span
              className="radial-swatch"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span className="radial-legend-text">
              <strong>{item.label}</strong>
              <small>{item.detail}</small>
            </span>
            <span className="radial-legend-value">{item.value}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function DriverPerformanceRings({ races }) {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(null);
  const activeIndex = hovered ?? selected;
  const total = races.length;
  const metrics = useMemo(
    () => [
      {
        label: "Win rate",
        count: races.filter((race) => Number(race.position) === 1).length,
        color: "#e82727",
      },
      {
        label: "Podium rate",
        count: races.filter(
          (race) => Number(race.position) >= 1 && Number(race.position) <= 3,
        ).length,
        color: "#b18b35",
      },
      {
        label: "Points-scoring rate",
        count: races.filter((race) => Number(race.points) > 0).length,
        color: "#34343d",
      },
    ],
    [races],
  );
  const chartData = useMemo(
    () => ({
      labels: ["Achieved", "Remaining"],
      datasets: metrics.map((metric) => ({
        label: metric.label,
        data: [metric.count, total - metric.count],
        backgroundColor: [metric.color, "#eeeef2"],
        hoverBackgroundColor: [metric.color, "#e4e4e9"],
        borderColor: "#ffffff",
        borderWidth: 4,
        hoverBorderWidth: 4,
        borderRadius: 7,
        weight: 1,
      })),
    }),
    [metrics, total],
  );
  const options = useMemo(
    () => ({
      maintainAspectRatio: false,
      cutout: "48%",
      radius: "96%",
      animation: { duration: reducedMotion() ? 0 : 400 },
      onHover(event, elements) {
        setHovered(elements[0]?.datasetIndex ?? null);
      },
      onClick(event, elements) {
        if (elements.length) setSelected(elements[0].datasetIndex);
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          filter: (item) => item.dataIndex === 0,
          callbacks: {
            title: (items) => metrics[items[0]?.datasetIndex]?.label ?? "",
            label: (item) =>
              `${metrics[item.datasetIndex].count} / ${total} races (${percentage(metrics[item.datasetIndex].count, total)})`,
          },
        },
      },
    }),
    [metrics, total],
  );
  const active = metrics[activeIndex];
  return (
    <Panel
      title="Season performance rings"
      className="radial-panel driver-rings-panel"
      aside={<span className="count-badge">{total} RACES</span>}
    >
      {!total ? (
        <EmptyState title="No race data">
          Choose another driver or season to explore.
        </EmptyState>
      ) : (
        <>
          <div className="radial-layout">
            <RadialChart
              data={chartData}
              options={options}
              label="Concentric rings showing win rate, podium rate and points-scoring rate for the selected driver season"
              value={percentage(active.count, total)}
              caption={active.label}
              detail={`${active.count} of ${total} races`}
              onLeave={() => setHovered(null)}
            />
            <RadialLegend
              items={metrics.map((metric) => ({
                ...metric,
                detail: `${metric.count} / ${total} race appearances`,
                value: percentage(metric.count, total),
              }))}
              activeIndex={activeIndex}
              selectedIndex={selected}
              onSelect={setSelected}
              onHover={setHovered}
            />
          </div>
        </>
      )}
    </Panel>
  );
}

export function StandingsPointsShare({ drivers }) {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const activeIndex = hovered ?? selected;
  const { segments, total } = useMemo(() => {
    const ordered = [...drivers].sort(
      (a, b) => Number(a.position) - Number(b.position),
    );
    const palette = ["#b18b35", "#939ba7", "#b37b54", "#e82727", "#34343d"];
    const segments = ordered.slice(0, 5).map((driver, index) => ({
      label: `${driver.fname} ${driver.name}`,
      points: Number(driver.points) || 0,
      car: driver.car,
      color: palette[index],
    }));
    const remaining = ordered.slice(5);
    if (remaining.length)
      segments.push({
        label: "Others",
        points:
          Math.round(
            remaining.reduce(
              (sum, driver) => sum + (Number(driver.points) || 0),
              0,
            ) * 1000,
          ) / 1000,
        car: `${remaining.length} drivers`,
        color: "#dddde4",
      });
    return {
      segments,
      total:
        Math.round(
          segments.reduce((sum, segment) => sum + segment.points, 0) * 1000,
        ) / 1000,
    };
  }, [drivers]);
  const chartData = useMemo(
    () => ({
      labels: segments.map((segment) => segment.label),
      datasets: [
        {
          data: segments.map((segment) => segment.points),
          backgroundColor: segments.map((segment) => segment.color),
          borderWidth: 3,
          borderColor: "#ffffff",
          hoverBorderWidth: 3,
          hoverOffset: 5,
          borderRadius: 4,
        },
      ],
    }),
    [segments],
  );
  const options = useMemo(
    () => ({
      maintainAspectRatio: false,
      cutout: "73%",
      radius: "94%",
      animation: { duration: reducedMotion() ? 0 : 400 },
      onHover(event, elements) {
        setHovered(elements[0]?.index ?? null);
      },
      onClick(event, elements) {
        if (elements.length)
          setSelected((previous) =>
            previous === elements[0].index ? null : elements[0].index,
          );
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => segments[items[0]?.dataIndex]?.label ?? "",
            label: (item) =>
              `${number(item.parsed)} points (${percentage(item.parsed, total)})`,
          },
        },
      },
    }),
    [segments, total],
  );
  const active = activeIndex === null ? null : segments[activeIndex];
  return (
    <Panel
      title="Championship points share"
      className="radial-panel points-share-panel"
      aside={<span className="count-badge">{drivers.length} DRIVERS</span>}
    >
      {!total ? (
        <EmptyState title="No points awarded">
          Points shares will appear once championship points are available.
        </EmptyState>
      ) : (
        <>
          <div className="radial-layout">
            <RadialChart
              data={chartData}
              options={options}
              label="Championship points share for the top five drivers and all other drivers combined"
              value={active ? percentage(active.points, total) : number(total)}
              caption={active ? active.label : "Total points"}
              detail={
                active
                  ? `${number(active.points)} points`
                  : "Drivers’ championship"
              }
              onLeave={() => setHovered(null)}
            />
            <RadialLegend
              items={segments.map((segment) => ({
                ...segment,
                detail: `${segment.car}, ${number(segment.points)} pts`,
                value: percentage(segment.points, total),
              }))}
              activeIndex={activeIndex}
              selectedIndex={selected}
              onSelect={(index) =>
                setSelected((previous) => (previous === index ? null : index))
              }
              onHover={setHovered}
            />
          </div>
        </>
      )}
    </Panel>
  );
}
