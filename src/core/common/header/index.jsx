import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import user1 from "../assets/images/users/user4.jpg";
import user1 from "../../../image/images/users/user4.jpg";
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  setDataLayout,
  setDataTheme,
} from "../../data/redux/themeSettingSlice";
import ImageWithBasePath from "../imageWithBasePath";
import { FaAngleDown } from "react-icons/fa6";

import {
  setExpandMenu,
  setMobileSidebar,
  toggleMiniSidebar,
} from "../../data/redux/sidebarSlice";
import { useContext, useEffect, useState } from "react";
import { all_routes } from "../../../feature-module/router/all_routes";
import { AuthContext } from "../../../feature-module/helper/AuthState";
import axios from "axios";
const Header = () => {
  const routes = all_routes;
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };
  const location = useLocation();

  const academicYearIddata = localStorage.getItem("academicYearId");
  const [startYearId, setStartYearId] = useState(academicYearIddata);
  const [startYear, setStartYear] = useState(academicYearIddata);

  const navigate = useNavigate();
  const { authState, setAuthState } = useContext(AuthContext);
  const [siblings, setSiblings] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [token] = useState(localStorage.getItem("accessToken"));
  const [studentName, setStudentName] = useState(authState.name);
  const [studentNamefirst, setStudentNamefirst] = useState(authState.name);

  const [SchoolName, setSchoolName] = useState("");
  const [father, setfather] = useState("");
  const [SchoolLogo, setSchoolLogo] = useState("");
  const dispatch = useDispatch();
  const dataTheme = useSelector((state) => state.themeSetting.dataTheme);
  const dataLayout = useSelector((state) => state.themeSetting.dataLayout);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const currentPath = location?.pathname;
  const [totalvalue, setTotalValue] = useState("");
  const [allyear, setAllYear] = useState([]);

  const mobileSidebar = useSelector(
    (state) => state.sidebarSlice.mobileSidebar
  );
  const changeStudent = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/users/siblings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response?.data?.status === "success") {
        localStorage.setItem("userId", id);
        localStorage.setItem("accessToken", response.data?.token);

        window.location.reload()
     }
    } catch (error) {}
  };
  // useeffect for academic year

  useEffect(() => {
    if (academicYearIddata !== startYearId) {
      const updatedStartYear = academicYearIddata;
      setAuthState((prevState) => ({
        ...prevState,
        startYearId: startYearId,
        startYear: academicYearIddata,
      }));
    } else {
      setAuthState((prevState) => ({
        ...prevState,
        startYearId: academicYearIddata,

        startYear: academicYearIddata,
      }));
    }
  }, [authState.startYearId, startYearId]);

  const getModules = async () => {
    // setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/academics/academic-year`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllYear(response?.data?.data);

      setTotalValue(response?.data?.results);
      // setDummyModules(response.data.data || []); // Check if data structure is correct
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching houses:", error);
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (allyear) {
      const academicYearIddata = localStorage.getItem("academicYearId");

      const startYears =
        allyear?.find((data) => data._id === academicYearIddata)?.start_year &&
        `${new Date(
          allyear?.find((data) => data._id === academicYearIddata)?.start_year
        ).getFullYear()} / ${new Date(
          allyear?.find((data) => data._id === academicYearIddata)?.end_year
        ).getFullYear()}`;

      setStartYear(startYears);
    }
  }, [allyear]);

  useEffect(() => {
    if (authState.academiclenth !== totalvalue) {
      getModules();
    }
    getModules();
  }, [authState.academiclenth]);

  useEffect(() => {
    const userInhead = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/school/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res?.data?.data?.photo) {
          setPhoto(
            `${process.env.REACT_APP_DEV_BASE_URL}/uploads/${res?.data?.data?.photo}`
          );
        }

        setStudentName(
          `${res.data.data?.firstName} ${res.data.data?.lastName}`
        );
        setStudentNamefirst(
          `${res.data.data?.firstName} `
        );
        setSchoolName(res.data.data?.schoolName);
        setSchoolLogo(res.data.data?.schoolLogo);
        localStorage.setItem("imgUrl", res.data.data?.schoolLogo || "");
        const userId = localStorage.getItem("userId");
        const filteredSiblings = res.data.data.siblings?.members?.filter(
          (member) => member._id !== userId
        );
  
        setSiblings(filteredSiblings);

        // setSiblings(res.data.data.siblings?.members);
        setfather(
          res.data.data.familyDetails?.fatherFirstName +
            " " +
            res.data.data.familyDetails?.fatherLastName
        );
        if (res?.data?.data?.photo) {
          setPhoto(
            `${process.env?.REACT_APP_DEV_BASE_URL}/uploads/${res.data.data?.photo}`
          );
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    userInhead();
  }, [authState.id, authState.name]);

  const toggleMobileSidebar = () => {
    dispatch(setMobileSidebar(!mobileSidebar));
  };
  const changepassword = () => {
    navigate("/change-password");
  };
  const logout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    // navigate("/");
    navigate(
      `/student/login/${localStorage.getItem(
        "schoolName"
      )}/${localStorage.getItem("uniqueId")}`
    );
  };
  const onMouseEnter = () => {
    dispatch(setExpandMenu(true));
  };
  const onMouseLeave = () => {
    dispatch(setExpandMenu(false));
  };
  const handleToggleMiniSidebar = () => {
    if (dataLayout === "mini_layout") {
      dispatch(setDataLayout("default_layout"));
      localStorage.setItem("dataLayout", "default_layout");
    } else {
      dispatch(toggleMiniSidebar());
    }
  };

  const handleToggleClick = () => {
    if (dataTheme === "default_data_theme") {
      dispatch(setDataTheme("dark_data_theme"));
      // localStorage.setItem(dataTheme,"dark_data_theme")
    } else {
      dispatch(setDataTheme("default_data_theme"));
      // localStorage.removeItem(dataTheme)
    }
  };
  const toggleNotification = () => {
    setNotificationVisible(!notificationVisible);
  };

  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {});
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch((err) => {});
        }
        setIsFullscreen(false);
      }
    }
  };

  // Find the selected year range from allyear using the startYear ID

  return (
    <>
      {/* Header */}
      <div className="header" style={{ maxWidth: "100vw" }}>
        {/* Logo */}
        <div
          className="header-left active"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {/* <Link to={routes.adminDashboard} className="logo logo-normal">
            <ImageWithBasePath src="assets/img/logo.svg" alt="Logo" />
          </Link> */}
          {/* <Link to={routes.adminDashboard} className="logo-small">
            <ImageWithBasePath src="assets/img/logo-small.svg" alt="Logo" />
          </Link>
          <Link to={routes.adminDashboard} className="dark-logo">
            <ImageWithBasePath src="assets/img/logo-dark.svg" alt="Logo" />
          </Link> */}
          <Link id="toggle_btn" to="#" 
          onClick={handleToggleMiniSidebar}
          >
            <i className="ti ti-menu-deep" />
          </Link>
        </div>
        {/* /Logo */}
        <Link
          id="mobile_btn"
          className="mobile_btn"
          to="#sidebar"
          onClick={toggleMobileSidebar}
        >
          <span className="bar-icon">
            <span />
            <span />
            <span />
          </span>
        </Link>
        <div className="header-user">
          <div className="nav user-menu d-flex justify-content-end">
            <div className="d-flex align-items-center gap-3 ">
              {currentPath == "/behaviour/assign/assign-points" ||
              currentPath == "/school/editAadat" ||
              currentPath == "/school/create/category" ||
              currentPath == "/school/edit/category" ||
              currentPath == "/school/miqaat/create" ||
              currentPath == "/school/miqaat/edit" ||
              currentPath == "/school/add-working-days" ||
              currentPath == "/school/EditDay" ||
              currentPath == "/school/behaviour/point/add" ||
              currentPath == "/school/behaviour/Coupons/addCoupon" ||
              currentPath == "/school/behaviour/Coupons/editCoupon" ||
              currentPath == "/attendance/addattendance" ||
              currentPath == "/attendance/editattendance" ||
              currentPath == "/AddClassAttend" ||
              currentPath == "/EditClassAttend" ||
              currentPath == "/school/points/assign" ||
              currentPath == "/school/addStudent" ||
              currentPath == "/school/editStudent" ||
              currentPath == "/school/editStudent" ? (
                <> </>
              ) : (
                <>
                  <div className="dropdown me-2 academicyear_responsive">
                    <Link
                      to="#"
                      className="btn btn-outline-light fw-normal bg-white d-flex align-items-center p-2"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="ti ti-calendar-due me-1" />
                      <p className="d-flex">
                        {" "}
                        <span className="conditionaly_show">
                          Academic Year
                        </span>{" "}
                        : {startYear ? `${startYear}` : "Select year"}
                      </p>
                    </Link>
                    <div className="dropdown-menu dropdown-menu-right">
                      {allyear?.map((res, i) => {
                        const yearRange = `${new Date(
                          res?.start_year
                        ).getFullYear()} / ${new Date(
                          res?.end_year
                        ).getFullYear()}`;
                        return (
                          <button
                            key={i}
                            className="dropdown-item d-flex align-items-center"
                            onClick={() => {
                              setStartYear(yearRange);
                              setStartYearId(res._id);
                            }}
                          >
                            Academic Year : {yearRange}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {localStorage.getItem("user") === "student" && (
                <div
                  className="btn-group dropdown"
                  style={{ display: "inline-block" }}
                >
                  <button
                    type="button"
                    className="btn important-style btn-outline-primary dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {studentNamefirst}
                    <FaAngleDown style={{ marginLeft: "5px" }} />
                  </button>
                  <div className="dropdown-menu dropdown-menu-right">
                    {siblings &&
                      siblings.map((sib, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            if (sib.active) {
                              setAuthState({
                                id: sib._id,
                                name: sib.firstName,
                                lastname: sib.lastName,
                              });
                              changeStudent(sib._id);
                            }
                          }}
                          style={{
                            opacity: sib.active ? 1 : 0.5,
                          }}
                          className="dropdown-item d-inline-flex align-items-center p-2"
                        >
                          <span className="fw-bold">
                            {sib?.firstName}
                          </span>
                          {!sib.active && (
                            <span className="text-muted"> (Inactive)</span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* menu thing */}

              <div className="dropdown ms-1">
                <Link
                  to="#"
                  className="dropdown-toggle d-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  <span className="avatar avatar-md rounded">
                    <img
                      crossorigin={process.env.REACT_APP_DEV_BASE_URL}
                      src={photo ? photo : user1}
                      alt="Img"
                      className="img-fluid rounded"
                    />
                  </span>
                </Link>
                <div className="dropdown-menu">
                  <div className="d-block">
                    <div className="d-flex align-items-center p-2">
                      <span className="avatar avatar-md me-2 online avatar-rounded">
                        <img
                          crossorigin={process.env.REACT_APP_DEV_BASE_URL}
                          src={photo ? photo : user1}
                          alt="img"
                          className="img-fluid rounded-circle mright-20px"
                        />
                      </span>
                      <div>
                        <h6>{studentName}</h6>
                      </div>
                    </div>
                    <hr className="m-0" />
                    <Link
                      className="dropdown-item d-inline-flex align-items-center p-2"
                      to={
                        localStorage.getItem("user") === "student"
                          ? routes.EditProfile
                          : routes.teacher.EditProfileTeacher
                      }
                    >
                      <i className="ti ti-user-circle me-2" />
                      Edit Profile
                    </Link>
                    <Link
                      className="dropdown-item d-inline-flex align-items-center p-2"
                      to={
                        localStorage.getItem("user") === "student"
                          ? routes.EditPassword
                          : routes.teacher.EditPasswordTeacher
                      }
                    >
                      <i className="ti ti-settings me-2" />
                      Change Password
                    </Link>
                    <hr className="m-0" />
                    {localStorage.getItem("user") === "student" ? (
                      <>
                        {" "}
                        <Link
                          className="dropdown-item d-inline-flex align-items-center p-2"
                          to={`student/login/${localStorage.getItem(
                            "schoolName"
                          )}/${localStorage.getItem("uniqueId")}`}
                          onClick={() => {
                            localStorage.clear();
                          }}
                        >
                          <i className="ti ti-login me-2" />
                          Logout
                        </Link>
                      </>
                    ) : (
                      <>
                        {" "}
                        <Link
                          className="dropdown-item d-inline-flex align-items-center p-2"
                          to={`teacher/login/${localStorage.getItem(
                            "schoolName"
                          )}/${localStorage.getItem("uniqueId")}`}
                          onClick={() => {
                            localStorage.clear();
                          }}
                        >
                          <i className="ti ti-login me-2" />
                          Logout
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        <div
          className="dropdown mobile-user-menu d-flex gap-1 align-items-center"
          style={{ lineHeight: "18px" }}
        >
          <div className="dropdown    academicyear_responsive">
            <Link
              to="#"
              className="btn btn-outline-light fw-normal bg-white d-flex align-items-center p-2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="ti ti-calendar-due me-1" />
              <p className="d-flex font-size-responsive">
                {" "}
                <span className="conditionaly_show">Academic Year</span> :{" "}
                {startYear ? `${startYear}` : "Select year"}
              </p>
            </Link>
            <div className="dropdown-menu dropdown-menu-right">
              {allyear?.map((res, i) => {
                const yearRange = `${new Date(
                  res?.start_year
                ).getFullYear()} / ${new Date(res?.end_year).getFullYear()}`;
                return (
                  <button
                    key={i}
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => {
                      setStartYear(yearRange);
                      setStartYearId(res._id);
                    }}
                  >
                    Academic Year : {yearRange}
                  </button>
                );
              })}
            </div>
          </div>

          {localStorage.getItem("user") === "student" && (
            <div
              className="btn-group dropdown"
              style={{ display: "inline-block" }}
            >
              <button
                type="button"
                className="btn btn-outline-primary dropdown-toggle small-size-button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  fontWeight: "normal", // equivalent to $font-weight-normal
                  fontSize: "12px", // equivalent to $font-size-14
                  position: "relative", // to position the caret icon
                }}
              >
                {studentNamefirst}
              </button>
              <div className="dropdown-menu dropdown-menu-right">
                {siblings &&
                  siblings.map((sib, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        if (sib.active) {
                          setAuthState({
                            id: sib._id,
                            name: sib.firstName,
                            lastname: sib.lastName,
                          });
                          changeStudent(sib._id);
                        }
                      }}
                      style={{
                        opacity: sib.active ? 1 : 0.5,
                      }}
                      className="dropdown-item d-inline-flex align-items-center p-2"
                    >
                      <span className="fw-bold">
                        {sib?.firstName}
                      </span>
                      {!sib.active && (
                        <span className="text-muted"> (Inactive)</span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="dropdown ms-1" style={{ lineHeight: "18px" }}>
            <Link
              to="#"
              className="dropdown-toggle d-flex align-items-center"
              data-bs-toggle="dropdown"
              onClick={() => dispatch(setMobileSidebar(false))}
            >
              <span className="avatar avatar-md rounded">
                <img
                  crossorigin={process.env.REACT_APP_DEV_BASE_URL}
                  src={photo ? photo : user1}
                  alt="Img"
                  className="img-fluid rounded"
                />
              </span>
            </Link>
            <div className="dropdown-menu">
              <div className="d-block">
                <div className="d-flex align-items-center p-2">
                  <span className="avatar avatar-md me-2 online avatar-rounded">
                    <img
                      crossorigin={process.env.REACT_APP_DEV_BASE_URL}
                      src={photo ? photo : user1}
                      alt="img"
                      className="img-fluid rounded-circle mright-20px"
                    />
                  </span>
                  <div>
                    <h6>{studentName}</h6>
                  </div>
                </div>
                <hr className="m-0" />
                <Link
                  className="dropdown-item d-inline-flex align-items-center p-2"
                  style={{ lineHeight: "6px" }}
                  to={
                    localStorage.getItem("user") === "student"
                      ? routes.EditProfile
                      : routes.teacher.EditProfileTeacher
                  }
                >
                  <i className="ti ti-user-circle me-2" />
                  Edit Profile
                </Link>
                <Link
                  className="dropdown-item d-inline-flex align-items-center p-2"
                  style={{ lineHeight: "6px" }}
                  to={
                    localStorage.getItem("user") === "student"
                      ? routes.EditPassword
                      : routes.teacher.EditPasswordTeacher
                  }
                >
                  <i className="ti ti-settings me-2" />
                  Change Password
                </Link>
                <hr className="m-0" />
                {localStorage.getItem("user") === "student" ? (
                  <>
                    {" "}
                    <Link
                      className="dropdown-item d-inline-flex align-items-center p-2"
                      style={{ lineHeight: "6px" }}
                      to={`student/login/${localStorage.getItem(
                        "schoolName"
                      )}/${localStorage.getItem("uniqueId")}`}
                      onClick={() => {
                        localStorage.clear();
                      }}
                    >
                      <i className="ti ti-login me-2" />
                      Logout
                    </Link>
                  </>
                ) : (
                  <>
                    {" "}
                    <Link
                      className="dropdown-item d-inline-flex align-items-center p-2"
                      style={{ lineHeight: "6px" }}
                      to={`teacher/login/${localStorage.getItem(
                        "schoolName"
                      )}/${localStorage.getItem("uniqueId")}`}
                      onClick={() => {
                        localStorage.clear();
                      }}
                    >
                      <i className="ti ti-login me-2" />
                      Logout
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* <div className="dropdown me-2  academicyear_responsive">
            <Link
              to="#"
              className="btn btn-outline-light fw-normal bg-white d-flex align-items-center p-2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="ti ti-calendar-due me-1" />
              <p className="d-flex">
                {" "}
                <span className="conditionaly_show">Academic Year</span> :{" "}
                {startYear ? `${startYear}` : "Select year"}
              </p>
            </Link>
            <div className="dropdown-menu dropdown-menu-right">
              {allyear?.map((res, i) => {
                const yearRange = `${new Date(
                  res?.start_year
                ).getFullYear()} / ${new Date(res?.end_year).getFullYear()}`;
                return (
                  <button
                    key={i}
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => {
                      setStartYear(yearRange);
                      setStartYearId(res._id);
                    }}
                  >
                    Academic Year : {yearRange}
                  </button>
                );
              })}
            </div>
          </div> */}
        </div>
        {/* /Mobile Menu */}
      </div>
      {/* /Header */}
    </>
  );
};

export default Header;
