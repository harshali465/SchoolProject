import React, { useContext, useMemo, useRef } from "react";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import "bootstrap-css-only/css/bootstrap.min.css";
// import "mdbreact/dist/css/mdb.css";
// import { AuthContext } from "../../helpers/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import useCountdown from "../../helpers/CountDownTimer";
import { CSpinner } from "@coreui/react";
import { Button, Typography, Modal, notification } from "antd";
// import Report from "./Reports";


  import ReactApexChart from "react-apexcharts";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
} from "@coreui/react";
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormLabel,
  CFormSelect,
  CFormCheck,
  CFormFeedback,
  CInputFile,
  CRow,
  CCardBody,
  CFormTextarea,
  CCard,
  CCardTitle,
  CContainer,
  CDateRangePicker,
  CProgress,
} from "@coreui/react";
import femaleGeneric from "../../../image/images/femalegeneric.png";
import maleGeneric from "../../../image/images/malegeneric.png";

// import genericimage from "../../../image/images/genericimage.png";
import useCountdown from "../../helper/coundown";
import { AuthContext } from "../../helper/AuthState";

function StudentView() {
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem("accessToken"));
  const { hoursLeft, minutesLeft, secondsLeft } = useCountdown();
  const { authState } = useContext(AuthContext);
  const [adaats, setadaats] = useState([]); //used for weekly
  const [adaatsD, setadaatsD] = useState([]); //used for daily
  const [adaatsM, setadaatsM] = useState([]); // used for monthly
  const [displayAdaats, setDisplayAdaats] = useState([]); //final display
  const [previewImages, setPreviewImages] = useState([]);

  const [displayMiqaats, setDisplayMiqaats] = useState([]);
  const [displaySurats, setDisplaySurats] = useState([]);
  const [newsurats, setNewSurats] = useState([]);
  const [displaysubmittedAdaats, setDisplaysubmittedAdaats] = useState([]); //final display

  const [currentAyat, setcurrentAyat] = useState([]);
  const [student, setstudent] = useState();
  const [validated, setValidated] = useState(false);
  const [EditForm, setEditForm] = useState(false);
  const [EditIdADM, setEditIdADM] = useState("");
  const [ReadyToEdit, setReadyToEdit] = useState(false);
  const [isLoding, setisLoding] = useState(false);
  const [updateAPI, setUpdateAPI] = useState(0);
  const uniqueCategories = useMemo(() => {
    const categories = [];
    displayAdaats?.forEach((adaat) => {
      if (!categories.includes(adaat.category.name)) {
        categories.push(adaat.category.name);
      }
    });
    return categories;
  }, [displayAdaats]);

  const [selectedSurats, setSelectedSurats] = useState([]);
  const [attendance_chart, setAttendanceChart] = useState({
    chart: {
      height: 255,
      type: "donut",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "80%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    series: [50, 50], // Default values, will be updated after API call
    labels: ["Completed", "Not Completed"],
    colors: ["#1ABE17", "#E82646"], // Green for Completed, Red for Not Completed
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 350,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    legend: {
      position: "bottom",
    },
  });


  useEffect(() => {
      if (student) {
        setAttendanceChart((prevChart) => ({
            ...prevChart,
            series: [
             Number(student.suratPercentage),
              100 - Number(student.suratPercentage), 
            ],
          }));
  }
      
      
    

  }, [student]);
  
  useEffect(() => {
    if (uniqueCategories.length > 0) {
      const initialSelections = uniqueCategories.map((cat) =>
        displayAdaats
          ?.filter((adaatt) => adaatt.category.name === cat)
          .map((adaat) => {
            const responseValues = adaat?.responsevalues || {}; // Safely accessing responsevalues

            return {
              suratName:
                responseValues?.suratName ||
                student?.suratDetails?.suratName ||
                "", // Set suratName if available
              ayatId:
                responseValues?.suratid || student?.suratDetails?._id || "", // Set ayatId if available
            };
          })
      );

      // Only update state if initialSelections has changed
      if (!arraysEqual(initialSelections, selectedSurats)) {
        setSelectedSurats(initialSelections);
      }
    }
  }, [displayAdaats, uniqueCategories]);

  // Helper function to compare arrays (for deep comparison)
  const arraysEqual = (array1, array2) => {
    if (array1.length !== array2.length) return false;
    // You might want to adjust this comparison logic depending on structure (i.e., include nested objects or arrays)
    return array1.every(
      (value, index) =>
        value.suratName === array2[index].suratName &&
        value.ayatId === array2[index].ayatId
    );
  };


  const handleSuratChange = (categoryIndex, adaatIndex, value) => {
    const newSelections = [...selectedSurats];

    // Update suratName and reset ayatId for the specific adaat within the category
    newSelections[categoryIndex][adaatIndex].suratName = value;
    newSelections[categoryIndex][adaatIndex].ayatId = ""; // Reset Ayat selection when Surat changes

    setSelectedSurats(newSelections);
  };

  const handleAyatChange = (categoryIndex, adaatIndex, value) => {
    const newSelections = [...selectedSurats];

    // Update ayatId for the specific adaat within the category
    newSelections[categoryIndex][adaatIndex].ayatId = value;

    setSelectedSurats(newSelections);
  };

  const [uniqueSurahCount, setUniqueSurahCount] = useState(0);

  const [formattedDate, setFormattedDate] = useState("");

  const [toast, addToast] = useState(0);

  const { setAuthState } = useContext(AuthContext);
  const toaster = useRef();
  const exampleToast = (
    <CToast>
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#007aff"></rect>
        </svg>
        <div className="fw-bold me-auto">Great!</div>
      </CToastHeader>
      <CToastBody>Form submitted successfully</CToastBody>
    </CToast>
  );

  const reportView = () => {
    navigate("/report", {
      state: { suratPercentage: student.suratPercentage },
    });
  };

  const [formData, setformData] = useState({
    remarkBoxes: {},
    yesno: {},
    customField: [],
    responsetypeCustomField: [],
    images: [],
  });

  const [newformData, setnewformData] = useState({
    images: [],
    category: [
      {
        categoryName: "",
        aadat: [
          {
            aadatId: "",
            aadatName: "",
            remarkBoxes: {},
            yesno: {},
            customField: [],
            responsetypeCustomField: [],
          },
        ],
      },
    ],
  });

  const [newformDatanode, setnewformDataNode] = useState({
    //
    aadat: [
      {
        aadatId: "",
        aadatName: "",
        remarkBoxes: {},
        yesno: {},
        customField: [],
        responsetypeCustomField: [],
        customType: [],
        images: [],
        isValid: false,
      },
    ],
    surat: [
      {
        suratName: "",
        suratId: "",
      },
    ],
    miqaat: [
      {
        miqaatId: "",
        miqaatyesno: "",
      },
    ],
  });

  const [suratForm, setsuratForm] = useState({
    suratName: "",
    ayatNo: "",
    selectedAyatNo: "",
  });

  const [NewsuratForm, setNewsuratForm] = useState({
    suratName: "",
    ayatNo: "",
    selectedAyatNo: "",
  });

  //   const getsurats = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/school/surat/all`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },

  //         }
  //       );

  //       const relength = response.data;
  //       if (Object.keys(relength).length === 0) {
  //         return false;
  //       }
  //       setDisplaySurats(response.data.data);

  // const selectedAyats = response.data.data?.filter(
  //   (adaatt) => adaatt.suratName === displaysubmittedAdaats?.aadat?.map((res)=>{
  //     res?.suratName
  //   })
  // );
  // setcurrentAyat(selectedAyats[0]["ayatDetails"]);
  //     } catch (error) {
  //     }
  //   };
  const getsurats = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/school/surat/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const relength = response.data;

      // Check if the response data is empty
      if (Object.keys(relength).length === 0) {
        return false;
      }

      // Set the display data
      setDisplaySurats(response.data.data);

   

      // Extract selected ayats
      const selectedAyats = response.data.data?.filter((adaatt) =>
        displaysubmittedAdaats?.aadat?.some(
          (res) => res?.suratName === adaatt.suratName
        )
      );

      // Check if selectedAyats is not empty before accessing the ayatDetails
      if (selectedAyats.length > 0) {
        setcurrentAyat(selectedAyats[0]["ayatDetails"]);
      } else {
      }
    } catch (error) {
      console.error("Error fetching surats:", error);
    }
  };
  const getMiqaats = async () => {
    try {
      const res = student;

      // this is the call where you are retrieving all the adaats for the student for repetation- daily
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/miqaat/current-miqaat`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // params: {
          //   class: res.class,
          //   repetation: "weekly",
          //   applicableTo: res?.gender,
          //   currentTime: new Date(),
          // },
        }
      );

      const relength = response?.data;
      if (Object.keys(relength).length === 0) {
        return false;
      }
   

      setDisplayMiqaats(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getsubmittedData = async () => {
    try {
      const dataForToday = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/aadatdata/sumbitresponse`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDisplaysubmittedAdaats(dataForToday.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getAadatsforStudentweekly = async () => {
    try {
      const res = student;

      // this is the call where you are retrieving all the adaats for the student for repetation- daily
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/aadat/getAllDailyAadat`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            class: res?.stageGradeSection,
            repetation: "weekly",
            applicableTo: res?.gender,
            currentTime: new Date(),
          },
        }
      );

      const relength = response.data.data;
      if (Object.keys(relength).length === 0) {
        return false;
      }

      // Get today's day in lowercase (e.g., 'monday', 'tuesday')

      const today = new Date()
        .toLocaleString("default", { weekday: "long" })
        .toLowerCase();

      const month = new Date()
        .toLocaleString("default", { month: "long" })
        .toLowerCase();

      // Filter aadats based on today's repetition day
      // const filtered = response.data.data.filter((aadat) => {
      //   return (
      //     aadat.repeatDays.some((day) => day.toLowerCase() === today) &&
      //     aadat.repeatMonths.some((mon) => mon.toLowerCase() === month)
      //   );
      // });

      const filtered = response.data.data;

      // checking if this weekly aadats were already submitted
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0); // Set to 00:00:00 of today

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999); // Set to 23:59:59 of today

      // const filtered2 = filtered.filter((aadat) => {
      //   if (!aadatDataModelIds.includes(aadat._id)) {
      //     return aadat;
      //   } else {
      //     const relevantAddmt = aadatDataModelIds1.find(
      //       (addmt) =>
      //         addmt.aadat._id === aadat._id &&
      //         addmt.student === authState.id &&
      //         new Date(addmt.createdAt) >= todayStart && // Check for entries created within today 24hours
      //         new Date(addmt.createdAt) <= todayEnd
      //     );

      //     if (relevantAddmt) {
      //       return false;
      //     } else {
      //       return aadat;
      //     }
      //   }
      // });

      setadaats(filtered);

      const newWeeklyAadats = filtered;

      // filter for checking endDate
      const currentTime = new Date(); // Current date and time

      // Convert the current date to ISO format
      const currentTimeISO = currentTime.toISOString();

      const FnewWeeklyAadats = newWeeklyAadats.filter((aadat) =>
        aadat.endDate == null ? aadat : aadat.endDate > currentTimeISO
      );

      // Check if the newDailyAadats are not already present in displayAdaats
      const isDuplicate = FnewWeeklyAadats.some((newAadat) =>
        displayAdaats.some((displayAadat) => displayAadat._id === newAadat._id)
      );

      if (!isDuplicate) {
        // If the new data is not a duplicate, merge it into displayAdaats
        const mergedDisplayAdaats = [...displayAdaats, ...FnewWeeklyAadats];
        // setDisplayAdaats(mergedDisplayAdaats);

        //returning to usestate
        return mergedDisplayAdaats;
      }

      // copy pasta for month

      ///////////////////////////
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getAadatsforStudentMonthly = async () => {
    try {
      const res = student;

      // this is the call where you are retrieving all the adaats for the student for repetation- daily
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/aadat/getAllDailyAadat`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            class: res?.stageGradeSection,

            repetation: "monthly",
            applicableTo: res?.gender,

            currentTime: new Date(),
          },
        }
      );

      const today = new Date();
      const todayMonth = today
        .toLocaleString("default", { month: "long" })
        .toLowerCase();
      // const todayMonth = "november";
      const todayDate = today.getDate();

      // const filteredMonthly = response.data.data.filter((aadat) => {
      //   if (!aadat.repeatDateForMonth || !aadat.repeatMonths) {
      //     return false;
      //   }

      //   const repeatDates = aadat.repeatDateForMonth.map((rdom) =>
      //     new Date(rdom).getDate()
      //   );
      //   const repeatMonths = aadat.repeatMonths.map((month) =>
      //     month.toLowerCase()
      //   );

      //   return (
      //     repeatMonths.includes(todayMonth) && repeatDates.includes(todayDate)
      //   );
      // });

      const filteredMonthly = response.data.data;

      // Checking if these monthly aadats were already submitted
      setadaatsM(filteredMonthly); // Assuming setAdaats updates the state with filteredMonthly

      const newMonthlyAadats = filteredMonthly;

      // filter for checking endDate
      const currentTime = new Date(); // Current date and time

      // Convert the current date to ISO format
      const currentTimeISO = currentTime.toISOString();

      const FnewMontlyAadats = newMonthlyAadats.filter((aadat) =>
        aadat.endDate == null ? aadat : aadat.endDate > currentTimeISO
      );

      // Check if the newDailyAadats are not already present in displayAdaats
      const isDuplicate = FnewMontlyAadats.some((newAadat) =>
        displayAdaats.some((displayAadat) => displayAadat._id === newAadat._id)
      );

      if (!isDuplicate) {
        // If the new data is not a duplicate, merge it into displayAdaats
        const mergedDisplayAdaats = [...displayAdaats, ...FnewMontlyAadats];
        // setDisplayAdaats(mergedDisplayAdaats);

        //returning to usestate
        return mergedDisplayAdaats;
      }

      // setaadatdatamodels(response.data.aadatdatamodels);
      // setaadatDataModelIds(response.data.aadatDataModelIds);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // yearly dawg
  const getAadatsforStudentYearly = async () => {
    // this is for getting the information about the student you need to display all the adaats for
    // const res = await axios.get(
    //   `https://api.myaadat.com/api/v1/users/${localStorage.getItem(
    //     "userId"
    //   )}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );

    // setstudent(res.data.data);

    const res = student;

    // this is the call where you are retrieving all the adaats for the student for repetation- daily
    const response = await axios.get(
      `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/aadat/getAllDailyAadat`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          class: res?.stageGradeSection,
          repetation: "yearly",
          applicableTo: res?.gender,
          currentTime: new Date(),
        },
      }
    );

    const relength = response.data.data;
    if (Object.keys(relength).length === 0) {
      return false;
    }

    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const responseData = response.data.data;

    const filteredYearly = responseData.filter((aadat) => {
      // return aadat.repeatDateForYear.some((rdoy) => {
      const date = new Date(aadat.repeatDateForYear);
      const repeatDay = date.getDate();
      const repeatMonth = date.getMonth();

      // Check if the year of today's date is less than the end date year
      const endDate = new Date(aadat.endDate);
      const endYear = endDate.getFullYear();
      if (today.getFullYear() < endYear) {
        // Check if today's month and date match the repeat month and date
        if (todayDate === repeatDay && todayMonth === repeatMonth) {
          // Add any additional conditions or logic here
          return true; // Return true if it meets the conditions
        }
      }
      return true; // Temp modified Return false otherwise
      // });
    });

    // Checking if these monthly aadats were already submitted
    setadaatsM(filteredYearly); // Assuming setAdaats updates the state with filteredMonthly

    const newMonthlyAadats = filteredYearly;

    // filter for checking endDate
    const currentTime = new Date(); // Current date and time

    // Convert the current date to ISO format
    const currentTimeISO = currentTime.toISOString();

    const FnewYearlyAadats = newMonthlyAadats.filter((aadat) =>
      aadat.endDate == null ? aadat : aadat.endDate > currentTimeISO
    );

    // Check if the newDailyAadats are not already present in displayAdaats
    const isDuplicate = FnewYearlyAadats.some((newAadat) =>
      displayAdaats.some((displayAadat) => displayAadat._id === newAadat._id)
    );

    if (!isDuplicate) {
      // If the new data is not a duplicate, merge it into displayAdaats
      const mergedDisplayAdaats = [...displayAdaats, ...FnewYearlyAadats];
      // setDisplayAdaats(mergedDisplayAdaats);

      //returning to usestate
      return mergedDisplayAdaats;
    }

    // setaadatdatamodels(response.data.aadatdatamodels);
    // setaadatDataModelIds(response.data.aadatDataModelIds);
  };

  // for customized

  const getAadatsforStudentCustom = async () => {
    // this is for getting the information about the student you need to display all the adaats for
    // const res = await axios.get(
    //   `https://api.myaadat.com/api/v1/users/${localStorage.getItem(
    //     "userId"
    //   )}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );

    // setstudent(res.data.data);

    const res = student;

    // this is the call where you are retrieving all the adaats for the student for repetation- daily
    const response = await axios.get(
      `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/aadat/getAllDailyAadat`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          class: res?.stageGradeSection,
          repetation: "custom", /// custom //// dailty, mothly
          applicableTo: res?.gender,
          currentTime: new Date(),
        },
      }
    );

    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    //Temp modified const filteredCustom = response.data.data.filter((aadat) => {
    //   const customDate = new Date(aadat.customDate);
    //   const customYear = customDate.getFullYear();
    //   const customMonth = customDate.getMonth();
    //   const customDay = customDate.getDate();
    //   return (
    //     todayYear === customYear &&
    //     todayMonth === customMonth &&
    //     todayDay === customDay
    //   );
    // });
    const filteredCustom = response.data.data;

    // Checking if these monthly aadats were already submitted
    setadaatsM(filteredCustom); // Assuming setAdaats updates the state with filteredMonthly

    const newMonthlyAadats = filteredCustom;

    // filter for checking endDate
    const currentTime = new Date(); // Current date and time

    // Convert the current date to ISO format
    const currentTimeISO = currentTime.toISOString();

    const FnewCustomAadats = newMonthlyAadats.filter((aadat) =>
      aadat.endDate == null ? aadat : aadat.endDate > currentTimeISO
    );

    // Check if the newDailyAadats are not already present in displayAdaats
    const isDuplicate = FnewCustomAadats.some((newAadat) =>
      displayAdaats.some((displayAadat) => displayAadat._id === newAadat._id)
    );

    if (!isDuplicate) {
      // If the new data is not a duplicate, merge it into displayAdaats
      const mergedDisplayAdaats = [...displayAdaats, ...FnewCustomAadats];
      // setDisplayAdaats(mergedDisplayAdaats);

      //returning to usestate
      return mergedDisplayAdaats;
    }

    // setaadatdatamodels(response.data.aadatdatamodels);
    // setaadatDataModelIds(response.data.aadatDataModelIds);
  };

  const getAadatsforStudentNoRepeat = async () => {
    const res = student;
    const response = await axios.get(
      `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/aadat/getAllDailyAadat`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          class: res?.stageGradeSection,
          repetation: "norepeat",
          applicableTo: res?.gender,
          currentTime: new Date(),
        },
      }
    );

    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    //Temp modified const filteredCustom = response.data.data.filter((aadat) => {
    //   const customDate = new Date(aadat.customDate);
    //   const customYear = customDate.getFullYear();
    //   const customMonth = customDate.getMonth();
    //   const customDay = customDate.getDate();
    //   return (
    //     todayYear === customYear &&
    //     todayMonth === customMonth &&
    //     todayDay === customDay
    //   );
    // });
    const filteredCustom = response.data.data;

    // Checking if these monthly aadats were already submitted
    setadaatsM(filteredCustom); // Assuming setAdaats updates the state with filteredMonthly

    const newMonthlyAadats = filteredCustom;

    // filter for checking endDate
    const currentTime = new Date(); // Current date and time

    // Convert the current date to ISO format
    const currentTimeISO = currentTime.toISOString();

    const FnewCustomAadats = newMonthlyAadats.filter((aadat) =>
      aadat.endDate == null ? aadat : aadat.endDate > currentTimeISO
    );

    // Check if the newDailyAadats are not already present in displayAdaats
    const isDuplicate = FnewCustomAadats.some((newAadat) =>
      displayAdaats.some((displayAadat) => displayAadat._id === newAadat._id)
    );

    if (!isDuplicate) {
      // If the new data is not a duplicate, merge it into displayAdaats
      const mergedDisplayAdaats = [...displayAdaats, ...FnewCustomAadats];
      // setDisplayAdaats(mergedDisplayAdaats);

      //returning to usestate
      return mergedDisplayAdaats;
    }

    // setaadatdatamodels(response.data.aadatdatamodels);
    // setaadatDataModelIds(response.data.aadatDataModelIds);
  };

  const getAadatsforStudentDaily = async () => {
    // this is for getting the information about the student you need to display all the adaats for
    // const res = await axios.get(
    //   `https://api.myaadat.com/api/v1/users/${localStorage.getItem(
    //     "userId"
    //   )}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );

    // setstudent(res.data.data);

    const res = student;
    // this is the call where you are retrieving all the adaats for the student for repetation- daily
    const response = await axios.get(
      `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/aadat/getAllDailyAadat`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          class: res?.stageGradeSection,
          repetation: "daily",
          applicableTo: res?.gender,
          currentTime: new Date(),
        },
      }
    );
    const relength = response.data.data;
    if (Object.keys(relength).length === 0) {
      return false;
    }

    setadaatsD(response.data.data);

    const newDailyAadats = response.data.data;

    // filter for checking endDate
    const currentTime = new Date(); // Current date and time

    // Convert the current date to ISO format
    const currentTimeISO = currentTime.toISOString();

    // const FnewDailyAadats = newDailyAadats.filter((aadat) =>
    //   aadat.endDate == null ? aadat : aadat.endDate > currentTimeISO
    // );

    const FnewDailyAadats = newDailyAadats;

    // Check if the newDailyAadats are not already present in displayAdaats
    const isDuplicate = FnewDailyAadats.some((newAadat) =>
      displayAdaats.some((displayAadat) => displayAadat._id === newAadat._id)
    );

    if (!isDuplicate) {
      // If the new data is not a duplicate, merge it into displayAdaats
      const mergedDisplayAdaats = [...displayAdaats, ...FnewDailyAadats];
      // setDisplayAdaats(mergedDisplayAdaats);

      //returning to usestate
      return mergedDisplayAdaats;
    }

    // setaadatDataModelIds1(response.data.aadatDataModelIds);
    // setaadatdatamodels1(response.data.aadatdatamodels);
  };

  // usestates for all types of adaats

  // this one is used for daily
  const [aadatdatamodels1, setaadatdatamodels1] = useState([]);
  const [aadatDataModelIds1, setaadatDataModelIds1] = useState([]);

  // this one is used for weekly
  const [aadatdatamodels, setaadatdatamodels] = useState([]);
  const [aadatDataModelIds, setaadatDataModelIds] = useState([]);

  const [dailyAadats, setdailyAadats] = useState([]);
  const [weeklyAadats, setweeklyAadats] = useState([]);
 
  const remindUsersdaily = () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set to 00:00:00 of today

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // Set to 23:59:59 of today
    const filteredDaily = adaatsD
      .map((aadat) => {
        if (aadatDataModelIds1.includes(aadat._id)) {
          const relevantAddmt = aadatdatamodels1.find(
            (addmt) =>
              addmt.aadat._id === aadat._id && addmt.student === authState.id
            // &&
            // new Date(addmt.createdAt) >= todayStart && // Check for entries created after today's start
            // new Date(addmt.createdAt) <= todayEnd
          );
          if (relevantAddmt) {
            if (
              // checking if the entry was made before todays end

              new Date(relevantAddmt.createdAt) <= todayEnd
            ) {
              // if yes then dont print the aadat
              return null;
            } else {
              // if no print the aadat only if
              return aadat;
            }
          } else {
            return aadat;
          }
          // if (!relevantAddmt) {
          //   return aadat;
          // } else {
          //   return false;
          // }
        } else {
          return aadat;
        }
        // if (relevantAddmt) {
        //   // Check if relevantAddmt was created before the current day's midnight but after yesterday's midnight should not consider
        //   // any before that
        //   if (
        //     relevantAddmt.createdAt < midnightOfgivenTime &&
        //     relevantAddmt.createdAt >= yesterdayStart
        //   ) {
        //     return aadat; // Include aadat if the condition is met
        //   }
        // } else {
        //   return aadat; // Include aadat if there's no relevantAddmt found
        // }
        // return !relevantAddmt; // Include only if not created today
      })
      .filter(Boolean);
    setdailyAadats(filteredDaily);
  };

  // useEffect(() => {
  //   remindUsersdaily();
  //   // remindUsersWeekly();
  // }, [aadatDataModelIds, aadatdatamodels]);

  // useEffect(() => {
  //   getAadatsforStudentCustom();
  //   getAadatsforStudentYearly();
  //   getAadatsforStudentweekly();
  //   getAadatsforStudentMonthly();
  //   getAadatsforStudentDaily();
  // }, [authState.id, authState.role]);

  // effects

  // useEffect(() => {
  //   const fetchAllAadats = async () => {
  //     setDisplayAdaats([]);
  //     const customAadats = await getAadatsforStudentCustom();
  //     const yearlyAadats = await getAadatsforStudentYearly();
  //     const weeklyAadats = await getAadatsforStudentweekly();
  //     const monthlyAadats = await getAadatsforStudentMonthly();
  //     const dailyAadats = await getAadatsforStudentDaily();

  //     // Combine all the fetched aadats
  //     const allAadats = [
  //       ...(customAadats || []), // Check if falsy or empty
  //       ...(yearlyAadats || []),
  //       ...(weeklyAadats || []),
  //       ...(monthlyAadats || []),
  //       ...(dailyAadats || []),
  //     ];
  //     // Set the combined aadats to the displayAadats state
  //     setDisplayAdaats(allAadats);
  //   };

  //   fetchAllAadats();
  // }, [authState.id, authState.role]);

  const fetchData = async () => {
    // const customAadats = await getAadatsforStudentCustom();
    // const yearlyAadats = await getAadatsforStudentYearly();
    // const weeklyAadats = await getAadatsforStudentweekly();
    // const monthlyAadats = await getAadatsforStudentMonthly();
    //const dailyAadats = await getAadatsforStudentDaily();

    const [
      customAadats,
      dailyAadats,
      yearlyAadats,
      weeklyAadats,
      monthlyAadats,
    ] = await Promise.all([
      getAadatsforStudentCustom(),
      getAadatsforStudentDaily(),
      getAadatsforStudentYearly(),
      getAadatsforStudentweekly(),
      getAadatsforStudentMonthly(),
      getAadatsforStudentNoRepeat(),
    ]);

    // Combine all the fetched aadats into a Set to ensure uniqueness
    // const allAadatsSet = new Set([
    //   ...(customAadats || []),
    //   ...(yearlyAadats || []),
    //   ...(weeklyAadats || []),
    //   ...(monthlyAadats || []),
    //   ...(dailyAadats || []),
    // ]);

    const allAadatsSet = new Set([...(dailyAadats || [])]);

    // Convert the Set back to an array
    return Array.from(allAadatsSet);
  };

  const fetchAllAadats = async () => {
    setisLoding(true);
    let submittedAdaats = displaysubmittedAdaats.aadat;
    let submittedmiqaat = displaysubmittedAdaats.miqaat;

    // const studentsvar = students;
    // const allAadats = await fetchData();
    // Set the combined aadats to the displayAadats state after clearing the previous data

    const customAadats = await getAadatsforStudentCustom();
    const yearlyAadats = await getAadatsforStudentYearly();
    const weeklyAadats = await getAadatsforStudentweekly();
    const monthlyAadats = await getAadatsforStudentMonthly();
    const dailyAadats = await getAadatsforStudentDaily();
    const norepeataadat = await getAadatsforStudentNoRepeat();

    // const [customAadats, dailyAadats, yearlyAadats, weeklyAadats, monthlyAadats] =
    //     await Promise.all([
    //         (getAadatsforStudentCustom()),
    //         (getAadatsforStudentDaily()),
    //         (getAadatsforStudentYearly()),
    //         (getAadatsforStudentweekly()),
    //         (getAadatsforStudentMonthly()),
    //     ]);

    // const dailyAadatss = await getAadatsforStudentDaily();

    // Combine all the fetched aadats into a Set to ensure uniqueness
    // const allAadatsSet = new Set([
    //   ...(customAadats || []),
    //   ...(yearlyAadats || []),
    //   ...(weeklyAadats || []),
    //   ...(monthlyAadats || []),
    //   ...(dailyAadats || []),
    // ]);

    const allAadatsSet = new Set([
      ...(customAadats || []),
      ...(dailyAadats || []),
      ...(yearlyAadats || []),
      ...(weeklyAadats || []),
      ...(monthlyAadats || []),
      ...(norepeataadat || []),
    ]);

    // Convert the Set back to an array
    const allAadats = Array.from(allAadatsSet);

    const modifiedaadat = allAadats.map((aadatmap, index) => {
      let aadatTemp = aadatmap;

      // if(aadatmap._id!='6672872b1b0b90ceb659fb73') return;

      let filteredsubmittedAdaats = submittedAdaats?.filter(
        (subadaatt) => subadaatt.aadatId === aadatmap._id
      );

      let filteredtemp = filteredsubmittedAdaats[0];
      if (!filteredtemp) {
        return { ...aadatmap };
      }

      let responsevalues = [];
      let aadatMaster;
      aadatmap.responseType.map((type, typeIndex) => {
        switch (type) {
          case "yesno":
            if (filteredtemp.yesno) {
              let yesnovalue;
              if (filteredtemp.yesno == "yes") {
                yesnovalue = "true";
              } else {
                yesnovalue = "false";
              }
              responsevalues["yesno"] = yesnovalue;
            }
            break;
          case "custom":
            responsevalues["custom"] = filteredtemp.customType;
            break;
          case "surat":
            if (filteredtemp.suratId) {
              var suratId = filteredtemp.suratId;
              var suratName = filteredtemp.suratName;
              responsevalues["suratid"] = suratId;
              responsevalues["suratName"] = suratName;
            }
            break;
          case "remarkbox":
            if (
              filteredtemp.remarkBoxes &&
              filteredtemp.remarkBoxes["remarkbox_1"]
            ) {
              var remarboxvalue = filteredtemp.remarkBoxes["remarkbox_1"].value;
              responsevalues["remarkbox"] = remarboxvalue;
            }
            break;
          case "image":
            responsevalues["images"] = filteredtemp.images;
          default:
            return null;
        }
      });

      const modifiedCustomfield = aadatmap.customField.map(
        (field, fieldIndex) => {
          if (
            filteredtemp.customField.length > 0 &&
            field.fieldType === "dropdown"
          ) {
            var fieldvalue =
              filteredtemp.customField[0][field.fieldTitle]?.value;

            // responsevalues['customField']= [];
            // responsevalues['customField'][fieldTitle] =fieldvalue;

            return { ...field, defaultvalue: fieldvalue };
          } else {
            return field;
          }
          // field.fieldType === "dropdown"
        }
      );

      let FinalAadatKey = { ...aadatmap };
      FinalAadatKey.customField = modifiedCustomfield;

      return { ...FinalAadatKey, responsevalues };

      // submittedAdaats.map((submittedadaat, index) => {
      //   if(submittedadaat.aadatId == '6672872b1b0b90ceb659fb73'){

      //   }
      // });
    });

    if (submittedAdaats?.length == 0) {
      setDisplayAdaats(allAadats);
      setisLoding(false);
    } else {
      setDisplayAdaats(modifiedaadat);
      setisLoding(false);
    }
  };

  // const reloadDetails = async () => {
  //   axios
  //     .get(
  //       `${process.env.REACT_APP_DEV_BASE_URL
  //       }/api/v1/users/${localStorage.getItem("userId")}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     )
  //     .then(function (response) {
  //       setstudent(response.data.data);
  //     });
  // };

  const getStudentdetails = () => {
    axios
      .get(`${process.env.REACT_APP_DEV_BASE_URL}/api/v1/school/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        setstudent(response.data.data);
        setNewSurats(response.data.data.suratDetails);
        setAuthState({
          role: response.data.data.role,
          id: response.data.data._id,
          name: response.data.data.firstName,
          lastname: response.data.data.lastName,
        });
      });
  };

  useEffect(() => {
    getStudentdetails();
  }, [updateAPI]);

  useEffect(() => {
    if (!student) return;
    getsubmittedData();
  }, [student, updateAPI]);

  useEffect(() => {
    if (displaysubmittedAdaats.length == 0) return;
    fetchAllAadats();
    getMiqaats();
    getsurats();
  }, [student, displaysubmittedAdaats]);

  //Temp modified useEffect(() => {
  //   fetchAllAadats();
  // }, [authState.id, authState.role]);

  // useEffect(() => {
  //   fetchAllAadats();
  // }, []);
  useEffect(() => {
    const fnccc = async () => {
      const userId = localStorage.getItem("userId");

      const dataForToday = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/aadatdata/sumbitresponse?student=${userId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const datafortoday = dataForToday.data.data.docs;
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to 00:00:00 of today

      const filteredData = datafortoday?.filter((aadat) => {
        const aDate = new Date(aadat.createdAt);

        return aDate >= today;
      });

      // 08/12/2023
      // before submitting the form i have to check if the form was already submitted for today,

      // it is submitted=====> print the values to form display
      if (filteredData.length > 0) {
        const [firstElement] = filteredData; // Extracting the first element

        // extracting data singularly
        // setformData({
        //   remarkBoxes: firstElement.remarkBoxes,
        //   yesno: firstElement.yesno,
        //   customField: firstElement.customField,
        //   responsetypeCustomField: firstElement.responsetypeCustomField,
        // });

        // form editing should be handled here
        setEditIdADM(firstElement._id);
        // setEditForm(true);
        setReadyToEdit(true);
      }

      // ////////////////////////////////////setting up the latest surat student has read
    };

    // fnccc();
  }, []);

  useEffect(() => {
    if (student && student.suratRecord) {
      const countUniqueEntries = async () => {
        // extracting latest surat student has read

        const suratRecordArray = student.suratRecord;

        // Get the last entry from the suratRecord array
        const lastEntry = suratRecordArray[suratRecordArray.length - 1];

        if (lastEntry) {
          setsuratForm((prevSuratForm) => ({
            ...prevSuratForm,
            suratName: lastEntry.suratName,
            ayatNo: ayatsPerSurat[lastEntry.suratName] || prevSuratForm.ayatNo,
            selectedAyatNo: lastEntry.selectedAyatNo,
          }));
        }

        try {
          const response = await axios.get(
            `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/surat`,
            {
              params: {
                suratName: lastEntry.suratName,
                ayatNo: 1,
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Assuming the page number is available in the response data
          const pageNumber = response.data.pageNumber;

          setUniqueSurahCount(pageNumber);
        } catch (error) {
          console.error("Error fetching data:", error.message);
          // Handle errors here
        }
      };

      countUniqueEntries();
    }
  }, [student]);

  useEffect(() => {
    function formatDate(date) {
      const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      return new Date(date).toLocaleDateString("en-US", options);
    }

    // Get the current date
    const currentDate = new Date();
    const formatted = formatDate(currentDate);

    // Update the state with the formatted date
    setFormattedDate(formatted);
  }, []);

  if (!student) {
    return <div>Loading...</div>; //setting loading to avoid onload error
  }

  // const handlechangeCusres = (e, val, cusresTitle) => {
  //   const { name, checked } = e.target;
  //   const updatedResponsetypeCustomField = [
  //     ...formData.responsetypeCustomField,
  //   ];

  //   updatedResponsetypeCustomField[name].cusresTitle = cusresTitle;
  //   updatedResponsetypeCustomField[name].cusresValue[val] = checked;
  // };
  // const handlechangeCusres = (e, val, cusresTitle) => {
  //   const { name, checked } = e.target;

  //   if (name.startsWith("cusradiofortitle")) {
  //     const [categoryIndex, index, typeIndex, resIndex, cusresindexVal] =
  //       name.split("_");

  //     if (name.startsWith("cusradiofortitle")) {

  //       const updatedResponsetypeCustomField = [
  //         ...formData.responsetypeCustomField,
  //       ];

  //       if (!updatedResponsetypeCustomField[index]) {
  //         updatedResponsetypeCustomField[index] = [];
  //       }

  //       if (!updatedResponsetypeCustomField[index][resIndex]) {
  //         updatedResponsetypeCustomField[index][resIndex] = {
  //           cusresTitle: cusresTitle,
  //           cusresValue: {},
  //         };
  //       }

  //       if (!updatedResponsetypeCustomField[index][resIndex].cusresValue) {
  //         updatedResponsetypeCustomField[index][resIndex].cusresValue = {}; // Initialize cusresValue if it's not defined
  //       }
  //       updatedResponsetypeCustomField[index][resIndex].cusresTitle =
  //         cusresTitle;

  //       if (
  //         !updatedResponsetypeCustomField[index][resIndex].cusresValue[name]
  //       ) {
  //         updatedResponsetypeCustomField[index][resIndex].cusresValue[name] =
  //           {}; // Initialize cusresindexVal if it's not defined
  //       }

  //       if (checked) {
  //         updatedResponsetypeCustomField[index][resIndex].cusresValue[name][
  //           val
  //         ] = checked;
  //       } else {
  //         updatedResponsetypeCustomField[index][resIndex].cusresValue[name][
  //           val
  //         ] = false; // Set the value to false if checked is false
  //       }

  //       setformData({
  //         ...formData,
  //         responsetypeCustomField: updatedResponsetypeCustomField,
  //       });
  //     }
  //   }
  // };

  const handlechangeCusres = (e, val, cusresTitle) => {
    const { name } = e.target;
    const [categoryIndex, index, typeIndex, resIndex, cusresindexVal] =
      name.split("_");

    // Update the selected value for the group

    // const updatedvalue = {
    //   [`${categoryIndex}_${index}_${typeIndex}_${resIndex}`]: val,
    // };
    const existingField =
      formData.responsetypeCustomField[
        `${categoryIndex}_${index}_${typeIndex}_${resIndex}`
      ];
    const updatedValue = {
      ...formData.responsetypeCustomField,
      [`${categoryIndex}_${index}_${typeIndex}_${resIndex}`]: {
        ...(existingField || {}), // If the field already exists, spread its content
        [`${categoryIndex}_${index}_${typeIndex}_${resIndex}`]: val, // Set the new value
      },
    };

    setformData({
      ...formData,
      responsetypeCustomField: updatedValue,
    });
  };

  const handlechange = (e, aadat) => {
    const { name, value } = e.target;
    if (name.startsWith("yesno") && !value) {
      // Show error notification if no radio button is selected
      notification.error({
        message: "Error",
        description: "Please select yes/no.",
      });

      // You can also directly display invalid feedback message within your UI here.
      return; // Exit if no selection
    }
    if (name.startsWith("image")) {
      // const files = e.target.files;
      // If no files are selected, clear the existing state for that input

      const selectedFiles = e.target.files[0];
      setnewformDataNode({ ...newformDatanode, images: selectedFiles });
    } else if (name.startsWith("yesno")) {
      setnewformDataNode((prevFormData) => {
        // Check if aadat already exists in the category
        const existingAadat = prevFormData.aadat.find(
          (item) => item.aadatName === aadat.name
        );

        // If aadat exists, update its 'yesno' object
        if (existingAadat) {
          const updatedAadats = prevFormData?.aadat.map((item) => {
            if (item?.aadatId === aadat?._id) {
              return {
                ...item,
                yesno: value,
              };
            }
            return item;
          });

          return {
            ...prevFormData,
            aadat: updatedAadats,
          };
        } else {
          // If aadat doesn't exist, add a new one
          return {
            ...prevFormData,
            aadat: [
              ...prevFormData.aadat,
              {
                aadatId: aadat._id,
                aadatName: aadat.name,
                yesno: value,
              },
            ],
          };
        }
      });

      // {
      //   category: [
      //     {
      //       categoryName: "",
      //       aadat: [
      //         {
      //           aadatName: "",
      //           remarkBoxes: {},
      //           yesno: {},
      //           customField: [],
      //           responsetypeCustomField: [],
      //           images: [],
      //         },
      //       ],
      //     },
      //   ],
      // }

      // const updatedYesNo = {
      //   ...newformData,
      //   // [name]: {
      //   //   value: value,
      //   //   aadat: aadat._id,
      //   //   aadatName: aadat.name,
      //   //   categoryName: aadat.category.name,
      //   // },
      //   category: [
      //     {
      //       categoryName: aadat.category.name,
      //       aadat: [
      //         {
      //           aadatName: aadat.name,

      //           yesno: {
      //             [name]: {
      //               value: value,
      //             },
      //           },
      //         },
      //       ],
      //     },
      //   ],
      // };

      // setnewformData({
      //   ...newformData,
      //   category: updatedYesNo,
      // });
    } else if (name.startsWith("remarkbox")) {
      setnewformDataNode((prevFormData) => {
        // Check if aadat already exists in the category
        const existingAadat = prevFormData.aadat.find(
          (item) => item.aadatId === aadat._id
        );

        // If aadat exists, update its 'yesno' object
        if (existingAadat) {
          const updatedAadats = prevFormData?.aadat.map((item) => {
            if (item.aadatId === aadat._id) {
              return {
                ...item,
                remarkBoxes: {
                  ...item.remarkBoxes,
                  ["remarkbox_1"]: {
                    value: value,
                  },
                },
              };
            }
            return item;
          });

          return {
            ...prevFormData,
            aadat: updatedAadats,
          };
        } else {
          // If aadat doesn't exist, add a new one
          return {
            ...prevFormData,
            aadat: [
              ...prevFormData.aadat,
              {
                aadatId: aadat._id,
                aadatName: aadat.name,
                remarkBoxes: {
                  ["remarkbox_1"]: {
                    value: value,
                  },
                },
              },
            ],
          };
        }
      });

      // const updatedRemarkBoxes = {
      //   ...formData.remarkBoxes,
      //   [name]: {
      //     value: value,
      //     aadat: aadat._id,
      //     aadatName: aadat.name,
      //     categoryName: aadat.category.name,
      //   },
      // };

      // setformData({
      //   ...formData,
      //   remarkBoxes: updatedRemarkBoxes,
      // });
    }
  };

  const handleImagechange = async (e, aadat) => {
    const { name, value } = e.target;

    if (name.startsWith("image")) {
      // const files = e.target.files;
      // If no files are selected, clear the existing state for that input

      const selectedFiles = e.target.files;
      const ImgFormdata = new FormData();

      //  ImgFormdata.append(`images`, selectedFiles);

      [...selectedFiles].forEach((image) => {
        ImgFormdata.append("image", image);
      });
      const previewUrls = [...selectedFiles].map((file) => URL.createObjectURL(file));
      setPreviewImages(previewUrls);
  
      //ImgFormconsoldata.append
      const response = await axios
        .post(
          `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/aadatdata/uploadImage`,
          ImgFormdata,
          // {
          //   student: authState.id,
          //   remarkBoxes: formData.remarkBoxes,
          //   yesno: formData.yesno,
          //   customField: formData.customField,
          //   responsetypeCustomField: formData.responsetypeCustomField,
          //   images: formData.images,
          // },

          {
            headers: {
              // "Content-Type": "multipart/form-data", // Ensure Content-Type is set to multipart/form-data
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(function (response) {
          let Tempfiles = response.data.imagesArr;
          // setnewformDataNode({ ...newformDatanode, images: Tempfiles });

          setnewformDataNode((prevFormData) => {
            // Check if aadat already exists in the category
            const existingAadat = prevFormData?.aadat.find(
              (item) => item?.aadatId === aadat?._id
            );

            // If aadat exists, update its 'yesno' object
            if (existingAadat) {
              const updatedAadats = prevFormData?.aadat.map((item) => {
                if (item?.aadatId === aadat?._id) {
                  return {
                    ...item,
                    images: Tempfiles,
                  };
                }
                return item;
              });

              return {
                ...prevFormData,
                aadat: updatedAadats,
              };
            } else {
              // If aadat doesn't exist, add a new one
              return {
                ...prevFormData,
                aadat: [
                  ...prevFormData.aadat,
                  {
                    aadatId: aadat._id,
                    aadatName: aadat.name,
                    images: Tempfiles,
                  },
                ],
              };
            }
          });
        });

      //setnewformDataNode({ ...newformDatanode, images: selectedFiles });
    }
  };

  const handlemiqaatchange = (e, miqaat) => {
    const { name, value } = e.target;
    if (!value) {
      // If the value is empty, show the toast with the error message
      notification.error({
        message: "Error",
        description: "Please select yes/no.",
      });
      return;
    }
    setnewformDataNode((prevFormData) => {
      // Check if aadat already exists in the category
      const existingAadat = prevFormData.miqaat.find(
        (item) => item.miqaatId === miqaat._id
      );

      // If aadat exists, update its 'yesno' object
      if (existingAadat) {
        const updatedAadats = prevFormData.miqaat.map((item) => {
          if (item.miqaatId === miqaat._id) {
            item.miqaatyesno = value;
            return item;
          }
          return item;
        });

        return {
          ...prevFormData,
          miqaat: updatedAadats,
        };
      } else {
        // If aadat doesn't exist, add a new one
        return {
          ...prevFormData,
          miqaat: [
            ...prevFormData.miqaat,
            {
              miqaatId: miqaat._id,
              miqaatyesno: value,
            },
          ],
        };
      }
    });
  };

  // saving data and making adaatDatamodels for everything mentioned in form

  const saveData = async (event) => {
    const form = event.currentTarget;
    // Check form validity
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      // Handle invalid form case (display errors or take other actions)
      setValidated(true); // If you want to set a flag for showing errors
      notification.error({
        message: "Error",
        description: "Please fill all required fields",
      });
      return; // Exit function if form is invalid
    }

    // If form is valid
    event.preventDefault();
    event.stopPropagation();

    try {
      // Temp modified const dataForToday = await axios.get(
      //   `https://api.myaadat.com/api/v1/aadatdata/sumbitresponse?student=${student._id}`,

      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      // const datafortoday = dataForToday.data.data.docs;
      // const today = new Date();
      // today.setHours(0, 0, 0, 0); // Set to 00:00:00 of today

      // const filteredData = datafortoday?.filter((aadat) => {
      //   const aDate = new Date(aadat.createdAt);

      //   return aDate >= today;
      // });
      const filteredData = [];
      // 08/12/2023
      // before submitting the form i have to check if the form was already submitted for today,

      // it is submitted=====> print the values to form display
      if (filteredData.length > 0) {
        const [firstElement] = filteredData; // Extracting the first element
        // extracting data singularly
        setformData({
          remarkBoxes: firstElement.remarkBoxes,
          yesno: firstElement.yesno,
          customField: firstElement.customField,
          responsetypeCustomField: firstElement.responsetypeCustomField,
        });

        // form editing should be handled here
        setEditIdADM(firstElement._id);
        setEditForm(true);
        setReadyToEdit(true);
      } else {
        // its not submitted========> submit the form ie below

        const Fd = new FormData();

        // Append form data fields to the FormData object
        //  Fd.append("student", student._id);
        // Fd.append("aadat", JSON.stringify(newformDatanode.aadat));
        // Fd.append("yesno", JSON.stringify(newformData.yesno));
        // Fd.append("customField", JSON.stringify(newformData.customField));
        // Fd.append(
        //   "responsetypeCustomField",
        //   JSON.stringify(newformData.responsetypeCustomField)
        // );

        // Append files to the FormData object
        // Fd.append("images", formData.images[0]);

        // newformData.images.forEach((file, index) => {
        //   Fd.append(`images`, file); // Append each file as an array
        //   // Fd.append(`images`, file, file.filename);
        // });

        //Fd.append("aadat", JSON.stringify(newformDatanode.aadat));

        const response = await axios.post(
          `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/aadatdata/sumbitresponse`,
          newformDatanode,
          // {
          //   student: authState.id,
          //   remarkBoxes: formData.remarkBoxes,
          //   yesno: formData.yesno,
          //   customField: formData.customField,
          //   responsetypeCustomField: formData.responsetypeCustomField,
          //   images: formData.images,
          // },

          {
            headers: {
              // "Content-Type": "multipart/form-data", // Ensure Content-Type is set to multipart/form-data
              Authorization: `Bearer ${token}`,
            },
          }
        );

        notification.success({
          message: "Success",
          description: "Form Submitted  successfully!",
        });

        setTimeout(function () {
          // reloadDetails();
          setUpdateAPI(updateAPI + 1);
        }, 500);

        // updating surat
        // const existingSuratRecord = student.suratRecord;

        // existingSuratRecord.push({
        //   suratName: suratForm.suratName,
        //   selectedAyatNo: suratForm.selectedAyatNo,
        // });

        // Creating the requestBody object with the updated suratRecord
        // const requestBody = {
        //   suratRecord: existingSuratRecord, // Converting Map back to an object
        // };

        // const response2 = await axios.patch(
        //   `https://api.myaadat.com/api/v1/users/${authState.id}`,

        //   requestBody,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );
        // throw alert("form successfully submitted!");
      }
      setValidated(false); // Reset validation flag if needed
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updateSurat = (selectedOption, aadat) => {
    setnewformDataNode((prevFormData) => {
      // Check if aadat already exists in the category
      const existingAadat = prevFormData?.aadat.find(
        (item) => item?.aadatId === aadat?._id
      );

      // If aadat exists, update its 'yesno' object
      if (existingAadat) {
        const updatedAadats = prevFormData?.aadat.map((item) => {
          if (item?.aadatId === aadat?._id) {
            return {
              ...item,
              suratId: selectedOption,
            };
          }
          return item;
        });

        return {
          ...prevFormData,
          aadat: updatedAadats,
        };
      } else {
        // If aadat doesn't exist, add a new one
        return {
          ...prevFormData,
          aadat: [
            ...prevFormData.aadat,
            {
              aadatId: aadat._id,
              aadatName: aadat.name,
              suratId: selectedOption,
            },
          ],
        };
      }
    });
  };

  const updateCustomFieldDropdown = (
    uniqueIndex,
    fieldTitle,
    fieldType,
    selectedOption,
    aadat
  ) => {
    setnewformDataNode((prevFormData) => {
      const [fieldIndex, typeIndex, uniqueFieldTitle] = uniqueIndex.split("_");

      // Find if aadat already exists
      const existingAadat = prevFormData.aadat.find(
        (item) => item.aadatName === aadat.name
      );

      // If aadat exists, update the 'customField' object
      if (existingAadat) {
        const updatedAadats = prevFormData.aadat.map((item) => {
          if (item.aadatId === aadat._id) {
            return {
              ...item,
              customField: {
                ...item.customField,
                [fieldTitle]: { value: selectedOption },
              },
            };
          }
          return item;
        });

        return { ...prevFormData, aadat: updatedAadats };
      } else {
        // If aadat doesn't exist, add a new one
        return {
          ...prevFormData,
          aadat: [
            ...prevFormData.aadat,
            {
              aadatId: aadat._id,
              aadatName: aadat.name,
              customField: {
                [fieldTitle]: { value: selectedOption },
              },
            },
          ],
        };
      }
    });
  };

  const updateCustomFieldCheckbox = (
    uniqueIndex,
    fieldTitle,
    fieldType,
    selectedOption,
    aadat
  ) => {
    const { value, checked } = selectedOption;

    setnewformDataNode((prevFormData) => {
      const updatedCustomField = [prevFormData.customField];
      const [fieldIndex, typeIndex, uniqueFieldTitle] = uniqueIndex.split("_");

      const existingAadat = prevFormData?.aadat?.find(
        (item) => item?.aadatName === aadat?.name
      );

      if (existingAadat) {
        const updatedAadats = prevFormData?.aadat?.map((item) => {
          if (item?.aadatId === aadat?._id) {
            let newCheckboxArray = [];

            // Initialize `item.customField` if it's undefined
            const fieldData = item?.customField?.[fieldTitle]?.value || [];

            newCheckboxArray = [...fieldData];

            if (checked) {
              // Add value if checkbox is checked
              newCheckboxArray.push(value);
            } else {
              // Remove value if checkbox is unchecked
              newCheckboxArray = newCheckboxArray.filter((e) => e !== value);
            }

            return {
              ...item,
              customField: {
                ...item.customField,
                [fieldTitle]: {
                  value: newCheckboxArray,
                },
              },
            };
          }
          return item;
        });

        return {
          ...prevFormData,
          aadat: updatedAadats,
        };
      } else {
        // If `aadat` doesn't exist, add a new one
        let newCheckboxArray = [value];
        return {
          ...prevFormData,
          aadat: [
            ...(prevFormData.aadat || []),
            {
              aadatId: aadat?._id,
              aadatName: aadat?.name,
              customField: {
                [fieldTitle]: {
                  value: newCheckboxArray,
                },
              },
            },
          ],
        };
      }
    });
  };

  const updateCustomTypeCheckbox = (
    uniqueIndex,
    fieldTitle,
    fieldType,
    selectedOption,
    aadat
  ) => {
    const { value, checked } = selectedOption;
    setnewformDataNode((prevFormData) => {
      const updatedCustomField = [prevFormData.customField];
      const [fieldIndex, typeIndex, uniqueFieldTitle] = uniqueIndex.split("_");

      // Check if the fieldIndex exists and uniqueFieldTitle matches with fieldTitle
      // const existingField = updatedCustomField.find(
      //   (cf) => cf.adaatId === id && cf.fieldTitle === uniqueFieldTitle
      // );

      // Check if aadat already exists in the category
      const existingAadat = prevFormData.aadat.find(
        (item) => item.aadatName === aadat.name
      );

      var adaatdisplay = displayAdaats.map((adaat, index) => {
        if (adaat._id == aadat._id && adaat.responsevalues) {
          var adaatcustom = value;
          adaat.responsevalues.custom = [value];
        }
        return adaat;
      });

      setDisplayAdaats(adaatdisplay);
      // If aadat exists, update its 'yesno' object
      if (existingAadat) {
        const updatedAadats = prevFormData?.aadat.map((item) => {
          if (item?.aadatId === aadat?._id) {
            let newcheckboxarray = [];

            if (checked) {
              newcheckboxarray.push(value);
            } else {
              let newcheckboxarrays = newcheckboxarray.filter((e) => {
                return e !== value;
              });

              newcheckboxarray = newcheckboxarrays;

              // newcheckboxarray.push(value);
            }
            return {
              ...item,
              customType: newcheckboxarray,
              isValid: true,
            };
          }

          return item;
        });

        return {
          ...prevFormData,
          aadat: updatedAadats,
        };
      } else {
        // If aadat doesn't exist, add a new one

        let newcheckboxarray = [];
        newcheckboxarray.push(value);

        return {
          ...prevFormData,
          aadat: [
            ...prevFormData.aadat,
            {
              aadatId: aadat._id,
              aadatName: aadat.name,
              customType: newcheckboxarray,
              isValid: true,
            },
          ],
        };
      }

      // return {
      //   images: [],
      //   category: [
      //     {
      //       categoryName: "",
      //       aadat: [
      //         {
      //           aadatName: "",
      //           remarkBoxes: {},
      //           yesno: {},
      //           customField: [],
      //           responsetypeCustomField: [],
      //         },
      //       ],
      //     },
      //   ],
      // }

      // if (!existingField) {
      //   // If the field doesn't exist, create a new entry
      //   updatedCustomField.push({
      //     fieldTitle: uniqueFieldTitle,
      //     fieldType: [{ type: fieldType }],
      //     options: [selectedOption],
      //     adaatId: id,
      //   });
      // } else {
      //   // If the field exists, update its options array
      //   existingField.options = [selectedOption];
      // }

      // setformData({
      //   ...formData,
      //   customField: updatedCustomField,
      // });
    });
  };

  const ayatsPerSurat = {
    "Al-Fatihah": 7,
    "Al-Baqarah": 286,
    "Aali 'Imran": 200,
    "An-Nisa": 176,
    "Al-Ma'idah": 120,
    "Al-An'am": 165,
    "Al-A'raf": 206,
    "Al-Anfal": 75,
    "At-Tawbah": 129,
    Yunus: 109,
    Hud: 123,
    Yusuf: 111,
    "Ar-Ra'd": 43,
    Ibrahim: 52,
    "Al-Hijr": 99,
    "An-Nahl": 128,
    "Al-Isra": 111,
    "Al-Kahf": 110,
    Maryam: 98,
    "Ta-Ha": 135,
    "Al-Anbiya": 112,
    "Al-Hajj": 78,
    "Al-Mu'minun": 118,
    "An-Nur": 64,
    "Al-Furqan": 77,
    "Ash-Shu'ara": 227,
    "An-Naml": 93,
    "Al-Qasas": 88,
    "Al-Ankabut": 69,
    "Ar-Rum": 60,
    Luqmaan: 34,
    "As-Sajdah": 30,
    "Al-Ahzaab": 73,
    "Saba (surah)": 54,
    Faatir: 45,
    "Ya-Sin": 83,
    "As-Saaffaat": 182,
    Saad: 88,
    "Az-Zumar": 75,
    Ghafir: 85,
    Fussilat: 54,
    "Ash-Shura": 53,
    "Az-Zukhruf": 89,
    "Ad-Dukhaan": 59,
    "Al-Jaathiyah": 37,
    "Al-Ahqaaf": 35,
    Muhammad: 38,
    "Al-Fath": 29,
    "Al-Hujuraat": 18,
    Qaaf: 45,
    "Adh-Dhaariyaat": 60,
    "At-Toor": 49,
    "An-Najm": 62,
    "Al-Qamar": 55,
    "Ar-Rahman": 78,
    "Al-Waqi'ah": 96,
    "Al-Hadeed": 29,
    "Al-Mujadila": 22,
    "Al-Hashr": 24,
    "Al-Mumtahanah": 13,
    "As-Saff": 14,
    "Al-Jumu'ah": 11,
    "Al-Munafiqoon": 11,
    "At-Taghabun": 18,
    "At-Talaq": 12,
    "At-Tahreem": 12,
    "Al-Mulk": 30,
    "Al-Qalam": 52,
    "Al-Haaqqa": 52,
    "Al-Ma'aarij": 44,
    Nuh: 28,
    "Al-Jinn": 28,
    "Al-Muzzammil": 20,
    "Al-Muddaththir": 56,
    "Al-Qiyamah": 40,
    "Al-Insaan": 31,
    "Al-Mursalaat": 50,
    "An-Naba'": 40,
    "An-Naazi'aat": 46,
    Abasa: 42,
    "At-Takweer": 29,
    "Al-Infitar": 19,
    "Al-Mutaffifeen": 36,
    "Al-Inshiqaaq": 25,
    "Al-Burooj": 22,
    "At-Taariq": 17,
    "Al-A'la": 19,
    "Al-Ghaashiyah": 26,
    "Al-Fajr": 30,
    "Al-Balad": 20,
    "Ash-Shams": 15,
    "Al-Layl": 21,
    "Ad-Dhuha": 11,
    "Ash-Sharh�(Al-Inshirah)": 8,
    "At-Tin": 8,
    "Al-Alaq": 19,
    "Al-Qadr": 5,
    "Al-Bayyinah": 8,
    "Az-Zalzalah": 8,
    "Al-'Aadiyat": 11,
    "Al-Qaari'ah": 11,
    "At-Takaathur": 8,
    "Al-'Asr": 3,
    "Al-Humazah": 9,
    "Al-Feel": 5,
    Quraish: 4,
    "Al-Maa'oon": 7,
    "Al-Kawthar": 6,
    "Al-Kaafiroon": 6,
    "An-Nasr": 2,
    "Al-Masad": 5,
    "Al-Ikhlas": 4,
    "Al-Falaq": 5,
    "An-Naas": 6,
  };
  const handleSurat = (e) => {
    const selectedSuratName = e.target.value;

    setsuratForm((prevSuratForm) => ({
      ...prevSuratForm,
      suratName: selectedSuratName,
      ayatNo: ayatsPerSurat[selectedSuratName] || prevSuratForm.ayatNo, // Set ayatNo based on the selected Surat
    }));
  };

  const handleNewSurat = (e) => {
    const selectedSuratNameObj = e.target.value;
    const selectedAyats = displaySurats.filter(
      (adaatt) => adaatt.suratName === selectedSuratNameObj
    );
    setcurrentAyat(selectedAyats[0]["ayatDetails"]);
  };
  const getFilteredAyats = (suratName, index) => {
  

    const surat = displaySurats?.filter((s) => s.suratName === suratName);

    return surat.length > 0 ? surat[0]["ayatDetails"] : [];
  };

  const handleEdit = async () => {
    try {
      const dataForToday = await axios.patch(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/aadatdata/${EditIdADM}`,

        {
          student: authState.id,
          remarkBoxes: formData.remarkBoxes,
          yesno: formData.yesno,
          customField: formData.customField,
          responsetypeCustomField: formData.responsetypeCustomField,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const existingSuratRecord = student.suratRecord;

      existingSuratRecord.push({
        suratName: suratForm.suratName,
        selectedAyatNo: suratForm.selectedAyatNo,
      });

      // Creating the requestBody object with the updated suratRecord
      const requestBody = {
        suratRecord: existingSuratRecord, // Converting Map back to an object
      };

      const response2 = await axios.patch(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/users/${authState.id}`,

        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      throw alert("successfully edited!");
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

    return (
      <div className="page-wrapper">
    <div className="content studentDashboard student_view">
    <CToaster
      className="p-3 "
      placement="top-end"
      push={toast}
      ref={toaster}
    />
    <div  className="d-md-flex d-block align-items-center justify-content-between  pb-3">
      {/* <div className="my-auto mb-2">
        <h3 className="page-title mb-1">Daily Update Form</h3>
      </div> */}
                  <div className="card-header  p-3 rounded" style={{width:"100%"}}>
                      <div className="d-flex align-items-center">
                        
                        <h4 className="text-dark" style={{fontSize:"x-large"}}>Daily Update Form</h4>
                      </div>
                    </div>
    </div>
    <div style={{height:"100%"}} className="d-md-flex d-block mt-3 school_fix ">
      <div style={{height:"100%"}} className=" d-flex justify-content-center flex-fill ps-0 border-0">
        <CForm
          style={{ width: "100%" , height:"100%" }}
          className="needs-validation"
          noValidate
          validated={validated}
          onSubmit={saveData}
        >
          {/* <div className="d-md-flex"> */}
          {/* <div className="flex-fill  "> */}
          <CRow className="justify-content-center height-innerCard ">

            <CCol xl={8} className="flex-rsponsive">
              <div className="flex-fill">
                <div className="card bg-dark position-relative">
                  <div className="card-body">
                    <div className="card-box-responsive ">
                      <div className="d-flex align-items-center  row-gap-3 mb-3">


                        <div className="avatar avatar-xxl rounded flex-shrink-0 me-3">
                          <img
                            crossorigin={process.env.REACT_APP_DEV_BASE_URL}
                            src={
                              student?.photo
                                ? `${process.env.REACT_APP_DEV_BASE_URL}/uploads/${student?.photo}`
                                : student?.gender == "female"
                                  ? femaleGeneric
                                  : maleGeneric
                            }
                            alt={student.firstName}
                            className="student-imgs"
                          />
                        </div>




                        <div className="d-block">
                          <span className="badge text-badge bg-transparent-primary text-primary mb-1">
                            ITS No. {student?.itsNo}
                          </span>
                          <h3 className="text-truncate text-white mb-1">
                            {student?.firstName} {student?.lastName}
                          </h3>
                          <div className="d-flex align-items-center flex-wrap row-gap-2 text-gray-2">
                            <span className=" me-2 pe-2" style={{ fontSize: "13px" }}>
                              {`${student?.stageGradeSectionData?.grade?.grade} + ${student?.stageGradeSectionData?.section?.section}`}

                            </span>

                          </div>
                        </div>
                      </div>

                      <div className="pagesubmission ">
                        <h3
                          // class="track"
                          className="text-end-responsive"
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "14px",

                          }}
                        >
                          Submission Expires in <br />

                                                        </h3>
                                                        <div className="text-end-responsive  mt-1  ">

                                                        
                        <span style={{

                          fontWeight: 500,
                          fontSize: "13px",
                          color: "yellow"
                        }} id="demo1" >
                          {hoursLeft}h {minutesLeft}m {secondsLeft}
                        </span></div>
                        <div className="position-button"><a
                          style={{ width: "fit-content" }}
                          className="m-0 mt-1 btn btn-primary text-end-responsive  "
                          onClick={() => reportView()}
                        >
                          View Report
                        </a></div>

                      </div>
                    </div>

                    <div className="second-box-responsive   profile-footer mt-3" >
                    
                                                    <div className="mt-3 d-flex justify-content-between" style={{width:"100%" , flexWrap:"wrap"}}>
                                                    <p style={{ marginBottom:"0px"  ,color: "white", fontSize: "14px", fontWeight: 500 }}>
                            Days Completed in
                            {student.islamicMonthName} :
                            <span style={{ color: "yellow" }}>{student.daysPassedInIslamicMonth}</span>
                          </p>

                        
                          <p  style={{marginBottom:"0px"  ,color: "white", fontSize: "14px", fontWeight: 500 }}>
                            Form Submitted:{" "}
                            <span style={{ color: "yellow" }}>{student.formSubmittedCount}</span>
                          </p>
                       
                          <p  style={{ marginBottom:"0px"   , color: "white", fontSize: "14px", fontWeight: 500 }}>
                            Form Not Submitted:{" "}
                            <span style={{ color: "yellow" }}>{student.formNotSubmittedCount}</span>
                          </p>   
</div>
                  

                    </div>

                 
                  </div>
                </div>

                                    </div>
                                    <div className=" d-flex">
                  <div className="card flex-fill">
                    <div className="card-header d-flex align-items-center justify-content-between">
                                                <h4 className="card-title">Percent completed (Surat):{ student.suratPercentage}% </h4>
                     
                    </div>
                    <div className="card-body  ">
                      <div className="attendance-chart appexchartBox-respnsive">
                                                    <div className="surat-responsive" style={{marginTop:"4px" , paddingLeft:"10px"}}>
                                                    <strong className="mb-2" style={{  fontSize: "15px", fontWeight: 500 }}>
                                Surat Name: <span style={{ color: "black" }}>{student.suratDetails.suratName}</span>
                              </strong>
                            
                              <strong style={{fontSize: "15px", fontWeight: 500 }}>
                                Ayat Name: <span style={{ color: "black" }}>{student.suratDetails.ayatNo}</span>
                              </strong>
                        </div>
                        
                      
                        <div className="text-center">
                         
                          <ReactApexChart
                            id="attendance_chart"
                            options={attendance_chart}
                            series={attendance_chart.series}
                            type="donut"
                            height={220}
                          />
                        </div>
                      
                      </div>
                    </div>
                  </div>
                </div>
            </CCol>
            <CCol xl={8} className="pb-5">


            <div className="sp_div">
                  <div
                    className="accordions-items-seperate"
                    id="accordionSpacingExample"
                  >
                    {uniqueCategories &&
                      uniqueCategories?.map((category, categoryIndex) => (
                        <div className="accordion-item" key={categoryIndex}>
                          <h2
                            className="accordion-header"
                            id={`panelsStayOpen-heading_${categoryIndex}`}
                          >
                            <button
                              className={
                                
                                categoryIndex === 0
                                  ? "accordion-button bg-blues"
                                  : "accordion-button  bg-blues"
                              }
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#panelsStayOpen-collapse_${categoryIndex}`}
                              aria-expanded="true"
                              aria-controls={`panelsStayOpen-collapse_${categoryIndex}`}
                            >
                              {category}
                            </button>
                          </h2>
                          {/* <div
                            id={`panelsStayOpen-collapse_${categoryIndex}`}
                            className={
                              categoryIndex === 0
                                ? "accordion-collapse collapse show"
                                : "accordion-collapse collapse"
                            }
                            aria-labelledby={`panelsStayOpen-heading_${categoryIndex}`}
                          > */}

                          <div
                            id={`panelsStayOpen-collapse_${categoryIndex}`}
                            className="accordion-collapse collapse show"
                            aria-labelledby={`panelsStayOpen-heading_${categoryIndex}`}
                          >
                            <div className="accordion-body">
                              {displayAdaats?.length > 0 &&
                                displayAdaats
                                  .filter(
                                    (adaatt) =>
                                      adaatt.category.name === category
                                  )
                                  .map((adaat, index) => (
                                    <>
                                      <div className="row  flex-col  " style={{gap:"10px" ,paddingTop:"0px" , paddingBottom:"25px"}}>
                                        <div className="col-md-12  ">
                                          <h1  style={{fontSize:"17px" , fontWeight:400}}>
                                            {adaat.name}
                                          </h1>
                                        </div>
                                        <div className="col-md-12 text-left" style={{display:"flex" ,flexDirection:"column" , gap:"10px"}}>
                                          {adaat.isSurat ? (
                                            <div   className="medium-boxs empty">
                                              <CCol className="col-medium" style={{padding:"0px" , gap:"0px"}}>
                                                <CFormSelect
                                                  id="validationCustom0789"
                                                  label="Surat Name"
                                                  name="suratName"
                                                  onChange={handleSurat}
                                                  value={
                                                    suratForm.suratName &&
                                                    suratForm.suratName
                                                  }
                                                  required={adaat.isCompulsory}
                                                >
                                                  <option
                                                    selected
                                                    disabled
                                                    value=""
                                                  >
                                                    Choose...
                                                  </option>

                                                  <option value="Al-Fatihah">
                                                    (1) Al-Fatihah
                                                  </option>
                                                  <option value="Al-Baqarah">
                                                    (2) Al-Baqarah
                                                  </option>
                                                  <option value="Aali 'Imran">
                                                    (3) Aali 'Imran
                                                  </option>
                                                  <option value="An-Nisa">
                                                    (4) An-Nisa
                                                  </option>
                                                  <option value="Al-Ma'idah">
                                                    (5) Al-Ma'idah
                                                  </option>
                                                  <option value="Al-An'am">
                                                    (6) Al-An'am
                                                  </option>
                                                  <option value="Al-A'raf">
                                                    (7) Al-A'raf
                                                  </option>
                                                  <option value="Al-Anfal">
                                                    (8) Al-Anfal
                                                  </option>
                                                  <option value="At-Tawbah">
                                                    (9) At-Tawbah
                                                  </option>
                                                  <option value="Yunus">
                                                    (10) Yunus
                                                  </option>
                                                  <option value="Hud">
                                                    (11) Hud
                                                  </option>
                                                  <option value="Yusuf">
                                                    (12) Yusuf
                                                  </option>
                                                  <option value="Ar-Ra'd">
                                                    (13) Ar-Ra'd
                                                  </option>
                                                  <option value="Ibrahim">
                                                    (14) Ibrahim
                                                  </option>
                                                  <option value="Al-Hijr">
                                                    (15) Al-Hijr
                                                  </option>
                                                  <option value="An-Nahl">
                                                    (16) An-Nahl
                                                  </option>
                                                  <option value="Al-Isra">
                                                    (17) Al-Isra
                                                  </option>
                                                  <option value="Al-Kahf">
                                                    (18) Al-Kahf
                                                  </option>
                                                  <option value="Maryam">
                                                    (19) Maryam
                                                  </option>
                                                  <option value="Ta-Ha">
                                                    (20) Ta-Ha
                                                  </option>
                                                  <option value="Al-Anbiya">
                                                    (21) Al-Anbiya
                                                  </option>
                                                  <option value="Al-Hajj">
                                                    (22) Al-Hajj
                                                  </option>
                                                  <option value="Al-Mu'minun">
                                                    (23) Al-Mu'minun
                                                  </option>
                                                  <option value="An-Nur">
                                                    (24) An-Nur
                                                  </option>
                                                  <option value="Al-Furqan">
                                                    (25) Al-Furqan
                                                  </option>
                                                  <option value="Ash-Shu'ara">
                                                    (26) Ash-Shu'ara
                                                  </option>
                                                  <option value="An-Naml">
                                                    (27) An-Naml
                                                  </option>
                                                  <option value="Al-Qasas">
                                                    (28) Al-Qasas
                                                  </option>
                                                  <option value="Al-Ankabut">
                                                    (29) Al-Ankabut
                                                  </option>
                                                  <option value="Ar-Rum">
                                                    (30) Ar-Rum
                                                  </option>
                                                  <option value="Luqmaan">
                                                    (31) Luqmaan
                                                  </option>
                                                  <option value="As-Sajdah">
                                                    (32) As-Sajdah
                                                  </option>
                                                  <option value="Al-Ahzaab">
                                                    (33) Al-Ahzaab
                                                  </option>
                                                  <option value="Saba (surah)">
                                                    (34) Saba (surah)
                                                  </option>
                                                  <option value="Faatir">
                                                    (35) Faatir
                                                  </option>
                                                  <option value="Ya-Sin">
                                                    (36) Ya-Sin
                                                  </option>
                                                  <option value="As-Saaffaat">
                                                    (37) As-Saaffaat
                                                  </option>
                                                  <option value="Saad">
                                                    (38) Saad
                                                  </option>
                                                  <option value="Az-Zumar">
                                                    (39) Az-Zumar
                                                  </option>
                                                  <option value="Ghafir">
                                                    (40) Ghafir
                                                  </option>
                                                  <option value="Fussilat">
                                                    (41) Fussilat
                                                  </option>
                                                  <option value="Ash-Shura">
                                                    (42) Ash-Shura
                                                  </option>
                                                  <option value="Az-Zukhruf">
                                                    (43) Az-Zukhruf
                                                  </option>
                                                  <option value="Ad-Dukhaan">
                                                    (44) Ad-Dukhaan
                                                  </option>
                                                  <option value="Al-Jaathiyah">
                                                    (45) Al-Jaathiyah
                                                  </option>
                                                  <option value="Al-Ahqaaf">
                                                    (46) Al-Ahqaaf
                                                  </option>
                                                  <option value="Muhammad">
                                                    (47) Muhammad
                                                  </option>
                                                  <option value="Al-Fath">
                                                    (48) Al-Fath
                                                  </option>
                                                  <option value="Al-Hujuraat">
                                                    (49) Al-Hujuraat
                                                  </option>
                                                  <option value="Qaaf">
                                                    (50) Qaaf
                                                  </option>
                                                  <option value="Adh-Dhaariyaat">
                                                    (51) Adh-Dhaariyaat
                                                  </option>
                                                  <option value="At-Toor">
                                                    (52) At-Toor
                                                  </option>
                                                  <option value="An-Najm">
                                                    (53) An-Najm
                                                  </option>
                                                  <option value="Al-Qamar">
                                                    (53) Al-Qamar
                                                  </option>
                                                  <option value="Ar-Rahman">
                                                    (55) Ar-Rahman
                                                  </option>
                                                  <option value="Al-Waqi'ah">
                                                    (56) Al-Waqi'ah
                                                  </option>
                                                  <option value="Al-Hadeed">
                                                    (57) Al-Hadeed
                                                  </option>
                                                  <option value="Al-Mujadila">
                                                    (58) Al-Mujadila
                                                  </option>
                                                  <option value="Al-Hashr">
                                                    (59) Al-Hashr
                                                  </option>
                                                  <option value="Al-Mumtahanah">
                                                    (60) Al-Mumtahanah
                                                  </option>
                                                  <option value="As-Saff">
                                                    (61) As-Saff
                                                  </option>
                                                  <option value="Al-Jumu'ah">
                                                    (62) Al-Jumu'ah
                                                  </option>
                                                  <option value="Al-Munafiqoon">
                                                    (63) Al-Munafiqoon
                                                  </option>
                                                  <option value="At-Taghabun">
                                                    (64) At-Taghabun
                                                  </option>
                                                  <option value="At-Talaq">
                                                    (65) At-Talaq
                                                  </option>
                                                  <option value="At-Tahreem">
                                                    (66) At-Tahreem
                                                  </option>
                                                  <option value="Al-Mulk">
                                                    (67) Al-Mulk
                                                  </option>
                                                  <option value="Al-Qalam">
                                                    (68) Al-Qalam
                                                  </option>
                                                  <option value="Al-Haaqqa">
                                                    (69) Al-Haaqqa
                                                  </option>
                                                  <option value="Al-Ma'aarij">
                                                    (70) Al-Ma'aarij
                                                  </option>
                                                  <option value="Nuh">
                                                    (71) Nuh
                                                  </option>
                                                  <option value="Al-Jinn">
                                                    (72) Al-Jinn
                                                  </option>
                                                  <option value="Al-Muzzammil">
                                                    (73) Al-Muzzammil
                                                  </option>
                                                  <option value="Al-Muddaththir">
                                                    (74) Al-Muddaththir
                                                  </option>
                                                  <option value="Al-Qiyamah">
                                                    (75) Al-Qiyamah
                                                  </option>
                                                  <option value="Al-Insaan">
                                                    (76) Al-Insaan
                                                  </option>
                                                  <option value="Al-Mursalaat">
                                                    (77) Al-Mursalaat
                                                  </option>
                                                  <option value="An-Naba'">
                                                    (78) An-Naba'
                                                  </option>
                                                  <option value="An-Naazi'aat">
                                                    (79) An-Naazi'aat
                                                  </option>
                                                  <option value="Abasa">
                                                    (80) Abasa
                                                  </option>
                                                  <option value="At-Takweer">
                                                    (81) At-Takweer
                                                  </option>
                                                  <option value="Al-Infitar">
                                                    (82) Al-Infitar
                                                  </option>
                                                  <option value="Al-Mutaffifeen">
                                                    (83) Al-Mutaffifeen
                                                  </option>
                                                  <option value="Al-Inshiqaaq">
                                                    (84) Al-Inshiqaaq
                                                  </option>
                                                  <option value="Al-Burooj">
                                                    (85) Al-Burooj
                                                  </option>
                                                  <option value="At-Taariq">
                                                    (86) At-Taariq
                                                  </option>
                                                  <option value="Al-A'la">
                                                    (87) Al-A'la
                                                  </option>
                                                  <option value="Al-Ghaashiyah">
                                                    (88) Al-Ghaashiyah
                                                  </option>
                                                  <option value="Al-Fajr">
                                                    (89) Al-Fajr
                                                  </option>
                                                  <option value="Al-Balad">
                                                    (90) Al-Balad
                                                  </option>
                                                  <option value="Ash-Shams">
                                                    (91) Ash-Shams
                                                  </option>
                                                  <option value="Al-Layl">
                                                    (92) Al-Layl
                                                  </option>
                                                  <option value="Ad-Dhuha">
                                                    (93) Ad-Dhuha
                                                  </option>
                                                  <option value="Ash-Sharh�(Al-Inshirah)">
                                                    (94) Ash-Sharh�(Al-Inshirah)
                                                  </option>
                                                  <option value="At-Tin">
                                                    (95) At-Tin
                                                  </option>
                                                  <option value="Al-Alaq">
                                                    (96) Al-Alaq
                                                  </option>
                                                  <option value="Al-Qadr">
                                                    (97) Al-Qadr
                                                  </option>
                                                  <option value="Al-Bayyinah">
                                                    (98) Al-Bayyinah
                                                  </option>
                                                  <option value="Az-Zalzalah">
                                                    (99) Az-Zalzalah
                                                  </option>
                                                  <option value="Al-'Aadiyat">
                                                    (100) Al-'Aadiyat
                                                  </option>
                                                  <option value="Al-Qaari'ah">
                                                    (101) Al-Qaari'ah
                                                  </option>
                                                  <option value="At-Takaathur">
                                                    (102) At-Takaathur
                                                  </option>
                                                  <option value="Al-'Asr">
                                                    (103) Al-'Asr
                                                  </option>
                                                  <option value="Al-Humazah">
                                                    (104) Al-Humazah
                                                  </option>
                                                  <option value="Al-Feel">
                                                    (105) Al-Feel
                                                  </option>
                                                  <option value="Quraish">
                                                    (106) Quraish
                                                  </option>
                                                  <option value="Al-Maa'oon">
                                                    (107) Al-Maa'oon
                                                  </option>
                                                  <option value="Al-Kawthar">
                                                    (108) Al-Kawthar
                                                  </option>
                                                  <option value="Al-Kaafiroon">
                                                    (109) Al-Kaafiroon
                                                  </option>
                                                  <option value="An-Nasr">
                                                    (110) An-Nasr
                                                  </option>
                                                  <option value="Al-Masad">
                                                    (111) Al-Masad
                                                  </option>
                                                  <option value="Al-Ikhlas">
                                                    (112) Al-Ikhlas
                                                  </option>
                                                  <option value="Al-Falaq">
                                                    (113) Al-Falaq
                                                  </option>
                                                  <option value="An-Naas">
                                                    (114) An-Naas
                                                  </option>
                                                </CFormSelect>
                                              </CCol>
                                              <CCol className="col-medium" style={{padding:"0px"}}>
                                                <CFormSelect
                                                  id="validationCustom0789"
                                                  label="To Ayat"
                                                  name="ayatName"
                                                  onChange={(e) => {
                                                    setsuratForm({
                                                      ...suratForm,
                                                      selectedAyatNo:
                                                        e.target.value,
                                                    });
                                                  }}
                                                  value={
                                                    suratForm.selectedAyatNo
                                                  }
                                                  required={adaat.isCompulsory}
                                                >
                                                  <option
                                                    selected=""
                                                    disabled=""
                                                    value=""
                                                  >
                                                    Choose...
                                                  </option>
                                                  {Array.from(
                                                    {
                                                      length: suratForm.ayatNo,
                                                    },
                                                    (_, index) => (
                                                      <option
                                                        key={index + 1}
                                                        value={index + 1}
                                                      >
                                                        {index + 1}
                                                      </option>
                                                    )
                                                  )}
                                                </CFormSelect>
                                              </CCol>
                                            </div>
                                          ) : null}
                                          <div className="new">
                                            {adaat.responseType.map(
                                              (type, typeIndex) => (
                                                <div
                                                  className="seleted empty"
                                                  key={typeIndex}
                                                >
                                                  {(() => {
                                                    switch (type) {
                                                      case "yesno":
                                                        return (
                                                          <>
                                                            <div className="yes_no">
                                                              {adaat.responsevalues &&
                                                              adaat
                                                                .responsevalues
                                                                .yesno &&
                                                              adaat
                                                                .responsevalues
                                                                .yesno ==
                                                                "true" ? (
                                                                <>
                                                                  <div class="d-flex gap-4 align-items-center ">
                                                                    <div class="d-flex gap-4 align-items-center">
                                                                      <input
                                                                        type="radio"
                                                                        className="btn-check"
                                                                        key={`${categoryIndex}_${index}_${typeIndex}_yes`}
                                                                        id={`flexCheckDefaultYes_${categoryIndex}_${index}_${typeIndex}`}
                                                                        required={
                                                                          adaat.isCompulsory
                                                                        }
                                                                        value="yes"
                                                                        name={`yesno_${categoryIndex}_${index}_${typeIndex}`}
                                                                        onChange={(
                                                                          e
                                                                        ) =>
                                                                          handlechange(
                                                                            e,
                                                                            adaat
                                                                          )
                                                                        }
                                                                        // Checked={
                                                                        //   newformDatanode.aadat?.find(
                                                                        //     (
                                                                        //       item
                                                                        //     ) =>
                                                                        //       item.aadatId ===
                                                                        //       adaat._id
                                                                        //   )
                                                                        //     ?.yesno ==
                                                                        //   "true"
                                                                        // }
                                                                        defaultChecked
                                                                      />
                                                                      <label
                                                                        className="btn btn-outline-success btn-sm rounded-btn m-0"
                                                                        for={`flexCheckDefaultYes_${categoryIndex}_${index}_${typeIndex}`}
                                                                      >
                                                                        yes
                                                                      </label>
                                                                      <input
                                                                        type="radio"
                                                                        className="btn-check"
                                                                        key={`${categoryIndex}_${index}_${typeIndex}_no`}
                                                                        id={`flexCheckDefaultNo_${categoryIndex}_${index}_${typeIndex}`}
                                                                        name={`yesno_${categoryIndex}_${index}_${typeIndex}`}
                                                                        required={
                                                                          adaat.isCompulsory
                                                                        }
                                                                        value="no"
                                                                        onChange={(
                                                                          e
                                                                        ) =>
                                                                          handlechange(
                                                                            e,
                                                                            adaat
                                                                          )
                                                                        }
                                                                        // Checked={
                                                                        //   newformDatanode.aadat?.find(
                                                                        //     (
                                                                        //       item
                                                                        //     ) =>
                                                                        //       item.aadatId ===
                                                                        //       adaat._id
                                                                        //   )
                                                                        //     ?.yesno ==
                                                                        //   " false"
                                                                        // }
                                                                      />
                                                                      <label
                                                                        className="btn btn-outline-danger btn-sm rounded-btn"
                                                                        for={`flexCheckDefaultNo_${categoryIndex}_${index}_${typeIndex}`}
                                                                      >
                                                                        no
                                                                      </label>
                                                                    </div>
                                                                  </div>
                                                                  <div className="invalid-feedback">
                                                                    Please
                                                                    select
                                                                    yes/no.
                                                                  </div>{" "}
                                                                </>
                                                              ) : (
                                                                <></>
                                                              )}

                                                              {adaat.responsevalues &&
                                                              adaat
                                                                .responsevalues
                                                                .yesno &&
                                                              adaat
                                                                .responsevalues
                                                                .yesno ==
                                                                "false" ? (
                                                                <>
                                                                  <input
                                                                    type="radio"
                                                                    className="btn-check"
                                                                    key={`${categoryIndex}_${index}_${typeIndex}_yes`}
                                                                    id={`flexCheckDefaultYes_${categoryIndex}_${index}_${typeIndex}`}
                                                                    required={
                                                                      adaat.isCompulsory
                                                                    }
                                                                    value="yes"
                                                                    name={`yesno_${categoryIndex}_${index}_${typeIndex}`}
                                                                    onChange={(
                                                                      e
                                                                    ) =>
                                                                      handlechange(
                                                                        e,
                                                                        adaat
                                                                      )
                                                                    }
                                                                    // Checked={
                                                                    //   newformDatanode.aadat?.find(
                                                                    //     (item) =>
                                                                    //       item.aadatId ===
                                                                    //       adaat._id
                                                                    //   )?.yesno ==
                                                                    //   "true"
                                                                    // }
                                                                  />
                                                                  <label
                                                                    className="btn btn-outline-success btn-sm rounded-btn m-0"
                                                                    for={`flexCheckDefaultYes_${categoryIndex}_${index}_${typeIndex}`}
                                                                  >
                                                                    yes
                                                                  </label>
                                                                  <input
                                                                    type="radio"
                                                                    className="btn-check"
                                                                    key={`${categoryIndex}_${index}_${typeIndex}_no`}
                                                                    id={`flexCheckDefaultNo_${categoryIndex}_${index}_${typeIndex}`}
                                                                    name={`yesno_${categoryIndex}_${index}_${typeIndex}`}
                                                                    required={
                                                                      adaat.isCompulsory
                                                                    }
                                                                    value="no"
                                                                    onChange={(
                                                                      e
                                                                    ) =>
                                                                      handlechange(
                                                                        e,
                                                                        adaat
                                                                      )
                                                                    }
                                                                    // Checked={
                                                                    //   newformDatanode.aadat?.find(
                                                                    //     (item) =>
                                                                    //       item.aadatId ===
                                                                    //       adaat._id
                                                                    //   )?.yesno ===
                                                                    //   "no"
                                                                    // }
                                                                    defaultChecked
                                                                  />
                                                                  <label
                                                                    className="btn btn-outline-danger btn-sm rounded-btn"
                                                                    for={`flexCheckDefaultNo_${categoryIndex}_${index}_${typeIndex}`}
                                                                  >
                                                                    no
                                                                  </label>
                                                                  <div className="invalid-feedback">
                                                                    Please
                                                                    select
                                                                    yes/no.
                                                                  </div>{" "}
                                                                </>
                                                              ) : (
                                                                <></>
                                                              )}

                                                              {!(
                                                                adaat.responsevalues &&
                                                                adaat
                                                                  .responsevalues
                                                                  .yesno
                                                              ) ? (
                                                                <>
                                                                  <input
                                                                    type="radio"
                                                                    className="btn-check"
                                                                    key={`${categoryIndex}_${index}_${typeIndex}_yes`}
                                                                    id={`flexCheckDefaultYes_${categoryIndex}_${index}_${typeIndex}`}
                                                                    required={
                                                                      adaat.isCompulsory
                                                                    }
                                                                    value="yes"
                                                                    name={`yesno_${categoryIndex}_${index}_${typeIndex}`}
                                                                    onChange={(
                                                                      e
                                                                    ) =>
                                                                      handlechange(
                                                                        e,
                                                                        adaat
                                                                      )
                                                                    }
                                                                  />
                                                                  <label
                                                                    className="btn btn-outline-success btn-sm rounded-btn m-0"
                                                                    for={`flexCheckDefaultYes_${categoryIndex}_${index}_${typeIndex}`}
                                                                  >
                                                                    yes
                                                                  </label>
                                                                  <input
                                                                    type="radio"
                                                                    className="btn-check"
                                                                    key={`${categoryIndex}_${index}_${typeIndex}_no`}
                                                                    id={`flexCheckDefaultNo_${categoryIndex}_${index}_${typeIndex}`}
                                                                    name={`yesno_${categoryIndex}_${index}_${typeIndex}`}
                                                                    required={
                                                                      adaat.isCompulsory
                                                                    }
                                                                    value="no"
                                                                    onChange={(
                                                                      e
                                                                    ) =>
                                                                      handlechange(
                                                                        e,
                                                                        adaat
                                                                      )
                                                                    }
                                                                  />
                                                                  <label
                                                                    className="btn btn-outline-danger btn-sm rounded-btn"
                                                                    for={`flexCheckDefaultNo_${categoryIndex}_${index}_${typeIndex}`}
                                                                  >
                                                                    no
                                                                  </label>
                                                                  <div className="invalid-feedback">
                                                                    Please
                                                                    select
                                                                    yes/no.
                                                                  </div>{" "}
                                                                </>
                                                              ) : (
                                                                <></>
                                                              )}
                                                            </div>
                                                          </>
                                                        );

                                                      case "custom":
                                                        return (
                                                          <>
                                                            <div className="text-left customType datatype">
                                                              {/*  content for responseType 'customfield' */}

                                                              {adaat.customType &&
                                                                adaat.customType[
                                                                  "values"
                                                                ].map(
                                                                  (
                                                                    option,
                                                                    optionIndex
                                                                  ) => (
                                                                    <div
                                                                      className={
                                                                        optionIndex ===
                                                                        0
                                                                          ? " form-check-inline pl-0 "
                                                                          : " form-check-inline pl-0 "
                                                                      }
                                                                    >
                                                                      <div class="d-flex gap-4 align-items-center flex-wrap ">
                                                                        {option &&
                                                                          option.trim() !==
                                                                            "" && (
                                                                            <>
                                                                              <input
                                                                                type="radio"
                                                                                className="btn-check"
                                                                                key={`checkbox_${categoryIndex}_${index}_${typeIndex}`}
                                                                                id={`checkbox_${categoryIndex}_${index}_${optionIndex}`}
                                                                                name={`checkbox_${categoryIndex}_${index}_${typeIndex}`}
                                                                                value={
                                                                                  option
                                                                                }
                                                                                required={
                                                                                  adaat.isCompulsory
                                                                                }
                                                                                onChange={(
                                                                                  e
                                                                                ) =>
                                                                                  updateCustomTypeCheckbox(
                                                                                    `${typeIndex}_customField`,
                                                                                    "customField",
                                                                                    "checkbox",
                                                                                    e.target,
                                                                                    adaat
                                                                                  )
                                                                                }
                                                                                {...(adaat.responsevalues &&
                                                                                  adaat
                                                                                    .responsevalues
                                                                                    .custom ===
                                                                                    option && {
                                                                                    checked: true,
                                                                                  })}
                                                                                checked={adaat.responsevalues?.custom?.includes(
                                                                                  option
                                                                                )}
                                                                              />
                                                                              <label
                                                                                htmlFor={`checkbox_${categoryIndex}_${index}_${optionIndex}`}
                                                                                className="btn btn-outline-success btn-sm rounded-btn m-0"
                                                                              >
                                                                                {
                                                                                  option
                                                                                }{" "}
                                                                               
                                                                              </label>
                                                                            </>
                                                                          )}
                                                                      </div>

                                                                      {adaat
                                                                        .customType[
                                                                        "values"
                                                                      ]
                                                                        .length ==
                                                                        optionIndex +
                                                                          1 && (
                                                                        <div className="invalid-feedback">
                                                                          Please
                                                                          select
                                                                        </div>
                                                                      )}
                                                                    </div>
                                                                  )
                                                                )}
                                                            </div>
                                                          </>
                                                        );
                                                      default:
                                                        return null;
                                                    }
                                                  })()}
                                                </div>
                                              )
                                            )}
                                          </div> 
                                          <div className="medium-box empty">
                                          {adaat?.customField.map(
                                            (field, fieldIndex) => (
                                              <>
                                                {field.fieldTitle != "" && (
                                                  <div
                                                    key={fieldIndex}
                                                   className=""
                                                  >
                                                    <p className="form-labels">
                                                      {field.fieldTitle}{" "}
                                                    </p>
                                                    {field.fieldType ===
                                                      "dropdown" && (
                                                      <div>
                                                        <CFormSelect
                                                          id={`validationCustom_${fieldIndex}_${field.fieldTitle}`} // Ensure a unique ID
                                                          className={`form-control ${
                                                            field.isCompulsory &&
                                                            field.selectedOption ===
                                                              ""
                                                              ? "is-invalid"
                                                              : ""
                                                          }`}
                                                          onChange={(e) =>
                                                            updateCustomFieldDropdown(
                                                              `${fieldIndex}_${field.fieldTitle}`,
                                                              field.fieldTitle,
                                                              "dropdown",
                                                              e.target.value,
                                                              adaat
                                                            )
                                                          }
                                                          defaultValue={
                                                            field.selectedOption ||
                                                            field.defaultvalue
                                                          } // Set initial/default value
                                                          required={
                                                            field.isCompulsory
                                                          }
                                                        >
                                                          <option
                                                            disabled
                                                            value=""
                                                          >
                                                            Select an option
                                                          </option>

                                                          {field.options.map(
                                                            (
                                                              option,
                                                              optionIndex
                                                            ) => (
                                                              <option
                                                                key={
                                                                  optionIndex
                                                                }
                                                                value={option}
                                                              >
                                                                {option}
                                                              </option>
                                                            )
                                                          )}
                                                        </CFormSelect>

                                                        {field.isCompulsory &&
                                                          field.selectedOption ===
                                                            "" && (
                                                            <div className="invalid-feedback">
                                                              Please select an
                                                              option
                                                            </div>
                                                          )}
                                                      </div>
                                                    )}

                                                    {field.fieldType ===
                                                      "checkbox" && (
                                                      <div>
                                                        <div className=" d-flex gap-2 align-items-center flex-wrap  ">
                                                          {field.options.map(
                                                            (
                                                              option,
                                                              optionIndex
                                                            ) =>
                                                              option?.trim() && ( // Check if option is not blank
                                                                <span
                                                                  key={
                                                                    optionIndex
                                                                  }
                                                                  style={{
                                                                    display:
                                                                      "block",
                                                                  }}
                                                                >
                                                                  <input
                                                                    type="checkbox"
                                                                    className="btn-check"
                                                                    key={`checkbox_${categoryIndex}_${index}_${fieldIndex}_${optionIndex}`}
                                                                    id={`checkbox_${categoryIndex}_${index}_${fieldIndex}_${optionIndex}`}
                                                                    name={`checkbox_${categoryIndex}_${index}_${fieldIndex}_${optionIndex}`}
                                                                    value={
                                                                      option
                                                                    }
                                                                    onChange={(
                                                                      e
                                                                    ) =>
                                                                      updateCustomFieldCheckbox(
                                                                        `${fieldIndex}_${field.fieldTitle}`,
                                                                        field.fieldTitle,
                                                                        "checkbox",
                                                                        e.target,
                                                                        adaat
                                                                      )
                                                                    }
                                                                  />
                                                                  <label
                                                                    htmlFor={`checkbox_${categoryIndex}_${index}_${fieldIndex}_${optionIndex}`}
                                                                    className="btn btn-outline-success btn-sm rounded-btn m-0"
                                                                  >
                                                                    {option}
                                                                  </label>
                                                                </span>
                                                              )
                                                          )}
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>
                                                )}
                                              </>
                                            )
                                          )}
                                           </div>

                                        
                                        </div>
                                        <div className="" style={{display:"flex" ,flexDirection:"column" , gap:"10px"}}>
                                          {adaat?.responseType.map(
                                            (type, typeIndex) => (
                                              <div key={typeIndex} className="empty">
                                                {type == "surat" ? (
                                                  <div className="medium-boxs empty" >
                                                  
                                                    <CCol className="col-medium" style={{ padding: "0px"  , gap:"0px"}}>
                                                      <CFormSelect
                                                        className="form-control"
                                                        label="Surat Name"
                                                        name="suratName"
                                                        id="validationCustom0789"
                                                        value={
                                                          selectedSurats?.[
                                                            categoryIndex
                                                          ]?.[index]?.suratName
                                                        }
                                                        required={
                                                          adaat.isCompulsory
                                                        }
                                                        onChange={(e) =>
                                                          handleSuratChange(
                                                            categoryIndex,
                                                            index,
                                                            e.target.value
                                                          )
                                                        }
                                                      >
                                                        <option
                                                          selected
                                                          disabled
                                                          value=""
                                                        >
                                                          Choose...{" "}
                                                        </option>

                                                        {displaySurats.length >
                                                          0 &&
                                                          displaySurats.map(
                                                            (
                                                              suratItem,
                                                              suratIndex
                                                            ) => (
                                                              <>
                                                                <option
                                                                  key={
                                                                    suratIndex
                                                                  }
                                                                  value={
                                                                    suratItem.suratName
                                                                  }
                                                                >
                                                                  {
                                                                    suratItem.orderName
                                                                  }

                                                                  {
                                                                    suratItem.suratName
                                                                  }
                                                                </option>
                                                              </>
                                                            )
                                                          )}
                                                      </CFormSelect>
                                                      </CCol>

                                                    <CCol className="col-medium"  style={{padding:"0px" , gap:"0px"}} >
                                                      <CFormSelect
                                                        className="form-control"
                                                        id="validationCustom0789"
                                                        label="To Ayat"
                                                        name="ayatName"
                                                        onChange={(e) => {
                                                          updateSurat(
                                                            e.target.value,
                                                            adaat
                                                          );

                                                          handleAyatChange(
                                                            categoryIndex,
                                                            index,
                                                            e.target?.value
                                                          );
                                                        }}
                                                        value={
                                                          selectedSurats?.[
                                                            categoryIndex
                                                          ]?.[index]?.ayatId
                                                        }
                                                        required={
                                                          adaat.isCompulsory
                                                        }
                                                      >
                                                        <option
                                                          disabled=""
                                                          value=""
                                                        >
                                                          Choose...
                                                        </option>

                                                        {getFilteredAyats(
                                                          selectedSurats?.[
                                                            categoryIndex
                                                          ]?.[index]?.suratName,
                                                          index
                                                        ).map((ayat) => (
                                                          <option
                                                            key={ayat._id}
                                                            value={ayat._id}
                                                          >
                                                            {ayat.ayatNo}
                                                          </option>
                                                        ))}
                                                      </CFormSelect>
                                                    </CCol>
                                                  </div>
                                                ) : (
                                                  ""
                                                )}
                                                {(() => {
                                                  switch (type) {
                                                    case "remarkbox":
                                                      return (
                                                        <div>
                                                          {/*  content for responseType 'remarkbox' */}

                                                          <div className="form-floating ">
                                                            <textarea
                                                              className="form-control"
                                                              placeholder="Leave a comment here"
                                                              id={`remarkbox_${categoryIndex}_${index}_${typeIndex}`}
                                                              name={`remarkbox_${categoryIndex}_${index}_${typeIndex}`}
                                                              defaultValue={
                                                                adaat.responsevalues &&
                                                                adaat
                                                                  .responsevalues
                                                                  .remarkbox
                                                                  ? adaat
                                                                      .responsevalues
                                                                      .remarkbox
                                                                  : ""
                                                              }
                                                              onChange={(e) =>
                                                                handlechange(
                                                                  e,
                                                                  adaat
                                                                )
                                                              }
                                                              required={
                                                                adaat.isCompulsory
                                                              }
                                                            ></textarea>
                                                            <label for="floatingTextarea">
                                                              Enter your remarks
                                                            </label>
                                                          </div>
                                                        </div>
                                                      );
                                                    case "image":
                                                      return (


                                                        <div className="">
                                                          {/*  content for responseType 'images' */}

                                                          <div key={index}>

                                                          {/*  new one */}                                        

   <div className="d-flex align-items-center flex-wrap row-gap-3 outline-border mb-3">
                              <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                              
                                                                {adaat.responsevalues &&
                                                              adaat
                                                                .responsevalues
                                                                .images ? (
                                                                <div
                                                                  className="row"
                                                                  style={{
                                                                    paddingTop:
                                                                      "10px",
                                                                  }}
                                                                >
                                                                  {typeof adaat
                                                                    .responsevalues
                                                                    .images ==
                                                                    "object" &&
                                                                    adaat.responsevalues.images.map(
                                                                      (
                                                                        image,
                                                                        key
                                                                      ) => (
                                                                        <div className="col">
                                                                          <img
                                                                            crossorigin={
                                                                              process
                                                                                .env
                                                                                .REACT_APP_DEV_BASE_URL
                                                                            }
                                                                            key={
                                                                              key
                                                                            }
                                                                            style={{
                                                                              objectFit:"contain"
                                                                            }}
                                                                            src={`${process.env.REACT_APP_DEV_BASE_URL}/${image}`}
                                                                          />
                                                                        </div>
                                                                      )
                                                                    ) 
                                                                    
                                                                    }

                                                                  {typeof adaat
                                                                    .responsevalues
                                                                    .images ==
                                                                    "string" && (
                                                                    <div className="col">
                                                                      <img
                                                                        crossorigin={
                                                                          process
                                                                            .env
                                                                            .REACT_APP_DEV_BASE_URL
                                                                        }
                                                                        style={{
                                                                          objectFit:"contain"
                                                                        }}
                                                                        src={`${process.env.REACT_APP_DEV_BASE_URL}/${adaat.responsevalues.images}`}
                                                                      />
                                                                    </div>
                                                                    ) 
                                                                  }
                                                                </div>
                                                                ) : 
                                                                previewImages.map((src, index) => (
                                                                  <div key={index} style={{ width: "100%", height: "100%" }}>
                                                                    <img
                                                                      src={src}
                                                                      alt={`Preview ${index + 1}`}
                                                                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "5px" }}
                                                                    />
                                                                  </div>
                                                                ))
                                                              }
                              </div>
                              <div className="profile-upload">
                                <div className="profile-uploader d-flex align-items-center">
                                  <div className="drag-upload-btn mb-3">
                                    Upload
                                    {/* <input
                                      type="file"
                                      className="form-control image-sign"
                                      multiple
                                    /> */}

<input
                                                              type="file"
                                                              className="form-control image-sign"
                                                              label="Images"
                                                              name={`image${index}`}
                                                              id={`inputGroupFile${
                                                                index + 1
                                                              }`}
                                                              onChange={(e) =>
                                                                handleImagechange(
                                                                  e,
                                                                  adaat
                                                                )
                                                              }
                                                              required={
                                                                adaat.isCompulsory
                                                              }
                                                              {...(!(
                                                                adaat.responsevalues &&
                                                                adaat
                                                                  .responsevalues
                                                                  .images
                                                              )
                                                                ? {
                                                                    required:
                                                                      adaat.isCompulsory,
                                                                  }
                                                                : "")}
                                                              multiple // Allow multiple file selection
                                                            />
                                  </div>
                                 
                                </div>
                                <p className="fs-12">
                                  Upload image size 4MB, Format JPG, PNG, SVG
                                </p>
                              </div>
                            </div>





                                                            {/* new one */}
                                                            {/* <input
                                                              type="file"
                                                              className="form-control"
                                                              label="Images"
                                                              name={`image${index}`}
                                                              id={`inputGroupFile${
                                                                index + 1
                                                              }`}
                                                              onChange={(e) =>
                                                                handleImagechange(
                                                                  e,
                                                                  adaat
                                                                )
                                                              }
                                                              required={
                                                                adaat.isCompulsory
                                                              }
                                                              {...(!(
                                                                adaat.responsevalues &&
                                                                adaat
                                                                  .responsevalues
                                                                  .images
                                                              )
                                                                ? {
                                                                    required:
                                                                      adaat.isCompulsory,
                                                                  }
                                                                : "")}
                                                              multiple // Allow multiple file selection
                                                            />
                                                            {adaat.responsevalues &&
                                                              adaat
                                                                .responsevalues
                                                                .images && (
                                                                <div
                                                                  className="row"
                                                                  style={{
                                                                    paddingTop:
                                                                      "10px",
                                                                  }}
                                                                >
                                                                  {typeof adaat
                                                                    .responsevalues
                                                                    .images ==
                                                                    "object" &&
                                                                    adaat.responsevalues.images.map(
                                                                      (
                                                                        image,
                                                                        key
                                                                      ) => (
                                                                        <div className="col">
                                                                          <img
                                                                            crossorigin={
                                                                              process
                                                                                .env
                                                                                .REACT_APP_DEV_BASE_URL
                                                                            }
                                                                            key={
                                                                              key
                                                                            }
                                                                            className="img-thumbnail"
                                                                            style={{
                                                                              maxWidth:
                                                                                "200px",
                                                                            }}
                                                                            src={`${process.env.REACT_APP_DEV_BASE_URL}/${image}`}
                                                                          />
                                                                        </div>
                                                                      )
                                                                    )}

                                                                  {typeof adaat
                                                                    .responsevalues
                                                                    .images ==
                                                                    "string" && (
                                                                    <div className="col">
                                                                      <img
                                                                        crossorigin={
                                                                          process
                                                                            .env
                                                                            .REACT_APP_DEV_BASE_URL
                                                                        }
                                                                        className="img-thumbnail"
                                                                        style={{
                                                                          maxWidth:
                                                                            "200px",
                                                                        }}
                                                                        src={`${process.env.REACT_APP_DEV_BASE_URL}/${adaat.responsevalues.images}`}
                                                                      />
                                                                    </div>
                                                                  )}
                                                                </div>
                                                              )} */}
                                                          </div>
                                                        </div>
                                                      );
                                                    default:
                                                      return null;
                                                  }
                                                })()}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  ))}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {displayMiqaats?.length > 0 && (
                    <>
                      <div
                        className="accordion-item "
                        style={{ marginTop: "20px" }}
                      >
                        <h2
                          className="accordion-header"
                          id={`panelsStayOpen-heading_miqaat`}
                        >
                          <button
                            className={"accordion-button bg-blues "}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#panelsStayOpen-collapse_miqaat`}
                            aria-expanded="true"
                            aria-controls={`panelsStayOpen-collapse_miqaat`}
                          >
                            Miqaat
                          </button>
                        </h2>
                        <div
                          id={`panelsStayOpen-collapse_miqaat`}
                          className={"accordion-collapse collapse show"}
                          aria-labelledby={`panelsStayOpen-heading_miqaat`}
                        >
                          <div className="accordion-body ">
                            {displayMiqaats.map((miqaatItem, miqaatIndex) => {
                              // Find the corresponding miqaat entry in displaysubmittedAdaats.miqaat
                              const matchedMiqaat =
                                displaysubmittedAdaats.miqaat.find(
                                  (submittedMiqaat) =>
                                    submittedMiqaat.miqaatId === miqaatItem._id
                                );

                              return (
                                <div className="row" key={miqaatIndex} style={{display: "flex" , paddingTop:"0px",  flexDirection: "column", gap: "10px"}}>
                                  <div className="col-md-12 ">
                                    <h1 style={{fontSize:"17px" , fontWeight:500 }}>
                                      {miqaatItem.name}
                                    </h1>
                                  </div>
                                  <div className="col-md-12 text-left mb-2 " style={{display:"flex" , flexDirection:"column" , gap:"10px"}}>
                                    <p  className="empty" style={{fontSize:"15px" , marginBottom:"0px"  , fontWeight:500 , color:"#30426e"}}>
                                      {miqaatItem.description}
                                    </p>
                                    <div>
                                      <div className="d-flex gap-4 align-items-center">
                                        {/* "Yes" Radio Button */}
                                        <input
                                          type="radio"
                                          className="btn-check"
                                          key={`${miqaatItem._id}_${miqaatIndex}_yes`}
                                          id={`flexCheckDefaultYes_${miqaatItem._id}`}
                                          value="yes"
                                          name={`yesno_${miqaatItem._id}`}
                                          // checked={
                                          //   matchedMiqaat?.miqaatyesno === "yes"
                                          // } // Check if 'yes' is selected
                                          onChange={(e) =>
                                            handlemiqaatchange(e, miqaatItem)
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-success btn-sm rounded-btn"
                                          htmlFor={`flexCheckDefaultYes_${miqaatItem._id}`}
                                        >
                                          Yes
                                        </label>

                                        {/* "No" Radio Button */}
                                        <input
                                          type="radio"
                                          className="btn-check"
                                          key={`${miqaatItem._id}_${miqaatIndex}_no`}
                                          id={`flexCheckDefaultNo_${miqaatItem._id}`}
                                          value="no"
                                          name={`yesno_${miqaatItem._id}`}
                                          // checked={
                                          //   matchedMiqaat?.miqaatyesno === "no"
                                          // }
                                          onChange={(e) =>
                                            handlemiqaatchange(e, miqaatItem)
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-danger btn-sm rounded-btn"
                                          htmlFor={`flexCheckDefaultNo_${miqaatItem._id}`}
                                        >
                                          No
                                        </label>
                                        <div className="invalid-feedback">
                                          Please select yes/no.
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="d-flex justify-content-center align-items-center hide_sp">
                    {isLoding ? <CSpinner /> : null}
                  </div>
                </div>
            </CCol>
          </CRow>
          {/* </div> */}
          {/* </div> */}

          {ReadyToEdit ? null : (
            <div className="text-center mt-2">
              <button className="btn btn-primary " type="submit">
                Save Changes
              </button>
            </div>
                )}
               
        </CForm>
        {ReadyToEdit ? (
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleEdit}
          >
            Confirm Edit
          </button>
        ) : null}
      </div>
    </div>
            </div>
             </div>
  );
}

export default StudentView;
