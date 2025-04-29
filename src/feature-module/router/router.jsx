import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import { authRoutes, publicRoutes, studentRoute } from "./router.link";
import Feature from "../feature";
import AuthFeature from "../authFeature";
import Login from "../auth/login/login";
import Loginteacher from "../auth/login/login-2";
import { AuthContext } from "../helper/AuthState";
import PublicRoute from "../../PublicRoute";
import ProtectedRoute from "../../ProtectedRoute";
import AssignPoint from "../mainMenu/studentDashboard/Behaviour/Assign/AssignPoint";
// import "./style/css/style.css";
// import "../../style/css/style.css"
import { all_routes } from "./all_routes";
import ForgotTeacherPassword from "../auth/forgotPassword/ForgotTeacherPassword";
import ForgotPassword from "../auth/forgotPassword/forgotPassword";
import { useDispatch, useSelector } from "react-redux";
import { setMobileSidebar } from "../../core/data/redux/sidebarSlice";

const ALLRoutes = () => {



  const mobileSidebar = useSelector((state) => state.sidebarSlice.mobileSidebar);
  const dispatch = useDispatch();

  const toggleMobileSidebar = () => {
    dispatch(setMobileSidebar(false));
  };


  useEffect(() => {
    // Query the sidebar element directly
    const sidebar = document.querySelector(".sidebar-of-mobile");
    const mobilebutton = document.querySelector(".mobile_btn")
    if (!sidebar) {
      console.warn("Element with class 'sidebar-of-mobile' not found in the DOM.");
      return;
    }
  
    const handleClick = (event) => {
  
      const isClickInsideSidebar = sidebar.contains(event.target);
      const isClickonTogglebutton = mobilebutton.contains(event.target);

      if (!isClickInsideSidebar && !isClickonTogglebutton) {
        toggleMobileSidebar()
        }
     };
  
    document.addEventListener("click", handleClick);
  
 
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [mobileSidebar, dispatch]);
  


  const [authState, setAuthState] = useState({
    role: "",
    name: "",
    class: "",
    id: "",
    fatherName: "",
    startYear: "",
    startYearId: "",
    academiclenth: "",
  });
  const jwtToken = localStorage.getItem("accessToken");
  const userType = localStorage.getItem("user");




  // useEffect(() => {
   
  //   const toggleButton = document.querySelector(".toggle-btn");

  //   if (!sidebar || !toggleButton) {
  //     console.error("Sidebar or toggle button not found in the DOM.");
  //     return;
  //   }

  //   // Toggle the sidebar when the toggle button is clicked
  //   toggleButton.addEventListener("click", function (event) {
  //     event.stopPropagation();
  //     store.dispatch({ type: "TOGGLE_SIDEBAR" });
  //   });

  //   // Subscribe to the Redux store to update the sidebar DOM when state changes
  //   const unsubscribe = store.subscribe(function () {
  //     const state = store.getState();
  //     if (state.sidebarOpen) {
  //       sidebar.classList.add("open");
  //     } else {
  //       sidebar.classList.remove("open");
  //     }
  //   });

  //   // Close the sidebar if clicked outside of it and the toggle button
  //   document.addEventListener("click", function (event) {
  //     if (
  //       sidebar.classList.contains("open") &&
  //       !sidebar.contains(event.target) &&
  //       !toggleButton.contains(event.target)
  //     ) {
  //       store.dispatch({ type: "CLOSE_SIDEBAR" });
  //     }
  //   });

  //   // Cleanup event listeners on unmount
  //   return () => {
  //     toggleButton.removeEventListener("click", () => {});
  //     document.removeEventListener("click", () => {});
  //     unsubscribe();
  //   };
  // }, []);






  return (
    <>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route
              path="student/login/:schoolName/:uniqueId"
              element={<Login />}
            />
            <Route
              path="teacher/login/:schoolName/:uniqueId"
              element={<Loginteacher />}
            />

<Route
                path="teacher/forgot-password"
                element={<ForgotTeacherPassword />}
              />
              <Route
                path="student/forgot-password"
                element={<ForgotPassword />}
              />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<Feature />}>
              {publicRoutes.map((route, idx) => (
                <Route path={route.path} element={route.element} key={idx} />
              ))}
            </Route>
          </Route>
          

        
          <Route element={<ProtectedRoute />}>
            <Route element={<Feature />}>
              {studentRoute.map((route, idx) => (
                <Route path={route.path} element={route.element} key={idx} />
              ))}
            </Route>
          </Route>


          
         
        </Routes>
      </AuthContext.Provider>
    </>
  );
};

export default ALLRoutes;
