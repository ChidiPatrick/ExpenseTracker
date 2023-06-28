import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router";
import { HiXMark } from "react-icons/hi2";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
const ExpenseChart = () => {
  const navigate = useNavigate();

  //// Global variables ////////////////
  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date();

  //////////////// Store selectors /////////////////////////////
  const monthlyExpenseArray = useSelector(
    (state) => state.expense.expenseArray
  );
  const chartArray = useSelector((state) => state.expense.chartArray);
  const chartColors = useSelector((state) => state.expense.chartColorArray);
  const allMonthsExpenseArray = useSelector(
    (state) => state.expense.allMonthsExpenseArray
  );
  ///////////////////////// Data simplification ///////////////////////////////
  const allMonthsExpenseArrayLength = allMonthsExpenseArray.length;
  const currMonthExpenseObjPosition = allMonthsExpenseArrayLength - 1;
  ///////////////////////////////////////////////////////////////////

  //////// Define Local States /////////////////
  const [currPosition, setCurrPosition] = useState(currMonthExpenseObjPosition);
  const [currChartArray, setCurrChartArray] = useState(chartArray);
  const [chartColorsArray, setChartColorsArray] = useState(chartColors);
  let [transactionMonth, setTransactionMonth] = useState(date.getMonth());
  /////////// Show previous month's chart handler ///////////////////////
  const getExpenseData = (currMonthExpenseArray) => {
    const newChartArray = [];
    currMonthExpenseArray.map((obj, item) => {
      if (obj.expenseAmount > 1)
        newChartArray.push({ name: obj.category, value: obj.expenseAmount });
    });
    return newChartArray;
  };

  const getCurrMonthColorArray = (currExpenseArray) => {
    const newCategoryColorArray = [];
    currExpenseArray.map((obj, index) => {
      newCategoryColorArray.push(obj.categoryColor);
    });
    return newCategoryColorArray;
  };

  const moveBack = (allMonthsExpenseObjArray, currPosition) => {
    if (currPosition > 0) {
      let newCurrPosition = currPosition - 1;
      const currObj = allMonthsExpenseObjArray[newCurrPosition];
      const currExpenseArray = currObj.expenseArray;
      // let currTransactionArray = currTransactions;
      const date = new Date(currObj.dateCreated);
      const currMonth = date.getMonth();
      setCurrPosition(newCurrPosition);
      const expenseData = getExpenseData(currExpenseArray);
      const colorArray = getCurrMonthColorArray(currExpenseArray);
      setTransactionMonth(currMonth);
      setChartColorsArray(colorArray);
      setCurrChartArray(expenseData);
      return;
    } else if (currPosition === 0) {
      return;
    }
  };

  const moveForward = (allMonthsExpenseObjArray, currPosition) => {
    if (currPosition >= 0) {
      let newCurrPosition = currPosition + 1;
      const currObj = allMonthsExpenseObjArray[newCurrPosition];
      console.log(currObj);
      const currExpenseArray = currObj.expenseArray;
      const date = new Date(currObj.dateCreated);
      const currMonth = date.getMonth();
      setCurrPosition(newCurrPosition);
      const expenseData = getExpenseData(currExpenseArray);
      const colorArray = getCurrMonthColorArray(currExpenseArray);
      setTransactionMonth(currMonth);
      setChartColorsArray(colorArray);
      setCurrChartArray(expenseData);
      return;
    } else if (currPosition === 0) {
      return;
    }
  };

  //////////////////////////////////////////////////////////
  console.log(chartArray);
  const data = [
    { name: "General", value: 40 },
    { name: "Games", value: 800 },
    { name: "Travel", value: 1300 },
    // { name: "Group D", value: 200 },
  ];

  const COLORS = [...chartColorsArray];

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
      <nav
        onClick={() => navigate("/ExpenseSummary")}
        className={styles.navContainer}
      >
        <HiChevronLeft className={styles.moveBackBtn} />
      </nav>
      <h1 className={styles.expenseChartHeader}>
        <span> Expense Chart</span>
      </h1>
      <div className={styles.btnWrapper}>
        <button
          className={currPosition === 0 ? styles.hidden : styles.btnMoveBack}
          onClick={() => moveBack(allMonthsExpenseArray, currPosition)}
        >
          <HiChevronLeft className={styles.btnIcon} />
        </button>
        <div className={styles.currMonth}>{months[transactionMonth]}</div>
        <button
          className={
            currPosition === allMonthsExpenseArrayLength - 1
              ? styles.hidden
              : styles.btnMoveBack
          }
          onClick={() => moveForward(allMonthsExpenseArray, currPosition)}
        >
          <HiChevronRight className={styles.btnIcon} />
        </button>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer
          className={styles.responsiveContainer}
          width={300}
          height={"100%"}
          aspect={1}
        >
          <PieChart width={600} height={300}>
            <Pie
              data={currChartArray}
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
            {/* <Tooltip /> */}
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
