"use strict";
(self.webpackChunkhoustonschoolfront =
  self.webpackChunkhoustonschoolfront || []).push([
  [907],
  {
    3907: function (e, t, n) {
      n.r(t);
      var c = n(3433),
        a = n(1413),
        s = n(9439),
        r = n(4165),
        i = n(5861),
        l = n(2791),
        o = n(7689),
        d = (n(6048), n(8983)),
        u = n(1243),
        h = (n(1323), n(6772), n(2957), n(184));
      t.default = function () {
        var e = (function () {
          var e = (0, i.Z)(
            (0, r.Z)().mark(function e() {
              var t;
              return (0, r.Z)().wrap(
                function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (e.prev = 0),
                          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU",
                          (e.next = 4),
                          u.Z.get(
                            "http://18.118.42.224:3001/api/v1/categories",
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
                        (t = e.sent),
                          console.log(t.data.data.docs),
                          j(t.data.data.docs),
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
        (0, l.useEffect)(function () {
          e(), X("");
        }, []);
        var t = (0, o.s0)(),
          n = (0, l.useState)([]),
          x = (0, s.Z)(n, 2),
          f = x[0],
          j = x[1],
          p = (0, l.useState)([]),
          m = (0, s.Z)(p, 2),
          I = m[0],
          N = (m[1], (0, l.useState)(!1)),
          b = (0, s.Z)(N, 2),
          v = b[0],
          y = b[1],
          C = (0, l.useState)(!1),
          k = (0, s.Z)(C, 2),
          Z = k[0],
          w = k[1],
          g = (0, l.useState)([]),
          S = (0, s.Z)(g, 2),
          z = S[0],
          T = S[1],
          E = (function () {
            var e = (0, i.Z)(
              (0, r.Z)().mark(function e(t) {
                var n;
                return (0, r.Z)().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        !1 === (n = (0, c.Z)(f))[t].selected
                          ? T([].concat((0, c.Z)(z), [n[t]._id]))
                          : T(function (e) {
                              return e.filter(function (e) {
                                return e !== n[t]._id;
                              });
                            }),
                          (n[t].selected = !n[t].selected),
                          j(n);
                      case 4:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function (t) {
              return e.apply(this, arguments);
            };
          })(),
          J = (function () {
            var t = (0, i.Z)(
              (0, r.Z)().mark(function t() {
                var n;
                return (0, r.Z)().wrap(
                  function (t) {
                    for (;;)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU",
                            (t.prev = 1),
                            (t.next = 4),
                            u.Z.delete(
                              "http://18.118.42.224:3001/api/v1/categories",
                              {
                                data: { ids: z },
                                headers: {
                                  Authorization: "Bearer ".concat(
                                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGIzNzQxYTRlOTIyNzU1ZTEzZjUwYSIsImlhdCI6MTY5OTQzMjE5NiwiZXhwIjoxNzAyMDI0MTk2fQ.Gn_VwncOvLdq9728FXSIESpmSw8J7Nu5d0AyezbwoOU"
                                  ),
                                },
                              }
                            )
                          );
                        case 4:
                          (n = t.sent),
                            console.log(n.data),
                            y(!1),
                            (t.next = 12);
                          break;
                        case 9:
                          (t.prev = 9),
                            (t.t0 = t.catch(1)),
                            console.error(t.t0);
                        case 12:
                          e();
                        case 13:
                        case "end":
                          return t.stop();
                      }
                  },
                  t,
                  null,
                  [[1, 9]]
                );
              })
            );
            return function () {
              return t.apply(this, arguments);
            };
          })(),
          O = (0, l.useState)(""),
          M = (0, s.Z)(O, 2),
          Y = M[0],
          A = M[1],
          U = (0, l.useState)(""),
          G = (0, s.Z)(U, 2),
          Q = G[0],
          X = G[1],
          D = (0, l.useState)(!1),
          _ = (0, s.Z)(D, 2),
          L = (_[0], _[1], (0, l.useState)("")),
          R = (0, s.Z)(L, 2),
          V = (R[0], R[1], (0, l.useState)("")),
          q = (0, s.Z)(V, 2),
          B = (q[0], q[1], (0, l.useState)("")),
          F = (0, s.Z)(B, 2),
          P = (F[0], F[1], (0, l.useState)(I.length)),
          H = (0, s.Z)(P, 2),
          K = H[0],
          W = H[1],
          $ = (0, l.useState)(1),
          ee = (0, s.Z)($, 2),
          te = ee[0],
          ne = ee[1],
          ce = function (e) {
            ne(e);
          },
          ae = (te - 1) * K,
          se = ae + K,
          re = (I.slice(ae, se), Math.ceil(I.length / K));
        return (0, h.jsxs)("div", {
          children: [
            (0, h.jsxs)(d.Tk, {
              backdrop: "static",
              visible: v,
              onClose: function () {
                y(!1), T([]);
              },
              "aria-labelledby": "StaticBackdropExampleLabel",
              children: [
                (0, h.jsx)(d.p0, {
                  children: (0, h.jsx)(d.fl, {
                    id: "StaticBackdropExampleLabel",
                    children: "Delete Category",
                  }),
                }),
                (0, h.jsx)(d.sD, {
                  children: "Are you sure you wish to delete this category?",
                }),
                (0, h.jsxs)(d.Ym, {
                  children: [
                    (0, h.jsx)(d.u5, {
                      color: "secondary",
                      onClick: function () {
                        y(!1), T([]);
                      },
                      children: "Close",
                    }),
                    (0, h.jsx)(d.u5, {
                      color: "primary",
                      onClick: function () {
                        return J();
                      },
                      children: "Yes!",
                    }),
                  ],
                }),
              ],
            }),
            (0, h.jsxs)("div", {
              className: "mb-2",
              children: [
                (0, h.jsxs)("div", {
                  className: "row pb-5",
                  children: [
                    (0, h.jsx)("div", {
                      className: "col-md-6 ",
                      children: (0, h.jsx)("div", {
                        className: "display-6 pb-3 float-end",
                        children: "Category listing",
                      }),
                    }),
                    (0, h.jsx)("div", {
                      className: "col-md-6 ",
                      children: (0, h.jsx)("button", {
                        className: "btn btn-primary float-end",
                        onClick: function () {
                          t("/addcategory");
                        },
                        children: "Add Category",
                      }),
                    }),
                  ],
                }),
                (0, h.jsx)("div", {
                  className: "filters d-flex",
                  children: (0, h.jsx)("input", {
                    className: "form-control",
                    type: "text",
                    placeholder: "Search by keyword",
                    value: Y,
                    onChange: function (e) {
                      return A(e.target.value);
                    },
                  }),
                }),
              ],
            }),
            (0, h.jsxs)("div", {
              className: "pb-4 d-flex justify-content-start align-items-center",
              children: [
                (0, h.jsx)("div", {
                  className: "p-2 ",
                  children: (0, h.jsx)(d.EC, {
                    type: "radio",
                    id: "flexCheckDefault",
                    label: "Active",
                    checked: "" !== Q && !!Q,
                    onClick: function () {
                      X(!0);
                    },
                  }),
                }),
                (0, h.jsx)("div", {
                  className: "p-2",
                  children: (0, h.jsx)(d.EC, {
                    type: "radio",
                    id: "flexCheckDefault",
                    label: "Inactive",
                    checked: "" !== Q && !Q,
                    onClick: function () {
                      X(!1);
                    },
                  }),
                }),
                "" !== Q &&
                  (0, h.jsx)("button", {
                    className: "btn btn-dark btn-md ",
                    onClick: function () {
                      X("");
                    },
                    children: "Show all",
                  }),
                (0, h.jsx)("button", {
                  className: "btn btn-dark btn-md ",
                  onClick: function () {
                    y(!v);
                  },
                  children: "Delete Selected",
                }),
              ],
            }),
            (0, h.jsxs)("table", {
              className: "table table-bordered",
              children: [
                (0, h.jsx)("thead", {
                  children: (0, h.jsxs)("tr", {
                    children: [
                      (0, h.jsx)("th", {
                        className: "text-center",
                        children: (0, h.jsx)("input", {
                          type: "checkbox",
                          checked: Z,
                          onChange: function () {
                            if ((T([]), Z)) T([]);
                            else {
                              var e = f.map(function (e) {
                                return e._id;
                              });
                              T(e);
                            }
                            w(!Z),
                              j(function (e) {
                                return e.map(function (e) {
                                  return (0,
                                  a.Z)((0, a.Z)({}, e), {}, { selected: !Z });
                                });
                              });
                          },
                        }),
                      }),
                      (0, h.jsx)("th", {
                        className: "text-center",
                        children: "Name of Category",
                      }),
                      (0, h.jsx)("th", {
                        className: "text-center",
                        children: "Number of Adaats",
                      }),
                      (0, h.jsx)("th", {
                        className: "text-center",
                        children: "Status",
                      }),
                      (0, h.jsx)("th", {
                        className: "text-center",
                        children: "Action",
                      }),
                    ],
                  }),
                }),
                (0, h.jsx)("tbody", {
                  children: f
                    .filter(function (e) {
                      return (function (e) {
                        var t = e.name.toLowerCase().includes(Y.toLowerCase()),
                          n = "" === Q || e.active === Q;
                        return t && n;
                      })(e);
                    })
                    .map(function (e, n) {
                      return (0, h.jsxs)(
                        "tr",
                        {
                          children: [
                            (0, h.jsx)("td", {
                              className: "text-center align-middle",
                              children: (0, h.jsx)("input", {
                                type: "checkbox",
                                checked: e.selected,
                                onChange: function () {
                                  return E(n);
                                },
                              }),
                            }),
                            (0, h.jsx)("td", {
                              className: "text-center align-middle",
                              children: e.name,
                            }),
                            (0, h.jsx)("td", {
                              className: "text-center align-middle",
                              children: e.assignedAadatCount,
                            }),
                            (0, h.jsx)("td", {
                              className: "text-center align-middle",
                              children: e.active ? "active" : "inactive",
                            }),
                            (0, h.jsxs)("td", {
                              className: "text-center align-middle",
                              children: [
                                (0, h.jsx)("button", {
                                  className: "btn btn-primary btn-md",
                                  onClick: function () {
                                    var n;
                                    (n = e._id),
                                      t("/editcategory", {
                                        state: { catid: n },
                                      });
                                  },
                                  children: "Edit",
                                }),
                                (0, h.jsx)("button", {
                                  className: "btn btn-dark btn-md",
                                  onClick: function () {
                                    T([]), T([e._id]), y(!0);
                                  },
                                  children: "Delete",
                                }),
                              ],
                            }),
                          ],
                        },
                        n
                      );
                    }),
                }),
              ],
            }),
            (0, h.jsx)("div", {
              className: "pagination",
              children: (0, h.jsxs)(d.E7, {
                "aria-label": "Page navigation",
                children: [
                  (0, h.jsx)(d.tn, {
                    onClick: function () {
                      return ce(te - 1);
                    },
                    disabled: 1 === te,
                    children: "Previous",
                  }),
                  Array.from({ length: re }, function (e, t) {
                    return (0, h.jsx)(
                      d.tn,
                      {
                        active: te === t + 1,
                        onClick: function () {
                          return ce(t + 1);
                        },
                        children: t + 1,
                      },
                      t
                    );
                  }),
                  (0, h.jsx)(d.tn, {
                    onClick: function () {
                      return ce(te + 1);
                    },
                    disabled: te === Math.ceil(I.length / K),
                    children: "Next",
                  }),
                  (0, h.jsxs)("div", {
                    className: "d-flex",
                    children: [
                      (0, h.jsx)(d.tn, { children: "Entries:" }),
                      (0, h.jsx)(d.tn, {
                        children: (0, h.jsxs)("select", {
                          value: K,
                          onChange: function (e) {
                            return W(e.target.value);
                          },
                          children: [
                            (0, h.jsx)("option", { value: "2", children: "2" }),
                            (0, h.jsx)("option", { value: "4", children: "4" }),
                            (0, h.jsx)("option", {
                              value: I.length,
                              children: "all",
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        });
      };
    },
  },
]);
//# sourceMappingURL=907.5e179a23.chunk.js.map
