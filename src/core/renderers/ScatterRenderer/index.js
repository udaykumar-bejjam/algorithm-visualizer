import React from 'react';
import { Scatter } from 'react-chartjs-2';
import Array2DRenderer from '../Array2DRenderer';
import { getThemeColors } from 'common/theme';
import { getChartAnimationOptions } from 'common/motion';
import { ensureChartJsSetup } from '../chartSetup';
import styles from './ScatterRenderer.module.scss';

ensureChartJsSetup();

const convertToObjectArray = (value) => {
  if (Array.isArray(value)) {
    const [x, y] = value;
    return { x, y };
  }
  return { x: 0, y: Number(value) || 0 };
};

class ScatterRenderer extends Array2DRenderer {
  renderData() {
    const { data = [] } = this.props.data;
    const { colorFont, colorPatched, colorSelected, seriesColors, chartGrid } = getThemeColors();

    const datasets = data.map((series, index) => ({
      label: `Series ${index + 1}`,
      data: series.map(s => convertToObjectArray(s.value)),
      backgroundColor: series.map(point => (
        point.patched ? colorPatched :
          point.selected ? colorSelected :
            seriesColors[index % seriesColors.length]
      )),
      pointRadius: series.map(point => (point.selected || point.patched ? 6 : (index + 1) * 2)),
      pointHoverRadius: series.map(point => (point.selected || point.patched ? 7 : (index + 1) * 2 + 1)),
    }));

    return (
      <div className={styles.chart}>
        <Scatter
          data={{ datasets }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: getChartAnimationOptions(),
            layout: {
              padding: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
              },
            },
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
            scales: {
              x: {
                type: 'linear',
                ticks: { color: colorFont },
                grid: { color: chartGrid },
              },
              y: {
                type: 'linear',
                ticks: { color: colorFont },
                grid: { color: chartGrid },
              },
            },
          }}
        />
      </div>
    );
  }
}

export default ScatterRenderer;
