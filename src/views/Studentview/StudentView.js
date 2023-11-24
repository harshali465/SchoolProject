import React, { useContext } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { AuthContext } from "../../helpers/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";

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
  const { authState } = useContext(AuthContext);
  const [adaats, setadaats] = useState([]);
  const [student, setstudent] = useState();

  const [formData, setformData] = useState({
    remarkBoxes: {},
    yesno: {},
  });

  const getAadatsforStudent = async () => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU";
      // this is for getting the information about the student you need to display all the adaats for
      const res = await axios.get(
        `http://localhost:3001/api/v1/users/${authState.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data.data.class);
      console.log(res.data.data);

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

      console.log(response.data);
      setadaats(response.data.data);
      setaadatdatamodels(response.data.aadatdatamodels);
      setaadatDataModelIds(response.data.aadatDataModelIds);
      setmidnightOfgivenTime(response.data.midnightOfgivenTime);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // usestates for all types of adaats
  const [aadatDataModelIds, setaadatDataModelIds] = useState([]);
  const [aadatdatamodels, setaadatdatamodels] = useState([]);
  const [midnightOfgivenTime, setmidnightOfgivenTime] = useState();

  const [dailyAadats, setdailyAadats] = useState([]);

  const remindUsersdaily = () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set to 00:00:00 of today

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // Set to 23:59:59 of today
    const filteredDaily = adaats
      .map((aadat) => {
        if (aadatDataModelIds.includes(aadat._id)) {
          const relevantAddmt = aadatdatamodels.find(
            (addmt) =>
              addmt.aadat._id === aadat._id &&
              new Date(addmt.createdAt) >= todayStart && // Check for entries created after today's start
              new Date(addmt.createdAt) <= todayEnd
          );
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

          if (!relevantAddmt) {
            return aadat;
          } else {
            return false;
          }
          // ////////////
        } else {
          return aadat;
        }
      })
      .filter(Boolean);
    setdailyAadats(filteredDaily);
  };

  useEffect(() => {
    remindUsersdaily();
  }, [aadatDataModelIds, aadatdatamodels, midnightOfgivenTime]);

  useEffect(() => {
    getAadatsforStudent();
  }, [authState.id, authState.role]);

  if (!student) {
    return <div>Loading...</div>; //setting loading to avoid onload error
  }

  const handlechange = (e, aadat) => {
    const { name, value } = e.target;

    if (name.startsWith("yesno")) {
      const index = parseInt(name.replace("yesno", ""));
      const updatedYesNo = {
        ...formData.yesno,
        [index]: {
          value: value,
          aadat: aadat._id,
        },
      };

      setformData({
        ...formData,
        yesno: updatedYesNo,
      });
    } else if (name.startsWith("remarkbox")) {
      const index = parseInt(name.replace("remarkbox", ""));

      const updatedRemarkBoxes = {
        ...formData.remarkBoxes,
        [index]: {
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
      const formdata = formData;
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU";

      const response = await axios.post(
        `http://localhost:3001/api/v1/aadatdata/sumbitresponse`,

        { formdata },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <CCard style={{ width: "50rem" }}>
        <CCardBody>
          <div className="d-flex justify-content-between">
            <CCardTitle>
              {student.firstName} {student.lastName}
            </CCardTitle>
            <CCardTitle>{student.class}</CCardTitle>
          </div>
          <p className="card-text">Form Submitted: 0</p>
          <p className="card-text">Form Not Submitted: 7</p>

          <CButton className="btn btn-dark">View Report</CButton>
        </CCardBody>
      </CCard>
      {dailyAadats.length > 0 &&
        dailyAadats.map((adaat, index) => (
          <CCard style={{ width: "50rem" }}>
            <CCardBody>
              <div className="d-flex justify-content-between">
                <CCardTitle>{adaat.category.name}</CCardTitle>
              </div>
              <p className="card-text">{adaat.name}</p>

              {(() => {
                switch (adaat.responseType) {
                  case "yesno":
                    return (
                      <div>
                        <CFormCheck
                          id="flexCheckDefault"
                          type="radio"
                          label="yes"
                          value="yes"
                          name={`yesno${index}`}
                          onChange={(e) => handlechange(e, adaat)}
                          checked={
                            formData.yesno && formData.yesno[index] === "yes"
                          }
                        />

                        <CFormCheck
                          id="flexCheckDefault"
                          label="no"
                          type="radio"
                          value="no"
                          name={`yesno${index}`}
                          onChange={(e) => handlechange(e, adaat)}
                          checked={
                            formData.yesno && formData.yesno[index] === "no"
                          }
                        />
                      </div>
                    );
                  case "customfield":
                    return (
                      <div>
                        {/*  content for responseType 'customfield' */}
                        {/* ... */}
                        <p>Response Type: Custom Field</p>
                      </div>
                    );
                  case "remarkbox":
                    return (
                      <div>
                        {/*  content for responseType 'remarkbox' */}

                        <div class="form-floating">
                          <textarea
                            class="form-control"
                            placeholder="Leave a comment here"
                            id="floatingTextarea"
                            name={`remarkbox${index}`}
                            value={formData[`remarkbox${index}`]}
                            onChange={(e) => {
                              handlechange(e, adaat);
                            }}
                          ></textarea>
                          <label for="floatingTextarea">remark box</label>
                        </div>
                      </div>
                    );
                  case "image":
                    return (
                      <div>
                        {/*  content for responseType 'images' */}

                        <CFormInput
                          type="file"
                          class="form-control"
                          label="Image"
                          name="image"
                          id="inputGroupFile02"
                        />
                      </div>
                    );
                  default:
                    return null;
                }
              })()}
            </CCardBody>
          </CCard>
        ))}
      <CButton
        className="btn btn-dark"
        onClick={() => {
          saveData();
        }}
      >
        Save
      </CButton>
    </div>
  );
}

export default StudentView;
