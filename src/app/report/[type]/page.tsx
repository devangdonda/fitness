"use client";
import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import "./ReportPage.css";
import { AiFillEdit } from "react-icons/ai";
import CaloriIntakePopup from "@/components/ReportFormPopup/CalorieIntake/CalorieIntakePopup";
import { usePathname } from "next/navigation";
import WorkoutPopup from "@/components/ReportFormPopup/Workout/WorkoutPopup";
import { toast } from "react-toastify";

const page = () => {
  const color = "#ffc20e";
  const pathname = usePathname();
  console.log(pathname);

  const chartsParams = {
    // margin: { bottom: 20, left: 25, right: 5 },
    height: 300,
  };

  const [dataS1, setDataS1] = React.useState<any>(null);
  const [dataS2, setDataS2] = React.useState<any>(null);

  const [workoutsNames, setWorkoutsNames] = React.useState<string[]>([""]);

  const getDataForS1 = async () => {
    if (pathname == "/report/Calorie%20Intake") {
      fetch(
        process.env.NEXT_PUBLIC_BACKEND_API +
          "/calorieintake/getcalorieintakebylimit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            limit: 10,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            let temp = data.data.map((item: any) => {
              return {
                date: item.date,
                value: item.calorieIntake,
                unit: "kcal",
              };
            });

            let dataForLineChart = temp.map((item: any) => {
              let val = JSON.stringify(item.value);
              return val;
            });

            let dataForXAxis = temp.map((item: any) => {
              let val = new Date(item.date);
              return val;
            });

            setDataS1({
              data: dataForLineChart,
              title: "1 Day Calorie Intake",
              color: color,
              xAxis: {
                data: dataForXAxis,
                label: "Last 10 Days",
                scaleType: "time",
              },
            });
          } else {
            setDataS1([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    /* let temp = [
      {
        date: "Thu Sep 28 2023 20:30:30 GMT+0530 (India Standard Time)",
        value: 2000,
        unit: "kcal",
      },
      {
        date: "Wed Sep 27 2023 20:30:30 GMT+0530 (India Standard Time)",
        value: 2500,
        unit: "kcal",
      },
      {
        date: "Tue Sep 26 2023 20:30:30 GMT+0530 (India Standard Time)",
        value: 2700,
        unit: "kcal",
      },
      {
        date: "Mon Sep 25 2023 20:30:30 GMT+0530 (India Standard Time)",
        value: 3000,
        unit: "kcal",
      },
      {
        date: "Sun Sep 24 2023 20:30:30 GMT+0530 (India Standard Time)",
        value: 2000,
        unit: "kcal",
      },
      {
        date: "Sat Sep 23 2023 20:30:30 GMT+0530 (India Standard Time)",
        value: 2300,
        unit: "kcal",
      },
      {
        date: "Fri Sep 22 2023 20:30:30 GMT+0530 (India Standard Time)",
        value: 2500,
        unit: "kcal",
      },
      {
        date: "Thu Sep 21 2023 20:30:30 GMT+0530 (India Standard Time)",
        value: 2700,
        unit: "kcal",
      },
    ];

    let dataForLineChart = temp.map((item: any) => {
      let val = JSON.stringify(item.value);
      return val;
    });

    let dataForXAxis = temp.map((item: any) => {
      let val = new Date(item.date);
      return val;
    });

    console.log({
      data: dataForLineChart,
      title: "1 Day Calorie Intake",
      color: color,
      xAxis: {
        data: dataForXAxis,
        label: "Last 10 Days",
        scaleType: "time",
      },
    });

    setDataS1({
      data: dataForLineChart,
      title: "1 Day Calorie Intake",
      color: color,
      xAxis: {
        data: dataForXAxis,
        label: "Last 10 Days",
        scaleType: "time",
      },
    }); */
  };

  const getDataForS2 = async () => {
    if (pathname == "/report/Workout") {
      fetch(
        process.env.NEXT_PUBLIC_BACKEND_API +
          "/workouttrack/getworkoutsbylimit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            limit: 100,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            let temp = data.data.map((item: any) => {
              return {
                date: item.date,
                name: item.name,
                vol: item.reps * item.sets * item.weights,
                durationInMinutes: item.durationInMinutes,
              };
            });

            let dataForLineChart = temp.map((item: any) => {
              let val = JSON.stringify(item.vol);
              return { name: item.name, val };
            });

            let nameForLineChart = temp.map((item: any) => {
              let val = JSON.stringify(item.name);
              return val;
            });

            let dataForXAxis = temp.map((item: any) => {
              let val = new Date(item.date);
              return val;
            });

            setDataS2({
              name: nameForLineChart,
              data: dataForLineChart,
              color: color,
              xAxis: {
                data: dataForXAxis,
                label: "Last 10 Days",
                scaleType: "time",
              },
            });
          } else {
            setDataS2([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getWorkoutList = async () => {
    fetch(
      process.env.NEXT_PUBLIC_BACKEND_API + "/workouttrack/getworkoutlist",
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          let workouts1 = data.data.exerciseNames;
          console.log(workouts1);
          /*   const exercises = workouts1.map((element: string[]) => (
              ...element)
            );
          setWorkoutsNames(exercises);
          console.log(workoutsNames) */
          const exercises = [];
          workouts1.forEach((element: string[]) => {
            exercises.push(...element);
          });
          setWorkoutsNames(exercises.map((obj) => obj.name));
          console.log(workoutsNames);
        } else {
          toast.error("Error in getting workout names");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in getting workout names");
      });
  };

  React.useEffect(() => {
    getDataForS1();
    getDataForS2();
    getWorkoutList();
  }, []);

  const [showCalorieIntakePopup, setShowCalorieIntakePopup] =
    React.useState<boolean>(false);
  const [showWorkoutPopup, setShowWorkoutPopup] =
    React.useState<boolean>(false);

  return (
    <div className="reportpage">
      <div className="s" style={{ display: dataS1 ? "block" : "none" }}>
        {dataS1 && (
          <LineChart
            xAxis={[
              {
                id: "Day",
                data: dataS1.xAxis.data,
                scaleType: dataS1.xAxis.scaleType,
                label: dataS1.xAxis.label,
                valueFormatter: (date: any) => {
                  return date.getDate().toString();
                },
              },
            ]}
            series={[
              {
                data: dataS1.data,
                label: dataS1.title,
                color: dataS1.color,
              },
            ]}
            {...chartsParams}
          />
        )}
      </div>
      {dataS2 &&
        workoutsNames.map((element, index) => (
          <div className="s">
            <LineChart
              xAxis={[
                {
                  id: "Day",
                  data: dataS2.xAxis.data,
                  scaleType: dataS2.xAxis.scaleType,
                  label: dataS2.xAxis.label,
                  valueFormatter: (date: any) => {
                    return date.getDate().toString();
                  },
                },
              ]}
              series={[
                {
                  data: dataS2.data
                    .filter((obj) => obj.name === element) // Filter out data points that don't match the current element
                    .map((obj) => obj.val),
                  label: element,
                  color: dataS2.color,
                },
              ]}
              {...chartsParams}
            />
          </div>
        ))}
      <button
        className="editbutton"
        onClick={() => {
          if (pathname === "/report/Calorie%20Intake") {
            setShowCalorieIntakePopup(true);
          } else if (pathname === "/report/Workout") {
            setShowWorkoutPopup(true);
          } else {
            // show popup for other reports
            alert("Show popup for other reports");
          }
        }}
      >
        <AiFillEdit />
      </button>

      {showCalorieIntakePopup && (
        <CaloriIntakePopup
          setShowCalorieIntakePopup={setShowCalorieIntakePopup}
        />
      )}
      {showWorkoutPopup && (
        <WorkoutPopup
          setShowWorkoutPopup={setShowWorkoutPopup}
          getDetails={true}
          workoutsNames={workoutsNames}
        />
      )}
    </div>
  );
};

export default page;
