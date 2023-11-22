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
  const getAadatsforStudent = async () => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU";

      const res = await axios.get(
        `http://localhost:3001/api/v1/users/${authState.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data.data.class);
      setstudent(res.data.data);

      const response = await axios.get("http://localhost:3001/api/v1/aadat", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          class: res.data.data.class,
        },
      });

      console.log(response.data.data.docs);
      setadaats(response.data.data.docs);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // usestates for all types of adaats
  const [DailyAdaats, setDailyAdaats] = useState([]);

  const remindUsersdaily = () => {
    const currentDate = new Date(); // Get current date

    // Filter habits for today
    const dailyAdaats = adaats.filter(
      (adaat) =>
        adaat.repetation === "daily" &&
        adaat.endDate &&
        new Date(adaat.endDate) >= currentDate
    );
    setDailyAdaats(dailyAdaats);
    // Remind users about habits for today
    dailyAdaats.forEach((adaat) => {
      console.log(`Reminder: Complete habit "${adaat.name}" today!`);
    });
  };
  useEffect(() => {
    getAadatsforStudent();
    remindUsersdaily();
  }, [authState.id, authState.role]);

  if (!student) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  // setinterval for daily
  // setInterval(() => {
  //   const now = new Date();
  //   if (now.getHours() === 0 && now.getMinutes() === 0) {
  //     remindUsersdaily();
  //   }
  // }, 24 * 60 * 60 * 1000); // Check every 24 hours

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
      {adaats.map((adaat) => (
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
                        name="yesno"
                        onChange={null}
                      />

                      <CFormCheck
                        id="flexCheckDefault"
                        label="no"
                        type="radio"
                        name="yesno"
                        onChange={null}
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
                        ></textarea>
                        <label for="floatingTextarea">remark box</label>
                      </div>
                    </div>
                  );
                default:
                  return null;
              }
            })()}
          </CCardBody>
        </CCard>
      ))}
    </div>
  );
}

export default StudentView;
