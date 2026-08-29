import React from 'react';
import { Bar } from 'react-chartjs-2';
import Array1DRenderer from '../Array1DRenderer';
import { colorFont, colorPatched, colorSelected } from 'common/theme';
import { ensureChartJsSetup } from '../chartSetup';
import styles from './ChartRenderer.module.scss';

ensureChartJsSetup();

class ChartRenderer extends Array1DRenderer {
  renderData() {
    const { data: [row] = [[]] } = this.props.data;
    if (!row || !row.length) {
      return <div className={styles.chart} />;
    }

    const chartData = {
      labels: row.map(col => `${col.value}`),
      datasets: [{
        backgroundColor: row.map(col => (
          col.patched ? colorPatched : col.selected ? colorSelected : colorFont
        )),
        data: row.map(col => col.value),
        borderWidth: 0,
      }],
    };

    return (
      <div className={styles.chart}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
            scales: {
              x: {
                ticks: { color: colorFont },
                grid: { color: 'rgba(255,255,255,0.08)' },
              },
              y: {
                beginAtZero: true,
                ticks: { color: colorFont },
                grid: { color: 'rgba(255,255,255,0.08)' },
              },
            },
          }}
        />
      </div>
    );
  }
}

export default ChartRenderer;
