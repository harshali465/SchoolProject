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

function StudentTable() {
  const token = localStorage.getItem("accessToken");
  const getUsers = async () => {
    try {
      // const token =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU";

      const response = await axios.get("http://localhost:3001/api/v1/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          role: "student",
        },
      });

      console.log(response);
      setdummystudents(response.data.data.docs);
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
  // {
  //   id: 1,
  //   name: "John Doe",
  //   class: "Grade 5",
  //   division: "A",
  //   behaviorPoints: 450,
  //   status: "active",
  //   selected: false,
  // },
  // {
  //   id: 2,
  //   name: "Alice Smith",
  //   class: "Grade 6",
  //   division: "B",
  //   behaviorPoints: 380,
  //   status: "active",
  //   selected: false,
  // },
  // {
  //   id: 3,
  //   name: "Bob Johnson",
  //   class: "Grade 5",
  //   division: "A",
  //   behaviorPoints: 510,
  //   status: "inactive",
  //   selected: false,
  // },
  // {
  //   id: 4,
  //   name: "Eva Wilson",
  //   class: "Grade 6",
  //   division: "C",
  //   behaviorPoints: 420,
  //   status: "active",
  //   selected: false,
  // },
  // {
  //   id: 5,
  //   name: "Mike Brown",
  //   class: "Grade 7",
  //   division: "A",
  //   behaviorPoints: 320,
  //   status: "inactive",
  //   selected: false,
  // },
  // {
  //   id: 6,
  //   name: "Linda Davis",
  //   class: "Grade 7",
  //   division: "B",
  //   behaviorPoints: 480,
  //   status: "active",
  //   selected: false,
  // },
  // {
  //   id: 7,
  //   name: "Chris Lee",
  //   class: "Grade 5",
  //   division: "B",
  //   behaviorPoints: 390,
  //   status: "inactive",
  //   selected: false,
  // },
  // {
  //   id: 8,
  //   name: "Emily Wilson",
  //   class: "Grade 6",
  //   division: "A",
  //   behaviorPoints: 550,
  //   status: "active",
  //   selected: false,
  // },
  // ]);

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

  const markActive = async () => {
    // const token =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU";

    try {
      const response = await axios.patch(
        "http://localhost:3001/api/v1/users/student",
        {
          ids: collecIds,
          active: true,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    const updatedStudents = dummystudents.map((student) =>
      student.selected ? { ...student, active: true } : student
    );
    setdummystudents(updatedStudents);
  };

  const markInactive = async () => {
    // const token =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU";

    try {
      const response = await axios.patch(
        "http://localhost:3001/api/v1/users/student",
        {
          ids: collecIds,
          active: false,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    const updatedStudents = dummystudents.map((student) =>
      student.selected ? { ...student, active: false } : student
    );
    setdummystudents(updatedStudents);
  };

  const deleteSelected = async () => {
    // const token =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU";

    try {
      const response = await axios.delete(
        "http://localhost:3001/api/v1/users/student",
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
    navigate("/editstudent", {
      state: { studentid: studentid },
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
      student.firstName.toLowerCase().includes(filterKeyword.toLowerCase()) &&
      (filterClass === "" || student.class === filterClass) &&
      (filterDivision === "" || student.division === filterDivision) &&
      (filterMinBehaviorPoints === "" ||
        student.behaviousPoints.positivePoints -
          student.behaviousPoints.negativePoints >=
          parseInt(filterMinBehaviorPoints)) &&
      (filterMaxBehaviorPoints === "" ||
        student.behaviousPoints.positivePoints -
          student.behaviousPoints.negativePoints <=
          parseInt(filterMaxBehaviorPoints))
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
    navigate("/addstudent");
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
            Delete students
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you wish to delete the student/students?
        </CModalBody>
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
            <div className="display-6 pb-3 float-end">Student listing</div>
          </div>

          <div className="col-md-6 ">
            <button
              className="btn btn-primary float-end"
              onClick={() => {
                redirectto();
              }}
            >
              Add student
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
            <option value="">All Classes</option>
            <option>Grade 2</option>
            <option>Grade 3</option>
            <option>Grade 1</option>
          </select>
          <select
            className="form-select"
            value={filterDivision}
            onChange={(e) => setFilterDivision(e.target.value)}
          >
            <option value="">All Divisions</option>
            <option>div A</option>
            <option>div B</option>
            <option>div C</option>
          </select>
          <input
            className="form-control"
            type="text"
            placeholder="Min Behavior Points"
            value={filterMinBehaviorPoints}
            onChange={(e) => setFilterMinBehaviorPoints(e.target.value)}
          />
          <input
            className="form-control"
            type="text"
            placeholder="Max Behavior Points"
            value={filterMaxBehaviorPoints}
            onChange={(e) => setFilterMaxBehaviorPoints(e.target.value)}
          />
        </div>
      </div>

      {/* buttons for action */}

      <div className="pb-4 flex-wrap">
        <button className="btn btn-primary btn-md " onClick={markActive}>
          Mark Active
        </button>
        <button className="btn btn-dark btn-md " onClick={markInactive}>
          Mark Inactive
        </button>
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
            <th className="text-center">Name</th>
            <th className="text-center">Class</th>
            <th className="text-center">Division</th>
            <th className="text-center">Behavior Points</th>
            <th className="text-center">Status</th>
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
                  {student.firstName}
                </td>
                <td className="text-center align-middle">{student.class}</td>
                <td className="text-center align-middle">{student.division}</td>
                <td className="text-center align-middle">
                  {student.behaviousPoints.positivePoints -
                    student.behaviousPoints.negativePoints}
                </td>
                <td className="text-center align-middle">
                  {student.active ? "active" : "inactive"}
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

export default StudentTable;
