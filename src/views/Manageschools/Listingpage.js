// import React, { useState, useEffect } from "react";
// import { Fragment } from "react";
// import axios from "axios";
// import "./custom.css";
// import { useNavigate } from "react-router-dom";
// import { MDBDataTableV5, MDBBtn } from "mdbreact";

// // imports for modal
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CButton,
// } from "@coreui/react";

// import "@fortawesome/fontawesome-free/css/all.min.css";
// import "bootstrap-css-only/css/bootstrap.min.css";
// import "mdbreact/dist/css/mdb.css";

// function Listingpage() {
//   const navigate = useNavigate();

//   const [schools, setschools] = useState([]);
//   const [checkedschools, setCheckedSchools] = useState([]);
//   const [visible, setVisible] = useState(false);
//   const [DeleteSchoolId, setDeleteSchoolId] = useState("");

//   useEffect(() => {
//     getallshools();
//   }, [schools]);

//   const getallshools = async () => {
//     const res = await axios.get("http://18.118.42.224:3001/api/v1/schools/getall");
//     setschools(res.data.school);
//   };

//   useEffect(() => {
//     setDatatable({
//       ...datatable,
//       rows: schools.map((school, index) => ({
//         check: (
//           <div className="d-flex align-items-center justify-content-center">
//             <input
//               class="form-check-input"
//               type="checkbox"
//               value=""
//               id="flexCheckDefault"
//               name={`nr${index}`}
//               onChange={() => toggleCheck(`nr${index}`, school)}
//               checked={checked[`nr${index}`]}
//               // onChange={(e) => {
//               //   if (e.target.checked) {
//               //     setCheckedSchools((prevState) => [...prevState, school._id]);
//               //   } else {
//               //     setCheckedSchools((prevState) =>
//               //       prevState.filter((id) => id !== school._id)
//               //     );
//               //   }
//               // }}
//             ></input>
//           </div>
//         ),
//         "Sr no": index + 1,
//         "Name of School": school.schoolName,
//         "Number of students": school.numberOfStudents,
//         Action: (
//           <div>
//             <button className="btn btn-sm" onClick={() => editfnc(school._id)}>
//               Edit
//             </button>
//             <button
//               className="btn btn-sm"
//               // onClick={() => deletefnc(school._id)}
//               onClick={() => {
//                 setVisible(!visible);
//                 setDeleteSchoolId(school._id);
//               }}
//             >
//               Delete
//             </button>
//           </div>
//         ),
//       })),
//     });
//   }, [schools]);

//   const consoleschools = () => {
//     console.log(schools);
//   };

//   const editfnc = (schoolid) => {
//     navigate("/editschool", {
//       state: { schoolid: schoolid },
//     });
//   };
//   const deletefnc = async (id) => {
//     try {
//       console.log(id);
//       const response = await axios.delete(
//         `http://18.118.42.224:3001/api/v1/schools/delete/${id}`
//       );
//       setschools(schools.filter((school) => school._id !== id));
//       console.log(response.data);
//       setVisible(false);
//     } catch (error) {
//       console.error(error);
//       setVisible(false);
//     }
//   };
//   const redirectto = () => {
//     navigate("/addschool");
//   };

//   // table functions

//   const [checked, setChecked] = useState({});

//   const toggleCheck = (inputName, school) => {
//     setChecked((prevState) => {
//       const newState = { ...prevState };
//       if (newState[inputName] === true) {
//         setCheckedSchools((prevState) =>
//           prevState.filter((id) => id !== school._id)
//         );
//       } else {
//         setCheckedSchools((prevState) => [...prevState, school._id]);
//       }
//       newState[inputName] = !prevState[inputName];
//       return newState;
//     });
//   };

//   //  no checkboxes for now
//   // data for table

//   const [datatable, setDatatable] = useState({
//     columns: [
//       {
//         label: (
//           <div className="checkbox-container ">
//             <input
//               class="form-check-input sorting"
//               type="checkbox"
//               id="new"
//               onChange={consoleschools}
//             />
//           </div>
//         ),
//         field: "check",
//         sort: "disabled",
//         width: 10,
//       },
//       {
//         label: "Sr no",
//         field: "Sr no",
//         sort: "asc",
//         width: 100,
//       },
//       {
//         label: "Name of School",
//         field: "Name of School",
//         width: 150,
//         attributes: {
//           "aria-controls": "DataTable",
//           "aria-label": "Name",
//         },
//       },
//       {
//         label: "Number of students",
//         field: "Number of students",
//         width: 270,
//       },
//       {
//         label: "Action",
//         field: "Action",
//         width: 200,
//       },
//     ],
//     rows: [],
//   });

