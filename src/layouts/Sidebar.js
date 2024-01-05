import { Button, Nav, NavItem } from "reactstrap";
import Logo from "./Logo";
import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../helpers/AuthContext";

const navigationStu = [
  {
    title: "Daily Update Form",
    href: "/studentview",
    icon: "bi bi-thermometer-low",
  },
];

const navigation = [
  {
    title: "Dashboard",
    href: "/starter",
    icon: "bi bi-speedometer2",
  },
  {
    title: "Schools",
    href: "/schoollisting",
    icon: "bi bi-bell",
  },
  {
    title: "Students",
    href: "/studentlisting",
    icon: "bi bi-bell",
  },

  {
    title: "Teachers",
    href: "/teacherlisting",
    icon: "bi bi-bell",
  },
  {
    title: "Categories",
    href: "/categorylisting",
    icon: "bi bi-bell",
  },
  {
    title: "Adaats",
    href: "/adaatlisting",
    icon: "bi bi-bell",
  },
  {
    title: "Miqaat",
    href: "/miqaatlisting",
    icon: "bi bi-bell",
  },
  {
    title: "Assign modules",
    href: "/badges",
    icon: "bi bi-patch-check",
  },
  {
    title: "Buttons",
    href: "/buttons",
    icon: "bi bi-hdd-stack",
  },
];

const Sidebar = () => {
  const { authState } = useContext(AuthContext);
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  let location = useLocation();

  const [user, setUsers] = useState("");
  useEffect(() => {
    setUsers(localStorage.getItem("user"));
  }, []);

  return (
    <div className="p-3" style={{ backgroundColor: "#135F77", height: "100%" }}>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "3.5rem" }}
      >
        <a className="text-center">
          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: "800",
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: ".05rem",
              margin: "auto",
              color: "whitesmoke",
            }}
          >
            myaadat
          </div>
        </a>

        <span className="ms-auto d-lg-none">
          <Button
            close
            size="sm"
            className="ms-auto d-lg-none"
            onClick={() => showMobilemenu()}
          ></Button>
        </span>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="sidebarNav">
          {
            // authState.role

            user == "admin"
              ? navigation.map((navi, index) => (
                  <NavItem key={index} className="sidenav-bg">
                    <Link
                      to={navi.href}
                      className={
                        location.pathname === navi.href
                          ? "text-primary nav-link py-3"
                          : "nav-link text-secondary py-3"
                      }
                    >
                      <i className={navi.icon} style={{ color: "white" }}></i>
                      <span
                        className="ms-3 d-inline-block"
                        style={{ color: "white" }}
                      >
                        {navi.title}
                      </span>
                    </Link>
                  </NavItem>
                ))
              : user == "student" &&
                navigationStu.map((navi, index) => (
                  <>
                    <div
                      className="border-bottom"
                      style={{ backgroundColor: "#dee2e62e" }}
                    ></div>
                    <NavItem key={index} className="sidenav-bg">
                      <Link
                        to={navi.href}
                        className={
                          location.pathname === navi.href
                            ? "text-primary nav-link py-3"
                            : "nav-link text-secondary py-3"
                        }
                      >
                        <i className={navi.icon} style={{ color: "white" }}></i>
                        <span
                          className="ms-3 d-inline-block"
                          style={{ color: "white" }}
                        >
                          {navi.title}
                        </span>
                      </Link>
                    </NavItem>
                    <div
                      className="border-bottom"
                      style={{ backgroundColor: "#dee2e62e" }}
                    ></div>
                  </>
                ))
          }
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
