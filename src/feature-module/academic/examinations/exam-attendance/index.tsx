import React, { useRef } from "react";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import CommonSelect from "../../../../core/common/commonSelect";
import {
  allClass,
  classSection,
  weeklytest,
} from "../../../../core/common/selectoption/selectoption";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import TooltipOption from "../../../../core/common/tooltipOption";
import { examattendance } from "../../../../core/data/json/exam_attendance";
import { TableData } from "../../../../core/data/interface";
import Table from "../../../../core/common/dataTable/index";

const ExamAttendance = () => {
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const routes = all_routes;
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  const data = examattendance;
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: string, record: any, index: number) => (
        <>
          <Link to="#" className="link-primary">
            {record.id}
          </Link>
        </>
      ),
      sorter: (a: any, b: any) => a.id.length - b.id.length,
    },
    {
      title: "Student Name",
      dataIndex: "studentName",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link to={routes.studentDetail} className="avatar avatar-md">
            <ImageWithBasePath
              src={record.img}
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to={routes.studentDetail}>{text}</Link>
            </p>
            <span className="fs-12">{record.rollNo}</span>
          </div>
        </div>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.studentName.length - b.studentName.length,
    },
    {
      title: "English",
      dataIndex: "english",
      render: (text: string, record: any, index: number) => (
        <>
          {text === "green" ? (
           <span className="attendance-range bg-success">
            </span>
          ) : (
            <span className="attendance-range bg-danger">
          </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.english.length - b.english.length,
    },
    {
      title: "Spanish",
      dataIndex: "spanish",
      render: (text: string, record: any, index: number) => (
        <>
          {text === "green" ? (
           <span className="attendance-range bg-success">
            </span>
          ) : (
            <span className="attendance-range bg-danger">
          </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.spanish.length - b.spanish.length,
    },
    {
      title: "Physics",
      dataIndex: "physics",
      render: (text: string, record: any, index: number) => (
        <>
          {text === "green" ? (
           <span className="attendance-range bg-success">
            </span>
          ) : (
            <span className="attendance-range bg-pending">
          </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.physics.length - b.physics.length,
    },
    {
      title: "Chemistry",
      dataIndex: "chemistry",
      render: (text: string, record: any, index: number) => (
        <>
          {text === "green" ? (
           <span className="attendance-range bg-success">
            </span>
          ) : (
            <span className="attendance-range bg-pending">
          </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.chemistry.length - b.chemistry.length,
    },
    {
      title: "Maths",
      dataIndex: "maths",
      render: (text: string, record: any, index: number) => (
        <>
          {text === "green" ? (
           <span className="attendance-range bg-success">
            </span>
          ) : (
            <span className="attendance-range bg-pending">
          </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.maths.length - b.maths.length,
    },
    {
      title: "Computer",
      dataIndex: "computer",
      render: (text: string, record: any, index: number) => (
        <>
          {text === "green" ? (
           <span className="attendance-range bg-success">
            </span>
          ) : (
            <span className="attendance-range bg-danger">
          </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.computer.length - b.computer.length,
    },
    {
      title: "Env Science",
      dataIndex: "envScience",
      render: (text: string, record: any, index: number) => (
        <>
          {text === "green" ? (
           <span className="attendance-range bg-success">
            </span>
          ) : (
            <span className="attendance-range bg-pending">
          </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.envScience.length - b.envScience.length,
    },
    
  ];
  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Exam Attendance</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">Report</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Exam Attendance
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              </div>
            </div>
            {/* /Page Header */}
            <div className="attendance-types page-header justify-content-end">
              <ul className="attendance-type-list">
                <li>
                  <span className="attendance-icon bg-success">
                    <i className="ti ti-checks" />
                  </span>
                  Present
                </li>
                <li>
                  <span className="attendance-icon bg-danger">
                    <i className="ti ti-x" />
                  </span>
                  Absent
                </li>
                <li>
                  <span className="attendance-icon bg-pending">
                    <i className="ti ti-clock-x" />
                  </span>
                  Late
                </li>
              </ul>
            </div>
            {/* Attendance List */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Exam Attendance</h4>
                <div className="d-flex align-items-center flex-wrap">
                  <div className="input-icon-start mb-3 me-2 position-relative">
                    {/*<PredefinedDateRanges /> */}
                  </div>
                  <div className="dropdown mb-3 me-2">
                    <Link
                      to="#"
                      className="btn btn-outline-light bg-white dropdown-toggle"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                    >
                      <i className="ti ti-filter me-2" />
                      Filter
                    </Link>
                    <div className="dropdown-menu drop-width">
                      <form>
                        <div className="d-flex align-items-center border-bottom p-3">
                          <h4>Filter</h4>
                        </div>
                        <div className="p-3 border-bottom pb-0">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Class</label>
                                <CommonSelect
                                  className="select"
                                  options={allClass}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Section</label>
                                <CommonSelect
                                  className="select"
                                  options={classSection}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Exam Type</label>
                                <CommonSelect
                                  className="select"
                                  options={weeklytest}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 d-flex align-items-center justify-content-end">
                          <Link to="#" className="btn btn-light me-3">
                            Reset
                          </Link>
                          <Link
                            to={routes.studentGrid}
                            className="btn btn-primary"
                            onClick={handleApplyClick}
                          >
                            Apply
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="dropdown mb-3">
                    <Link
                      to="#"
                      className="btn btn-outline-light bg-white dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-sort-ascending-2 me-2" />
                      Sort by A-Z
                    </Link>
                    <ul className="dropdown-menu p-3">
                      <li>
                        <Link to="#" className="dropdown-item rounded-1 active">
                          Ascending
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          Descending
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          Recently Viewed
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          Recently Added
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body p-0 py-3">
                {/* Student List */}
                <Table columns={columns} dataSource={data} Selection={true} />
                {/* /Student List */}
              </div>
            </div>
            {/* /Attendance List */}
          </div>
        </div>
        {/* /Page Wrapper */}
      </>
    </div>
  );
};

export default ExamAttendance;
