import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  PointElement,
  ScatterController,
  Tooltip,
  Legend,
} from 'chart.js';

let registered = false;

export const ensureChartJsSetup = () => {
  if (registered) return;
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    PointElement,
    ScatterController,
    Tooltip,
    Legend,
  );
  registered = true;
};
