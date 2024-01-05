import React, { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";

// routes config
import routes from "../../routes/Router";
import { useContext } from "react";
import { AuthContext } from "../../helpers/AuthContext";
import StudentView from "../../views/Studentview/StudentView";
import Login from "../../views/Login";

const AppContent = () => {
  const { authState } = useContext(AuthContext);

  const [user, setuser] = useState(null);

  useEffect(() => {
    setuser(localStorage.getItem("user"));
  }, []);

  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            // authState.role
            return user === "admin"
              ? route.element && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    element={<route.element />}
                  />
                )
              : user === "student" && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    element={<StudentView />}
                  />
                );
          })}

          {/* <Route path="/" element={<Navigate to="Dashboard" replace />} /> */}
        </Routes>
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);
