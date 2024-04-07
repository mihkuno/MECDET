import React from 'react';
import { BarChart as Chart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BarChart = ({ data }) => {
  return (
    <Chart
      width={500}
      height={250}
      data={data}
      layout="vertical" // Set the layout to vertical to make the chart horizontal
      margin={{
        top: 30,
        right: 40,
        left: 20,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" domain={[0, 1]} /> {/* X-axis is now numeric for horizontal layout */}
      <YAxis 
        dataKey="name" 
        type="category" 
        width={100} // Increase the width of the Y-axis to accommodate longer category text
      /> 
      <Tooltip />
      <Bar
        dataKey="value"
        fill="rgba(75, 192, 192, 0.2)" // Transparent fill color for the bar
        stroke="rgba(75, 192, 192, 1)" // Solid outline color for the bar
        strokeWidth={2} // Width of the border
      />
    </Chart>
  );
};

export default BarChart;
