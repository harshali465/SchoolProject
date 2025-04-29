

import React, { useContext, useCallback } from "react";
import { read, utils, writeFileXLSX } from "xlsx";


import { CFormInput, CButton } from "@coreui/react";
import axios from "axios";
import { useState } from "react";

import { CProgress } from "@coreui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { AuthContext } from "../../helper/AuthState";

function ViewReport() {
  /* the component state is an array of presidents */
  const [pres, setPres] = useState([]);
  const location = useLocation();
  const suratPercentageparam = location?.state?.suratPercentage;

  /* Fetch and update the state once */
  useEffect(() => {
    (async () => {
      const f = await (
        await fetch("https://docs.sheetjs.com/pres.xlsx")
      ).arrayBuffer();
      const wb = read(f); // parse the array buffer
      const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
      const data = utils.sheet_to_json(ws); // generate objects
      setPres(data); // update state
    })();
  }, []);

  const [token] = useState(localStorage.getItem("accessToken"));
  // Initialize a new map to store combined values
  const combinedValuesMap = {};

  const { authState } = useContext(AuthContext);

  const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay(); // Get the current day of the week (0=Sunday, 1=Monday, etc.)
    const diff = day === 0 ? 6 : day - 1; // If Sunday, treat as start of the week, else subtract the day value to get Monday
    startOfWeek.setDate(startOfWeek.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0); // Set time to start of day
    return startOfWeek;
  };

  const getEndOfWeek = (date) => {
    const endOfWeek = new Date(date);
    const day = endOfWeek.getDay(); // Get the current day of the week (0=Sunday, 1=Monday, etc.)
    const diff = day === 0 ? 0 : 7 - day; // If Sunday, treat as end of the week, else calculate days to Saturday
    endOfWeek.setDate(endOfWeek.getDate() + diff);
    endOfWeek.setHours(23, 59, 59, 999); // Set time to end of day (11:59 PM)
    return endOfWeek;
  };

  const [reportState, setreportState] = useState({
    startDaterep: getStartOfWeek(new Date()), // Start of the current week (Monday)
    endDaterep: getEndOfWeek(new Date()),
    totalCount: "",
  });
  const [Obj, setObj] = useState({});
  const uniqueCategories = new Set();
  const uniqueAadats = new Set();

  const [data, setdata] = useState();
  const [uniqueCategoriesArray, setuniqueCategoriesArray] = useState([]);
  const [uniqueAadatsArray, setuniqueAadatsArray] = useState([]);

  // Function to get the last Sunday
  const getLastSunday = (date) => {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek;
    return new Date(date.setDate(diff));
  };

  // Function to get the coming Saturday
  const getComingSaturday = (date) => {
    const dayOfWeek = date.getDay();
    const diff = 6 - dayOfWeek + date.getDate();
    return new Date(date.setDate(diff));
  };

  const fnccc = async () => {
    let today = new Date(); // Get today's date

    const lastSunday = getLastSunday(today);
    const comingSaturday = getComingSaturday(today);

    let lastSundayDate =
      lastSunday.getDate() > "9"
        ? lastSunday.getDate()
        : "0" + lastSunday.getDate();
    let lastSundayMonth = lastSunday.getMonth() + 1;
    lastSundayMonth =
      lastSundayMonth > "9" ? lastSundayMonth : "0" + lastSundayMonth;

    let comingSaturdayDate =
      comingSaturday.getDate() > "9"
        ? comingSaturday.getDate()
        : "0" + comingSaturday.getDate();
    let comingSaturdayMonth = comingSaturday.getMonth() + 1;
    comingSaturdayMonth =
      comingSaturdayMonth > "9"
        ? comingSaturdayMonth
        : "0" + comingSaturdayMonth;

    const startdate =
      lastSundayDate + "-" + lastSundayMonth + "-" + lastSunday.getFullYear();
    const enddate =
      comingSaturdayDate +
      "-" +
      comingSaturdayMonth +
      "-" +
      comingSaturday.getFullYear();

    const response = await axios.get(
      `${
        process.env.REACT_APP_DEV_BASE_URL
      }/api/v1/school/get/student-report?studentId=${localStorage.getItem(
        "userId"
      )}&startDate=${moment(reportState?.startDaterep).format(
        "DD-MM-YYYY"
      )}&endDate=${moment(reportState?.endDaterep).format("DD-MM-YYYY")}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(
      "this is the complete adaatdata for logged student--->",
      moment(reportState?.startDaterep).format("DD-MM-YYYY"),
      reportState?.startDaterep
    );

    //setdata(response.data.data.docs);

    const jsonValue = {
      status: "success",
      data: [
        {
          _id: "6682c325e6bd9907d1d57255",
          name: "Aqa Maula (Tus) Farmaan",
          aadats: [
            {
              name: "I Will Stay Away From Moharramaat In My Entire Life.",
              submissions: [
                {
                  fieldName: "I Promise",
                  fieldType: "custom",
                  count: 0,
                },
                {
                  fieldName: "yes",
                  count: 0,
                },
                {
                  fieldName: "no",
                  count: 0,
                },
              ],
            },
            {
              name: "I Will Stay Away From Moharramaat In My Entire Life.",
              submissions: [
                {
                  fieldName: "I Promise",
                  fieldType: "custom",
                  count: 0,
                },
                {
                  fieldName: "yes",
                  count: 0,
                },
                {
                  fieldName: "no",
                  count: 0,
                },
              ],
            },
          ],
        },
      ],
    };
    setdata(response.data);

    //const totalCount = response.data.data.docs.length;
    const totalCount = "1";

    setreportState((prevState) => ({
      ...prevState,
      totalCount: totalCount,
    }));
  };

  const reportfilter = async (e) => {
    e.preventDefault();

    let today = new Date(); // Get today's date


    const lastSunday = new Date(reportState.startDaterep);
    const comingSaturday = new Date(reportState.endDaterep);

    let lastSundayDate =
      lastSunday.getDate() > "9"
        ? lastSunday.getDate()
        : "0" + lastSunday.getDate();
    let lastSundayMonth = lastSunday.getMonth() + 1;
    lastSundayMonth =
      lastSundayMonth > "9" ? lastSundayMonth : "0" + lastSundayMonth;

    let comingSaturdayDate =
      comingSaturday.getDate() > "9"
        ? comingSaturday.getDate()
        : "0" + comingSaturday.getDate();
    let comingSaturdayMonth = comingSaturday.getMonth() + 1;
    comingSaturdayMonth =
      comingSaturdayMonth > "9"
        ? comingSaturdayMonth
        : "0" + comingSaturdayMonth;

    const startdate =
      lastSundayDate + "-" + lastSundayMonth + "-" + lastSunday.getFullYear();
    const enddate =
      comingSaturdayDate +
      "-" +
      comingSaturdayMonth +
      "-" +
      comingSaturday.getFullYear();

    const response = await axios.get(
      //  `https://api.myaadat.com/api/v1/aadatdata?student=${authState.id}`,
      // `https://api.myaadat.com/api/v1/aadatdata?studentId=${localStorage.getItem(
      //     "userId"
      //   )}`,
      `${
        process.env.REACT_APP_DEV_BASE_URL
      }/api/v1/school/get/student-report?studentId=${localStorage.getItem(
        "userId"
      )}&startDate=${startdate}&endDate=${enddate}`,

      // `https://api.myaadat.com/api/v1/users/get/student-report?studentId=${localStorage.getItem(
      //   "userId"
      // )}&startDate=01-01-2023&endDate=31-12-2024`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

   

    //setdata(response.data.data.docs);

    const jsonValue = {
      status: "success",
      data: [
        {
          _id: "6682c325e6bd9907d1d57255",
          name: "Aqa Maula (Tus) Farmaan",
          aadats: [
            {
              name: "I Will Stay Away From Moharramaat In My Entire Life.",
              submissions: [
                {
                  fieldName: "I Promise",
                  fieldType: "custom",
                  count: 0,
                },
                {
                  fieldName: "yes",
                  count: 0,
                },
                {
                  fieldName: "no",
                  count: 0,
                },
              ],
            },
            {
              name: "I Will Stay Away From Moharramaat In My Entire Life.",
              submissions: [
                {
                  fieldName: "I Promise",
                  fieldType: "custom",
                  count: 0,
                },
                {
                  fieldName: "yes",
                  count: 0,
                },
                {
                  fieldName: "no",
                  count: 0,
                },
              ],
            },
          ],
        },
      ],
    };
    setdata(response.data);
 
    const totalCount = "1";

    setreportState((prevState) => ({
      ...prevState,
      totalCount: totalCount,
    }));
  };

  /* get state data and export to XLSX */
  const exportFile = useCallback(() => {

    let datamap = data.data;

    let dataarray = [];

    datamap.map((data) => {
      dataarray.push([data.categoryName]);
      data.aadats.map((aadat) => {
        let aadatArray = [];
        aadatArray.push(aadat.aadatName);
        aadat.submissions.map((submission) => {
          let submissionString =
            submission.fieldName + " : " + submission.count;
          aadatArray.push(submissionString);
        });
        dataarray.push(aadatArray);
      });
    });

    // return

    const ws = utils.json_to_sheet(dataarray);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "SheetJSReactAoO.xlsx");
  }, [data]);

  useEffect(() => {
    const today = new Date(); // Get today's date
    const lastSunday = getLastSunday(today);
    const comingSaturday = getComingSaturday(today);

    setreportState({
      ...reportState,
      startDaterep: lastSunday, // Set the last Sunday in YYYY-MM-DD format
      endDaterep: comingSaturday,
    });

    fnccc();
  }, []);

  const CustomInput = ({ value, onClick, labelName }) => (
    <CFormInput
      type="text"
      id="dateselect"
      placeholder="Select date"
      label={labelName}
      onClick={onClick}
      value={value}
    />
  );
  return (
    <div className="page-wrapper">
            <div className="content">
    <div className="reportview student_view">
      <div>
        <div className="parameters">
          <div>
            <h4 className="mb-1">Quran Progress</h4>
            {/* <CProgress
              color="success"
              className="mb-4"
              value={(uniqueSurahCount / 604) * 100}
            >
              {`${((uniqueSurahCount / 604) * 100).toFixed(2)}%`}
            </CProgress> */}

            <CProgress
              color="success"
              className="mb-4"
              value={suratPercentageparam}
            >
              {suratPercentageparam} %
            </CProgress>
          </div>

          <div className="row mb-5 gap-2">
            <div className="start pt-2 col-md-4">
              <DatePicker
                label="Start date"
                name="startDate"
                dateFormat="dd/MM/yyyy"
                popperPlacement="top-end"
                customInput={<CustomInput labelName={"Start date"} />}
                selected={reportState.startDaterep}
                onChange={(date) =>
                  setreportState({
                    ...reportState,
                    startDaterep: date,
                  })
                }
              />
            </div>
            <div className="end pt-2 col-md-4">
              <DatePicker
                label="End date"
                name="endDate"
                dateFormat="dd/MM/yyyy"
                popperPlacement="top-end"
                customInput={<CustomInput labelName={"End date"} />}
                selected={reportState.endDaterep}
                onChange={(date) =>
                  setreportState({
                    ...reportState,
                    endDaterep: date,
                  })
                }
              />
            </div>
            <div className="col" style={{ alignSelf: "end" }}>
              <button
                type="submit"
                onClick={reportfilter}
                className="btn btn-responsive btn-primary"
              >
                Filter
              </button>
              <button
                type="submit"
                onClick={fnccc}
                className="btn btn-responsive btn-danger"
              >
                Reset
              </button>
              <button
                className="btn btn-responsive btn-primary"
                onClick={exportFile}
              >
                Export Daily Report
              </button>
            </div>
          </div>

          <div className="filter-data">
            <h3>
              Total &nbsp;
              {data?.totalDays == data?.totalDays ? data?.totalDays : "0"}&nbsp;
              Days
            </h3>
            {data && (
              <ul>
                <li>Form Submission : {data.formSubmissionPercentage}%</li>
                <li>Submitted : {data.formSubmittedCount} days</li>
                <li>Not Submitted : {data.formNotSubmittedCount} days</li>
              </ul>
            )}
          </div>

          {/* <div className="total-counts ">
          Total count: {reportState.totalCount}
          </div> */}

          <div
            className="m-auto mt-3"
            style={{ width: "100%", maxWidth: "800px" }}
          >
            {(!data || data?.data?.length === 0) && (
              <div>No data available</div>
            )}
            {data &&
              data.data.map((dat, datIndex) => (
                <div
                  className="card shadow"
                  style={{ width: "100%", maxWidth: "800px" }}
                >
                  <div
                    className="card-header"
                    style={{ fontSize: "25px", fontWeight: "400" }}
                  >
                    {dat.categoryName}
                  </div>
                  <div className="card-bodyy test">
                    <div className="div-table mt-4">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th className="text-center">Aadat Name </th>
                            {dat.aadats.map((aadat, aadatIndex) =>
                              aadatIndex <= 0
                                ? aadat.submissions.map(
                                    (submission, submissionHeaderIndex) => (
                                      <th
                                        className="text-center"
                                        key={submissionHeaderIndex}
                                      >
                                        {submission.fieldName}
                                      </th>
                                    )
                                  )
                                : null
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {dat.aadats.map((aadat, aadatIndex) => (
                            <>
                              <tr>
                                <td>{aadat.aadatName} </td>
                                {aadat.submissions.map(
                                  (submission, submissionIndex) => (
                                    <>
                                      <td className="text-center">
                                        <p
                                          className={`${
                                            submission.count > 0
                                              ? "green"
                                              : "red"
                                          }`}
                                        >
                                          {submission.count}
                                        </p>
                                      </td>
                                    </>
                                  )
                                )}
                              </tr>
                            </>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
        </div>
        </div></div>
  );
}

export default ViewReport;
