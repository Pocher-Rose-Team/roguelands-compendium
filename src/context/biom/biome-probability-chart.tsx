import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import React from "react";

Chart.register(...registerables);

interface BiomeProbabilityChartAttributes {
  countFrequencyMap: Map<number, number>;
  biomeKey: string;
}

export default function BiomeProbabilityChart({
  countFrequencyMap,
  biomeKey,
}: BiomeProbabilityChartAttributes) {
  // Labels und Werte für das Diagramm
  const labels = Array.from(countFrequencyMap.keys()).sort((a, b) => a - b);
  const counts = labels.map((label) => countFrequencyMap.get(label));

  const chartData = {
    labels,
    datasets: [
      {
        label: `Times in biome occured`,
        data: counts,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };

  return <Bar data={chartData} options={options} style={{ maxWidth: 300, maxHeight: 200 }} />;
}
