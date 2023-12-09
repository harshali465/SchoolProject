"use strict";
(self.webpackChunkhoustonschoolfront =
  self.webpackChunkhoustonschoolfront || []).push([
  [885],
  {
    9885: function (e, s, r) {
      r.r(s);
      var d = r(4942),
        t = r(1413),
        c = r(9439),
        i = r(4165),
        l = r(5861),
        n = r(2791),
        a = r(8983),
        o = r(4846),
        h = r(3647),
        x = (r(1323), r(6772), r(2957), r(1243)),
        j = r(9513),
        p = r.n(j),
        m = (r(8639), r(7689)),
        u = r(184);
      s.default = function () {
        (0, m.s0)();
        var e = (0, m.TH)().state.studentid,
          s = (function () {
            var s = (0, l.Z)(
              (0, i.Z)().mark(function s() {
                var r, d;
                return (0, i.Z)().wrap(
                  function (s) {
                    for (;;)
                      switch ((s.prev = s.next)) {
                        case 0:
                          return (
                            (s.prev = 0),
                            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU",
                            (s.next = 4),
                            x.Z.get(
                              "http://18.118.42.224:3001/api/v1/users/".concat(
                                e
                              ),
                              {
                                headers: {
                                  Authorization: "Bearer ".concat(
                                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU"
                                  ),
                                },
                              }
                            )
                          );
                        case 4:
                          (r = s.sent),
                            console.log(r.data.data),
                            (d = r.data.data) &&
                              f({
                                profilePic: "",
                                firstName: d.firstName,
                                lastName: d.lastName,
                                teacherPassword: "",
                                confirmTeacherPassword: "",
                                phoneNumber: d.itsNo,
                                email: d.email,
                                teachertype: d.teachertype,
                                section: d.section,
                              }),
                            (s.next = 13);
                          break;
                        case 10:
                          (s.prev = 10),
                            (s.t0 = s.catch(0)),
                            console.error("Error fetching users:", s.t0);
                        case 13:
                        case "end":
                          return s.stop();
                      }
                  },
                  s,
                  null,
                  [[0, 10]]
                );
              })
            );
            return function () {
              return s.apply(this, arguments);
            };
          })();
        (0, n.useEffect)(function () {
          s();
        }, []);
        var r = localStorage.getItem("accessToken"),
          j = (0, n.useState)({
            profilePic: "",
            firstName: "",
            lastName: "",
            teacherPassword: "",
            confirmTeacherPassword: "",
            phoneNumber: "",
            email: "",
            teachertype: "",
            section: "",
            division: "",
          }),
          b = (0, c.Z)(j, 2),
          v = b[0],
          f = b[1],
          N = (0, n.useState)(!0),
          g = (0, c.Z)(N, 2),
          w = (g[0], g[1]),
          C = (0, n.useState)(!1),
          y = (0, c.Z)(C, 2),
          D = (y[0], y[1]),
          k = (0, n.useState)(!1),
          T = (0, c.Z)(k, 2),
          I = T[0],
          P = T[1],
          Z = (0, n.useState)(!1),
          O = (0, c.Z)(Z, 2),
          S = O[0],
          F = O[1],
          A = function (e) {
            var s = e.target,
              r = s.name,
              c = s.value;
            f((0, t.Z)((0, t.Z)({}, v), {}, (0, d.Z)({}, r, c)));
          },
          z = (function () {
            var e = (0, l.Z)(
              (0, i.Z)().mark(function e(s) {
                return (0, i.Z)().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        s.preventDefault(),
                          !1 === s.currentTarget.checkValidity()
                            ? P(!0)
                            : (console.log("form is valid and good to ship"),
                              F(!0));
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
          B = (0, n.useState)(new Date()),
          V = (0, c.Z)(B, 2),
          R = V[0],
          E = V[1],
          L = (0, n.useState)(null),
          M = (0, c.Z)(L, 2),
          q = M[0],
          Y = M[1],
          U = function (e) {
            E(e[0]), Y(e[1]);
          },
          J = (function () {
            var s = (0, l.Z)(
              (0, i.Z)().mark(function s() {
                var d;
                return (0, i.Z)().wrap(function (s) {
                  for (;;)
                    switch ((s.prev = s.next)) {
                      case 0:
                        return (
                          console.log(v),
                          (s.next = 3),
                          x.Z.patch(
                            "http://18.118.42.224:3001/api/v1/users/".concat(e),
                            {
                              firstName: v.firstName,
                              lastName: v.lastName,
                              itsNo: v.phoneNumber,
                              email: v.email,
                              photo: v.profilePic,
                              gender: "male",
                              role: "teacher",
                              class: "CT 3rd grade",
                              password: v.teacherPassword,
                              teachertype: v.teachertype,
                              section: v.section,
                              behaviousPoints: {
                                positivePoints: "500",
                                negativePoints: "200",
                              },
                            },
                            { headers: { Authorization: "Bearer ".concat(r) } }
                          )
                        );
                      case 3:
                        (d = s.sent), F(!1), console.log(d), G();
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
          G = function () {
            w(!1),
              D(!1),
              P(!1),
              f({
                profilePic: "",
                firstName: "",
                lastName: "",
                teacherPassword: "",
                confirmTeacherPassword: "",
                phoneNumber: "",
                email: "",
                teachertype: "",
                section: "",
              });
          };
        return (0, u.jsx)(u.Fragment, {
          children: (0, u.jsxs)(a.KB, {
            fluid: !0,
            className: "container overflow-auto",
            children: [
              (0, u.jsxs)(a.Tk, {
                backdrop: "static",
                visible: S,
                onClose: function () {
                  return F(!1);
                },
                "aria-labelledby": "StaticBackdropExampleLabel",
                children: [
                  (0, u.jsx)(a.p0, {
                    children: (0, u.jsx)(a.fl, {
                      id: "StaticBackdropExampleLabel",
                      children: "Form submission",
                    }),
                  }),
                  (0, u.jsx)(a.sD, {
                    children: "Are you sure you wish to sumbit this form?",
                  }),
                  (0, u.jsxs)(a.Ym, {
                    children: [
                      (0, u.jsx)(a.u5, {
                        color: "secondary",
                        onClick: function () {
                          return F(!1);
                        },
                        children: "Close",
                      }),
                      (0, u.jsx)(a.u5, {
                        color: "primary",
                        onClick: J,
                        children: "Yes!",
                      }),
                    ],
                  }),
                ],
              }),
              (0, u.jsx)("div", {
                className: "display-5 text-center pb-3 font-weight-bold",
                children: "Edit teacher",
              }),
              (0, u.jsx)("div", {
                className: "display-6 text-center pb-3",
                children: "Teacher information",
              }),
              (0, u.jsxs)(a.lx, {
                className: "row needs-validation",
                noValidate: !0,
                validated: I,
                onSubmit: z,
                children: [
                  (0, u.jsxs)(a.rb, {
                    children: [
                      (0, u.jsxs)(a.b7, {
                        md: 6,
                        className: "d-flex flex-column align-items-center col1",
                        children: [
                          (0, u.jsx)(a.b7, {
                            className: "pt-4",
                            children: (0, u.jsx)(a.jO, {
                              type: "file",
                              class: "form-control",
                              label: "Profile pic",
                              name: "profilePic",
                              id: "inputGroupFile02",
                              value: v.profilePic,
                              onChange: A,
                            }),
                          }),
                          (0, u.jsxs)(a.b7, {
                            children: [
                              (0, u.jsx)(a.L8, {
                                htmlFor: "validationCustomPassword",
                                children: "Password",
                              }),
                              (0, u.jsxs)(a.YR, {
                                className: "has-validation",
                                children: [
                                  (0, u.jsx)(a.wV, {
                                    children: (0, u.jsx)(o.Z, { icon: h.U }),
                                  }),
                                  (0, u.jsx)(a.jO, {
                                    type: "password",
                                    "aria-describedby":
                                      "inputGroupPrependFeedback",
                                    id: "validationCustomPassword",
                                    name: "teacherPassword",
                                    required: !0,
                                    value: v.teacherPassword,
                                    onChange: A,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, u.jsxs)(a.b7, {
                            children: [
                              (0, u.jsx)(a.L8, {
                                htmlFor: "validationCustomConfirmPassword",
                                children: "Confirm Password",
                              }),
                              (0, u.jsxs)(a.YR, {
                                className: "has-validation",
                                children: [
                                  (0, u.jsx)(a.wV, {
                                    children: (0, u.jsx)(o.Z, { icon: h.U }),
                                  }),
                                  (0, u.jsx)(a.jO, {
                                    type: "password",
                                    "aria-describedby":
                                      "inputGroupPrependFeedback",
                                    id: "validationCustomConfirmPassword",
                                    name: "confirmTeacherPassword",
                                    required: !0,
                                    value: v.confirmTeacherPassword,
                                    onChange: A,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, u.jsx)(a.b7, {
                            className: "pt-2",
                            children: (0, u.jsx)(a.jO, {
                              type: "number",
                              feedbackValid: "Looks good!",
                              id: "validationCustom03",
                              label: "Home phone number",
                              name: "phoneNumber",
                              required: !0,
                              value: v.phoneNumber,
                              onChange: A,
                            }),
                          }),
                          (0, u.jsx)(a.b7, {
                            children: (0, u.jsxs)(a.LX, {
                              "aria-describedby": "validationCustom04Feedback",
                              feedbackInvalid:
                                "Please select a valid Division.",
                              id: "validationCustom04",
                              label: "Teacher type",
                              name: "teachertype",
                              required: !0,
                              value: v.teachertype,
                              onChange: A,
                              children: [
                                (0, u.jsx)("option", {
                                  selected: "",
                                  disabled: "",
                                  value: "",
                                  children: "Choose...",
                                }),
                                (0, u.jsx)("option", { children: "Class T" }),
                                (0, u.jsx)("option", { children: "Assist T" }),
                                (0, u.jsx)("option", { children: "Subject T" }),
                              ],
                            }),
                          }),
                        ],
                      }),
                      (0, u.jsxs)(a.b7, {
                        md: 6,
                        className: "d-flex flex-column align-items-center col2",
                        children: [
                          (0, u.jsx)(a.b7, {
                            className: "pt-4",
                            children: (0, u.jsx)(a.jO, {
                              type: "text",
                              feedbackValid: "Looks good!",
                              id: "validationCustom01",
                              label: "First name",
                              name: "firstName",
                              required: !0,
                              value: v.firstName,
                              onChange: A,
                            }),
                          }),
                          (0, u.jsx)(a.b7, {
                            children: (0, u.jsx)(a.jO, {
                              type: "text",
                              feedbackValid: "Looks good!",
                              id: "validationCustom02",
                              label: "Last name",
                              name: "lastName",
                              required: !0,
                              value: v.lastName,
                              onChange: A,
                            }),
                          }),
                          (0, u.jsx)(a.b7, {
                            children: (0, u.jsx)(a.jO, {
                              type: "email",
                              feedbackValid: "Looks good!",
                              id: "validationCustom02",
                              label: "Email address",
                              name: "email",
                              required: !0,
                              value: v.email,
                              onChange: A,
                            }),
                          }),
                          (0, u.jsx)(a.b7, {
                            children: (0, u.jsxs)(a.LX, {
                              "aria-describedby": "validationCustom07Feedback",
                              feedbackInvalid: "Please select a valid Mentor.",
                              id: "validationCustom07",
                              label: "Section",
                              name: "section",
                              required: !0,
                              value: v.section,
                              onChange: A,
                              children: [
                                (0, u.jsx)("option", {
                                  selected: "",
                                  disabled: "",
                                  value: "",
                                  children: "Choose...",
                                }),
                                (0, u.jsx)("option", {
                                  children: "Pre primary",
                                }),
                                (0, u.jsx)("option", { children: "Primary" }),
                                (0, u.jsx)("option", { children: "Secondary" }),
                              ],
                            }),
                          }),
                        ],
                      }),
                      (0, u.jsx)(a.KB, {
                        fluid: !0,
                        className: "Academic details mt-4",
                        children: (0, u.jsxs)(a.rb, {
                          children: [
                            (0, u.jsxs)(a.b7, {
                              md: 6,
                              className: "academin-col1",
                              children: [
                                (0, u.jsxs)(a.b7, {
                                  className: "mt-4",
                                  children: [
                                    (0, u.jsx)("p", {
                                      children: "Mentorship status:",
                                    }),
                                    (0, u.jsxs)("table", {
                                      class: "table table-bordered",
                                      children: [
                                        (0, u.jsx)("thead", {
                                          children: (0, u.jsxs)("tr", {
                                            children: [
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "#",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Name",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Class",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Division",
                                              }),
                                            ],
                                          }),
                                        }),
                                        (0, u.jsxs)("tbody", {
                                          children: [
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "1",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Otto",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "4th grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "div A",
                                                }),
                                              ],
                                            }),
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "2",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Thornton",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "3rd grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Div B",
                                                }),
                                              ],
                                            }),
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "3",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Forsen",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "2nd grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "div C",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                (0, u.jsxs)(a.b7, {
                                  className: "mt-4",
                                  children: [
                                    (0, u.jsxs)("div", {
                                      className: "d-flex",
                                      children: [
                                        (0, u.jsx)("p", {
                                          className: "p-2",
                                          children: "Teacher Attendence:",
                                        }),
                                        (0, u.jsx)(p(), {
                                          selected: R,
                                          startDate: R,
                                          endDate: q,
                                          onChange: U,
                                          selectsRange: !0,
                                        }),
                                      ],
                                    }),
                                    (0, u.jsxs)("table", {
                                      class: "table table-bordered mt-2",
                                      children: [
                                        (0, u.jsx)("thead", {
                                          children: (0, u.jsxs)("tr", {
                                            children: [
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "#",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Name",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Class",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Division",
                                              }),
                                            ],
                                          }),
                                        }),
                                        (0, u.jsxs)("tbody", {
                                          children: [
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "1",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Otto",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "4th grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "div A",
                                                }),
                                              ],
                                            }),
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "2",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Thornton",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "3rd grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Div B",
                                                }),
                                              ],
                                            }),
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "3",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Forsen",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "2nd grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "div C",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                (0, u.jsxs)(a.b7, {
                                  className: "mt-4",
                                  children: [
                                    (0, u.jsxs)("div", {
                                      className: "d-flex",
                                      children: [
                                        (0, u.jsx)("p", {
                                          className: "p-2",
                                          children: "Extra classes taken:",
                                        }),
                                        (0, u.jsx)(p(), {
                                          selected: R,
                                          startDate: R,
                                          endDate: q,
                                          onChange: U,
                                          selectsRange: !0,
                                        }),
                                      ],
                                    }),
                                    (0, u.jsxs)("table", {
                                      class: "table table-bordered mt-2",
                                      children: [
                                        (0, u.jsx)("thead", {
                                          children: (0, u.jsxs)("tr", {
                                            children: [
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "#",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Name",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Class",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Division",
                                              }),
                                            ],
                                          }),
                                        }),
                                        (0, u.jsxs)("tbody", {
                                          children: [
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "1",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Otto",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "4th grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "div A",
                                                }),
                                              ],
                                            }),
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "2",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Thornton",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "3rd grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Div B",
                                                }),
                                              ],
                                            }),
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "3",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Forsen",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "2nd grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "div C",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                (0, u.jsxs)(a.b7, {
                                  className: "mt-4",
                                  children: [
                                    (0, u.jsxs)("div", {
                                      className: "d-flex",
                                      children: [
                                        (0, u.jsx)("p", {
                                          className: "p-2",
                                          children: "Notifications sent:",
                                        }),
                                        (0, u.jsx)(p(), {
                                          selected: R,
                                          startDate: R,
                                          endDate: q,
                                          onChange: U,
                                          selectsRange: !0,
                                        }),
                                      ],
                                    }),
                                    (0, u.jsxs)("table", {
                                      class: "table table-bordered mt-2",
                                      children: [
                                        (0, u.jsx)("thead", {
                                          children: (0, u.jsxs)("tr", {
                                            children: [
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "#",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Name",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Class",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Division",
                                              }),
                                            ],
                                          }),
                                        }),
                                        (0, u.jsxs)("tbody", {
                                          children: [
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "1",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Otto",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "4th grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "div A",
                                                }),
                                              ],
                                            }),
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "2",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Thornton",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "3rd grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Div B",
                                                }),
                                              ],
                                            }),
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "3",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Forsen",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "2nd grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "div C",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                (0, u.jsxs)(a.rb, {
                                  children: [
                                    (0, u.jsx)(a.b7, {
                                      md: 6,
                                      children: (0, u.jsx)("p", {
                                        children: "Behavious points:",
                                      }),
                                    }),
                                    (0, u.jsxs)(a.b7, {
                                      md: 6,
                                      children: [
                                        (0, u.jsx)(a.jO, {
                                          type: "text",
                                          id: "validationCustom01",
                                          label: "+ve points",
                                          required: !0,
                                          readOnly: !0,
                                          value: "20",
                                        }),
                                        (0, u.jsx)(a.jO, {
                                          type: "text",
                                          id: "validationCustom01",
                                          label: "-ve points",
                                          required: !0,
                                          readOnly: !0,
                                          value: "17",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, u.jsxs)(a.b7, {
                              md: 6,
                              className: "academin-col2",
                              children: [
                                (0, u.jsxs)(a.b7, {
                                  className: "mt-4",
                                  children: [
                                    (0, u.jsxs)("div", {
                                      className: "d-flex",
                                      children: [
                                        (0, u.jsx)("p", {
                                          children: "Time table:",
                                        }),
                                        (0, u.jsx)(p(), {
                                          selected: R,
                                          startDate: R,
                                          endDate: q,
                                          onChange: U,
                                          selectsRange: !0,
                                        }),
                                      ],
                                    }),
                                    (0, u.jsxs)("table", {
                                      class: "table table-bordered",
                                      children: [
                                        (0, u.jsx)("thead", {
                                          children: (0, u.jsxs)("tr", {
                                            children: [
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "#",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Time",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Class",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Division",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Subject",
                                              }),
                                            ],
                                          }),
                                        }),
                                        (0, u.jsxs)("tbody", {
                                          children: [
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "1",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "10am",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "4th grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "div A",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "English",
                                                }),
                                              ],
                                            }),
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "2",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "10am",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "3rd grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Div B",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "sub2",
                                                }),
                                              ],
                                            }),
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "3",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "10am",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "2nd grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "div C",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Forsen",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                (0, u.jsxs)(a.b7, {
                                  className: "mt-4",
                                  children: [
                                    (0, u.jsxs)("div", {
                                      className: "d-flex",
                                      children: [
                                        (0, u.jsx)("p", {
                                          className: "p-2",
                                          children: "Proxy classes:",
                                        }),
                                        (0, u.jsx)(p(), {
                                          selected: R,
                                          startDate: R,
                                          endDate: q,
                                          onChange: U,
                                          selectsRange: !0,
                                        }),
                                      ],
                                    }),
                                    (0, u.jsxs)("table", {
                                      class: "table table-bordered mt-2",
                                      children: [
                                        (0, u.jsx)("thead", {
                                          children: (0, u.jsxs)("tr", {
                                            children: [
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "#",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Name",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Class",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Division",
                                              }),
                                            ],
                                          }),
                                        }),
                                        (0, u.jsxs)("tbody", {
                                          children: [
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "1",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Otto",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "4th grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "div A",
                                                }),
                                              ],
                                            }),
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "2",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Thornton",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "3rd grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Div B",
                                                }),
                                              ],
                                            }),
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "3",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Forsen",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "2nd grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "div C",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                (0, u.jsxs)(a.b7, {
                                  className: "mt-4",
                                  children: [
                                    (0, u.jsxs)("div", {
                                      className: "d-flex",
                                      children: [
                                        (0, u.jsx)("p", {
                                          className: "p-2",
                                          children: "Leave requests:",
                                        }),
                                        (0, u.jsx)(p(), {
                                          selected: R,
                                          startDate: R,
                                          endDate: q,
                                          onChange: U,
                                          selectsRange: !0,
                                        }),
                                      ],
                                    }),
                                    (0, u.jsxs)("table", {
                                      class: "table table-bordered mt-2",
                                      children: [
                                        (0, u.jsx)("thead", {
                                          children: (0, u.jsxs)("tr", {
                                            children: [
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "#",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Name",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Class",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Division",
                                              }),
                                            ],
                                          }),
                                        }),
                                        (0, u.jsxs)("tbody", {
                                          children: [
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "1",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Otto",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "4th grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "div A",
                                                }),
                                              ],
                                            }),
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "2",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Thornton",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "3rd grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Div B",
                                                }),
                                              ],
                                            }),
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "3",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Forsen",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "2nd grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "div C",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                (0, u.jsxs)(a.b7, {
                                  className: "mt-4",
                                  children: [
                                    (0, u.jsxs)("div", {
                                      className: "d-flex",
                                      children: [
                                        (0, u.jsx)("p", {
                                          className: "p-2",
                                          children: "Homework posted:",
                                        }),
                                        (0, u.jsx)(p(), {
                                          selected: R,
                                          startDate: R,
                                          endDate: q,
                                          onChange: U,
                                          selectsRange: !0,
                                        }),
                                      ],
                                    }),
                                    (0, u.jsxs)("table", {
                                      class: "table table-bordered mt-2",
                                      children: [
                                        (0, u.jsx)("thead", {
                                          children: (0, u.jsxs)("tr", {
                                            children: [
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "#",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Name",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Class",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Division",
                                              }),
                                            ],
                                          }),
                                        }),
                                        (0, u.jsxs)("tbody", {
                                          children: [
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "1",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Otto",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "4th grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "div A",
                                                }),
                                              ],
                                            }),
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "2",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Thornton",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "3rd grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Div B",
                                                }),
                                              ],
                                            }),
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "3",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Forsen",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "2nd grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "div C",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                (0, u.jsxs)(a.b7, {
                                  className: "mt-4",
                                  children: [
                                    (0, u.jsxs)("div", {
                                      className: "d-flex",
                                      children: [
                                        (0, u.jsx)("p", {
                                          className: "p-2",
                                          children: "Meeting tasks assigned:",
                                        }),
                                        (0, u.jsx)(p(), {
                                          selected: R,
                                          startDate: R,
                                          endDate: q,
                                          onChange: U,
                                          selectsRange: !0,
                                        }),
                                      ],
                                    }),
                                    (0, u.jsxs)("table", {
                                      class: "table table-bordered mt-2",
                                      children: [
                                        (0, u.jsx)("thead", {
                                          children: (0, u.jsxs)("tr", {
                                            children: [
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "#",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Name",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Class",
                                              }),
                                              (0, u.jsx)("th", {
                                                scope: "col",
                                                children: "Division",
                                              }),
                                            ],
                                          }),
                                        }),
                                        (0, u.jsxs)("tbody", {
                                          children: [
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "1",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Otto",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "4th grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "div A",
                                                }),
                                              ],
                                            }),
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "2",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Thornton",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "3rd grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Div B",
                                                }),
                                              ],
                                            }),
                                            (0, u.jsxs)("tr", {
                                              children: [
                                                (0, u.jsx)("th", {
                                                  scope: "row",
                                                  children: "3",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "Forsen",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "2nd grade",
                                                }),
                                                (0, u.jsx)("td", {
                                                  children: "div C",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                  (0, u.jsxs)("div", {
                    className: "buttons text-center pt-3",
                    children: [
                      (0, u.jsx)(a.u5, {
                        color: "primary",
                        type: "submit",
                        children: "Submit form",
                      }),
                      (0, u.jsx)(a.u5, {
                        color: "dark",
                        type: "reset",
                        onClick: G,
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
    3647: function (e, s, r) {
      r.d(s, {
        U: function () {
          return d;
        },
      });
      var d = [
        "512 512",
        "<path fill='var(--ci-primary-color, currentColor)' d='M384,200V144a128,128,0,0,0-256,0v56H88V328c0,92.635,75.364,168,168,168s168-75.365,168-168V200ZM160,144a96,96,0,0,1,192,0v56H160ZM392,328c0,74.99-61.01,136-136,136s-136-61.01-136-136V232H392Z' class='ci-primary'/>",
      ];
    },
  },
]);
//# sourceMappingURL=885.94a6d7ec.chunk.js.map
