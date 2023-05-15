import React, { useEffect } from "react";
import styles from "./expenseChart.module.scss";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useSelector } from "react-redux";
const ExpenseChart = () => {
  const monthlyExpenseArray = useSelector(
    (state) => state.expense.expenseArray
  );
  const chartArray = useSelector((state) => state.expense.chartArray);
  console.log(chartArray);
  const data = [
    { name: "General", value: 40 },
    { name: "Games", value: 800 },
    { name: "Travel", value: 1300 },
    // { name: "Group D", value: 200 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <div className={styles.expenseChartUI}>
      <h1>All Expense Chart</h1>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer
          className={styles.responsiveContainer}
          width={300}
          height={"100%"}
          aspect={1}
        >
          <PieChart width={600} height={300}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
//   return <div className={styles.expenseChartUI}>Hello world</div>;
// };

export default ExpenseChart;
