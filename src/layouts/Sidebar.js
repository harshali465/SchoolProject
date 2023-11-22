import { Button, Nav, NavItem } from "reactstrap";
import Logo from "./Logo";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";

const navigationStu = [
  {
    title: "View report",
    href: "/studentview",
    icon: "bi bi-speedometer2",
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

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Logo />

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
          {authState.role == "admin"
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
                    <i className={navi.icon}></i>
                    <span className="ms-3 d-inline-block">{navi.title}</span>
                  </Link>
                </NavItem>
              ))
            : navigationStu.map((navi, index) => (
                <NavItem key={index} className="sidenav-bg">
                  <Link
                    to={navi.href}
                    className={
                      location.pathname === navi.href
                        ? "text-primary nav-link py-3"
                        : "nav-link text-secondary py-3"
                    }
                  >
                    <i className={navi.icon}></i>
                    <span className="ms-3 d-inline-block">{navi.title}</span>
                  </Link>
                </NavItem>
              ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
