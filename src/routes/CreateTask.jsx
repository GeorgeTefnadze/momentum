import React, { useState, useEffect } from "react";
import FormInputs from "../elements/FormInputs";
import CustomDropdown from "../elements/CustomDropdown";
import CustomDatepicker from "../elements/CustomDatepicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import useToastStore from "../hooks/useToastStore";

dayjs.extend(customParseFormat);

// API_KEY ანუ BearerToken და API_URL რომლებსაც ვიღებთ .env ფაილიდან
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export default function CreateTask({
  statusesData,
  departmentsData,
  prioritiesData,
  employeesData,
  reloadData,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastStore();

  // ფორმის state
  const [formData, setFormData] = useState({
    title: searchParams.get("title") || "",
    description: searchParams.get("description") || "",
    department_id: searchParams.get("department_id") || "",
    employee_id: searchParams.get("employee_id") || "",
    priority_id: Number(searchParams.get("priority_id")) || 2,
    status_id: Number(searchParams.get("status_id")) || 1,
    deadline: searchParams.get("deadline")
      ? dayjs(searchParams.get("deadline"))
      : dayjs().add(1, "day"),
  });

  useEffect(() => {
    setSearchParams({
      title: formData.title,
      description: formData.description,
      department_id: formData.department_id,
      employee_id: formData.employee_id,
      priority_id: formData.priority_id,
      status_id: formData.status_id,
      deadline: formData.deadline,
    });
  }, [formData, setSearchParams]);

  // useEffect(() => {
  //   setFormData((prev) => ({ ...prev, employee_id: "" }));
  // }, [formData.department_id]);

  function clearEmployees() {
    setFormData((prev) => ({ ...prev, employee_id: "" }));
  }

  const handleFormInputs = (customKey, data) => {
    setFormData({
      ...formData,
      [customKey]: data,
    });
  };

  const validateFormData = (
    formData,
    priorities,
    statuses,
    departments,
    employees
  ) => {
    let errors = {};

    if (!formData.title.trim()) {
      errors.title = "სათაური სავალდებულოა";
    } else if (formData.title.length < 3) {
      errors.title = "სათაური უნდა იყოს მინიმუმ 3 სიმბოლო";
    } else if (formData.title.length > 255) {
      errors.title = "სათაური უნდა იყოს მაქსიმუმ 255 სიმბოლო";
    }

    if (formData.description.trim()) {
      const wordCount = formData.description.trim().split(/\s+/).length;
      if (wordCount < 4) {
        errors.description = "აღწერა უნდა შეიცავდეს მინიმუმ 4 სიტყვას";
      }
      if (formData.description.length > 255) {
        errors.description = "აღწერა არ უნდა აღემატებოდეს 255 სიმბოლოს";
      }
    }

    if (!statuses.some((status) => status.id === formData.status_id)) {
      errors.status_id = "არასწორი სტატუსი";
    }

    if (!formData.department_id) {
      errors.department_id = "დეპარტამენტი სავალდებულოა";
    } else if (!departments.some((dep) => dep.id == formData.department_id)) {
      errors.department_id = "არასწორი დეპარტამენტი";
    }

    if (!priorities.some((priority) => priority.id == formData.priority_id)) {
      errors.priority_id = "არასწორი პრიორიტეტი";
    }

    if (!formData.employee_id) {
      errors.employee_id = "პასუხისმგებელი თანამშრომელი სავალდებულოა";
    } else if (!employees.some((emp) => emp.id == formData.employee_id)) {
      errors.employee_id = "არასწორი თანამშრომელი";
    }

    if (!formData.deadline) {
      errors.deadline = "დედლაინი სავალდებულოა";
    } else {
      const selectedDate = new Date(formData.deadline);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      if (selectedDate < tomorrow) {
        errors.deadline = "დედლაინი უნდა იყოს მინიმუმ ხვალინდელი";
      }
    }

    return errors;
  };

  async function handleSubmit() {
    const errors = validateFormData(
      formData,
      prioritiesData,
      statusesData,
      departmentsData,
      employeesData
    );

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([key, value], index) => {
        setTimeout(() => {
          showError(value);
        }, index * 300);
      });
      return;
    }

    const options = {
      method: "POST",
      url: API_URL + "/tasks",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      data: {
        name: formData.title,
        description: formData.description,
        due_date: formData.deadline,
        status_id: formData.status_id,
        employee_id: formData.employee_id,
        priority_id: formData.priority_id,
      },
    };

    try {
      const { data } = await axios.request(options);
    } catch (error) {
      console.error(error);
    } finally {
      showSuccess("დავალება წარმატებით შეიქმნა");
      reloadData("tasks");
      navigate(`/`);
    }
  }

  return (
    <div>
      <h1 className="text-[34px] font-semibold">შექმენი ახალი დავალება</h1>
      <form
        action=""
        className="flex flex-col gap-[55px] items-center bg-tasksbg px-[55px] py-[65px] mt-[30px] rounded-[4px]"
      >
        <div className="flex gap-[161px]">
          <div className="w-[550px]">
            <FormInputs
              label={"სათაური"}
              formData={formData.title}
              handleFormInputs={handleFormInputs}
              customKey={"title"}
            />
          </div>
          <div className="w-[550px]">
            <CustomDropdown
              options={departmentsData}
              label={"დეპარტამენტი"}
              handler={handleFormInputs}
              customKey={"department_id"}
              clearEmployees={clearEmployees}
              defaultValue={departmentsData.find(
                (item) => item.id == formData.department_id
              )}
            />
          </div>
        </div>
        <div className="flex gap-[161px]">
          <div className="w-[550px] h-[196px]">
            <FormInputs
              label={"აღწერა"}
              formData={formData.description}
              handleFormInputs={handleFormInputs}
              customKey={"description"}
              textarea={true}
              min={4}
              countWords={true}
            />
          </div>
          <div className="w-[550px]">
            <CustomDropdown
              options={employeesData}
              label={"პასუხისმგებელი თანამშრომელი"}
              handler={handleFormInputs}
              customKey={"employee_id"}
              defaultValue={employeesData.find(
                (item) => item.id == formData.employee_id
              )}
              department_id={formData.department_id}
              createEmployee={true}
            />
          </div>
        </div>
        <div className="flex gap-[161px]">
          <div>
            <div className="flex gap-8">
              <div className="w-[259px]">
                <CustomDropdown
                  options={prioritiesData}
                  label={"პრიორიტეტი"}
                  handler={handleFormInputs}
                  customKey={"priority_id"}
                  defaultValue={prioritiesData.find(
                    (item) => item.id === formData.priority_id
                  )}
                />
              </div>
              <div className="w-[259px]">
                <CustomDropdown
                  options={statusesData}
                  label={"სტატუსი"}
                  handler={handleFormInputs}
                  customKey={"status_id"}
                  defaultValue={statusesData.find(
                    (item) => item.id === formData.status_id
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-24 w-[550px]">
            <div>
              <p>დედლაინი</p>
              <div className="w-[320px] mt-1 bg-white">
                <CustomDatepicker
                  handler={handleFormInputs}
                  customKey={"deadline"}
                  defaultValue={formData.deadline}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
                className="w-fit text-[18px] rounded-[5px] bg-mainpurple text-white px-[20px] py-[10px]"
              >
                დავალების შექმნა
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
