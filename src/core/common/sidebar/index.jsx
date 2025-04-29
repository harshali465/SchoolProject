/* eslint-disable */

import React, { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";
import Scrollbars from "react-custom-scrollbars-2";
import ImageWithBasePath from "../imageWithBasePath";
import "../../../style/icon/tabler-icons/webfont/tabler-icons.css";
import { setExpandMenu, setMobileSidebar } from "../../data/redux/sidebarSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  resetAllMode,
  setDataLayout,
} from "../../data/redux/themeSettingSlice";
import usePreviousRoute from "./usePreviousRoute";
import {
  SidebarDataStudent,
  SidebarDataTeacher,
} from "../../data/json/sidebarData";
import malegeneric from "../../../image/images/malegeneric.png";
import axios from "axios";
const Sidebar = () => {
  const Location = useLocation();
  const mobileSidebar = useSelector(
    (state) => state.sidebarSlice.mobileSidebar
  );
  const dispatch = useDispatch();
  const toggleMobileSidebar = () => {
    dispatch(setMobileSidebar(!mobileSidebar));
  };
  const [messageCount, setmessageCount] = useState("");
  const token = localStorage.getItem("accessToken");
  const [subOpen, setSubopen] = useState("");
  const [subsidebar, setSubsidebar] = useState("");
  const toggleSidebar = (title) => {
    localStorage.setItem("menuOpened", title);
    if (title === subOpen) {
      setSubopen("");
    } else {
      setSubopen(title);
    }
  };

  const [module, setModule] = useState([]);
  useEffect(() => {
    const userInhead = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/school/school-admin`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        setModule(res.data?.data?.school?.modulesActivated);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    userInhead();
  }, []);
  console.log("this is a module", module);
  const checkPermissions = (title) => {
    console.log("this is a checkpermission title", title);
    if (title === "Manage Students") {
      return (
        module?.some(
          (mod) => mod.moduleId.moduleName === "Student" && mod.status === true
        ) || false
      );
    }
    if (title === "Manage Teachers") {
      return (
        module?.some(
          (mod) => mod.moduleId.moduleName === "Teacher" && mod.status === true
        ) || false
      );
    }
    if (title === "Aadat") {
      return (
        module?.some(
          (mod) => mod.moduleId.moduleName === "Aadat" && mod.status === true
        ) || false
      );
    }

    if (title === "Behaviour") {
      console.log("ok come inside the behavious module");
      console.log("this is module", module);
      console.log(
        "this is s boolean value",
        module?.some(
          (mod) =>
            mod.moduleId.moduleName === "Behaviour" && mod.status === true
        ) || false
      );
      return (
        module?.some(
          (mod) =>
            mod.moduleId.moduleName === "Behaviour" && mod.status === true
        ) || false
      );
    }

    if (title === "Attendance") {
      return (
        module?.some(
          (mod) =>
            mod.moduleId.moduleName === "Attendance" && mod.status === true
        ) || false
      );
    }


    if (title === "Notification") {
      return (
        module?.some(
          (mod) =>
            mod.moduleId.moduleName === "Notification" && mod.status === true
        ) || false
      );
    }


    if (title === "Time Table") {
      return (
        module?.some(
          (mod) =>
            mod.moduleId.moduleName === "Time Table" && mod.status === true
        ) || false
      );
    }

    return true;
  };

  const getNotification = async () => {
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_DEV_BASE_URL
        }/api/v1/school/notification/user/${localStorage.getItem(
          "userId"
        )}?receive=true`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setmessageCount(res?.data?.notification?.length);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getNotification();
  }, []);
  const toggleSubsidebar = (subitem) => {
    if (subitem === subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };

  const handleLayoutChange = (layout) => {
    dispatch(setDataLayout(layout));
  };

  const handleClick = (label, themeSetting, layout) => {
    toggleSidebar(label);
    if (themeSetting) {
      handleLayoutChange(layout);
    }
  };

  const getLayoutClass = (label) => {
    switch (label) {
      case "Default":
        return "default_layout";
      case "Mini":
        return "mini_layout";
      case "Box":
        return "boxed_layout";
      case "Dark":
        return "dark_data_theme";
      case "RTL":
        return "rtl";
      default:
        return "";
    }
  };
  const location = useLocation();
  const previousLocation = usePreviousRoute();

  useEffect(() => {
    const layoutPages = [
      "/layout-dark",
      "/layout-rtl",
      "/layout-mini",
      "/layout-box",
      "/layout-default",
    ];

    const isCurrentLayoutPage = layoutPages.some((path) =>
      location.pathname.includes(path)
    );
    const isPreviousLayoutPage =
      previousLocation &&
      layoutPages.some((path) => previousLocation.pathname.includes(path));

    if (isPreviousLayoutPage && !isCurrentLayoutPage) {
      dispatch(resetAllMode());
    }
  }, [location, previousLocation, dispatch]);

  useEffect(() => {
    setSubopen(localStorage.getItem("menuOpened"));
    // Select all 'submenu' elements
    const submenus = document.querySelectorAll(".submenu");
    // Loop through each 'submenu'
    submenus.forEach((submenu) => {
      // Find all 'li' elements within the 'submenu'
      const listItems = submenu.querySelectorAll("li");
      submenu.classList.remove("active");
      // Check if any 'li' has the 'active' class
      listItems.forEach((item) => {
        if (item.classList.contains("active")) {
          // Add 'active' class to the 'submenu'
          submenu.classList.add("active");
          return;
        }
      });
    });
  }, [Location.pathname]);

  const onMouseEnter = () => {
    dispatch(setExpandMenu(true));
  };
  const onMouseLeave = () => {
    dispatch(setExpandMenu(false));
  };

  const [schoollogo, setschoollogo] = useState("");
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
      setschoollogo(res?.schoollogo);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    userInhead();
  }, []);

  return (
    <>
      <div
        className="sidebar"
        id="sidebar"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Scrollbars>
          <div className="sidebar-inner slimscroll desktop mobile-content">
            <div id="sidebar-menu" className="sidebar-menu sidebar-of-mobile">
              <ul>
                <li>
                  <Link
                    to="#"
                    className="d-flex align-items-center border bg-white rounded p-2 mb-4"
                  >
                    <img
                      crossorigin={process.env.REACT_APP_DEV_BASE_URL}
                      src={
                        schoollogo
                          ? schoollogo
                          : localStorage.getItem("imgUrl")
                          ? localStorage.getItem("imgUrl")
                          : malegeneric
                      }
                      className="avatar avatar-md img-fluid rounded"
                      alt="Profile"
                    />
                    <span className="text-dark ms-2 fw-normal school-names">
                      {localStorage.getItem("schoolName").replace(/_/g, " ")}
                    </span>
                  </Link>
                </li>
              </ul>
              {localStorage.getItem("user") === "student" ? (
                <ul>
                  {SidebarDataStudent?.map((mainLabel, index) => {
                    console.log("this is a mainlabel", mainLabel);
                    return (
                      <li key={index}>
                        <h6 className="submenu-hdr">
                          <span>{mainLabel?.label}</span>
                        </h6>
                        <ul>
                          {mainLabel?.submenuItems?.map((title, i) => {
                            const booleand = checkPermissions(
                              title?.moduleName
                            );
                         
  console.log("this is a booleand" , booleand)
                            if (!booleand) {
                              return null; // This should prevent rendering
                            }
                            let link_array = [];
                            if ("submenuItems" in title) {
                              title.submenuItems?.forEach((link) => {
                                link_array.push(link?.link);
                                if (link?.submenu && "submenuItems" in link) {
                                  link.submenuItems?.forEach((item) => {
                                    link_array.push(item?.link);
                                  });
                                }
                              });
                            }
                            title.links = link_array;

                            return (
                              <li className="submenu" key={title.label}>
                                <Link
                                  to={title?.submenu ? "#" : title?.link}
                                  onClick={() => {
                                    if (
                                      title?.label === "Sibling" ||
                                      title?.label === "Daily update form" ||
                                      title?.label === "Notification" ||
                                      title?.label === "Time Table"
                                    ) {
                                      toggleMobileSidebar();
                                    }
                                    handleClick(
                                      title?.label,
                                      title?.themeSetting,
                                      getLayoutClass(title?.label)
                                    );
                                  }}
                                  className={`${
                                    subOpen === title?.label ? "subdrop" : ""
                                  } ${
                                    title?.links?.includes(Location.pathname)
                                      ? "active"
                                      : ""
                                  } ${
                                    title?.submenuItems
                                      ?.map((link) => link?.link)
                                      .includes(Location.pathname) ||
                                    title?.link === Location.pathname
                                      ? "active"
                                      : "" ||
                                        title?.subLink1 === Location.pathname
                                      ? "active"
                                      : "" ||
                                        title?.subLink2 === Location.pathname
                                      ? "active"
                                      : "" ||
                                        title?.subLink3 === Location.pathname
                                      ? "active"
                                      : "" ||
                                        title?.subLink4 === Location.pathname
                                      ? "active"
                                      : "" ||
                                        title?.subLink5 === Location.pathname
                                      ? "active"
                                      : "" ||
                                        title?.subLink6 === Location.pathname
                                      ? "active"
                                      : "" ||
                                        title?.subLink7 === Location.pathname
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  <i className={title.icon}></i>
                                  <span>{title?.label}</span>

                                  <span className="badge badge-primary badge-xs text-white fs-10 ms-auto">
                                    {title?.label === "Notification"
                                      ? messageCount
                                      : ""}
                                  </span>
                                  <span
                                    className={
                                      title?.submenu ? "menu-arrow" : ""
                                    }
                                  />
                                </Link>
                                {title?.submenu !== false &&
                                  subOpen === title?.label && (
                                    <ul
                                      style={{
                                        display:
                                          subOpen === title?.label
                                            ? "block"
                                            : "none",
                                      }}
                                    >
                                      {title?.submenuItems?.map((item) => (
                                        <li
                                          className={
                                            item?.submenuItems
                                              ? "submenu submenu-two "
                                              : ""
                                          }
                                          key={item.label}
                                        >
                                          <Link
                                            to={item?.link}
                                            className={`${
                                              item?.submenuItems
                                                ?.map((link) => link?.link)
                                                .includes(Location.pathname) ||
                                              item?.link === Location.pathname
                                                ? "active"
                                                : "" ||
                                                  item?.subLink1 ===
                                                    Location.pathname
                                                ? "active"
                                                : "" ||
                                                  item?.subLink2 ===
                                                    Location.pathname
                                                ? "active"
                                                : "" ||
                                                  item?.subLink3 ===
                                                    Location.pathname
                                                ? "active"
                                                : "" ||
                                                  item?.subLink4 ===
                                                    Location.pathname
                                                ? "active"
                                                : "" ||
                                                  item?.subLink5 ===
                                                    Location.pathname
                                                ? "active"
                                                : "" ||
                                                  item?.subLink6 ===
                                                    Location.pathname
                                                ? "active"
                                                : ""
                                            } ${
                                              subsidebar === item?.label
                                                ? "subdrop"
                                                : ""
                                            }  `}
                                            onClick={() => {
                                              toggleSubsidebar(item?.label);
                                              toggleMobileSidebar();
                                            }}
                                          >
                                            {item?.label}
                                            <span
                                              className={
                                                item?.submenu
                                                  ? "menu-arrow"
                                                  : ""
                                              }
                                            />
                                          </Link>
                                          {item?.submenuItems ? (
                                            <ul
                                              style={{
                                                display:
                                                  subsidebar === item?.label
                                                    ? "block"
                                                    : "none",
                                              }}
                                            >
                                              {item?.submenuItems?.map(
                                                (items) => (
                                                  <li key={items.label}>
                                                    <Link
                                                      to={items?.link}
                                                      className={`${
                                                        subsidebar ===
                                                        items?.label
                                                          ? "submenu-two subdrop"
                                                          : "submenu-two"
                                                      } ${
                                                        items?.submenuItems
                                                          ?.map(
                                                            (link) => link.link
                                                          )
                                                          .includes(
                                                            Location.pathname
                                                          ) ||
                                                        items?.link ===
                                                          Location.pathname
                                                          ? "active"
                                                          : ""
                                                      }`}
                                                    >
                                                      {items?.label}
                                                    </Link>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          ) : (
                                            <></>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              ) : localStorage.getItem("user") === "teacher" ? (
                <ul>
                  {SidebarDataTeacher?.map((mainLabel, index) => {
                    return (
                      <li key={index}>
                        <h6 className="submenu-hdr">
                          <span>{mainLabel?.label}</span>
                        </h6>
                        <ul>
                          {mainLabel?.submenuItems?.map((title, i) => {
                            console.log("this is a title", title);

                            if (!checkPermissions(title?.moduleName)) {
                              return null;
                            }

                            let link_array = [];
                            if ("submenuItems" in title) {
                              title.submenuItems?.forEach((link) => {
                                link_array.push(link?.link);
                                if (link?.submenu && "submenuItems" in link) {
                                  link.submenuItems?.forEach((item) => {
                                    link_array.push(item?.link);
                                  });
                                }
                              });
                            }
                            title.links = link_array;

                            return (
                              <li className="submenu" key={title.label}>
                                <Link
                                  to={title?.submenu ? "#" : title?.link}
                                  onClick={() => {
                                    if (title?.label === "Notification") {
                                      toggleMobileSidebar();
                                    }

                                    handleClick(
                                      title?.label,
                                      title?.themeSetting,
                                      getLayoutClass(title?.label)
                                    );
                                  }}
                                  className={`${
                                    subOpen === title?.label ? "subdrop" : ""
                                  } ${
                                    title?.links?.includes(Location.pathname)
                                      ? "active"
                                      : ""
                                  } ${
                                    title?.submenuItems
                                      ?.map((link) => link?.link)
                                      .includes(Location.pathname) ||
                                    title?.link === Location.pathname
                                      ? "active"
                                      : "" ||
                                        title?.subLink1 === Location.pathname
                                      ? "active"
                                      : "" ||
                                        title?.subLink2 === Location.pathname
                                      ? "active"
                                      : "" ||
                                        title?.subLink3 === Location.pathname
                                      ? "active"
                                      : "" ||
                                        title?.subLink4 === Location.pathname
                                      ? "active"
                                      : "" ||
                                        title?.subLink5 === Location.pathname
                                      ? "active"
                                      : "" ||
                                        title?.subLink6 === Location.pathname
                                      ? "active"
                                      : "" ||
                                        title?.subLink7 === Location.pathname
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  <i className={title.icon}></i>
                                  <span>{title?.label}</span>
                                  <span className="badge badge-primary badge-xs text-white fs-10 ms-auto">
                                    {title?.label === "Notification"
                                      ? messageCount
                                      : ""}
                                  </span>
                                  <span
                                    className={
                                      title?.submenu ? "menu-arrow" : ""
                                    }
                                  />
                                </Link>
                                {title?.submenu !== false &&
                                  subOpen === title?.label && (
                                    <ul
                                      style={{
                                        display:
                                          subOpen === title?.label
                                            ? "block"
                                            : "none",
                                      }}
                                    >
                                      {title?.submenuItems?.map((item) => (
                                        <li
                                          className={
                                            item?.submenuItems
                                              ? "submenu submenu-two "
                                              : ""
                                          }
                                          key={item.label}
                                        >
                                          <Link
                                            to={item?.link}
                                            className={`${
                                              item?.submenuItems
                                                ?.map((link) => link?.link)
                                                .includes(Location.pathname) ||
                                              item?.link === Location.pathname
                                                ? "active"
                                                : "" ||
                                                  item?.subLink1 ===
                                                    Location.pathname
                                                ? "active"
                                                : "" ||
                                                  item?.subLink2 ===
                                                    Location.pathname
                                                ? "active"
                                                : "" ||
                                                  item?.subLink3 ===
                                                    Location.pathname
                                                ? "active"
                                                : "" ||
                                                  item?.subLink4 ===
                                                    Location.pathname
                                                ? "active"
                                                : "" ||
                                                  item?.subLink5 ===
                                                    Location.pathname
                                                ? "active"
                                                : "" ||
                                                  item?.subLink6 ===
                                                    Location.pathname
                                                ? "active"
                                                : ""
                                            } ${
                                              subsidebar === item?.label
                                                ? "subdrop"
                                                : ""
                                            }  `}
                                            onClick={() => {
                                              toggleSubsidebar(item?.label);
                                              if (
                                                item?.label !==
                                                "Class Attendance"
                                              ) {
                                                toggleMobileSidebar();
                                              }
                                            }}
                                          >
                                            {item?.label}
                                            <span
                                              className={
                                                item?.submenu
                                                  ? "menu-arrow"
                                                  : ""
                                              }
                                            />
                                          </Link>
                                          {item?.submenuItems ? (
                                            <ul
                                              style={{
                                                display:
                                                  subsidebar === item?.label
                                                    ? "block"
                                                    : "none",
                                              }}
                                            >
                                              {item?.submenuItems?.map(
                                                (items) => (
                                                  <li key={items.label}>
                                                    <Link
                                                      to={items?.link}
                                                      className={`${
                                                        subsidebar ===
                                                        items?.label
                                                          ? "submenu-two subdrop"
                                                          : "submenu-two"
                                                      } ${
                                                        items?.submenuItems
                                                          ?.map(
                                                            (link) => link.link
                                                          )
                                                          .includes(
                                                            Location.pathname
                                                          ) ||
                                                        items?.link ===
                                                          Location.pathname
                                                          ? "active"
                                                          : ""
                                                      }`}
                                                      onClick={() =>
                                                        toggleMobileSidebar()
                                                      }
                                                    >
                                                      {items?.label}
                                                    </Link>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          ) : (
                                            <></>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <ul>
                  {SidebarDataTeacher?.map((mainLabel, index) => (
                    <li key={index}>
                      <h6 className="submenu-hdr">
                        <span>{mainLabel?.label}</span>
                      </h6>
                      <ul>
                        {mainLabel?.submenuItems?.map((title, i) => {
                          
                          if (!checkPermissions(title?.moduleName)) {
                            return null;
                          }

                          let link_array = [];
                          if ("submenuItems" in title) {
                            title.submenuItems?.forEach((link) => {
                              link_array.push(link?.link);
                              if (link?.submenu && "submenuItems" in link) {
                                link.submenuItems?.forEach((item) => {
                                  link_array.push(item?.link);
                                });
                              }
                            });
                          }
                          title.links = link_array;

                          return (
                            <li className="submenu" key={title.label}>
                              <Link
                                to={title?.submenu ? "#" : title?.link}
                                onClick={() =>
                                  handleClick(
                                    title?.label,
                                    title?.themeSetting,
                                    getLayoutClass(title?.label)
                                  )
                                }
                                className={`${
                                  subOpen === title?.label ? "subdrop" : ""
                                } ${
                                  title?.links?.includes(Location.pathname)
                                    ? "active"
                                    : ""
                                } ${
                                  title?.submenuItems
                                    ?.map((link) => link?.link)
                                    .includes(Location.pathname) ||
                                  title?.link === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink1 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink2 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink3 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink4 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink5 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink6 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink7 === Location.pathname
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <i className={title.icon}></i>
                                <span>{title?.label}</span>
                                <span className="badge badge-primary badge-xs text-white fs-10 ms-auto">
                                  {title?.version}
                                </span>
                                <span
                                  className={title?.submenu ? "menu-arrow" : ""}
                                />
                              </Link>
                              {title?.submenu !== false &&
                                subOpen === title?.label && (
                                  <ul
                                    style={{
                                      display:
                                        subOpen === title?.label
                                          ? "block"
                                          : "none",
                                    }}
                                  >
                                    {title?.submenuItems?.map((item) => (
                                      <li
                                        className={
                                          item?.submenuItems
                                            ? "submenu submenu-two "
                                            : ""
                                        }
                                        key={item.label}
                                      >
                                        <Link
                                          to={item?.link}
                                          className={`${
                                            item?.submenuItems
                                              ?.map((link) => link?.link)
                                              .includes(Location.pathname) ||
                                            item?.link === Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink1 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink2 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink3 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink4 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink5 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink6 ===
                                                  Location.pathname
                                              ? "active"
                                              : ""
                                          } ${
                                            subsidebar === item?.label
                                              ? "subdrop"
                                              : ""
                                          }  `}
                                          onClick={() => {
                                            toggleSubsidebar(item?.label);
                                            toggleMobileSidebar();
                                          }}
                                        >
                                          {item?.label}
                                          <span
                                            className={
                                              item?.submenu ? "menu-arrow" : ""
                                            }
                                          />
                                        </Link>
                                        {item?.submenuItems ? (
                                          <ul
                                            style={{
                                              display:
                                                subsidebar === item?.label
                                                  ? "block"
                                                  : "none",
                                            }}
                                          >
                                            {item?.submenuItems?.map(
                                              (items) => (
                                                <li key={items.label}>
                                                  <Link
                                                    to={items?.link}
                                                    className={`${
                                                      subsidebar ===
                                                      items?.label
                                                        ? "submenu-two subdrop"
                                                        : "submenu-two"
                                                    } ${
                                                      items?.submenuItems
                                                        ?.map(
                                                          (link) => link.link
                                                        )
                                                        .includes(
                                                          Location.pathname
                                                        ) ||
                                                      items?.link ===
                                                        Location.pathname
                                                        ? "active"
                                                        : ""
                                                    }`}
                                                  >
                                                    {items?.label}
                                                  </Link>
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        ) : (
                                          <></>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="sidebar-inner slimscroll desktop desktop-content">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                <li>
                  <Link
                    to="#"
                    className="d-flex align-items-center border bg-white rounded p-2 mb-4"
                  >
                    <img
                      crossorigin={process.env.REACT_APP_DEV_BASE_URL}
                      src={
                        schoollogo
                          ? schoollogo
                          : localStorage.getItem("imgUrl")
                          ? localStorage.getItem("imgUrl")
                          : malegeneric
                      }
                      className="avatar avatar-md img-fluid rounded"
                      alt="Profile"
                    />
                    <span
                      className="text-dark ms-2 fw-normal school-name "
                      style={{ overflow: "auto" }}
                    >
                      {localStorage.getItem("schoolName").replace(/_/g, " ")}
                    </span>
                  </Link>
                </li>
              </ul>
              {localStorage.getItem("user") === "student" ? (
                <ul>
                  {SidebarDataStudent?.map((mainLabel, index) => (
                    <li key={index}>
                      <h6 className="submenu-hdr">
                        <span>{mainLabel?.label}</span>
                      </h6>
                      <ul>
                        {mainLabel?.submenuItems?.map((title, i) => {
                          
                          if (!checkPermissions(title?.moduleName)) {
                            return null;
                          }

                          let link_array = [];
                          if ("submenuItems" in title) {
                            title.submenuItems?.forEach((link) => {
                              link_array.push(link?.link);
                              if (link?.submenu && "submenuItems" in link) {
                                link.submenuItems?.forEach((item) => {
                                  link_array.push(item?.link);
                                });
                              }
                            });
                          }
                          title.links = link_array;

                          return (
                            <li className="submenu" key={title.label}>
                              <Link
                                to={title?.submenu ? "#" : title?.link}
                                onClick={() => {
                                  handleClick(
                                    title?.label,
                                    title?.themeSetting,
                                    getLayoutClass(title?.label)
                                  );
                                }}
                                className={`${
                                  subOpen === title?.label ? "subdrop" : ""
                                } ${
                                  title?.links?.includes(Location.pathname)
                                    ? "active"
                                    : ""
                                } ${
                                  title?.submenuItems
                                    ?.map((link) => link?.link)
                                    .includes(Location.pathname) ||
                                  title?.link === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink1 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink2 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink3 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink4 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink5 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink6 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink7 === Location.pathname
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <i className={title.icon}></i>
                                <span>{title?.label}</span>
                                <span className="badge badge-primary badge-xs text-white fs-10 ms-auto">
                                  {title?.label === "Notification"
                                    ? messageCount
                                    : ""}
                                </span>
                                <span
                                  className={title?.submenu ? "menu-arrow" : ""}
                                />
                              </Link>
                              {title?.submenu !== false &&
                                subOpen === title?.label && (
                                  <ul
                                    style={{
                                      display:
                                        subOpen === title?.label
                                          ? "block"
                                          : "none",
                                    }}
                                  >
                                    {title?.submenuItems?.map((item) => (
                                      <li
                                        className={
                                          item?.submenuItems
                                            ? "submenu submenu-two "
                                            : ""
                                        }
                                        key={item.label}
                                      >
                                        <Link
                                          to={item?.link}
                                          className={`${
                                            item?.submenuItems
                                              ?.map((link) => link?.link)
                                              .includes(Location.pathname) ||
                                            item?.link === Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink1 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink2 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink3 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink4 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink5 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink6 ===
                                                  Location.pathname
                                              ? "active"
                                              : ""
                                          } ${
                                            subsidebar === item?.label
                                              ? "subdrop"
                                              : ""
                                          }  `}
                                          onClick={() => {
                                            toggleSubsidebar(item?.label);
                                          }}
                                        >
                                          {item?.label}
                                          <span
                                            className={
                                              item?.submenu ? "menu-arrow" : ""
                                            }
                                          />
                                        </Link>
                                        {item?.submenuItems ? (
                                          <ul
                                            style={{
                                              display:
                                                subsidebar === item?.label
                                                  ? "block"
                                                  : "none",
                                            }}
                                          >
                                            {item?.submenuItems?.map(
                                              (items) => (
                                                <li key={items.label}>
                                                  <Link
                                                    to={items?.link}
                                                    className={`${
                                                      subsidebar ===
                                                      items?.label
                                                        ? "submenu-two subdrop"
                                                        : "submenu-two"
                                                    } ${
                                                      items?.submenuItems
                                                        ?.map(
                                                          (link) => link.link
                                                        )
                                                        .includes(
                                                          Location.pathname
                                                        ) ||
                                                      items?.link ===
                                                        Location.pathname
                                                        ? "active"
                                                        : ""
                                                    }`}
                                                  >
                                                    {items?.label}
                                                  </Link>
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        ) : (
                                          <></>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : localStorage.getItem("user") === "teacher" ? (
                <ul>
                  {SidebarDataTeacher?.map((mainLabel, index) => (
                    <li key={index}>
                      <h6 className="submenu-hdr">
                        <span>{mainLabel?.label}</span>
                      </h6>
                      <ul>
                        {mainLabel?.submenuItems?.map((title, i) => {

if (!checkPermissions(title?.moduleName)) {
  return null;
}

                          let link_array = [];
                          if ("submenuItems" in title) {
                            title.submenuItems?.forEach((link) => {
                              link_array.push(link?.link);
                              if (link?.submenu && "submenuItems" in link) {
                                link.submenuItems?.forEach((item) => {
                                  link_array.push(item?.link);
                                });
                              }
                            });
                          }
                          title.links = link_array;

                          return (
                            <li className="submenu" key={title.label}>
                              <Link
                                to={title?.submenu ? "#" : title?.link}
                                onClick={() =>
                                  handleClick(
                                    title?.label,
                                    title?.themeSetting,
                                    getLayoutClass(title?.label)
                                  )
                                }
                                className={`${
                                  subOpen === title?.label ? "subdrop" : ""
                                } ${
                                  title?.links?.includes(Location.pathname)
                                    ? "active"
                                    : ""
                                } ${
                                  title?.submenuItems
                                    ?.map((link) => link?.link)
                                    .includes(Location.pathname) ||
                                  title?.link === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink1 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink2 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink3 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink4 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink5 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink6 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink7 === Location.pathname
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <i className={title.icon}></i>
                                <span>{title?.label}</span>
                                <span className="badge badge-primary badge-xs text-white fs-10 ms-auto">
                                  {title?.label === "Notification"
                                    ? messageCount
                                    : ""}
                                </span>
                                <span
                                  className={title?.submenu ? "menu-arrow" : ""}
                                />
                              </Link>
                              {title?.submenu !== false &&
                                subOpen === title?.label && (
                                  <ul
                                    style={{
                                      display:
                                        subOpen === title?.label
                                          ? "block"
                                          : "none",
                                    }}
                                  >
                                    {title?.submenuItems?.map((item) => (
                                      <li
                                        className={
                                          item?.submenuItems
                                            ? "submenu submenu-two "
                                            : ""
                                        }
                                        key={item.label}
                                      >
                                        <Link
                                          to={item?.link}
                                          className={`${
                                            item?.submenuItems
                                              ?.map((link) => link?.link)
                                              .includes(Location.pathname) ||
                                            item?.link === Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink1 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink2 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink3 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink4 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink5 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink6 ===
                                                  Location.pathname
                                              ? "active"
                                              : ""
                                          } ${
                                            subsidebar === item?.label
                                              ? "subdrop"
                                              : ""
                                          }  `}
                                          onClick={() => {
                                            toggleSubsidebar(item?.label);
                                          }}
                                        >
                                          {item?.label}
                                          <span
                                            className={
                                              item?.submenu ? "menu-arrow" : ""
                                            }
                                          />
                                        </Link>
                                        {item?.submenuItems ? (
                                          <ul
                                            style={{
                                              display:
                                                subsidebar === item?.label
                                                  ? "block"
                                                  : "none",
                                            }}
                                          >
                                            {item?.submenuItems?.map(
                                              (items) => (
                                                <li key={items.label}>
                                                  <Link
                                                    to={items?.link}
                                                    className={`${
                                                      subsidebar ===
                                                      items?.label
                                                        ? "submenu-two subdrop"
                                                        : "submenu-two"
                                                    } ${
                                                      items?.submenuItems
                                                        ?.map(
                                                          (link) => link.link
                                                        )
                                                        .includes(
                                                          Location.pathname
                                                        ) ||
                                                      items?.link ===
                                                        Location.pathname
                                                        ? "active"
                                                        : ""
                                                    }`}
                                                  >
                                                    {items?.label}
                                                  </Link>
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        ) : (
                                          <></>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul>
                  {SidebarDataTeacher?.map((mainLabel, index) => (
                    <li key={index}>
                      <h6 className="submenu-hdr">
                        <span>{mainLabel?.label}</span>
                      </h6>
                      <ul>
                        {mainLabel?.submenuItems?.map((title, i) => {
                          
                          if (!checkPermissions(title?.moduleName)) {
                            return null;
                          }

                          let link_array = [];
                          if ("submenuItems" in title) {
                            title.submenuItems?.forEach((link) => {
                              link_array.push(link?.link);
                              if (link?.submenu && "submenuItems" in link) {
                                link.submenuItems?.forEach((item) => {
                                  link_array.push(item?.link);
                                });
                              }
                            });
                          }
                          title.links = link_array;

                          return (
                            <li className="submenu" key={title.label}>
                              <Link
                                to={title?.submenu ? "#" : title?.link}
                                onClick={() =>
                                  handleClick(
                                    title?.label,
                                    title?.themeSetting,
                                    getLayoutClass(title?.label)
                                  )
                                }
                                className={`${
                                  subOpen === title?.label ? "subdrop" : ""
                                } ${
                                  title?.links?.includes(Location.pathname)
                                    ? "active"
                                    : ""
                                } ${
                                  title?.submenuItems
                                    ?.map((link) => link?.link)
                                    .includes(Location.pathname) ||
                                  title?.link === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink1 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink2 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink3 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink4 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink5 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink6 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink7 === Location.pathname
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <i className={title.icon}></i>
                                <span>{title?.label}</span>
                                <span className="badge badge-primary badge-xs text-white fs-10 ms-auto">
                                  {title?.version}
                                </span>
                                <span
                                  className={title?.submenu ? "menu-arrow" : ""}
                                />
                              </Link>
                              {title?.submenu !== false &&
                                subOpen === title?.label && (
                                  <ul
                                    style={{
                                      display:
                                        subOpen === title?.label
                                          ? "block"
                                          : "none",
                                    }}
                                  >
                                    {title?.submenuItems?.map((item) => (
                                      <li
                                        className={
                                          item?.submenuItems
                                            ? "submenu submenu-two "
                                            : ""
                                        }
                                        key={item.label}
                                      >
                                        <Link
                                          to={item?.link}
                                          className={`${
                                            item?.submenuItems
                                              ?.map((link) => link?.link)
                                              .includes(Location.pathname) ||
                                            item?.link === Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink1 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink2 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink3 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink4 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink5 ===
                                                  Location.pathname
                                              ? "active"
                                              : "" ||
                                                item?.subLink6 ===
                                                  Location.pathname
                                              ? "active"
                                              : ""
                                          } ${
                                            subsidebar === item?.label
                                              ? "subdrop"
                                              : ""
                                          }  `}
                                          onClick={() => {
                                            toggleSubsidebar(item?.label);
                                          }}
                                        >
                                          {item?.label}
                                          <span
                                            className={
                                              item?.submenu ? "menu-arrow" : ""
                                            }
                                          />
                                        </Link>
                                        {item?.submenuItems ? (
                                          <ul
                                            style={{
                                              display:
                                                subsidebar === item?.label
                                                  ? "block"
                                                  : "none",
                                            }}
                                          >
                                            {item?.submenuItems?.map(
                                              (items) => (
                                                <li key={items.label}>
                                                  <Link
                                                    to={items?.link}
                                                    className={`${
                                                      subsidebar ===
                                                      items?.label
                                                        ? "submenu-two subdrop"
                                                        : "submenu-two"
                                                    } ${
                                                      items?.submenuItems
                                                        ?.map(
                                                          (link) => link.link
                                                        )
                                                        .includes(
                                                          Location.pathname
                                                        ) ||
                                                      items?.link ===
                                                        Location.pathname
                                                        ? "active"
                                                        : ""
                                                    }`}
                                                  >
                                                    {items?.label}
                                                  </Link>
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        ) : (
                                          <></>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Scrollbars>
      </div>
    </>
  );
};

export default Sidebar;