//   return (
//     <div className="container h-100">
//       {/* modal */}
//       <CModal
//         backdrop="static"
//         visible={visible}
//         onClose={() => setVisible(false)}
//         aria-labelledby="StaticBackdropExampleLabel"
//       >
//         <CModalHeader>
//           <CModalTitle id="StaticBackdropExampleLabel">
//             Delete school
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>Are you sure you wish to delete this school?</CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setVisible(false)}>
//             Close
//           </CButton>
//           <CButton color="primary" onClick={() => deletefnc(DeleteSchoolId)}>
//             Yes!
//           </CButton>
//         </CModalFooter>
//       </CModal>
//       <div className="display-4 text-center pb-3 mb-5">Schools</div>
//       <div className="main-container d-flex w-50 mx-auto mb-3">
//         <div className="heading-div">
//           <div className="display-6 pb-3">School listing</div>
//         </div>

//         <div className="d-flex align-items-center button-div">
//           <button
//             className="btn btn-primary btn-sm"
//             onClick={() => {
//               redirectto();
//             }}
//           >
//             Add school
//           </button>
//         </div>
//       </div>

//       {/* <table className="table w-50 mx-auto table-striped table-hover">
//         <thead className="thead-dark text-center">
//           <tr>
//             <th scope="col">Sr.No</th>
//             <th scope="col">Name of school</th>
//             <th scope="col">Number of students</th>
//             <th scope="col">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {schools.map((school) => (
//             <tr key={sount++} className="text-center">
//               <td>{count++}</td>
//               <td>{school.schoolName}</td>
//               <td>{school.numberOfStudents}</td>
//               <td className="d-flex justify-content-between">
//                 <button
//                   className="btn-primary btn"
//                   onClick={() => {
//                     editfnc(school._id);
//                   }}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="btn-dark btn"
//                   onClick={() => {
//                     deletefnc(school._id);
//                   }}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table> */}
//       <div className="container d-flex justify-content-center">
//         <MDBDataTableV5
//           hover
//           entriesOptions={[1, 4, 10]}
//           entries={2} ///it starts with 2 (on load)
//           pagesAmount={2}
//           data={datatable}
//         />
//       </div>
//     </div>
//   );
// }

// export default Listingpage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
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
  CContainer,
  CPagination,
  CPaginationItem,
} from "@coreui/react";
import axios from "axios";
// imports for modal
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

