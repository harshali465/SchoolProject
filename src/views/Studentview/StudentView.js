import React, { useContext } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { AuthContext } from "../../helpers/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";
import useCountdown from "../../helpers/CountDownTimer";
import "./studentview.css";

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
  CCard,
  CCardTitle,
  CContainer,
  CDateRangePicker,
} from "@coreui/react";

function StudentView() {
  const { hoursLeft, minutesLeft, secondsLeft } = useCountdown();
  const { authState } = useContext(AuthContext);
  const [adaats, setadaats] = useState([]); //used for weekly
  const [adaatsD, setadaatsD] = useState([]); //used for daily
  const [adaatsM, setadaatsM] = useState([]); // used for monthly
  const [displayAdaats, setDisplayAdaats] = useState([]); //final display
  const [student, setstudent] = useState();

  const [formattedDate, setFormattedDate] = useState("");

  const [formData, setformData] = useState({
    remarkBoxes: {},
    yesno: {},
    customField: [
      {
        fieldTitle: "",
        fieldType: [""],
        options: [],
      },
    ],
    responsetypeCustomField: [
      {
        cusresTitle: "",
        cusresValue: {},
      },
    ],
  });

  const getAadatsforStudentweekly = async () => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTcwMjAyNjUyMSwiZXhwIjoxNzMzNTYyNTIxfQ.SQNoJL4HEKvUKrw6AEpCtg1hDNx26vRPz1Az2sZohz4";
      // this is for getting the information about the student you need to display all the adaats for
      const res = await axios.get(
        `http://localhost:3001/api/v1/users/${authState.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setstudent(res.data.data);
      // this is the call where you are retrieving all the adaats for the student for repetation- daily
      const response = await axios.get(
        "http://localhost:3001/api/v1/aadat/getAllDailyAadat",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            class: res.data.data.class,
            repetation: "weekly",
            applicableTo: res.data.data.gender,
            currentTime: new Date(),
          },
        }
      );

      // Get today's day in lowercase (e.g., 'monday', 'tuesday')

      const today = new Date()
        .toLocaleString("default", { weekday: "long" })
        .toLowerCase();

      const month = new Date()
        .toLocaleString("default", { month: "long" })
        .toLowerCase();

      // Filter aadats based on today's repetition day
      const filtered = response.data.data.filter((aadat) => {
        return (
          aadat.repeatDays.some((day) => day.toLowerCase() === today) &&
          aadat.repeatMonths.some((mon) => mon.toLowerCase() === month)
        );
      });

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

      console.log("these are aadats for today- weekly", filtered);
      setadaats(filtered);

      const newWeeklyAadats = filtered;

      // Check if the newDailyAadats are not already present in displayAdaats
      const isDuplicate = newWeeklyAadats.some((newAadat) =>
        displayAdaats.some((displayAadat) => displayAadat._id === newAadat._id)
      );

      if (!isDuplicate) {
        // If the new data is not a duplicate, merge it into displayAdaats
        const mergedDisplayAdaats = [...displayAdaats, ...newWeeklyAadats];
        setDisplayAdaats(mergedDisplayAdaats);
      }

      // copy pasta for month

      ///////////////////////////

      setaadatdatamodels(response.data.aadatdatamodels);
      setaadatDataModelIds(response.data.aadatDataModelIds);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getAadatsforStudentMonthly = async () => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTcwMjAyNjUyMSwiZXhwIjoxNzMzNTYyNTIxfQ.SQNoJL4HEKvUKrw6AEpCtg1hDNx26vRPz1Az2sZohz4";
      // this is for getting the information about the student you need to display all the adaats for
      const res = await axios.get(
        `http://localhost:3001/api/v1/users/${authState.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setstudent(res.data.data);
      // this is the call where you are retrieving all the adaats for the student for repetation- daily
      const response = await axios.get(
        "http://localhost:3001/api/v1/aadat/getAllDailyAadat",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            class: res.data.data.class,

            repetation: "monthly",
            applicableTo: res.data.data.gender,

            currentTime: new Date(),
          },
        }
      );

      // // Get today's month in lowercase (e.g., 'january', 'february')
      // const todayMonth = new Date()
      //   .toLocaleString("default", { month: "long" })
      //   .toLowerCase();

      // // Filter aadats based on today's repetition month
      // const filteredMonthly = response.data.data.filter((aadat) => {
      //   const datefort = aadat.repeatDateForMonth;
      //   console.log(datefort, new Date().getDate());
      //   return (
      //     aadat.repeatMonths.some(
      //       (month) => month.toLowerCase() === todayMonth
      //     ) &&
      //     aadat.repeatDateForMonth.some((rdom) => {
      //       const date = new Date(rdom);
      //       return date.getDate() === new Date().getDate();
      //     })
      //   );
      // });
      const today = new Date();
      const todayMonth = today
        .toLocaleString("default", { month: "long" })
        .toLowerCase();
      // const todayMonth = "november";
      const todayDate = today.getDate();

      const filteredMonthly = response.data.data.filter((aadat) => {
        if (!aadat.repeatDateForMonth || !aadat.repeatMonths) {
          return false;
        }

        const repeatDates = aadat.repeatDateForMonth.map((rdom) =>
          new Date(rdom).getDate()
        );
        const repeatMonths = aadat.repeatMonths.map((month) =>
          month.toLowerCase()
        );

        return (
          repeatMonths.includes(todayMonth) && repeatDates.includes(todayDate)
        );
      });

      // Checking if these monthly aadats were already submitted
      console.log("These are aadats for today - monthly", filteredMonthly);
      setadaatsM(filteredMonthly); // Assuming setAdaats updates the state with filteredMonthly

      const newMonthlyAadats = filteredMonthly;

      // Check if the newDailyAadats are not already present in displayAdaats
      const isDuplicate = newMonthlyAadats.some((newAadat) =>
        displayAdaats.some((displayAadat) => displayAadat._id === newAadat._id)
      );

      if (!isDuplicate) {
        // If the new data is not a duplicate, merge it into displayAdaats
        const mergedDisplayAdaats = [...displayAdaats, ...newMonthlyAadats];
        setDisplayAdaats(mergedDisplayAdaats);
      }

      // setaadatdatamodels(response.data.aadatdatamodels);
      // setaadatDataModelIds(response.data.aadatDataModelIds);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // yearly dawg
  const getAadatsforStudentYearly = async () => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTcwMjAyNjUyMSwiZXhwIjoxNzMzNTYyNTIxfQ.SQNoJL4HEKvUKrw6AEpCtg1hDNx26vRPz1Az2sZohz4";
      // this is for getting the information about the student you need to display all the adaats for
      const res = await axios.get(
        `http://localhost:3001/api/v1/users/${authState.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setstudent(res.data.data);
      // this is the call where you are retrieving all the adaats for the student for repetation- daily
      const response = await axios.get(
        "http://localhost:3001/api/v1/aadat/getAllDailyAadat",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            class: res.data.data.class,
            repetation: "yearly",
            applicableTo: res.data.data.gender,
            currentTime: new Date(),
          },
        }
      );

      const today = new Date();
      const todayDate = today.getDate();
      const todayMonth = today.getMonth();

      const filteredYearly = response.data.data.filter((aadat) => {
        return aadat.repeatDateForYear.some((rdoy) => {
          const date = new Date(rdoy);
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
          return false; // Return false otherwise
        });
      });

      // Checking if these monthly aadats were already submitted
      console.log("These are aadats for today - yearly", filteredYearly);
      setadaatsM(filteredYearly); // Assuming setAdaats updates the state with filteredMonthly

      const newMonthlyAadats = filteredYearly;

      // Check if the newDailyAadats are not already present in displayAdaats
      const isDuplicate = newMonthlyAadats.some((newAadat) =>
        displayAdaats.some((displayAadat) => displayAadat._id === newAadat._id)
      );

      if (!isDuplicate) {
        // If the new data is not a duplicate, merge it into displayAdaats
        const mergedDisplayAdaats = [...displayAdaats, ...newMonthlyAadats];
        setDisplayAdaats(mergedDisplayAdaats);
      }

      // setaadatdatamodels(response.data.aadatdatamodels);
      // setaadatDataModelIds(response.data.aadatDataModelIds);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // for customized

  const getAadatsforStudentCustom = async () => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTcwMjAyNjUyMSwiZXhwIjoxNzMzNTYyNTIxfQ.SQNoJL4HEKvUKrw6AEpCtg1hDNx26vRPz1Az2sZohz4";
      // this is for getting the information about the student you need to display all the adaats for
      const res = await axios.get(
        `http://localhost:3001/api/v1/users/${authState.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setstudent(res.data.data);
      // this is the call where you are retrieving all the adaats for the student for repetation- daily
      const response = await axios.get(
        "http://localhost:3001/api/v1/aadat/getAllDailyAadat",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            class: res.data.data.class,
            repetation: "custom",
            applicableTo: res.data.data.gender,
            currentTime: new Date(),
          },
        }
      );

      const today = new Date();
      const todayYear = today.getFullYear();
      const todayMonth = today.getMonth();
      const todayDay = today.getDate();

      const filteredCustom = response.data.data.filter((aadat) => {
        const customDate = new Date(aadat.customDate);
        const customYear = customDate.getFullYear();
        const customMonth = customDate.getMonth();
        const customDay = customDate.getDate();

        return (
          todayYear === customYear &&
          todayMonth === customMonth &&
          todayDay === customDay
        );
      });

      // Checking if these monthly aadats were already submitted
      console.log("These are aadats for today - yearly", filteredCustom);
      setadaatsM(filteredCustom); // Assuming setAdaats updates the state with filteredMonthly

      const newMonthlyAadats = filteredCustom;

      // Check if the newDailyAadats are not already present in displayAdaats
      const isDuplicate = newMonthlyAadats.some((newAadat) =>
        displayAdaats.some((displayAadat) => displayAadat._id === newAadat._id)
      );

      if (!isDuplicate) {
        // If the new data is not a duplicate, merge it into displayAdaats
        const mergedDisplayAdaats = [...displayAdaats, ...newMonthlyAadats];
        setDisplayAdaats(mergedDisplayAdaats);
      }

      // setaadatdatamodels(response.data.aadatdatamodels);
      // setaadatDataModelIds(response.data.aadatDataModelIds);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getAadatsforStudentDaily = async () => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTcwMjAyNjUyMSwiZXhwIjoxNzMzNTYyNTIxfQ.SQNoJL4HEKvUKrw6AEpCtg1hDNx26vRPz1Az2sZohz4";
      // this is for getting the information about the student you need to display all the adaats for
      const res = await axios.get(
        `http://localhost:3001/api/v1/users/${authState.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(res.data.data.class);
      // console.log(res.data.data);

      setstudent(res.data.data);
      // this is the call where you are retrieving all the adaats for the student for repetation- daily
      const response = await axios.get(
        "http://localhost:3001/api/v1/aadat/getAllDailyAadat",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            class: res.data.data.class,
            repetation: "daily",
            applicableTo: res.data.data.gender,
            currentTime: new Date(),
          },
        }
      );

      console.log(`these are daily`, response.data);
      setadaatsD(response.data.data);

      const newDailyAadats = response.data.data;

      // Check if the newDailyAadats are not already present in displayAdaats
      const isDuplicate = newDailyAadats.some((newAadat) =>
        displayAdaats.some((displayAadat) => displayAadat._id === newAadat._id)
      );

      if (!isDuplicate) {
        // If the new data is not a duplicate, merge it into displayAdaats
        const mergedDisplayAdaats = [...displayAdaats, ...newDailyAadats];
        setDisplayAdaats(mergedDisplayAdaats);
      }

      setaadatDataModelIds1(response.data.aadatDataModelIds);
      setaadatdatamodels1(response.data.aadatdatamodels);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
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
            // console.log(
            //   // todayStart,
            //   // new Date(relevantAddmt.createdAt),
            //   // todayEnd

            //   new Date(relevantAddmt.createdAt) <= todayEnd
            // );
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

  useEffect(() => {
    remindUsersdaily();
    // remindUsersWeekly();
  }, [aadatDataModelIds, aadatdatamodels]);

  useEffect(() => {
    getAadatsforStudentCustom();
    getAadatsforStudentYearly();
    getAadatsforStudentweekly();
    getAadatsforStudentMonthly();
    getAadatsforStudentDaily();
  }, [authState.id, authState.role]);

  // weekly filtering for repetition

  // const remindUsersWeekly = () => {
  //   const currentDate = new Date();
  //   const endOfWeek = new Date(currentDate);
  //   const startOfWeek = new Date(currentDate);
  //   endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
  //   startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  //   const filteredWeekly = adaats
  //     .map((aadat) => {
  //       if (aadatDataModelIds.includes(aadat._id)) {
  //         const relevantAddmt = aadatdatamodels.find(
  //           (addmt) =>
  //             addmt.aadat._id === aadat._id && addmt.student === authState.id
  //         );
  //         if (relevantAddmt) {
  //           if (
  //             // checking if the entry was made before this week's Saturday

  //             new Date(relevantAddmt.createdAt) <= endOfWeek &&
  //             new Date(relevantAddmt.createdAt) >= startOfWeek
  //           ) {
  //             // if yes then dont print the aadat
  //             return null;
  //           } else {
  //             // if no print the aadat only if
  //             return aadat;
  //           }

  //           // console.log(
  //           //   startOfWeek,
  //           //   new Date(relevantAddmt.createdAt),
  //           //   endOfWeek
  //           //   // todayEnd
  //           // );
  //         } else {
  //           return aadat;
  //         }
  //       } else {
  //         return aadat;
  //       }

  //       //   // new Date(relevantAddmt.createdAt) <= todayEnd
  //     })
  //     .filter(Boolean);
  //   setweeklyAadats(filteredWeekly);
  // };

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
  const handlechangeCusres = (e, val, cusresTitle) => {
    const { name, checked } = e.target;

    if (name.startsWith("cusradiofortitle")) {
      const [categoryIndex, index, typeIndex, resIndex, cusresindexVal] =
        name.split("_");

      if (name.startsWith("cusradiofortitle")) {
        console.log(name, checked);

        const updatedResponsetypeCustomField = [
          ...formData.responsetypeCustomField,
        ];

        if (!updatedResponsetypeCustomField[index]) {
          updatedResponsetypeCustomField[index] = [];
        }

        if (!updatedResponsetypeCustomField[index][resIndex]) {
          updatedResponsetypeCustomField[index][resIndex] = {
            cusresTitle: cusresTitle,
            cusresValue: {},
          };
        }

        if (!updatedResponsetypeCustomField[index][resIndex].cusresValue) {
          updatedResponsetypeCustomField[index][resIndex].cusresValue = {}; // Initialize cusresValue if it's not defined
        }
        updatedResponsetypeCustomField[index][resIndex].cusresTitle =
          cusresTitle;

        if (
          !updatedResponsetypeCustomField[index][resIndex].cusresValue[name]
        ) {
          updatedResponsetypeCustomField[index][resIndex].cusresValue[name] =
            {}; // Initialize cusresindexVal if it's not defined
        }

        if (checked) {
          updatedResponsetypeCustomField[index][resIndex].cusresValue[name][
            val
          ] = checked;
        } else {
          updatedResponsetypeCustomField[index][resIndex].cusresValue[name][
            val
          ] = false; // Set the value to false if checked is false
        }

        setformData({
          ...formData,
          responsetypeCustomField: updatedResponsetypeCustomField,
        });
      }
    }
  };

  const handlechange = (e, aadat) => {
    const { name, value } = e.target;

    if (name.startsWith("yesno")) {
      console.log(name, value);
      const updatedYesNo = {
        ...formData.yesno,
        [name]: {
          value: value,
          aadat: aadat._id,
        },
      };

      setformData({
        ...formData,
        yesno: updatedYesNo,
      });
    } else if (name.startsWith("remarkbox")) {
      // const index = parseInt(name.replace("remarkbox", ""));

      // const updatedRemarkBoxes = {
      //   ...formData.remarkBoxes,
      //   [index]: {
      //     value: value,
      //     aadat: aadat._id,
      //   },
      // };

      // setformData({
      //   ...formData,
      //   remarkBoxes: updatedRemarkBoxes,
      // });
      console.log(name, value);
      const updatedRemarkBoxes = {
        ...formData.remarkBoxes,
        [name]: {
          value: value,
          aadat: aadat._id,
        },
      };

      setformData({
        ...formData,
        remarkBoxes: updatedRemarkBoxes,
      });
    }
  };

  // saving data and making adaatDatamodels for everything mentioned in form

  const saveData = async () => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTcwMjAyNjUyMSwiZXhwIjoxNzMzNTYyNTIxfQ.SQNoJL4HEKvUKrw6AEpCtg1hDNx26vRPz1Az2sZohz4";

      const dataForToday = await axios.get(
        `http://localhost:3001/api/v1/aadatdata/sumbitresponse?student=${authState.id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(dataForToday.data.data.docs);
      const datafortoday = dataForToday.data.data.docs;
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to 00:00:00 of today

      const filteredData = datafortoday?.filter((aadat) => {
        const aDate = new Date(aadat.createdAt);

        return aDate >= today;
      });

      console.log(filteredData);
      // 08/12/2023
      // before submitting the form i have to check if the form was already submitted for today,
      // it is submitted=====> print the values to form display

      // its not submitted========> submit the form ie below

      if (filteredData.length > 0) {
        alert(
          "entry for today has already been made! please try again tomorrow"
        );
        setformData(filteredData);
      } else {
        const response = await axios.post(
          `http://localhost:3001/api/v1/aadatdata/sumbitresponse`,

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

        console.log(response);
        throw alert("form successfully submitted!");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const uniqueCategories = [
    ...new Set(displayAdaats.map((adaat) => adaat.category.name)),
  ];
  const uniqueCategories1 = [
    ...new Set(dailyAadats.map((adaat) => adaat.category.name)),
  ];

  const updateCustomFieldDropdown = (
    uniqueIndex,
    fieldTitle,
    fieldType,
    selectedOption
  ) => {
    const updatedCustomField = [...formData.customField];
    const [fieldIndex, typeIndex] = uniqueIndex.split("_");

    if (fieldIndex >= 0 && fieldIndex < updatedCustomField.length) {
      updatedCustomField[fieldIndex] = {
        fieldTitle: fieldTitle,
        fieldType: [{ type: fieldType }],
        options: [selectedOption],
      };

      setformData({
        ...formData,
        customField: updatedCustomField,
      });
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      {/* <CCard style={{ width: "50rem" }} className="p-0">
        <CCardBody className="bg-light bg-gradient">
          <div className="d-flex justify-content-between">
            <CCardTitle className="fs-3 fw-bold">
              {student.firstName} {student.lastName}
            </CCardTitle>
            <p className="mb-0 fs-5">Class: {student.class}</p>
          </div>
          <div className="date mt-3">
            <p className="mb-0 fs-5">{formattedDate}</p>
          </div>
          <div className="formstat d-flex justify-content-between">
            <div className="text d-flex flex-column mt-3 justify-content-center">
              <p className="card-text mb-0">Form Submitted: 0</p>
              <p className="card-text">Form Not Submitted: 7</p>
            </div>
            <div className="countdown d-flex flex-column align-items-center float-right">
              <CountdownTimer />

              <CButton className="btn btn-dark btn-sm mt-2">
                View Report
              </CButton>
            </div>
          </div>
        </CCardBody>
      </CCard> */}

      <div
        className="card"
        style={{
          color: "black",
          width: "100%",
          maxWidth: "800px",
          margin: "0px auto",
          padding: "0px !important",
          marginBottom: "1.5rem",
          boxShadow: "0 .15rem 1.75rem 0 rgba(58,59,69,.15)",
        }}
      >
        <div
          className="card-header"
          style={{
            padding: "22px 50px",
            backgroundColor: "#135F77",
            color: "white",
            marginBottom: "0px",
            fontSize: "1rem",
            fontWeight: "400",
            lineHeight: "1.5",

            textAlign: "left",
          }}
        >
          <div
            className="innerhead"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <img
              class="user-image"
              src="https://laravel.cppatidar.com/myaadat/images/no_image.png"
            ></img>
            <a
              href="https://laravel.cppatidar.com/myaadat/student/profile/1"
              class="btn-success edit-btn"
            >
              Edit<i class="fas fa-edit"></i>
            </a>

            <h4 className="student-name">
              {student.firstName + " " + student.lastName}
            </h4>
            <div className="right-data">
              <h4 className="" style={{ fontSize: "1.5rem" }}>
                Class: <strong>{student.class}</strong>
              </h4>
            </div>
          </div>
        </div>
        <div className="card-body row margins">
          <div className="col-2"></div>
          <div className="col-7"></div>
          <div class="col-3">
            <h3
              class="track"
              style={{ marginTop: "6%", fontWeight: "bold", fontSize: "14px" }}
            >
              Page Submission Expires in <br />
              <span id="demo1" class="tiktiktimer">
                {hoursLeft}h {minutesLeft}m {secondsLeft}s
              </span>
            </h3>
            <a href="" class="vw only-dd" style={{ marginTop: "5%" }}>
              View Report
            </a>
          </div>
        </div>
        <span style={{ textAlign: "center" }} class="tracking">
          Friday, 09 December 2023 | 27 Jamadil Awwal 1445
        </span>
        <div class="text-ss web-ss">
          <h4>Day Completed in Jamadil Awwal : 25</h4>
          <h4>
            Form Submitted : <span>1</span>
          </h4>
          <h4>
            Form Not Submitted : <span>24</span>
          </h4>
        </div>
      </div>
      {/* <form> */}

      {uniqueCategories &&
        uniqueCategories.map((category, categoryIndex) => (
          <div
            className="card shadow"
            style={{ width: "100%", maxWidth: "800px" }}
          >
            <div
              className="card-header"
              style={{ fontSize: "25px", fontWeight: "400" }}
            >
              {category}
            </div>
            <div className="card-bodyy">
              {displayAdaats.length > 0 &&
                displayAdaats
                  .filter((adaatt) => adaatt.category.name === category)
                  .map((adaat, index) => (
                    <CCard>
                      <CCardBody>
                        <p className=" lule">{adaat.name}</p>

                        {adaat.responseType.map((type, typeIndex) => (
                          <div key={typeIndex}>
                            {(() => {
                              switch (type) {
                                case "yesno":
                                  return (
                                    <div>
                                      <CFormCheck
                                        button={{
                                          color: "success",
                                          variant:
                                            formData.yesno &&
                                            formData.yesno[
                                              `yesno_${categoryIndex}_${index}_${typeIndex}`
                                            ]?.value === "yes"
                                              ? ""
                                              : "outline",
                                          shape: "round-1",
                                          size: "sm",
                                        }}
                                        key={`${categoryIndex}_${index}_${typeIndex}_yes`}
                                        id={`flexCheckDefaultYes_${categoryIndex}_${index}_${typeIndex}`}
                                        type="radio"
                                        label="yes"
                                        value="yes"
                                        // name={`yesno${index}`}
                                        name={`yesno_${categoryIndex}_${index}_${typeIndex}`} // Unique name
                                        onChange={(e) => handlechange(e, adaat)}
                                        checked={
                                          formData.yesno &&
                                          formData.yesno[
                                            `yesno_${categoryIndex}_${index}_${typeIndex}`
                                          ]?.value === "yes"
                                        }
                                        required
                                      />

                                      <CFormCheck
                                        button={{
                                          color: "danger",
                                          variant:
                                            formData.yesno &&
                                            formData.yesno[
                                              `yesno_${categoryIndex}_${index}_${typeIndex}`
                                            ]?.value === "no"
                                              ? ""
                                              : "outline",
                                          shape: "round-1",
                                          size: "sm",
                                        }}
                                        key={`${categoryIndex}_${index}_${typeIndex}_no`}
                                        id={`flexCheckDefaultNo_${categoryIndex}_${index}_${typeIndex}`}
                                        label="no"
                                        type="radio"
                                        value="no"
                                        name={`yesno_${categoryIndex}_${index}_${typeIndex}`} // Same unique name for "no"
                                        onChange={(e) => handlechange(e, adaat)}
                                        checked={
                                          formData.yesno &&
                                          formData.yesno[
                                            `yesno_${categoryIndex}_${index}_${typeIndex}`
                                          ]?.value === "no"
                                        }
                                        className="small-button"
                                        required
                                      />
                                    </div>
                                  );

                                case "custom":
                                  return (
                                    <div>
                                      {/*  content for responseType 'customfield' */}
                                      {adaat.responsetypeCustomField.map(
                                        (field, resIndex) => (
                                          <div>
                                            <p className="pt-1 mt-3 mb-1">
                                              {field.cusresTitle}
                                            </p>

                                            {field.cusresValue.map(
                                              (val, cusresindexVal) => (
                                                <div>
                                                  <CFormCheck
                                                    id={`cusradiofortitle${categoryIndex}_${index}_${typeIndex}_${resIndex}_${cusresindexVal}`}
                                                    label={val}
                                                    name={`cusradiofortitle${categoryIndex}_${index}_${typeIndex}_${resIndex}_${cusresindexVal}`}
                                                    onChange={(e) =>
                                                      handlechangeCusres(
                                                        e,
                                                        val,
                                                        field.cusresTitle
                                                      )
                                                    }
                                                    checked={
                                                      formData
                                                        .responsetypeCustomField[
                                                        index
                                                      ] &&
                                                      formData
                                                        .responsetypeCustomField[
                                                        index
                                                      ][resIndex] &&
                                                      formData
                                                        .responsetypeCustomField[
                                                        index
                                                      ][resIndex].cusresValue &&
                                                      formData
                                                        .responsetypeCustomField[
                                                        index
                                                      ][resIndex].cusresValue[
                                                        `cusradiofortitle${categoryIndex}_${index}_${typeIndex}_${resIndex}_${cusresindexVal}`
                                                      ] &&
                                                      formData
                                                        .responsetypeCustomField[
                                                        index
                                                      ][resIndex].cusresValue[
                                                        `cusradiofortitle${categoryIndex}_${index}_${typeIndex}_${resIndex}_${cusresindexVal}`
                                                      ][val]
                                                        ? true
                                                        : false
                                                    }
                                                    required
                                                  />
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  );
                                case "remarkbox":
                                  return (
                                    <div>
                                      {/*  content for responseType 'remarkbox' */}

                                      <div class="form-floating mt-2">
                                        <textarea
                                          class="form-control"
                                          placeholder="Leave a comment here"
                                          // id="floatingTextarea"
                                          // name={`remarkbox${index}`}
                                          // value={
                                          //   formData[`remarkbox${index}`]
                                          // }
                                          // onChange={(e) => {
                                          //   handlechange(e, adaat);
                                          // }}
                                          id={`remarkbox_${categoryIndex}_${index}_${typeIndex}`}
                                          name={`remarkbox_${categoryIndex}_${index}_${typeIndex}`}
                                          value={
                                            formData[
                                              `remarkbox_${categoryIndex}_${index}_${typeIndex}`
                                            ]
                                          }
                                          onChange={(e) =>
                                            handlechange(e, adaat)
                                          }
                                          required
                                        ></textarea>
                                        <label for="floatingTextarea">
                                          remark box
                                        </label>
                                      </div>
                                    </div>
                                  );
                                case "image":
                                  return (
                                    <div className="mt-2">
                                      {/*  content for responseType 'images' */}

                                      {/* {[...Array(formData.isImageUpload)].map(
                                          (_, index) => ( */}
                                      <div key={index}>
                                        <CFormInput
                                          type="file"
                                          className="form-control"
                                          label="Images"
                                          // label={`Image ${index + 1}`}
                                          name={`image${index}`}
                                          id={`inputGroupFile${index + 1}`}
                                          multiple // Allow multiple file selection
                                        />
                                      </div>
                                      {/* //   )
                                        // )} */}
                                    </div>
                                  );
                                default:
                                  return null;
                              }
                            })()}
                          </div>
                        ))}

                        {/* custom field outside of response type */}
                        {adaat.customField.map((field, fieldIndex) => (
                          <div key={fieldIndex} className="mt-3">
                            <p>{field.fieldTitle}</p>
                            {field.fieldType.map((type, typeIndex) => (
                              <div key={typeIndex}>
                                {type === "dropdown" && (
                                  <CFormSelect
                                    onChange={(e) =>
                                      updateCustomFieldDropdown(
                                        `${fieldIndex}_${typeIndex}`,
                                        field.fieldTitle,
                                        "dropdown",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="" disabled>
                                      Select an option
                                    </option>
                                    {field.options.map(
                                      (option, optionIndex) => (
                                        <option
                                          key={optionIndex}
                                          value={option}
                                        >
                                          {option}
                                        </option>
                                      )
                                    )}
                                  </CFormSelect>
                                )}
                                {type === "checkbox" && (
                                  <div>
                                    {field.options.map(
                                      (option, optionIndex) => (
                                        <div key={optionIndex} className="ml-4">
                                          <CFormCheck
                                            id={`checkbox_${fieldIndex}_${typeIndex}_${optionIndex}`}
                                            name={`checkbox_${fieldIndex}_${typeIndex}`}
                                            value={option}
                                          />
                                          {option}
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </CCardBody>
                    </CCard>
                  ))}
            </div>
          </div>
        ))}

      {/* for daily */}

      <CButton
        className="btn btn-dark"
        type="submit"
        // onClick={() => {
        //   saveData();
        // }}
      >
        Save
      </CButton>
    </div>
  );
}

export default StudentView;
