import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  NavbarText,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import { ReactComponent as LogoWhite } from "../assets/images/logos/xtremelogowhite.svg";
import user1 from "../assets/images/users/user4.jpg";
import { AuthContext } from "../helpers/AuthContext";
import { useContext } from "react";
import axios from "axios";

const Header = () => {
  const { authState, setAuthState } = useContext(AuthContext);

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [dropdownOpen1, setDropdownOpen1] = React.useState(false);
  const [displayName, setdisplayName] = useState(authState.name);
  const [father, setfather] = useState("");

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const toggle1 = () => setDropdownOpen1((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/");
  };
  const [siblings, setSiblings] = useState([]);
  useEffect(() => {
    const userInhead = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTcwMjAyNjUyMSwiZXhwIjoxNzMzNTYyNTIxfQ.SQNoJL4HEKvUKrw6AEpCtg1hDNx26vRPz1Az2sZohz4";
        // this is for getting the information about the student you need to display
        const res = await axios.get(
          `http://18.118.42.224:3001/api/v1/users/${authState.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data.data.siblings);
        setSiblings(res.data.data.siblings);
        setfather(
          res.data.data.familyDetails.fatherFirstName +
            " " +
            res.data.data.familyDetails.fatherLastName
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    userInhead();
  }, [authState.id, authState.name]);

  return (
    <Navbar color="white" dark expand="md">
      <div className="d-flex align-items-center">
        <NavbarBrand href="/" className="d-lg-none">
          <LogoWhite />
        </NavbarBrand>
        <Button
          color="primary"
          className="d-lg-none"
          onClick={() => showMobilemenu()}
        >
          <i className="bi bi-list"></i>
        </Button>
      </div>
      {/* <NavbarText className="text-center" style={{ color: "black" }}>
        Welcome to Houston School
      </NavbarText> */}

      <span
        className="text-center"
        style={{ color: "black", fontSize: "20px" }}
      >
        Welcome to <strong>Madrasah Ezziyah Houston</strong>
      </span>
      <div className="hstack gap-2">
        <Button
          color="primary"
          size="sm"
          className="d-sm-block d-md-none"
          onClick={Handletoggle}
        >
          {isOpen ? (
            <i className="bi bi-x"></i>
          ) : (
            <i className="bi bi-three-dots-vertical"></i>
          )}
        </Button>
      </div>
      <Collapse navbar isOpen={isOpen}>
        <Nav className="me-auto" navbar>
          {/* <NavItem>
            <Link to="/starter" className="nav-link">
              Starter
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/about" className="nav-link">
              About
            </Link>
          </NavItem> */}
          <UncontrolledDropdown inNavbar nav>
            {/* <DropdownToggle caret nav>
              DD Menu
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem>Option 1</DropdownItem>
              <DropdownItem>Option 2</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Reset</DropdownItem>
            </DropdownMenu> */}
          </UncontrolledDropdown>
        </Nav>
        <Dropdown isOpen={dropdownOpen1} toggle={toggle1}>
          <DropdownToggle color="white">
            {authState.name && authState.name + " " + authState.lastname}
          </DropdownToggle>
          <DropdownMenu>
            {siblings &&
              siblings.map((sib, index) => (
                <DropdownItem
                  key={index}
                  onClick={() => {
                    setAuthState({
                      id: sib._id,
                      name: sib.firstName,
                      lastname: sib.lastName,
                    });
                    localStorage.setItem("userId", sib._id);
                  }}
                >
                  {sib.firstName + " " + sib.lastName}
                </DropdownItem>
              ))}
          </DropdownMenu>
        </Dropdown>
        <div
          className="mx-2 pl-2 pr-2"
          style={{
            borderLeft: "1px solid black",
            height: "30px",
          }}
        />

        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle color="white">
            <img
              src={user1}
              alt="profile"
              className="rounded-circle"
              width="30"
            ></img>
            <div>
              {authState.fatherName
                ? authState.fatherName + " " + authState.fatherLastName
                : father}
            </div>
          </DropdownToggle>
          <DropdownMenu>
            {/* <DropdownItem header>Info</DropdownItem>
            <DropdownItem>My Account</DropdownItem>
            <DropdownItem>Edit Profile</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>My Balance</DropdownItem>
            <DropdownItem>Inbox</DropdownItem> */}
            <DropdownItem onClick={logout}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Collapse>
    </Navbar>
  );
};

export default Header;
