import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Legend,
  Tooltip,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Legend,
  Tooltip,
);
Chart.defaults.font.family =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.color = "#7b7b84";
Chart.defaults.plugins.legend.display = false;
Chart.defaults.plugins.tooltip.backgroundColor = "#18181c";
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.cornerRadius = 6;
Chart.defaults.scale.grid.color = "#eeeef0";
Chart.defaults.scale.border.display = false;
Chart.defaults.scale.ticks.padding = 10;
Chart.defaults.scale.beginAtZero = true;
Chart.defaults.elements.line.tension = 0.3;

export { Line, Bar } from "react-chartjs-2";

export function pointsChart(labels, points, positions) {
  const accents = positions?.map(
    (position) =>
      ["#b18b35", "#939ba7", "#b37b54"][Number(position) - 1] || "#e82727",
  );
  return {
    labels,
    datasets: [
      {
        label: "Points",
        data: points,
        backgroundColor: accents || "#e82727",
        borderColor: "#e82727",
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: accents || "#ffffff",
        pointBorderWidth: 2,
        borderRadius: 4,
        maxBarThickness: 32,
        fill: false,
      },
    ],
  };
}
