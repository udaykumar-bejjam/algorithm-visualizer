import React from 'react';
import { Bar } from 'react-chartjs-2';
import Array1DRenderer from '../Array1DRenderer';
import { colorFont, colorPatched, colorSelected } from 'common/theme';

class ChartRenderer extends Array1DRenderer {
  renderData() {
    const { data: [row] } = this.props.data;

    const chartData = {
      labels: row.map(col => `${col.value}`),
      datasets: [{
        backgroundColor: row.map(col => col.patched ? colorPatched : col.selected ? colorSelected : colorFont),
        data: row.map(col => col.value),
      }],
    };
    return (
      <Bar data={chartData} options={{
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        animation: false,
        legend: false,
        responsive: true,
        maintainAspectRatio: false
      }} />
    );
  }
}

export default ChartRenderer;
