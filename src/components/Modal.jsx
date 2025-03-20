import FormInputs from "../elements/FormInputs";
import CustomDropdown from "../elements/CustomDropdown";

import closeIcon from "../assets/closeIcon.svg";
import trashIcon from "../assets/trash.svg";
import uploadIcon from "../assets/uploadIcon.svg";

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";

// API_KEY ანუ BearerToken და API_URL რომლებსაც ვიღებთ .env ფაილიდან
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

const Modal = ({ isOpen, onClose, departments, reloadData }) => {
  if (!isOpen) return null;

  const modalRef = useRef(null);

  const handleClose = useCallback(() => {
    onClose();
  }, []);

  useEffect(() => {
    if (!modalRef.current) return;
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // ფორმის state
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    avatar: null,
    department_id: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // სურათის ატვირთვა
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("ატვირთეთ მხოლოდ სურათი");
        return;
      }

      if (file.size > 600 * 1024) {
        alert("ფაილის ზომა არ უნდა აღემატებოდეს 600KB-ს");
        return;
      }

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
      }

      setFormData({ ...formData, avatar: file });
    }
  };

  const handleFormInputs = (label, data) => {
    setFormData({
      ...formData,
      [label === "სახელი" ? "name" : "surname"]: data,
    });
  };

  function handleDepartments(id) {
    setFormData({
      ...formData,
      department_id: id,
    });
  }

  // ფორმის ვალიდაცია
  const validateForm = () => {
    let newErrors = {};
    const nameRegex = /^[ა-ჰa-zA-Z]{2,255}$/;

    if (!formData.name.trim()) newErrors.name = "სახელი სავალდებულოა";
    else if (!nameRegex.test(formData.name))
      newErrors.name = "მხოლოდ ქართული და ლათინური სიმბოლოები";

    if (!formData.surname.trim()) newErrors.surname = "გვარი სავალდებულოა";
    else if (!nameRegex.test(formData.surname))
      newErrors.surname = "მხოლოდ ქართული და ლათინური სიმბოლოები";

    if (!formData.avatar) newErrors.avatar = "ავატარი სავალდებულოა";
    else if (formData.avatar.size > 600 * 1024)
      newErrors.avatar = "ავატარი არ უნდა აღემატებოდეს 600KB-ს";
    else if (!formData.avatar || !formData.avatar.type.startsWith("image/"))
      newErrors.avatar = "ატვირთეთ მხოლოდ სურათი";

    if (!formData.department_id)
      newErrors.department_id = "დეპარტამენტი სავალდებულოა";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // API რექუესთი
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log(errors);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("surname", formData.surname);
    formDataToSend.append("avatar", formData.avatar);
    formDataToSend.append("department_id", formData.department_id);

    const options = {
      method: "POST",
      url: API_URL + "/employees",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${API_KEY}`,
      },
      data: formDataToSend,
    };

    try {
      const { data } = await axios.request(options);
      console.log(data);
    } catch (error) {
      alert("შეცდომა მოხდა!");
      console.error(error);
    } finally {
      reloadData("employees");
      onClose();
    }
  };

  return (
    <div className="fixed w-screen h-screen z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white w-[913px] h-[766px] rounded-[10px] px-[50px] pt-[40px] pb-[60px]"
      >
        <div className="flex justify-end">
          <button onClick={onClose} className="cursor-pointer">
            <img src={closeIcon} alt="" />
          </button>
        </div>
        <div className="mt-[37px]">
          <h1 className="text-[32px] text-center font-medium">
            თანამშრომლის დამატება
          </h1>
          <form
            onSubmit={handleSubmit}
            className="mt-[45px] flex flex-col gap-[45px]"
          >
            <div className="flex justify-between">
              <div className="w-[384px]">
                <FormInputs
                  label={"სახელი"}
                  formData={formData.name}
                  handleFormInputs={handleFormInputs}
                />
              </div>
              <div className="w-[384px]">
                <FormInputs
                  label={"გვარი"}
                  formData={formData.surname}
                  handleFormInputs={handleFormInputs}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="pfp">
                ავატარი<span>*</span>
              </label>
              <input
                type="file"
                id="pfp"
                name="pfp"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="relative mt-[8px] flex items-center justify-center w-full h-[120px]  outline-dashed outline outline-mainoutline hover:outline-hoverpurple rounded-[8px]">
                {formData.avatar ? (
                  <>
                    <label
                      htmlFor="pfp"
                      className="relative w-24 h-24 rounded-full border-2 border-gray-300 cursor-pointer flex items-center justify-center overflow-hidden bg-gray-100"
                    >
                      <img
                        src={avatarPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </label>
                    <div
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, avatar: null }));
                        document.getElementById("pfp").value = "";
                      }}
                      className="absolute bottom-[10%] right-[44%] cursor-pointer bg-white w-6 h-6 rounded-full outline outline-mainoutline flex items-center justify-center"
                    >
                      <img src={trashIcon} alt="" />
                    </div>
                  </>
                ) : (
                  <label
                    htmlFor="pfp"
                    className="flex flex-col gap-[5px] items-center justify-center w-full h-full cursor-pointer"
                  >
                    <img
                      src={uploadIcon}
                      alt=""
                      className="w-[24px] h-[24px]"
                    />
                    <p className="text-[14px] text-textgray">ატვირთე ფოტო</p>
                  </label>
                )}
              </div>
            </div>
            <div className="w-[384px]">
              <CustomDropdown
                options={departments}
                label={"დეპარტამენტი"}
                handler={handleDepartments}
              />
            </div>
            <div>
              <div className="flex gap-[22px] justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-[10px] rounded-[5px] outline outline-mainpurple hover:outline-hoverpurple duration-200 text-[16px]"
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  className="px-4 py-[10px] rounded-[5px] bg-mainpurple hover:bg-hoverpurple duration-200 text-white text-[16px]"
                >
                  დაამატე თანამშრომელი
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
