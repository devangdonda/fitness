"use client";
import React, { useState } from "react";
import "../popup.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AiFillDelete, AiOutlineClose } from "react-icons/ai";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { dateCalendarClasses } from "@mui/x-date-pickers";
import { toast } from "react-toastify";
import { it } from "node:test";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import { SelectChangeEvent } from "@mui/material/Select";

interface WorkoutPopupProps {
  setShowWorkoutPopup: React.Dispatch<React.SetStateAction<boolean>>;
  getDetails: boolean;
  workoutsNames: string[];
}

const WorkoutPopup: React.FC<WorkoutPopupProps> = ({
  setShowWorkoutPopup,
  getDetails,
  workoutsNames,
}) => {
  const color = "#ffc20e";
  const [date, setDate] = React.useState<any>(dayjs(new Date()));
  const [time, setTime] = React.useState<any>(dayjs(new Date()));

  const [workouts, setWorkouts] = React.useState<any>({
    reps: 0,
    sets: 0,
    name: "",
    date: "",
    durationInMinutes: 0,
    weights: 0,
  });

  //const [exercises, setExerices] = React.useState<any>({});

  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const saveWorkout = async () => {
    let tempdate = date.format("YYYY-MM-DD");
    let temptime = time.format("HH:mm:ss");
    let tempdatetime = tempdate + " " + temptime;
    let finaldatetime = new Date(tempdatetime);

    console.log(finaldatetime + "finaldatetime");
    console.log({
      sets: workouts.sets,
      reps: workouts.reps,
      name: workouts.name,
      date: finaldatetime,
      durationInMinutes: workouts.durationInMinutes,
      weights: workouts.weights,
    });
    window.location.reload();

    fetch(
      process.env.NEXT_PUBLIC_BACKEND_API + "/workouttrack/addworkoutentry",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          sets: workouts.sets,
          reps: workouts.reps,
          name: workouts.name,
          date: finaldatetime,
          durationInMinutes: workouts.durationInMinutes,
          weights: workouts.weights,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.ok) {
          toast.success("Workout added successfully");
          getWorkout();
        } else {
          toast.error("Error in adding workout");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in adding calorie intake");
      });
  };

  const getWorkout = async () => {
    //setExerices([]);
    fetch(
      process.env.NEXT_PUBLIC_BACKEND_API + "/workouttrack/getworkoutsbydate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          date: date,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          console.log(data.data);
          setWorkouts(data.data);
        } else {
          toast.error("Error in getting workout");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in getting workout");
      });
  };

  const deleteCalorieIntake = async (item: any) => {
    fetch(
      process.env.NEXT_PUBLIC_BACKEND_API + "/workouttrack/deleteworkoutentry",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          date: item.date,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          toast.success("Workout deleted successfully");
          getWorkout();
        } else {
          toast.error("Error in deleting workout");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in deleting wrkout");
      });
  };

  React.useEffect(() => {
    if (getDetails) {
      getWorkout();
    }
  }, [dateCalendarClasses, getDetails]);

  const selectedDay = (val: any) => {
    setDate(val);
  };
  /*
    const [value, setValue] = React.useState<Dayjs | null>(
      dayjs("2022-04-17T15:30")
    ); */
  return (
    <div className="popupout">
      <div className="popupbox">
        <button
          className="close"
          onClick={() => {
            setShowWorkoutPopup(false);
          }}
        >
          <AiOutlineClose />
        </button>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Selct Date"
            value={date}
            onChange={(newValue: any) => selectedDay(newValue)}
          />
        </LocalizationProvider>

        {/* <DatePicker
            getSelectedDay={selectedDay}
            endDate={100}
            selectDate={new Date()}
            labelFormat={"MMMM"}
            color={color}
          /> */}

        {/*  <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="outlined-age-native-simple">Exercise</InputLabel>
          <Select
            native
            value={workouts.exercise}
            onChange={(e) => {
              console.log(e);
              setWorkouts({ ...workouts, sets: e.target.value });
            }}
            label="Exercise"
            inputProps={{
              name: "exercise",
              id: "outlined-age-native-simple",
            }}
          >
              // Use 'option' instead of 'MenuItem' for native selects
              <MenuItem value={"obj"}>"obj"</MenuItem>
              <MenuItem value={"obj"}>"obj"</MenuItem>
          </Select>
        </FormControl> */}

        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Exercise</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              onChange={(e) => {
                setWorkouts({ ...workouts, name: e.target.value });
              }}
            >
              {workoutsNames.map((obj) => (
                <MenuItem value={obj}>{obj}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* <TextField
            id="outlined-basic"
            label="Exercise Name"
            variant="outlined"
            color="warning"
            type="string"
            onChange={(e) => {
              setWorkouts({ ...workouts, name: e.target.value });
            }}
          /> */}
        <TextField
          id="outlined-basic"
          label="Weights"
          variant="outlined"
          color="warning"
          type="bumber"
          onChange={(e) => {
            setWorkouts({ ...workouts, weights: e.target.value });
          }}
        />
        <TextField
          id="outlined-basic"
          label="Reps"
          variant="outlined"
          color="warning"
          type="number"
          onChange={(e) => {
            setWorkouts({ ...workouts, reps: e.target.value });
          }}
        />
        <TextField
          id="outlined-basic"
          label="Sets"
          variant="outlined"
          color="warning"
          type="number"
          onChange={(e) => {
            setWorkouts({ ...workouts, sets: e.target.value });
          }}
        />
        <TextField
          id="outlined-basic"
          label="Duration In Minutes"
          variant="outlined"
          color="warning"
          type="number"
          onChange={(e) => {
            setWorkouts({ ...workouts, durationInMinutes: e.target.value });
          }}
        />
        <div className="timebox">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticTimePicker
              value={time}
              onChange={(newValue: any) => setTime(newValue)}
            />
          </LocalizationProvider>
        </div>
        <Button variant="contained" color="warning" onClick={saveWorkout}>
          Save
        </Button>
        <div className="hrline"></div>
        {/* <div className="items">
          {items.map((item: any) => {
            return (
              <div className="item">
                <h3>{item.item}</h3>
                <h3>
                  {item.quantity} {item.quantitytype}
                </h3>
                <button
                  onClick={() => {
                    deleteCalorieIntake(item);
                  }}
                >
                  {" "}
                  <AiFillDelete />
                </button>
              </div>
            );
          })}
        </div> */}
      </div>
    </div>
  );
};

export default WorkoutPopup;