function SchoolTable() {
  const token = localStorage.getItem("accessToken");
  const getUsers = async () => {
    try {
      // const token =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU";

      const response = await axios.get(
        "http://18.118.42.224:3001/api/v1/schools/getall",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.school);
      setdummystudents(response.data.school);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  const navigate = useNavigate();
  const [dummystudents, setdummystudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [visible, setVisible] = useState(false);

  const [selectAll, setSelectAll] = useState(false);
  const [collecIds, setcollecIds] = useState([]);

  const toggleSelectAll = () => {
    setcollecIds([]);

    if (!selectAll) {
      const selectedIds = dummystudents.map((student) => student._id);
      setcollecIds(selectedIds);
    } else {
      setcollecIds([]);
    }
    // setting frontend to checked
    setSelectAll(!selectAll);
    setdummystudents((prevStudents) =>
      prevStudents.map((student) => ({ ...student, selected: !selectAll }))
    );
  };

  const handleSelect = async (index) => {
    const updatedStudents = [...dummystudents];
    if (updatedStudents[index].selected === false) {
      setcollecIds([...collecIds, updatedStudents[index]._id]);
    } else {
      setcollecIds((prevCollecIds) =>
        prevCollecIds.filter((id) => id !== updatedStudents[index]._id)
      );
    }

    updatedStudents[index].selected = !updatedStudents[index].selected;
    setdummystudents(updatedStudents);
  };

  const deleteSelected = async () => {
    // const token =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU";

    try {
      const response = await axios.delete(
        "http://18.118.42.224:3001/api/v1/schools/delete",
        {
          data: { ids: collecIds },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      setVisible(false);
    } catch (error) {
      console.error(error);
    }
    getUsers();
    // const updatedStudents =
    // dummystudents.filter(
    //   (student) => !student.selected
    // );
    // setdummystudents(updatedStudents);
  };

  const editStudent = (studentid) => {
    navigate("/editschool", {
      state: { schoolid: studentid },
    });
  };

  //   filter states
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterDivision, setFilterDivision] = useState("");
  const [filterMinBehaviorPoints, setFilterMinBehaviorPoints] = useState("");
  const [filterMaxBehaviorPoints, setFilterMaxBehaviorPoints] = useState("");

  //   function calling in the table
  const applyFilters = (student) => {
    // Apply filters to the student based on filter values
    return (
      student.schoolName.toLowerCase().includes(filterKeyword.toLowerCase()) &&
      (filterClass === "" || student.schoolName === filterClass) &&
      (filterDivision === "" || student.division === filterDivision) &&
      (filterMinBehaviorPoints === "" ||
        student.numberOfStudents >= parseInt(filterMinBehaviorPoints)) &&
      (filterMaxBehaviorPoints === "" ||
        student.numberOfStudents <= parseInt(filterMaxBehaviorPoints))
    );
  };

  //   pagination

  //   const [pageSize] = useState(4);
  const [pageSize, setpageSize] = useState(students.length);
  const [currentPage, setCurrentPage] = useState(1); // Current page, starts at 1

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Calculate the range of students to display based on the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedStudents = students.slice(startIndex, endIndex);

  const numPages = Math.ceil(students.length / pageSize);

  //   exporting to excel sheet

  const exportToCSV = () => {
    const selectedStudents = dummystudents.filter(
      (student) => student.selected
    );
    const headers = ["Name", "Class", "Division", "Behavior Points", "Status"];
    const csvData = [headers].concat(
      selectedStudents.map((student) => [
        student.firstName,
        student.class,
        student.division,
        student.behaviousPoints.positivePoints -
          student.behaviousPoints.negativePoints,
        student.active ? "Active" : "Inactive",
      ])
    );

    // Convert the data to a CSV string
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Create a download link
    const a = document.createElement("a");
    a.href = url;
    a.download = "selected_students.csv"; // File name
    a.style.display = "none";
    document.body.appendChild(a);

    a.click(); // Trigger the download
    URL.revokeObjectURL(url); // Release the object URL
    document.body.removeChild(a);
  };

  const redirectto = () => {
    navigate("/addschool");
  };

  return (
    <div>
      {/* modal */}
      <CModal
        backdrop="static"
        visible={visible}
        onClose={() => {
          setVisible(false);
          setcollecIds([]);
        }}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">
            Delete schools
          </CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you wish to delete the schools?</CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setVisible(false);
              setcollecIds([]);
            }}
          >
            Close
          </CButton>
          <CButton color="primary" onClick={() => deleteSelected()}>
            Yes!
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Filters */}
      <div className="mb-2">
        <div className="row pb-5">
          <div className="col-md-6 ">
            <div className="display-6 pb-3 float-end">School listing</div>
          </div>

          <div className="col-md-6 ">
            <button
              className="btn btn-primary float-end"
              onClick={() => {
                redirectto();
              }}
            >
              Add School
            </button>
          </div>
        </div>
        {/* filters */}
        <div className="filters d-flex justify-content-between">
          <input
            className="form-control"
            type="text"
            placeholder="Search by keyword"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
          />
          <select
            className="form-select"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="">Show all schools</option>
            {/* <option>Grade 2</option>
            <option>Grade 3</option>
            <option>Grade 1</option> */}
            {dummystudents.map((student) => (
              <option>{student.schoolName}</option>
            ))}
          </select>

          <input
            className="form-control"
            type="text"
            placeholder="Min no of students"
            value={filterMinBehaviorPoints}
            onChange={(e) => setFilterMinBehaviorPoints(e.target.value)}
          />
          <input
            className="form-control"
            type="text"
            placeholder="Max no of students"
            value={filterMaxBehaviorPoints}
            onChange={(e) => setFilterMaxBehaviorPoints(e.target.value)}
          />
        </div>
      </div>

      {/* buttons for action */}

      <div className="pb-4 flex-wrap">
        <button
          className="btn btn-dark btn-md "
          onClick={() => {
            setVisible(!visible);
          }}
        >
          Delete Selected
        </button>
        <button
          className="btn btn-success btn-md float-end"
          onClick={exportToCSV}
        >
          Export to Excel
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th className="text-center">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="text-center">Name of School</th>
            <th className="text-center">Number of students</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {dummystudents
            .filter((student) => applyFilters(student))
            .map((student, index) => (
              <tr key={index}>
                <td className="text-center align-middle">
                  <input
                    type="checkbox"
                    checked={student.selected}
                    onChange={() => handleSelect(index)}
                  />
                </td>
                <td className="text-center align-middle">
                  {student.schoolName}
                </td>

                <td className="text-center align-middle">
                  {student.numberOfStudents}
                </td>
                <td className="text-center align-middle">
                  <button
                    className="btn btn-primary btn-md"
                    onClick={() => {
                      editStudent(student._id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-dark btn-md"
                    onClick={() => {
                      setcollecIds([]);
                      setcollecIds([student._id]);
                      setVisible(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="pagination">
        <CPagination aria-label="Page navigation">
          <CPaginationItem
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </CPaginationItem>
          {Array.from({ length: numPages }, (_, i) => (
            <CPaginationItem
              key={i}
              active={currentPage === i + 1}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </CPaginationItem>
          ))}
          <CPaginationItem
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(students.length / pageSize)}
          >
            Next
          </CPaginationItem>

          <div className="d-flex">
            <CPaginationItem>Entries:</CPaginationItem>
            <CPaginationItem>
              <select
                value={pageSize}
                onChange={(e) => setpageSize(e.target.value)}
              >
                <option value="2">2</option>
                <option value="4">4</option>
                <option value={students.length}>all</option>
                {/* Add more options as needed */}
              </select>
            </CPaginationItem>
          </div>
        </CPagination>
      </div>
    </div>
  );
}

export default SchoolTable;
