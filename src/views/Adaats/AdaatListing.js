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

function CategoryListing() {
  const getUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://18.118.42.224:3001/api/v1/aadat",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.data.docs);
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
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.delete(
        "http://18.118.42.224:3001/api/v1/aadat",
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

  const editStudent = (catid) => {
    navigate("/editadaat", {
      state: { catid: catid },
    });
  };

  //   filter states
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterActive, setfilterActive] = useState("");
  const [tableState, setTableState] = useState(false);
  const [filterDivision, setFilterDivision] = useState("");
  const [filterMinBehaviorPoints, setFilterMinBehaviorPoints] = useState("");
  const [filterMaxBehaviorPoints, setFilterMaxBehaviorPoints] = useState("");

  const handleFilterClick = () => {
    setTableState((prevState) => !prevState);
  };

  //   function calling in the table
  const applyFilters = (student) => {
    const keywordMatch = student.name
      .toLowerCase()
      .includes(filterKeyword.toLowerCase());
    const isActiveMatch =
      filterActive === "" || student.active === filterActive;

    return keywordMatch && isActiveMatch;
  };

  const filterFunction = () => {};

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

  const redirectto = () => {
    navigate("/addadaat");
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
            Delete Adaat
          </CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you wish to delete this Adaat?</CModalBody>
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
            <div className="display-6 pb-3 float-end">Adaat listing</div>
          </div>

          <div className="col-md-6 ">
            <button
              className="btn btn-primary float-end"
              onClick={() => {
                redirectto();
              }}
            >
              Add Adaat
            </button>
          </div>
        </div>
        {/* filters */}
        <div className="filters d-flex">
          <input
            className="form-control"
            type="text"
            placeholder="Search by keyword"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* buttons for action */}

      <div className="pb-4 d-flex justify-content-start align-items-center">
        <div className="p-2">
          <CFormCheck
            type="radio"
            id="flexCheckDefault"
            label="Active"
            checked={filterActive === "" ? false : filterActive ? true : false}
            onClick={() => {
              setfilterActive(true);
            }}
          />
        </div>
        <div className="p-2">
          <CFormCheck
            type="radio"
            id="flexCheckDefault"
            label="Inactive"
            checked={filterActive === "" ? false : filterActive ? false : true}
            onClick={() => {
              setfilterActive(false);
            }}
          />
        </div>

        {filterActive !== "" && (
          <button
            className="btn btn-dark btn-md "
            onClick={() => {
              setfilterActive("");
            }}
          >
            Show all
          </button>
        )}

        <button
          className="btn btn-dark btn-md "
          onClick={() => {
            setVisible(!visible);
          }}
        >
          Delete Selected
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
            <th className="text-center">Name of Adaat</th>
            <th className="text-center">Adaat Category</th>
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
                <td className="text-center align-middle">{student.name}</td>
                <td className="text-center align-middle">
                  {student.category.name}
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

export default CategoryListing;
