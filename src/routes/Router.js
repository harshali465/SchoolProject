import React from "react";

const Addschool = React.lazy(() => import("../views/Manageschools/Addschool"));
const Addstudent = React.lazy(() =>
  import("../views/Managestudents/Addstudent")
);
const Listingpage = React.lazy(() =>
  import("../views/Manageschools/Listingpage")
);
const Editschool = React.lazy(() =>
  import("../views/Manageschools/Editschool")
);
const Studentlisting = React.lazy(() =>
  import("../views/Managestudents/StudentListing")
);
const Editstudent = React.lazy(() =>
  import("../views/Managestudents/Editstudent")
);
const Addteacher = React.lazy(() =>
  import("../views/Manageteachers/Addteacher")
);
const Teacherlisting = React.lazy(() =>
  import("../views/Manageteachers/Teacherlisting")
);

const Editteacher = React.lazy(() =>
  import("../views/Manageteachers/Editteacher")
);
const CategoryListing = React.lazy(() =>
  import("../views/Categories/CategoryListing")
);
const Addcategory = React.lazy(() => import("../views/Categories/AddCategory"));
const Editcategory = React.lazy(() =>
  import("../views/Categories/EditCategory")
);
const AdaatListing = React.lazy(() => import("../views/Adaats/AdaatListing"));
const AddAdaat = React.lazy(() => import("../views/Adaats/AddAdaat"));

const StudentView = React.lazy(() =>
  import("../views/Studentview/StudentView")
);

const MiqaatListing = React.lazy(() =>
  import("../views/Miqaats/MiqaatListing")
);

const AddMiqaat = React.lazy(() => import("../views/Miqaats/AddMiqaat"));
const EditMiqaat = React.lazy(() => import("../views/Miqaats/EditMiqaat"));
const EditAdaat = React.lazy(() => import("../views/Adaats/EditAdaat"));
const Reports = React.lazy(() => import("../views/Studentview/Reports"));

const routes = [
  { path: "/addstudent", name: "Addstudent", element: Addstudent },
  { path: "/editstudent", name: "Editstudent", element: Editstudent },
  { path: "/studentlisting", name: "Studentlisting", element: Studentlisting },
  { path: "/addschool", name: "Addschool", element: Addschool },
  { path: "/schoollisting", name: "Schoollisting", element: Listingpage },
  { path: "/editschool", name: "Editschool", element: Editschool },
  { path: "/addteacher", name: "Addteacher", element: Addteacher },
  { path: "/teacherlisting", name: "Teacherlisting", element: Teacherlisting },
  { path: "/editteacher", name: "Editteacher", element: Editteacher },

  {
    path: "/categorylisting",
    name: "CategoryListing",
    element: CategoryListing,
  },
  { path: "/addcategory", name: "Addcategory", element: Addcategory },
  { path: "/editcategory", name: "Editcategory", element: Editcategory },

  {
    path: "/adaatlisting",
    name: "AdaatListing",
    element: AdaatListing,
  },

  {
    path: "/addadaat",
    name: "AddAdaat",
    element: AddAdaat,
  },
  {
    path: "/editadaat",
    name: "EditAdaat",
    element: EditAdaat,
  },

  {
    path: "/miqaatlisting",
    name: "MiqaatListing",
    element: MiqaatListing,
  },

  {
    path: "/addmiqaat",
    name: "AddMiqaat",
    element: AddMiqaat,
  },
  {
    path: "/editmiqaat",
    name: "EditMiqaat",
    element: EditMiqaat,
  },

  // frontend for students/parents
  {
    path: "/studentview",
    name: "StudentView",
    element: StudentView,
  },
  {
    path: "/reports",
    name: "Report",
    element: Reports,
  },
];

export default routes;

// import { lazy } from "react";
// import { Navigate } from "react-router-dom";

// /****Layouts*****/
// const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

// /***** Pages ****/

// const Addschool = React.lazy(() =>
//   import("../views/school listing/Addschool.js")
// );
// const Addstudent = React.lazy(() =>
//   import("../views/school listing/Addstudent.js")
// );
// const Listingpage = React.lazy(() =>
//   import("../views/school listing/Listingpage.js")
// );
// const Editschool = React.lazy(() =>
//   import("../views/school listing/Editschool.js")
// );

// /*****Routes******/

// const ThemeRoutes = [
//   {
//     path: "/",
//     element: <FullLayout />,
//     children: [
//       { path: "/", element: <Navigate to="/home" /> },
//       { path: "/addstudent", name: "Addstudent", element: Addstudent },
//       { path: "/addschool", name: "Addschool", element: Addschool },
//       { path: "/schoollisting", name: "Schoollisting", element: Listingpage },
//       { path: "/editschool", name: "Editschool", element: Editschool },
//     ],
//   },
// ];

// export default ThemeRoutes;
