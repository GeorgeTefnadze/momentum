import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import dayjs from "dayjs";
import "dayjs/locale/ka";

export default function CustomDatepicker({ handler, defaultValue }) {
  const [selectedDate, setSelectedDate] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ka">
      <DatePicker
        value={selectedDate}
        onChange={(newDate) => {
          if (newDate) {
            const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
            setSelectedDate(newDate);
            handler(formattedDate);
          }
        }}
        format="DD/MM/YYYY"
        minDate={dayjs()}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        slots={{
          textField: TextField,
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            InputProps: {
              sx: {
                height: "50px",
                padding: "0 12px",
                minHeight: "unset",
              },
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={() => setIsOpen(true)}
                    sx={{
                      height: "40px",
                      width: "40px",
                      minWidth: "unset",
                      minHeight: "unset",
                      borderRadius: "4px",
                      padding: "5px",
                      "&:hover": {
                        backgroundColor: "#b588f4",
                      },
                    }}
                  >
                    <svg
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.00065 1.16406V2.4974H10.0007V1.16406H11.334V2.4974H14.0007C14.3689 2.4974 14.6673 2.79588 14.6673 3.16406V13.8307C14.6673 14.1989 14.3689 14.4974 14.0007 14.4974H2.00065C1.63246 14.4974 1.33398 14.1989 1.33398 13.8307V3.16406C1.33398 2.79588 1.63246 2.4974 2.00065 2.4974H4.66732V1.16406H6.00065ZM13.334 7.83073H2.66732V13.1641H13.334V7.83073ZM4.66732 3.83073H2.66732V6.4974H13.334V3.83073H11.334V5.16406H10.0007V3.83073H6.00065V5.16406H4.66732V3.83073Z"
                        fill="black"
                      />
                    </svg>
                  </IconButton>
                </InputAdornment>
              ),
            },
            sx: {
              height: "50px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                borderColor: "#6c757d",
                "&:hover fieldset": { borderColor: "#b588f4" },
                "&.Mui-focused fieldset": {
                  borderColor: "#8338ec",
                  borderWidth: "1px",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#5f6368",
                top: "-2px",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#8338ec",
              },
            },
          },
          openPickerButton: {
            sx: {
              display: "none",
            },
          },
          day: (ownerState) => ({
            sx: {
              borderRadius: "4px",
              "&.Mui-selected": {
                backgroundColor: "#8338ec !important",
                color: "#fff",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#b588f4 !important",
              },
              "&:hover": {
                backgroundColor: "#b588f4",
              },
            },
          }),
          popper: {
            sx: {
              "& .MuiPickersYear-yearButton": {
                borderRadius: "4px",
                color: "#333",
                "&.Mui-selected": {
                  backgroundColor: "#8338ec !important",
                  color: "#fff",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#b588f4 !important",
                },
                "&:hover": {
                  backgroundColor: "#b588f4",
                },
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}
