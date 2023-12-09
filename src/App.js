import React, { Suspense, useContext, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
// import "./scss/style.scss";

// // Containers
// const DefaultLayout = React.lazy(() => import("./Layout/DefaultLayout"));

// // Pages
// const Login = React.lazy(() => import("./views/Login.js"));

// const Register = React.lazy(() => import("./views/Register"));

// function App() {
//   const loading = (
//     <div className="pt-3 text-center">
//       <div className="sk-spinner sk-spinner-pulse"></div>
//     </div>
//   );

//   return (
//     <HashRouter>
//       <Suspense fallback={loading}>
//         <Routes>
//           <Route exact path="/login" name="Login Page" element={<Login />} />
//           <Route
//             exact
//             path="/register"
//             name="Register Page"
//             element={<Register />}
//           />

//           <Route path="*" name="Home" element={<DefaultLayout />} />
//         </Routes>
//       </Suspense>
//     </HashRouter>
//   );
// }

// export default App;

// import { useRoutes } from "react-router-dom";
// import Themeroutes from "./routes/Router";
// import FullLayout from "./layouts/FullLayout";

// const App = () => {
//   const routing = useRoutes(Themeroutes);

//   return (

//     <div className="dark">
//       <FullLayout />
//     </div>
//   );
// };

// export default App;

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

  return (
    <HashRouter>
      <Suspense fallback={<Loader />}>
        <AuthContext.Provider value={{ authState, setAuthState }}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
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
