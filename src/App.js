import React, { Suspense, useContext, useEffect, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
// import "./scss/style.scss";

import { useRoutes } from "react-router-dom";
import Themeroutes from "./routes/Router";
import FullLayout from "./layouts/FullLayout";
import Loader from "./layouts/loader/Loader";
import { AuthContext } from "./helpers/AuthContext.js";

// Pages
const Login = React.lazy(() => import("./views/Login.js"));

const Register = React.lazy(() => import("./views/Register"));

const App = () => {
  const [authState, setAuthState] = useState({
    role: "",
    name: "",
    class: "",
    id: "",
    fatherName: "",
  });

  const accessToken = localStorage.getItem("accessToken");

  return (
    // <HashRouter>
    //   <Suspense fallback={<Loader />}>
    //     <AuthContext.Provider value={{ authState, setAuthState }}>
    //       <Routes>
    //         <Route path="/dashboard" name="Home" element={<FullLayout />} />

    //         <Route exact path="/" name="Login Page" element={<Login />} />

    //         {/* <Route exact path="/" name="Login Page" element={<Login />} /> */}
    //         {/* <Route
    //           exact
    //           path="/register"
    //           name="Register Page"
    //           element={<Register />}
    //         /> */}

    //         {/* <Route path="/dashboard" name="Home" element={<FullLayout />} /> */}
    //         {/* {accessToken === null || !accessToken ? (
    //           <Route
    //             exact
    //             path="/login"
    //             name="Login Page"
    //             element={<Login />}
    //           />
    //         ) : (
    //           <Route path="*" name="Home" element={<FullLayout />} />
    //         )} */}
    //       </Routes>
    //     </AuthContext.Provider>
    //   </Suspense>
    // </HashRouter>
    <HashRouter>
      <Suspense fallback={<Loader />}>
        <AuthContext.Provider value={{ authState, setAuthState }}>
          <Routes>
            <Route path="/" name="Login Page" element={<Login />} />
            <Route
              exact
              path="/register"
              name="Register Page"
              element={<Register />}
            />

            <Route path="*" name="Home" element={<FullLayout />} />
          </Routes>
        </AuthContext.Provider>
      </Suspense>
    </HashRouter>
  );
};

export default App;
