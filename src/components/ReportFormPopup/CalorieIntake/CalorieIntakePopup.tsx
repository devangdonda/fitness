import React from "react";
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

interface CaloriIntakePopupProps {
  setShowCalorieIntakePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalorieIntakePopup: React.FC<CaloriIntakePopupProps> = ({
  setShowCalorieIntakePopup,
}) => {
  const color = "#ffc20e";
  const [date, setDate] = React.useState<any>(dayjs(new Date()));
  const [time, setTime] = React.useState<any>(dayjs(new Date()));

  const [calorieIntake, setCalorieIntake] = React.useState<any>({
    item: "",
    date: "",
    quantity: "",
    quantitytype: "g",
  });

  const [items, setItems] = React.useState<any>([]);

  const saveCalorieIntake = async () => {
    let tempdate = date.format("YYYY-MM-DD");
    let temptime = time.format("HH:mm:ss");
    let tempdatetime = tempdate + " " + temptime;
    let finaldatetime = new Date(tempdatetime);

    console.log(finaldatetime + "finaldatetime");

    fetch(
      process.env.NEXT_PUBLIC_BACKEND_API + "/calorieintake/addcalorieintake",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          item: calorieIntake.item,
          date: finaldatetime,
          quantity: calorieIntake.quantity,
          quantitytype: calorieIntake.quantitytype,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          toast.success("Calorie intake added successfully");
          getCalorieIntake();
        } else {
          toast.error("Error in adding calorie intake");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in adding calorie intake");
      });
  };

  const getCalorieIntake = async () => {
    setItems([]);
    fetch(
      process.env.NEXT_PUBLIC_BACKEND_API +
        "/calorieintake/getcalorieintakebydate",
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
          setItems(data.data);
        } else {
          toast.error("Error in getting calorie intake");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in getting calorie intake");
      });
  };

  const deleteCalorieIntake = async (item: any) => {
    fetch(
      process.env.NEXT_PUBLIC_BACKEND_API +
        "/calorieintake/deletecalorieintake",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          item: item.item,
          date: item.date
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          toast.success('Calorie intake item deleted successfully')
          getCalorieIntake()
        } else {
          toast.error("Error in deleting calorie intake");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in deleting calorie intake");
      });
  };

  React.useEffect(() => {
    getCalorieIntake();
  }, [dateCalendarClasses]);

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
            setShowCalorieIntakePopup(false);
            window.location.reload();
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

        <TextField
          id="outlined-basic"
          label="Food item name"
          variant="outlined"
          color="warning"
          onChange={(e) => {
            setCalorieIntake({ ...calorieIntake, item: e.target.value });
          }}
        />
        <TextField
          id="outlined-basic"
          label="Food item amount (in gms)"
          variant="outlined"
          color="warning"
          type="number"
          onChange={(e) => {
            setCalorieIntake({ ...calorieIntake, quantity: e.target.value });
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
        <Button variant="contained" color="warning" onClick={saveCalorieIntake}>
          Save
        </Button>
        <div className="hrline"></div>
        <div className="items">
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
        </div>
      </div>
    </div>
  );
};

export default CalorieIntakePopup;
