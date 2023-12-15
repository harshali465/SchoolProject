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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
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

function StudentView() {
  const { hoursLeft, minutesLeft, secondsLeft } = useCountdown();
  const { authState } = useContext(AuthContext);
  const [adaats, setadaats] = useState([]); //used for weekly
  const [adaatsD, setadaatsD] = useState([]); //used for daily
  const [adaatsM, setadaatsM] = useState([]); // used for monthly
  const [displayAdaats, setDisplayAdaats] = useState([]); //final display
  const [student, setstudent] = useState();
  const [validated, setValidated] = useState(false);
  const [EditForm, setEditForm] = useState(false);
  const [EditIdADM, setEditIdADM] = useState("");
  const [ReadyToEdit, setReadyToEdit] = useState(false);

  const [uniqueSurahCount, setUniqueSurahCount] = useState(0);

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
    images: {},
  });

  const [suratForm, setsuratForm] = useState({
    suratName: "",
    ayatNo: "",
    selectedAyatNo: "",
  });

  const getAadatsforStudentweekly = async () => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTcwMjAyNjUyMSwiZXhwIjoxNzMzNTYyNTIxfQ.SQNoJL4HEKvUKrw6AEpCtg1hDNx26vRPz1Az2sZohz4";
      // this is for getting the information about the student you need to display all the adaats for
      const res = await axios.get(
        `http://18.118.42.224:3001/api/v1/users/${authState.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setstudent(res.data.data);

      // this is the call where you are retrieving all the adaats for the student for repetation- daily
      const response = await axios.get(
        "http://18.118.42.224:3001/api/v1/aadat/getAllDailyAadat",
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
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTcwMjAyNjUyMSwiZXhwIjoxNzMzNTYyNTIxfQ.SQNoJL4HEKvUKrw6AEpCtg1hDNx26vRPz1Az2sZohz4";
      // this is for getting the information about the student you need to display all the adaats for
      const res = await axios.get(
        `http://18.118.42.224:3001/api/v1/users/${authState.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setstudent(res.data.data);
      // this is the call where you are retrieving all the adaats for the student for repetation- daily
      const response = await axios.get(
        "http://18.118.42.224:3001/api/v1/aadat/getAllDailyAadat",
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
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTcwMjAyNjUyMSwiZXhwIjoxNzMzNTYyNTIxfQ.SQNoJL4HEKvUKrw6AEpCtg1hDNx26vRPz1Az2sZohz4";
      // this is for getting the information about the student you need to display all the adaats for
      const res = await axios.get(
        `http://18.118.42.224:3001/api/v1/users/${authState.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setstudent(res.data.data);
      // this is the call where you are retrieving all the adaats for the student for repetation- daily
      const response = await axios.get(
        "http://18.118.42.224:3001/api/v1/aadat/getAllDailyAadat",
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

  // for customized

  const getAadatsforStudentCustom = async () => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTcwMjAyNjUyMSwiZXhwIjoxNzMzNTYyNTIxfQ.SQNoJL4HEKvUKrw6AEpCtg1hDNx26vRPz1Az2sZohz4";
      // this is for getting the information about the student you need to display all the adaats for
      const res = await axios.get(
        `http://18.118.42.224:3001/api/v1/users/${authState.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setstudent(res.data.data);
      // this is the call where you are retrieving all the adaats for the student for repetation- daily
      const response = await axios.get(
        "http://18.118.42.224:3001/api/v1/aadat/getAllDailyAadat",
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
      console.log("These are aadats for today - custom", filteredCustom);
      setadaatsM(filteredCustom); // Assuming setAdaats updates the state with filteredMonthly

      const newMonthlyAadats = filteredCustom;

      // Check if the newDailyAadats are not already present in displayAdaats
      const isDuplicate = newMonthlyAadats.some((newAadat) =>
        displayAdaats.some((displayAadat) => displayAadat._id === newAadat._id)
      );

      if (!isDuplicate) {
        // If the new data is not a duplicate, merge it into displayAdaats
        const mergedDisplayAdaats = [...displayAdaats, ...newMonthlyAadats];
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

  const getAadatsforStudentDaily = async () => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTcwMjAyNjUyMSwiZXhwIjoxNzMzNTYyNTIxfQ.SQNoJL4HEKvUKrw6AEpCtg1hDNx26vRPz1Az2sZohz4";
      // this is for getting the information about the student you need to display all the adaats for
      const res = await axios.get(
        `http://18.118.42.224:3001/api/v1/users/${authState.id}`,
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
        "http://18.118.42.224:3001/api/v1/aadat/getAllDailyAadat",
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
        // setDisplayAdaats(mergedDisplayAdaats);

        //returning to usestate
        return mergedDisplayAdaats;
      }

      // setaadatDataModelIds1(response.data.aadatDataModelIds);
      // setaadatdatamodels1(response.data.aadatdatamodels);
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

  useEffect(() => {
    const fetchAllAadats = async () => {
      setDisplayAdaats([]);
      const customAadats = await getAadatsforStudentCustom();
      const yearlyAadats = await getAadatsforStudentYearly();
      const weeklyAadats = await getAadatsforStudentweekly();
      const monthlyAadats = await getAadatsforStudentMonthly();
      const dailyAadats = await getAadatsforStudentDaily();

      // Combine all the fetched aadats
      const allAadats = [
        ...(customAadats || []), // Check if falsy or empty
        ...(yearlyAadats || []),
        ...(weeklyAadats || []),
        ...(monthlyAadats || []),
        ...(dailyAadats || []),
      ];
      // Set the combined aadats to the displayAadats state
      console.log("Display adaats->", allAadats);
      setDisplayAdaats(allAadats);
    };

    fetchAllAadats();
  }, [authState.id, authState.role]);

  useEffect(() => {
    const fnccc = async () => {
      // Your code here...
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTcwMjAyNjUyMSwiZXhwIjoxNzMzNTYyNTIxfQ.SQNoJL4HEKvUKrw6AEpCtg1hDNx26vRPz1Az2sZohz4";

      const dataForToday = await axios.get(
        `http://18.118.42.224:3001/api/v1/aadatdata/sumbitresponse?student=${authState.id}`,

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
        // setEditForm(true);
        setReadyToEdit(true);
      }

      // ////////////////////////////////////setting up the latest surat student has read
    };

    fnccc();
  }, []);

  useEffect(() => {
    if (student && student.suratRecord) {
      const countUniqueEntries = () => {
        // extracting latest surat student has read

        const obj = student.suratRecord;
        let keys = Object.keys(obj);
        let lastKey = keys[keys.length - 1];

        let lastValue = obj[lastKey];

        setsuratForm((prevSuratForm) => ({
          ...prevSuratForm,
          suratName: lastKey,
          ayatNo: ayatsPerSurat[lastKey] || prevSuratForm.ayatNo, // Set ayatNo based on the selected Surat
          selectedAyatNo: lastValue,
        }));

        const uniqueEntries = new Set();
        let count = 0;

        Object.entries(student.suratRecord).forEach(
          ([suratName, selectedAyatNo]) => {
            const combinedEntry = `${suratName}-${selectedAyatNo}`;

            if (!uniqueEntries.has(combinedEntry)) {
              uniqueEntries.add(combinedEntry);
              count++;
            }
          }
        );
        // 6236 total ayats
        setUniqueSurahCount(count);
      };

      countUniqueEntries();
    }
  }, [student]);

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

    if (name.startsWith("image")) {
      const files = e.target.files;
      // If no files are selected, clear the existing state for that input
      if (files.length === 0) {
        const updatedImages = { ...formData.images };
        delete updatedImages[name]; // Remove the specific image key
        setformData({
          ...formData,
          images: updatedImages,
        });
        return; // Exit function
      }

      // Make a copy of existing images
      const updatedImages = {
        ...formData.images,
      };

      // Handle the selected files and update updatedImages object accordingly
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Process each file as needed, for instance, upload to a server, etc.
        // Here, we are just adding files to the updatedImages object
        updatedImages[name] = file;
      }

      // Update formData with updated images
      setformData({
        ...formData,
        images: updatedImages,
      });
    } else if (name.startsWith("yesno")) {
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

  const saveData = async (event) => {
    const form = event.currentTarget;
    // Check form validity
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      // Handle invalid form case (display errors or take other actions)
      setValidated(true); // If you want to set a flag for showing errors
      return; // Exit function if form is invalid
    }

    // If form is valid
    event.preventDefault();
    event.stopPropagation();

    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTcwMjAyNjUyMSwiZXhwIjoxNzMzNTYyNTIxfQ.SQNoJL4HEKvUKrw6AEpCtg1hDNx26vRPz1Az2sZohz4";

      const dataForToday = await axios.get(
        `http://18.118.42.224:3001/api/v1/aadatdata/sumbitresponse?student=${authState.id}`,

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
        const response = await axios.post(
          `http://18.118.42.224:3001/api/v1/aadatdata/sumbitresponse`,

          {
            student: authState.id,
            remarkBoxes: formData.remarkBoxes,
            yesno: formData.yesno,
            customField: formData.customField,
            responsetypeCustomField: formData.responsetypeCustomField,
            images: formData.images,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response);

        const existingSuratRecord = student.suratRecord;

        existingSuratRecord[suratForm.suratName] = suratForm.selectedAyatNo;

        const requestBody = {
          suratRecord: existingSuratRecord,
        };

        const response2 = await axios.patch(
          `http://18.118.42.224:3001/api/v1/users/${authState.id}`,

          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response2);
        throw alert("form successfully submitted!");
      }
      setValidated(false); // Reset validation flag if needed
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const uniqueCategories = [
    ...new Set(displayAdaats.map((adaat) => adaat.category.name)),
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
    "Ash-Shu'ara": "",
    "An-Naml": "",
    "Al-Qasas": "",
    "Al-Ankabut": "",
    "Ar-Rum": "",
    Luqmaan: "",
    "As-Sajdah": "",
    "Al-Ahzaab": "",
    "Saba (surah)": "",
    Faatir: "",
    "Ya-Sin": "",
    "As-Saaffaat": "",
    Saad: "",
    "Az-Zumar": "",
    Ghafir: "",
    Fussilat: "",
    "Ash-Shura": "",
    "Az-Zukhruf": "",
    "Ad-Dukhaan": "",
    "Al-Jaathiyah": "",
    "Al-Ahqaaf": "",
    Muhammad: "",
    "Al-Fath": "",
    "Al-Hujuraat": "",
    Qaaf: "",
    "Adh-Dhaariyaat": "",
    "At-Toor": "",
    "An-Najm": "",
    "Al-Qamar": "",
    "Ar-Rahman": "",
    "Al-Waqi'ah": "",
    "Al-Hadeed": "",
    "Al-Mujadila": "",
    "Al-Hashr": "",
    "Al-Mumtahanah": "",
    "As-Saff": "",
    "Al-Jumu'ah": "",
    "Al-Munafiqoon": "",
    "At-Taghabun": "",
    "At-Talaq": "",
    "At-Tahreem": "",
    "Al-Mulk": "",
    "Al-Qalam": "",
    "Al-Haaqqa": "",
    "Al-Ma'aarij": "",
    Nuh: "",
    "Al-Jinn": "",
    "Al-Muzzammil": "",
    "Al-Muddaththir": "",
    "Al-Qiyamah": "",
    "Al-Insaan": "",
    "Al-Mursalaat": "",
    "An-Naba'": "",
    "An-Naazi'aat": "",
    Abasa: "",
    "At-Takweer": "",
    "Al-Infitar": "",
    "Al-Mutaffifeen": "",
    "Al-Inshiqaaq": "",
    "Al-Burooj": "",
    "At-Taariq": "",
    "Al-A'la": "",
    "Al-Ghaashiyah": "",
    "Al-Fajr": "",
    "Al-Balad": "",
    "Ash-Shams": "",
    "Al-Layl": "",
    "Ad-Dhuha": "",
    "Ash-Sharh�(Al-Inshirah)": "",
    "At-Tin": "",
    "Al-Alaq": "",
    "Al-Qadr": "",
    "Al-Bayyinah": "",
    "Az-Zalzalah": "",
    "Al-'Aadiyat": "",
    "Al-Qaari'ah": "",
    "At-Takaathur": "",
    "Al-'Asr": "",
    "Al-Humazah": "",
    "Al-Feel": "",
    Quraish: "",
    "Al-Maa'oon": "",
    "Al-Kawthar": "",
    "Al-Kaafiroon": "",
    "An-Nasr": "",
    "Al-Masad": "",
    "Al-Ikhlas": "",
    "Al-Falaq": "",
    "An-Naas": "",
  };
  const handleSurat = (e) => {
    const selectedSuratName = e.target.value;

    setsuratForm((prevSuratForm) => ({
      ...prevSuratForm,
      suratName: selectedSuratName,
      ayatNo: ayatsPerSurat[selectedSuratName] || prevSuratForm.ayatNo, // Set ayatNo based on the selected Surat
    }));
  };

  const handleEdit = async () => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTcwMjAyNjUyMSwiZXhwIjoxNzMzNTYyNTIxfQ.SQNoJL4HEKvUKrw6AEpCtg1hDNx26vRPz1Az2sZohz4";

      const dataForToday = await axios.patch(
        `http://18.118.42.224:3001/api/v1/aadatdata/${EditIdADM}`,

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
      console.log(dataForToday);
      setReadyToEdit(false);
      throw alert("successfully edited!");
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      {/* modal */}
      <CModal
        backdrop="static"
        visible={EditForm}
        onClose={() => setEditForm(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">
            Edit submission
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          Printing already recorded data to screen. Please evaluate and Confirm
          Edit
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditForm(false)}>
            Go back and evaluate
          </CButton>
          {/* <CButton color="primary" onClick={handleEdit}>
            Yes!
          </CButton> */}
        </CModalFooter>
      </CModal>
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
          Thursday, 14 December 2023 | 2 Jamadil Ukhra 1445
        </span>
        <div class="text-ss web-ss">
          <h4>Day Completed in Jamadil Awwal : 25</h4>
          <h4>
            Form Submitted : <span>1</span>
          </h4>
          <h4>
            Form Not Submitted : <span>24</span>
          </h4>
          <div>
            <h4>Percent completed (Surat):</h4>
            <CProgress
              color="success"
              className="mb-4"
              value={(uniqueSurahCount / 10) * 100}
            >
              {`${((uniqueSurahCount / 10) * 100).toFixed(2)}%`}
            </CProgress>
          </div>
        </div>
      </div>
      {/* <form> */}
      <CForm
        style={{ width: "100%", maxWidth: "800px" }}
        className="needs-validation"
        noValidate
        validated={validated}
        onSubmit={saveData}
      >
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
                          <p className="lule">{adaat.name}</p>

                          {/* surat handling */}

                          <p>
                            {adaat.isSurat ? (
                              <div className="row">
                                <div className="col-6">
                                  <CFormSelect
                                    id="validationCustom0789"
                                    label="Surat Name"
                                    name="suratName"
                                    onChange={handleSurat}
                                    value={
                                      suratForm.suratName && suratForm.suratName
                                    }
                                  >
                                    <option selected="" disabled="" value="">
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
                                    <option value="An-Nisa">(4) An-Nisa</option>
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
                                    <option value="Yunus">(10) Yunus</option>
                                    <option value="Hud">(11) Hud</option>
                                    <option value="Yusuf">(12) Yusuf</option>
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
                                    <option value="Maryam">(19) Maryam</option>
                                    <option value="Ta-Ha">(20) Ta-Ha</option>
                                    <option value="Al-Anbiya">
                                      (21) Al-Anbiya
                                    </option>
                                    <option value="Al-Hajj">
                                      (22) Al-Hajj
                                    </option>
                                    <option value="Al-Mu'minun">
                                      (23) Al-Mu'minun
                                    </option>
                                    <option value="An-Nur">(24) An-Nur</option>
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
                                    <option value="Ar-Rum">(30) Ar-Rum</option>
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
                                    <option value="Faatir">(35) Faatir</option>
                                    <option value="Ya-Sin">(36) Ya-Sin</option>
                                    <option value="As-Saaffaat">
                                      (37) As-Saaffaat
                                    </option>
                                    <option value="Saad">(38) Saad</option>
                                    <option value="Az-Zumar">
                                      (39) Az-Zumar
                                    </option>
                                    <option value="Ghafir">(40) Ghafir</option>
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
                                    <option value="Qaaf">(50) Qaaf</option>
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
                                    <option value="Nuh">(71) Nuh</option>
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
                                    <option value="Abasa">(80) Abasa</option>
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
                                    <option value="At-Tin">(95) At-Tin</option>
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
                                </div>
                                <div className="col-6">
                                  <CFormSelect
                                    id="validationCustom0789"
                                    label="To Ayat"
                                    name="ayatName"
                                    onChange={(e) => {
                                      setsuratForm({
                                        ...suratForm,
                                        selectedAyatNo: e.target.value,
                                      });
                                    }}
                                    value={suratForm.selectedAyatNo}
                                  >
                                    <option selected="" disabled="" value="">
                                      Choose...
                                    </option>
                                    {Array.from(
                                      { length: suratForm.ayatNo },
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
                                </div>
                              </div>
                            ) : null}
                          </p>
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
                                          onChange={(e) =>
                                            handlechange(e, adaat)
                                          }
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
                                          feedbackInvalid="Please select yes/no."
                                          name={`yesno_${categoryIndex}_${index}_${typeIndex}`} // Same unique name for "no"
                                          onChange={(e) =>
                                            handlechange(e, adaat)
                                          }
                                          checked={
                                            formData.yesno &&
                                            formData.yesno[
                                              `yesno_${categoryIndex}_${index}_${typeIndex}`
                                            ]?.value === "no"
                                          }
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
                                                        ][resIndex]
                                                          .cusresValue &&
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
                                          <CFormTextarea
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
                                              // formData.remarkBoxes[
                                              //   `remarkbox_${categoryIndex}_${index}_${typeIndex}`
                                              // ]
                                              formData.remarkBoxes &&
                                              formData.remarkBoxes[
                                                `remarkbox_${categoryIndex}_${index}_${typeIndex}`
                                              ] &&
                                              formData.remarkBoxes[
                                                `remarkbox_${categoryIndex}_${index}_${typeIndex}`
                                              ].value
                                                ? formData.remarkBoxes[
                                                    `remarkbox_${categoryIndex}_${index}_${typeIndex}`
                                                  ].value
                                                : null
                                            }
                                            onChange={(e) =>
                                              handlechange(e, adaat)
                                            }
                                            required
                                          ></CFormTextarea>
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
                                        <div key={index}>
                                          <CFormInput
                                            type="file"
                                            className="form-control"
                                            label="Images"
                                            name={`image${index}`}
                                            id={`inputGroupFile${index + 1}`}
                                            onChange={(e) =>
                                              handlechange(e, adaat)
                                            }
                                            multiple // Allow multiple file selection
                                          />
                                        </div>
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
                                          <div
                                            key={optionIndex}
                                            className="ml-4"
                                          >
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

        {ReadyToEdit ? null : (
          <div className="text-center">
            <CButton className="btn btn-dark" type="submit">
              Save
            </CButton>
          </div>
        )}
      </CForm>
      {ReadyToEdit ? (
        <CButton className="btn btn-dark" type="button" onClick={handleEdit}>
          Confirm Edit
        </CButton>
      ) : null}
    </div>
  );
}

export default StudentView;
