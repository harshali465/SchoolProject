import React, { useContext } from "react";

import "./studentview.css";

import { CFormInput, CButton } from "@coreui/react";
import axios from "axios";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from "../../helpers/AuthContext";

function Report() {
  // Initialize a new map to store combined values
  const combinedValuesMap = {};
  // Object to store counts for each category and aadat
  const categoryAadatCounts = {};
  const { authState } = useContext(AuthContext);

  const [reportState, setreportState] = useState({
    startDaterep: new Date(),
    endDaterep: new Date(),
    totalCount: "",
  });
  const [Obj, setObj] = useState({});

  const [data, setdata] = useState([]);

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

  useEffect(() => {
    const today = new Date(); // Get today's date
    const lastSunday = getLastSunday(today);
    const comingSaturday = getComingSaturday(today);

    setreportState({
      ...reportState,
      startDaterep: lastSunday, // Set the last Sunday in YYYY-MM-DD format
      endDaterep: comingSaturday,
    });

    const fnccc = async () => {
      // Your code here...
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTcwMjAyNjUyMSwiZXhwIjoxNzMzNTYyNTIxfQ.SQNoJL4HEKvUKrw6AEpCtg1hDNx26vRPz1Az2sZohz4";

      const response = await axios.get(
        `http://18.118.42.224:3001/api/v1/aadatdata?student=${authState.id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "this is the complete adaatdata for logged student--->",
        response.data.data.docs
      );

      setdata(response.data.data.docs);

      const totalCount = response.data.data.docs.length;

      setreportState((prevState) => ({
        ...prevState,
        totalCount: totalCount,
      }));
    };

    fnccc();
  }, []);

  useEffect(() => {
    data.forEach((dat, index) => {
      Object.keys(dat.yesno).forEach((key) => {
        const date = dat.updatedAt;
        const category = dat.yesno[key].categoryName;
        const aadat = dat.yesno[key].aadatName;
        const value = dat.yesno[key].value;

        // Combine category and aadat to form a unique key
        const combinedKey = `${category}_${aadat}_${date}_yesno`;

        // If the combinedKey already exists in the map, add the value to its array
        if (combinedValuesMap.hasOwnProperty(combinedKey)) {
          combinedValuesMap[combinedKey].push(value);
        } else {
          // Otherwise, create a new array for the key and add the value
          combinedValuesMap[combinedKey] = [value];
        }
      });

      Object.keys(dat.remarkBoxes).forEach((key) => {
        const date = dat.updatedAt;
        const category = dat.remarkBoxes[key].categoryName;
        const aadat = dat.remarkBoxes[key].aadatName;
        const value = dat.remarkBoxes[key].value;

        // Combine category and aadat to form a unique key
        const combinedKey = `${category}_${aadat}_${date}_remarkboxes`;

        // If the combinedKey already exists in the map, add the value to its array
        if (combinedValuesMap.hasOwnProperty(combinedKey)) {
          combinedValuesMap[combinedKey].push(value);
        } else {
          // Otherwise, create a new array for the key and add the value
          combinedValuesMap[combinedKey] = [value];
        }
      });
    });

    setObj(combinedValuesMap);

    // // Loop through combinedValuesMap
    // Object.keys(combinedValuesMap).forEach((key) => {
    //   const [category, aadat, type] = key.split("_"); // Extract category, aadat, and type

    //   // Create an entry for the category if it doesn't exist
    //   if (!categoryAadatCounts[category]) {
    //     categoryAadatCounts[category] = {};
    //   }

    //   // Create an entry for the aadat under the category if it doesn't exist
    //   if (!categoryAadatCounts[category][aadat]) {
    //     categoryAadatCounts[category][aadat] = {
    //       yes: 0,
    //       no: 0,
    //       remarkboxes: 0,
    //     };
    //   }

    //   // Increment count based on type (yesno or remarkboxes)
    //   if (type === "yesno") {
    //     combinedValuesMap[key].value
    //     categoryAadatCounts[category][aadat].yesno +=
    //       combinedValuesMap[key].length;
    //   } else if (type === "remarkboxes") {
    //     categoryAadatCounts[category][aadat].remarkboxes +=
    //       combinedValuesMap[key].length;
    //   }
    // });

    // // Log the categoryAadatCounts
    // console.log(categoryAadatCounts);
  }, [data]);

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
    <div>
      <div className="parameters">
        <div className="total-counts ">
          Total count: {reportState.totalCount}
        </div>
        <div className="parameters ">
          <div className="start pt-2">
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
          <div className="end pt-3">
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
          <div className="reports">
            {data.map((dat, index) => (
              <>
                <div className="createdAt pt-2 pb-2">{dat.createdAt}</div>
                <div className="yesno card p-3">
                  Yes/No-
                  {Object.keys(dat.yesno).map((key) => (
                    <div className="cat" key={key}>
                      {dat.yesno[key].categoryName}
                      <div className="aad">{dat.yesno[key].aadatName}</div>
                      <div className="value">{dat.yesno[key].value}</div>
                    </div>
                  ))}
                </div>
                <div className="remarkbox card p-3">
                  Remarkboxes-
                  {Object.keys(dat.remarkBoxes).map((key) => (
                    <div className="cat" key={key}>
                      {dat.remarkBoxes[key].categoryName}
                      <div className="aad">
                        {dat.remarkBoxes[key].aadatName}
                      </div>
                      <div className="value">{dat.remarkBoxes[key].value}</div>
                    </div>
                  ))}
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;
