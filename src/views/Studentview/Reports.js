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

  const { authState } = useContext(AuthContext);

  const [reportState, setreportState] = useState({
    startDaterep: new Date(),
    endDaterep: new Date(),
    totalCount: "",
  });
  const [Obj, setObj] = useState({});
  const uniqueCategories = new Set();
  const uniqueAadats = new Set();

  const [data, setdata] = useState([]);
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

        // Add unique categories and aadats to respective sets
        uniqueCategories.add(category); /// i gave categry
        uniqueAadats.add(`${category}_${aadat}_${value}`); /// i gave category as well as aadat in 1 name
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

        // Add unique categories and aadats to respective sets
        uniqueCategories.add(category);
        // uniqueAadats.add(`${category}_${aadat}_${value}`); /// i gave category as well as aadat in 1 name

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

    setuniqueCategoriesArray([...uniqueCategories]);
    setuniqueAadatsArray([...uniqueAadats]);
    setObj(combinedValuesMap);
  }, [data]);

  // const uniqueCategoriesArray = [...uniqueCategories];
  // const uniqueAadatsArray = [...uniqueAadats];

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

          {/* {data.map((data, dataindex) => */}
          {uniqueCategoriesArray.map((category, catindex) => (
            <div className="div-table mt-4">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="text-center">Category Name: {category}</th>
                    <th className="text-center">Yes</th>
                    <th className="text-center">No</th>
                    <th className="text-center">Remarkboxes</th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueAadatsArray
                    .filter((item) => {
                      {
                        const [innetcategory, aadat] = item.split("_");
                        return innetcategory === category;
                      }
                    })
                    .map((aadat, aindex) => (
                      <>
                        <tr>
                          <td>{aadat}</td>
                          <td className="text-center">{aadat.split("_")[2]}</td>
                          <td className="text-center">3</td>
                          <td>Lorem, ipsum.</td>
                        </tr>
                      </>
                    ))}
                </tbody>
              </table>
            </div>
          ))}
          {/* )} */}
        </div>
      </div>
    </div>
  );
}

export default Report;
