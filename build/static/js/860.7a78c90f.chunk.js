"use strict";
(self.webpackChunkhoustonschoolfront =
  self.webpackChunkhoustonschoolfront || []).push([
  [860],
  {
    9860: function (e, s, a) {
      a.r(s);
      var t = a(3433),
        i = a(4942),
        r = a(1413),
        n = a(4165),
        d = a(5861),
        l = a(9439),
        o = a(2791),
        c = a(8983),
        h = (a(4846), a(1323), a(6772), a(2957), a(1243)),
        m = a(184);
      s.default = function () {
        var e = localStorage.getItem("accessToken"),
          s = (0, o.useState)({
            profilePic: "",
            firstName: "",
            lastName: "",
            studentPassword: "",
            ConfirmStudentPassword: "",
            class: "",
            house: "",
            phoneNumber: "",
            studentId: "",
            division: "",
            mentor: "",
            siblings: [],
            fatherFirstName: "",
            fatherLastName: "",
            fatherPhoneNumber: "",
            fatherEmailAddress: "",
            motherFirstName: "",
            motherLastName: "",
            motherPhoneNumber: "",
            motherEmailAddress: "",
            year: "",
            term: "",
          }),
          a = (0, l.Z)(s, 2),
          u = a[0],
          x = a[1],
          j = (0, o.useState)(!1),
          b = (0, l.Z)(j, 2),
          p = b[0],
          v = b[1],
          f = (0, o.useState)(!1),
          N = (0, l.Z)(f, 2),
          C = N[0],
          y = N[1],
          I = (0, o.useState)(!1),
          k = (0, l.Z)(I, 2),
          g = k[0],
          w = k[1],
          O = (0, o.useState)(!1),
          P = (0, l.Z)(O, 2),
          Z = P[0],
          S = P[1],
          q = (0, o.useState)("password"),
          L = (0, l.Z)(q, 2),
          F = L[0],
          z = L[1],
          T = (0, o.useState)([]),
          E = (0, l.Z)(T, 2),
          A = E[0],
          M = E[1],
          V = (0, o.useState)([]),
          G = (0, l.Z)(V, 2),
          J = G[0],
          Y = G[1];
        (0, o.useEffect)(function () {
          var e = (function () {
            var e = (0, d.Z)(
              (0, n.Z)().mark(function e() {
                var s;
                return (0, n.Z)().wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (
                            (e.prev = 0),
                            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU",
                            (e.next = 4),
                            h.Z.get("http://18.118.42.224:3001/api/v1/users", {
                              headers: {
                                Authorization: "Bearer ".concat(
                                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU"
                                ),
                              },
                              params: { role: "teacher" },
                            })
                          );
                        case 4:
                          (s = e.sent),
                            console.log(s.data.data.docs),
                            M(s.data.data.docs),
                            (e.next = 12);
                          break;
                        case 9:
                          (e.prev = 9),
                            (e.t0 = e.catch(0)),
                            console.error("Error fetching users:", e.t0);
                        case 12:
                        case "end":
                          return e.stop();
                      }
                  },
                  e,
                  null,
                  [[0, 9]]
                );
              })
            );
            return function () {
              return e.apply(this, arguments);
            };
          })();
          e();
          var s = (function () {
            var e = (0, d.Z)(
              (0, n.Z)().mark(function e() {
                var s;
                return (0, n.Z)().wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (
                            (e.prev = 0),
                            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU",
                            (e.next = 4),
                            h.Z.get("http://18.118.42.224:3001/api/v1/users", {
                              headers: {
                                Authorization: "Bearer ".concat(
                                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU"
                                ),
                              },
                              params: { role: "student" },
                            })
                          );
                        case 4:
                          (s = e.sent),
                            console.log(s.data.data.docs),
                            Y(s.data.data.docs),
                            (e.next = 12);
                          break;
                        case 9:
                          (e.prev = 9),
                            (e.t0 = e.catch(0)),
                            console.error("Error fetching users:", e.t0);
                        case 12:
                        case "end":
                          return e.stop();
                      }
                  },
                  e,
                  null,
                  [[0, 9]]
                );
              })
            );
            return function () {
              return e.apply(this, arguments);
            };
          })();
          s();
        }, []);
        var X = function (e) {
            var s = e.target,
              a = s.name,
              t = s.value;
            x((0, r.Z)((0, r.Z)({}, u), {}, (0, i.Z)({}, a, t)));
          },
          U = (function () {
            var e = (0, d.Z)(
              (0, n.Z)().mark(function e(s) {
                return (0, n.Z)().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        s.preventDefault(),
                          !1 === s.currentTarget.checkValidity()
                            ? w(!0)
                            : (console.log("form is valid and good to ship"),
                              S(!0));
                      case 3:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function (s) {
              return e.apply(this, arguments);
            };
          })(),
          D = (function () {
            var s = (0, d.Z)(
              (0, n.Z)().mark(function s() {
                var a;
                return (0, n.Z)().wrap(function (s) {
                  for (;;)
                    switch ((s.prev = s.next)) {
                      case 0:
                        return (
                          console.log(u),
                          (s.next = 3),
                          h.Z.post(
                            "http://18.118.42.224:3001/api/v1/users/student",
                            {
                              firstName: u.firstName,
                              lastName: u.lastName,
                              itsNo: u.phoneNumber,
                              email: u.fatherEmailAddress,
                              photo: u.profilePic,
                              gender: "male",
                              password: u.studentPassword,
                              studentId: u.studentId,
                              class: u.class,
                              house: u.house,
                              division: u.division,
                              mentor: u.mentor,
                              siblings: u.siblings,
                              familyDetails: {
                                fatherFirstName: u.fatherFirstName,
                                fatherLastName: u.fatherLastName,
                                fatherPhone: u.fatherPhoneNumber,
                                fatherEmail: u.fatherEmailAddress,
                                motherFirstName: u.motherFirstName,
                                motherLastName: u.motherLastName,
                                motherPhone: u.motherPhoneNumber,
                                motherEmail: u.motherEmailAddress,
                              },
                              behaviousPoints: {
                                positivePoints: "500",
                                negativePoints: "200",
                              },
                              year: u.year,
                              term: u.term,
                            },
                            { headers: { Authorization: "Bearer ".concat(e) } }
                          )
                        );
                      case 3:
                        (a = s.sent), S(!1), console.log(a), B();
                      case 7:
                      case "end":
                        return s.stop();
                    }
                }, s);
              })
            );
            return function () {
              return s.apply(this, arguments);
            };
          })(),
          B = function () {
            v(!1),
              y(!1),
              w(!1),
              x({
                profilePic: "",
                firstName: "",
                lastName: "",
                studentPassword: "",
                ConfirmStudentPassword: "",
                class: "",
                house: "",
                phoneNumber: "",
                studentId: "",
                division: "",
                mentor: "",
                siblings: [],
                fatherFirstName: "",
                fatherLastName: "",
                fatherPhoneNumber: "",
                fatherEmailAddress: "",
                motherFirstName: "",
                motherLastName: "",
                motherPhoneNumber: "",
                motherEmailAddress: "",
                year: "",
                term: "",
              });
          },
          Q = (0, o.useState)([]),
          R = (0, l.Z)(Q, 2),
          H = R[0],
          _ = R[1];
        return (0, m.jsx)(m.Fragment, {
          children: (0, m.jsxs)(c.KB, {
            fluid: !0,
            className: "container overflow-auto",
            children: [
              (0, m.jsxs)(c.Tk, {
                backdrop: "static",
                visible: Z,
                onClose: function () {
                  return S(!1);
                },
                "aria-labelledby": "StaticBackdropExampleLabel",
                children: [
                  (0, m.jsx)(c.p0, {
                    children: (0, m.jsx)(c.fl, {
                      id: "StaticBackdropExampleLabel",
                      children: "Form submission",
                    }),
                  }),
                  (0, m.jsx)(c.sD, {
                    children: "Are you sure you wish to sumbit this form?",
                  }),
                  (0, m.jsxs)(c.Ym, {
                    children: [
                      (0, m.jsx)(c.u5, {
                        color: "secondary",
                        onClick: function () {
                          return S(!1);
                        },
                        children: "Close",
                      }),
                      (0, m.jsx)(c.u5, {
                        color: "primary",
                        onClick: D,
                        children: "Yes!",
                      }),
                    ],
                  }),
                ],
              }),
              (0, m.jsx)("div", {
                className: "display-5 text-center pb-3 font-weight-bold",
                children: "Add student",
              }),
              (0, m.jsx)("div", {
                className: "display-6 text-center pb-3",
                children: "Student information",
              }),
              (0, m.jsxs)(c.lx, {
                className: "row g-3 needs-validation",
                noValidate: !0,
                validated: g,
                onSubmit: U,
                children: [
                  (0, m.jsxs)(c.rb, {
                    children: [
                      (0, m.jsxs)(c.b7, {
                        md: 6,
                        className: "d-flex flex-column align-items-center col1",
                        children: [
                          (0, m.jsx)(c.b7, {
                            className: "pt-4",
                            children: (0, m.jsx)(c.jO, {
                              type: "file",
                              class: "form-control",
                              label: "Profile pic",
                              name: "profilePic",
                              id: "inputGroupFile02",
                              value: u.profilePic,
                              onChange: X,
                            }),
                          }),
                          (0, m.jsxs)(c.b7, {
                            children: [
                              (0, m.jsx)(c.L8, {
                                htmlFor: "validationCustomPassword",
                                children: "Password",
                              }),
                              (0, m.jsxs)(c.YR, {
                                className: "has-validation",
                                children: [
                                  (0, m.jsx)(c.wV, {
                                    onClick: function () {
                                      z("text" === F ? "password" : "text");
                                    },
                                    children: "@",
                                  }),
                                  (0, m.jsx)(c.jO, {
                                    type: F,
                                    "aria-describedby":
                                      "inputGroupPrependFeedback",
                                    id: "validationCustomPassword",
                                    name: "studentPassword",
                                    required: !0,
                                    value: u.studentPassword,
                                    onChange: X,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, m.jsxs)(c.b7, {
                            children: [
                              (0, m.jsx)(c.L8, {
                                htmlFor: "validationCustomConfirmPassword",
                                children: "Confirm Password",
                              }),
                              (0, m.jsxs)(c.YR, {
                                className: "has-validation",
                                children: [
                                  (0, m.jsx)(c.wV, { children: "@" }),
                                  (0, m.jsx)(c.jO, {
                                    type: F,
                                    "aria-describedby":
                                      "inputGroupPrependFeedback",
                                    id: "validationCustomConfirmPassword",
                                    name: "ConfirmStudentPassword",
                                    required: !0,
                                    value: u.ConfirmStudentPassword,
                                    onChange: X,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, m.jsx)(c.b7, {
                            className: "pt-2",
                            children: (0, m.jsx)(c.jO, {
                              type: "number",
                              feedbackValid: "Looks good!",
                              id: "validationCustom03",
                              label: "Home phone number",
                              name: "phoneNumber",
                              required: !0,
                              value: u.phoneNumber,
                              onChange: X,
                            }),
                          }),
                          (0, m.jsx)(c.b7, {
                            children: (0, m.jsxs)(c.LX, {
                              "aria-describedby": "validationCustom04Feedback",
                              feedbackInvalid:
                                "Please select a valid Division.",
                              id: "validationCustom04",
                              label: "Division",
                              name: "division",
                              required: !0,
                              value: u.division,
                              onChange: X,
                              children: [
                                (0, m.jsx)("option", {
                                  selected: "",
                                  disabled: "",
                                  value: "",
                                  children: "Choose...",
                                }),
                                (0, m.jsx)("option", { children: "div A" }),
                                (0, m.jsx)("option", { children: "div B" }),
                                (0, m.jsx)("option", { children: "div C" }),
                              ],
                            }),
                          }),
                          (0, m.jsxs)(c.b7, {
                            children: [
                              (0, m.jsxs)(c.LX, {
                                "aria-describedby":
                                  "validationCustom07Feedback",
                                feedbackInvalid:
                                  "Please select a valid Mentor.",
                                id: "validationCustom07",
                                label: "Sibilings",
                                name: "sibilings",
                                required: !0,
                                onChange: function (e) {
                                  var s = e.target.value;
                                  if (!H.includes(s)) {
                                    var a = [].concat((0, t.Z)(H), [s]);
                                    _(a),
                                      x(
                                        (0, r.Z)(
                                          (0, r.Z)({}, u),
                                          {},
                                          { siblings: a }
                                        )
                                      );
                                  }
                                },
                                children: [
                                  (0, m.jsx)("option", {
                                    selected: "",
                                    disabled: "",
                                    value: "",
                                    children: "Choose...",
                                  }),
                                  J.map(function (e) {
                                    return (0,
                                    m.jsxs)("option", { value: e._id, onClick: null, children: [e.firstName, " ", e.lastName] });
                                  }),
                                ],
                              }),
                              (0, m.jsxs)("div", {
                                children: [
                                  H.length > 0 &&
                                    H.map(function (e) {
                                      var s = J.find(function (s) {
                                        return s._id === e;
                                      });
                                      return (0,
                                      m.jsx)("span", { children: s && "".concat(s.firstName, " ").concat(s.lastName, ", ") }, e);
                                    }),
                                  (0, m.jsx)(c.u5, {
                                    className: "btn btn-md btn-dark",
                                    onClick: function () {
                                      _([]);
                                    },
                                    children: "reset",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, m.jsxs)(c.b7, {
                        md: 6,
                        className: "d-flex flex-column align-items-center col2",
                        children: [
                          (0, m.jsx)(c.b7, {
                            className: "pt-4",
                            children: (0, m.jsx)(c.jO, {
                              type: "text",
                              feedbackValid: "Looks good!",
                              id: "validationCustom01",
                              label: "First name",
                              name: "firstName",
                              required: !0,
                              value: u.firstName,
                              onChange: X,
                            }),
                          }),
                          (0, m.jsx)(c.b7, {
                            children: (0, m.jsx)(c.jO, {
                              type: "text",
                              feedbackValid: "Looks good!",
                              id: "validationCustom02",
                              label: "Last name",
                              name: "lastName",
                              required: !0,
                              value: u.lastName,
                              onChange: X,
                            }),
                          }),
                          (0, m.jsx)(c.b7, {
                            children: (0, m.jsxs)(c.LX, {
                              "aria-describedby": "validationCustom05Feedback",
                              feedbackInvalid: "Please select a valid Class.",
                              id: "validationCustom05",
                              label: "Class",
                              name: "class",
                              required: !0,
                              value: u.class,
                              onChange: X,
                              children: [
                                (0, m.jsx)("option", {
                                  selected: "",
                                  disabled: "",
                                  value: "",
                                  children: "Choose...",
                                }),
                                (0, m.jsx)("option", { children: "Grade 1" }),
                                (0, m.jsx)("option", { children: "Grade 2" }),
                                (0, m.jsx)("option", { children: "Grade 3" }),
                              ],
                            }),
                          }),
                          (0, m.jsx)(c.b7, {
                            children: (0, m.jsxs)(c.LX, {
                              "aria-describedby": "validationCustom06Feedback",
                              feedbackInvalid: "Please select a valid House.",
                              id: "validationCustom06",
                              label: "House",
                              name: "house",
                              required: !0,
                              value: u.house,
                              onChange: X,
                              children: [
                                (0, m.jsx)("option", {
                                  selected: "",
                                  disabled: "",
                                  value: "",
                                  children: "Choose...",
                                }),
                                (0, m.jsx)("option", {
                                  children: "Green house",
                                }),
                                (0, m.jsx)("option", {
                                  children: "Blue house",
                                }),
                                (0, m.jsx)("option", { children: "Red house" }),
                              ],
                            }),
                          }),
                          (0, m.jsxs)(c.b7, {
                            className: "pt-2",
                            children: [
                              (0, m.jsx)(c.jO, {
                                type: "text",
                                id: "validationCustom01",
                                label: "StudentId",
                                name: "studentId",
                                required: !0,
                                readOnly: !0,
                                value: u.studentId,
                                placeholder: "null-id",
                              }),
                              (0, m.jsx)(c.u5, {
                                color: "dark",
                                className: "float-end btn-md",
                                onClick: function () {
                                  var e =
                                    Date.now().toString(36) +
                                    Math.random().toString(36).substr(2, 5);
                                  x(
                                    (0, r.Z)(
                                      (0, r.Z)({}, u),
                                      {},
                                      { studentId: e }
                                    )
                                  );
                                },
                                children: "Generate id",
                              }),
                            ],
                          }),
                          (0, m.jsx)(c.b7, {
                            children: (0, m.jsxs)(c.LX, {
                              "aria-describedby": "validationCustom07Feedback",
                              feedbackInvalid: "Please select a valid Mentor.",
                              id: "validationCustom07",
                              label: "Mentor",
                              name: "mentor",
                              required: !0,
                              value: u.mentor,
                              onChange: X,
                              children: [
                                (0, m.jsx)("option", {
                                  selected: "",
                                  disabled: "",
                                  value: "",
                                  children: "Choose...",
                                }),
                                A.map(function (e) {
                                  return (0,
                                  m.jsx)("option", { value: e._id, children: e.firstName });
                                }),
                              ],
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, m.jsxs)(c.KB, {
                    fluid: !0,
                    className: " d-flex mt-4",
                    children: [
                      (0, m.jsxs)(c.KB, {
                        fluid: !0,
                        className: "father-info",
                        children: [
                          (0, m.jsx)("div", {
                            className: "display-6 text-center pb-3",
                            children: "Father details",
                          }),
                          (0, m.jsx)(c.rb, {
                            children: (0, m.jsxs)(c.b7, {
                              md: 12,
                              className: "fathers-column",
                              children: [
                                (0, m.jsx)(c.b7, {
                                  children: (0, m.jsx)(c.jO, {
                                    type: "text",
                                    feedbackValid: "Looks good!",
                                    id: "validationCustom02",
                                    label: "Fathers first name",
                                    name: "fatherFirstName",
                                    required: !0,
                                    value: u.fatherFirstName,
                                    onChange: X,
                                  }),
                                }),
                                (0, m.jsx)(c.b7, {
                                  children: (0, m.jsx)(c.jO, {
                                    type: "text",
                                    feedbackValid: "Looks good!",
                                    id: "validationCustom02",
                                    label: "Fathers last name",
                                    name: "fatherLastName",
                                    required: !0,
                                    value: u.fatherLastName,
                                    onChange: X,
                                  }),
                                }),
                                (0, m.jsx)(c.b7, {
                                  children: (0, m.jsx)(c.jO, {
                                    type: "number",
                                    feedbackValid: "Looks good!",
                                    id: "validationCustom02",
                                    label: "Fathers phone number",
                                    name: "fatherPhoneNumber",
                                    required: !0,
                                    value: u.fatherPhoneNumber,
                                    onChange: X,
                                  }),
                                }),
                                (0, m.jsx)(c.b7, {
                                  children: (0, m.jsx)(c.jO, {
                                    type: "email",
                                    feedbackValid: "Looks good!",
                                    id: "validationCustom02",
                                    label: "Fathers email address",
                                    name: "fatherEmailAddress",
                                    required: !0,
                                    value: u.fatherEmailAddress,
                                    onChange: X,
                                  }),
                                }),
                              ],
                            }),
                          }),
                        ],
                      }),
                      (0, m.jsxs)(c.KB, {
                        fluid: !0,
                        className: "mother-info",
                        children: [
                          (0, m.jsx)("div", {
                            className: "display-6 text-center pb-3",
                            children: "Mother details",
                          }),
                          (0, m.jsx)(c.rb, {
                            children: (0, m.jsxs)(c.b7, {
                              md: 12,
                              className: "mothers-column",
                              children: [
                                (0, m.jsx)(c.b7, {
                                  children: (0, m.jsx)(c.jO, {
                                    type: "text",
                                    feedbackValid: "Looks good!",
                                    id: "validationCustom02",
                                    label: "Mothers first name",
                                    name: "motherFirstName",
                                    required: !0,
                                    value: u.motherFirstName,
                                    onChange: X,
                                  }),
                                }),
                                (0, m.jsx)(c.b7, {
                                  children: (0, m.jsx)(c.jO, {
                                    type: "text",
                                    feedbackValid: "Looks good!",
                                    id: "validationCustom02",
                                    label: "Mothers last name",
                                    name: "motherLastName",
                                    required: !0,
                                    value: u.motherLastName,
                                    onChange: X,
                                  }),
                                }),
                                (0, m.jsx)(c.b7, {
                                  children: (0, m.jsx)(c.jO, {
                                    type: "number",
                                    feedbackValid: "Looks good!",
                                    id: "validationCustom02",
                                    label: "Mothers phone number",
                                    name: "motherPhoneNumber",
                                    required: !0,
                                    value: u.motherPhoneNumber,
                                    onChange: X,
                                  }),
                                }),
                                (0, m.jsx)(c.b7, {
                                  children: (0, m.jsx)(c.jO, {
                                    type: "email",
                                    feedbackValid: "Looks good!",
                                    id: "validationCustom02",
                                    label: "Mothers email address",
                                    name: "motherEmailAddress",
                                    required: !0,
                                    value: u.motherEmailAddress,
                                    onChange: X,
                                  }),
                                }),
                              ],
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, m.jsxs)(c.KB, {
                    fluid: !0,
                    className: "Academic details mt-4",
                    children: [
                      (0, m.jsx)("div", {
                        className: "display-6 text-center pb-3",
                        children: "Academic details",
                      }),
                      (0, m.jsxs)(c.rb, {
                        children: [
                          (0, m.jsxs)(c.b7, {
                            md: 6,
                            className: "academin-col1",
                            children: [
                              (0, m.jsx)(c.b7, {
                                children: (0, m.jsxs)(c.LX, {
                                  "aria-describedby":
                                    "validationCustom07Feedback",
                                  feedbackInvalid:
                                    "Please select a valid year.",
                                  id: "validationCustom07",
                                  label: "Select year",
                                  name: "year",
                                  required: !0,
                                  value: u.year,
                                  onChange: X,
                                  children: [
                                    (0, m.jsx)("option", {
                                      selected: "",
                                      disabled: "",
                                      value: "",
                                      children: "Choose...",
                                    }),
                                    (0, m.jsx)("option", {
                                      children: "2019-20",
                                    }),
                                    (0, m.jsx)("option", {
                                      children: "2020-21",
                                    }),
                                    (0, m.jsx)("option", {
                                      children: "2021-22",
                                    }),
                                  ],
                                }),
                              }),
                              (0, m.jsx)(c.b7, {
                                className: "pt-4",
                                children: (0, m.jsxs)(c.rb, {
                                  className: "align-items-center",
                                  children: [
                                    (0, m.jsx)(c.b7, {
                                      md: 6,
                                      children: (0, m.jsx)("p", {
                                        children: "Attendence:",
                                      }),
                                    }),
                                    (0, m.jsxs)(c.b7, {
                                      md: 6,
                                      children: [
                                        (0, m.jsx)(c.jO, {
                                          type: "text",
                                          id: "validationCustom01",
                                          label: "Total days",
                                          required: !0,
                                          readOnly: !0,
                                          value: "10",
                                        }),
                                        (0, m.jsx)(c.jO, {
                                          type: "text",
                                          id: "validationCustom01",
                                          label: "Present",
                                          required: !0,
                                          readOnly: !0,
                                          value: "8",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              }),
                              (0, m.jsx)(c.b7, {
                                className: "pt-4",
                                children: (0, m.jsxs)(c.rb, {
                                  children: [
                                    (0, m.jsx)(c.b7, {
                                      md: 6,
                                      children: (0, m.jsx)("p", {
                                        children: "Student report:",
                                      }),
                                    }),
                                    (0, m.jsxs)(c.b7, {
                                      md: 6,
                                      children: [
                                        (0, m.jsx)(c.jO, {
                                          type: "text",
                                          id: "validationCustom01",
                                          required: !0,
                                          readOnly: !0,
                                          value: "80%",
                                        }),
                                        (0, m.jsx)(c.u5, {
                                          color: "dark",
                                          className: "float-end btn-md",
                                          children: "Download pdf",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              }),
                              (0, m.jsx)(c.b7, {
                                className: "pt-4",
                                children: (0, m.jsxs)(c.rb, {
                                  className: "align-items-center",
                                  children: [
                                    (0, m.jsx)(c.b7, {
                                      md: 6,
                                      children: (0, m.jsx)("p", {
                                        children: "Leave request:",
                                      }),
                                    }),
                                    (0, m.jsxs)(c.b7, {
                                      md: 6,
                                      children: [
                                        (0, m.jsx)(c.jO, {
                                          type: "text",
                                          id: "validationCustom01",
                                          label: "Total req",
                                          required: !0,
                                          readOnly: !0,
                                          value: "20",
                                        }),
                                        (0, m.jsx)(c.jO, {
                                          type: "text",
                                          id: "validationCustom01",
                                          label: "App req",
                                          required: !0,
                                          readOnly: !0,
                                          value: "17",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              }),
                              (0, m.jsx)(c.b7, {
                                className: "pt-4",
                                children: (0, m.jsxs)(c.rb, {
                                  className: "align-items-center",
                                  children: [
                                    (0, m.jsx)(c.b7, {
                                      md: 6,
                                      children: (0, m.jsx)("p", {
                                        children: "Fees:",
                                      }),
                                    }),
                                    (0, m.jsxs)(c.b7, {
                                      md: 6,
                                      children: [
                                        (0, m.jsx)(c.jO, {
                                          type: "text",
                                          id: "validationCustom01",
                                          label: "Total",
                                          required: !0,
                                          readOnly: !0,
                                          value: "10000",
                                        }),
                                        (0, m.jsx)(c.jO, {
                                          type: "text",
                                          id: "validationCustom01",
                                          label: "Paid",
                                          required: !0,
                                          readOnly: !0,
                                          value: "7000",
                                        }),
                                        (0, m.jsx)(c.jO, {
                                          type: "text",
                                          id: "validationCustom01",
                                          label: "Pending",
                                          required: !0,
                                          readOnly: !0,
                                          value: "3000",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              }),
                            ],
                          }),
                          (0, m.jsxs)(c.b7, {
                            md: 6,
                            className: "academin-col2",
                            children: [
                              (0, m.jsx)(c.b7, {
                                children: (0, m.jsxs)(c.LX, {
                                  "aria-describedby":
                                    "validationCustom07Feedback",
                                  feedbackInvalid:
                                    "Please select a valid term.",
                                  id: "validationCustom07",
                                  label: "Select term",
                                  name: "term",
                                  required: !0,
                                  value: u.term,
                                  onChange: X,
                                  children: [
                                    (0, m.jsx)("option", {
                                      selected: "",
                                      disabled: "",
                                      value: "",
                                      children: "Choose...",
                                    }),
                                    (0, m.jsx)("option", {
                                      children: "1st term",
                                    }),
                                    (0, m.jsx)("option", {
                                      children: "2nd term",
                                    }),
                                    (0, m.jsx)("option", { children: "both" }),
                                  ],
                                }),
                              }),
                              (0, m.jsx)(c.b7, {
                                className: "pt-4",
                                children: (0, m.jsxs)(c.rb, {
                                  className: "align-items-center",
                                  children: [
                                    (0, m.jsx)(c.b7, {
                                      md: 6,
                                      children: (0, m.jsx)("p", {
                                        children: "Behavious points:",
                                      }),
                                    }),
                                    (0, m.jsxs)(c.b7, {
                                      md: 6,
                                      children: [
                                        (0, m.jsx)(c.jO, {
                                          type: "text",
                                          id: "validationCustom01",
                                          label: "+ve points",
                                          required: !0,
                                          readOnly: !0,
                                          value: "20",
                                        }),
                                        (0, m.jsx)(c.jO, {
                                          type: "text",
                                          id: "validationCustom01",
                                          label: "-ve points",
                                          required: !0,
                                          readOnly: !0,
                                          value: "17",
                                        }),
                                      ],
                                    }),
                                    (0, m.jsx)(c.b7, {
                                      md: 6,
                                      className: "mt-4",
                                      children: (0, m.jsx)("p", {
                                        children: "Homework status:",
                                      }),
                                    }),
                                    (0, m.jsxs)(c.b7, {
                                      md: 6,
                                      className: "mt-4",
                                      children: [
                                        (0, m.jsx)(c.jO, {
                                          type: "text",
                                          id: "validationCustom01",
                                          label: "Total",
                                          required: !0,
                                          readOnly: !0,
                                          value: "5",
                                        }),
                                        (0, m.jsx)(c.jO, {
                                          type: "text",
                                          id: "validationCustom01",
                                          label: "Completed",
                                          required: !0,
                                          readOnly: !0,
                                          value: "3",
                                        }),
                                      ],
                                    }),
                                    (0, m.jsx)(c.b7, {
                                      md: 6,
                                      className: "mt-4",
                                      children: (0, m.jsx)("p", {
                                        children: "Notifications:",
                                      }),
                                    }),
                                    (0, m.jsxs)(c.b7, {
                                      md: 6,
                                      className: "mt-4 d-flex",
                                      children: [
                                        (0, m.jsx)(c.u5, {
                                          color: "dark",
                                          className: "float-end btn-md",
                                          onClick: function () {
                                            v(!0);
                                          },
                                          children: "Individual",
                                        }),
                                        (0, m.jsx)(c.u5, {
                                          color: "dark",
                                          className: "float-end btn-md",
                                          onClick: function () {
                                            y(!0);
                                          },
                                          children: "General",
                                        }),
                                      ],
                                    }),
                                    (0, m.jsx)(c.KB, {
                                      className: "d-flex tables mt-3",
                                      children: (0, m.jsxs)(c.rb, {
                                        children: [
                                          (0, m.jsx)(c.b7, {
                                            md: 12,
                                            className: "table1",
                                            children: p
                                              ? (0, m.jsxs)("table", {
                                                  class: "table table-bordered",
                                                  children: [
                                                    (0, m.jsx)("thead", {
                                                      children: (0, m.jsxs)(
                                                        "tr",
                                                        {
                                                          children: [
                                                            (0, m.jsx)("th", {
                                                              scope: "col",
                                                              children: "#",
                                                            }),
                                                            (0, m.jsx)("th", {
                                                              scope: "col",
                                                              children: "Date",
                                                            }),
                                                            (0, m.jsx)("th", {
                                                              scope: "col",
                                                              children:
                                                                "Sent by",
                                                            }),
                                                            (0, m.jsx)("th", {
                                                              scope: "col",
                                                              children:
                                                                "Message",
                                                            }),
                                                          ],
                                                        }
                                                      ),
                                                    }),
                                                    (0, m.jsxs)("tbody", {
                                                      children: [
                                                        (0, m.jsxs)("tr", {
                                                          children: [
                                                            (0, m.jsx)("th", {
                                                              scope: "row",
                                                              children: "1",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children:
                                                                "20/09/2023",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children: "Otto",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children:
                                                                "Hi there",
                                                            }),
                                                          ],
                                                        }),
                                                        (0, m.jsxs)("tr", {
                                                          children: [
                                                            (0, m.jsx)("th", {
                                                              scope: "row",
                                                              children: "2",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children:
                                                                "20/09/2023",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children:
                                                                "Thornton",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children:
                                                                "Hows it going",
                                                            }),
                                                          ],
                                                        }),
                                                        (0, m.jsxs)("tr", {
                                                          children: [
                                                            (0, m.jsx)("th", {
                                                              scope: "row",
                                                              children: "3",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children:
                                                                "20/09/2023",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children:
                                                                "Forsen",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children:
                                                                "Detailed message",
                                                            }),
                                                          ],
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                })
                                              : null,
                                          }),
                                          (0, m.jsx)(c.b7, {
                                            md: 12,
                                            className: "table2",
                                            children: C
                                              ? (0, m.jsxs)("table", {
                                                  class: "table table-bordered",
                                                  children: [
                                                    (0, m.jsx)("thead", {
                                                      children: (0, m.jsxs)(
                                                        "tr",
                                                        {
                                                          children: [
                                                            (0, m.jsx)("th", {
                                                              scope: "col",
                                                              children: "#",
                                                            }),
                                                            (0, m.jsx)("th", {
                                                              scope: "col",
                                                              children: "Date",
                                                            }),
                                                            (0, m.jsx)("th", {
                                                              scope: "col",
                                                              children:
                                                                "Sent by",
                                                            }),
                                                            (0, m.jsx)("th", {
                                                              scope: "col",
                                                              children:
                                                                "Sent To",
                                                            }),
                                                            (0, m.jsx)("th", {
                                                              scope: "col",
                                                              children:
                                                                "Message",
                                                            }),
                                                          ],
                                                        }
                                                      ),
                                                    }),
                                                    (0, m.jsxs)("tbody", {
                                                      children: [
                                                        (0, m.jsxs)("tr", {
                                                          children: [
                                                            (0, m.jsx)("th", {
                                                              scope: "row",
                                                              children: "1",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children:
                                                                "20/09/2023",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children: "Otto",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children:
                                                                "Class 2nd",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children:
                                                                "Hi there",
                                                            }),
                                                          ],
                                                        }),
                                                        (0, m.jsxs)("tr", {
                                                          children: [
                                                            (0, m.jsx)("th", {
                                                              scope: "row",
                                                              children: "2",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children:
                                                                "20/09/2023",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children:
                                                                "Thornton",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children:
                                                                "Class 3rd",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children:
                                                                "Hows it going",
                                                            }),
                                                          ],
                                                        }),
                                                        (0, m.jsxs)("tr", {
                                                          children: [
                                                            (0, m.jsx)("th", {
                                                              scope: "row",
                                                              children: "3",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children:
                                                                "20/09/2023",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children:
                                                                "Forsen",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children: "xyz",
                                                            }),
                                                            (0, m.jsx)("td", {
                                                              children:
                                                                "Detailed message",
                                                            }),
                                                          ],
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                })
                                              : null,
                                          }),
                                        ],
                                      }),
                                    }),
                                  ],
                                }),
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, m.jsxs)("div", {
                    className: "buttons text-center",
                    children: [
                      (0, m.jsx)(c.u5, {
                        color: "primary",
                        type: "submit",
                        children: "Submit form",
                      }),
                      (0, m.jsx)(c.u5, {
                        color: "dark",
                        type: "reset",
                        onClick: B,
                        children: "Reset form",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        });
      };
    },
  },
]);
//# sourceMappingURL=860.7a78c90f.chunk.js.map
