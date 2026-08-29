import React from 'react'
import { Scatter } from 'react-chartjs-2'
import Array2DRenderer from '../Array2DRenderer'
import styles from './ScatterRenderer.module.scss'

const convertToObjectArray = (value) => {
  if (Array.isArray(value)) {
    const [x, y] = value
    return { x, y }
  }
  return { x: 0, y: value }
}

class ScatterRenderer extends Array2DRenderer {
  renderData() {
    const { data } = this.props.data

    const datasets = data.map((series, index) => ({
      backgroundColor: series.map(point => (
        point.patched ? styles.colorPatched :
          point.selected ? styles.colorSelected :
            styles.seriesColors.split(',')[index % 6]
      )),
      data: series.map(s => convertToObjectArray(s.value)),
      label: `Series ${index + 1}`,
      pointRadius: series.map(point => (point.selected || point.patched ? 6 : (index + 1) * 2)),
    }))

    const chartData = {
      datasets,
    }

    return (
      <Scatter
        data={chartData}
        options={{
          legend: false,
          animation: false,
          layout: {
            padding: {
              left: 20,
              right: 20,
              top: 20,
              bottom: 20,
            },
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: false,
              },
            }],
            xAxes: [{
              ticks: {
                beginAtZero: false,
              },
            }],
          },
        }}
      />
    )
  }
}

export default ScatterRenderer
