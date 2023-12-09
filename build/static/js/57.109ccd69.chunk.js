"use strict";
(self.webpackChunkhoustonschoolfront =
  self.webpackChunkhoustonschoolfront || []).push([
  [57],
  {
    1057: function (e, r, s) {
      s.r(r);
      var t = s(4165),
        a = s(5861),
        n = s(9439),
        l = s(2791),
        c = s(7689),
        i = s(1087),
        o = s(8983),
        d = s(4846),
        u = s(3647),
        h = s(1243),
        x = s(3179),
        m = s(184);
      r.default = function () {
        var e = (0, c.s0)(),
          r = (0, l.useContext)(x.V).setAuthState,
          s = (0, l.useState)(""),
          p = (0, n.Z)(s, 2),
          j = p[0],
          g = p[1],
          f = (0, l.useState)(""),
          v = (0, n.Z)(f, 2),
          b = v[0],
          w = v[1],
          N = (function () {
            var s = (0, a.Z)(
              (0, t.Z)().mark(function s() {
                var a, n;
                return (0, t.Z)().wrap(
                  function (s) {
                    for (;;)
                      switch ((s.prev = s.next)) {
                        case 0:
                          if (
                            (j.trim() && b.trim()) ||
                            (alert("Email and password are required"), 0)
                          ) {
                            s.next = 2;
                            break;
                          }
                          return s.abrupt("return");
                        case 2:
                          return (
                            (s.prev = 2),
                            (s.next = 5),
                            h.Z.post(
                              "http://18.118.42.224:3001/api/v1/users/login",
                              { email: j, password: b }
                            )
                          );
                        case 5:
                          (a = s.sent),
                            console.log(a.data.data.user.role),
                            r({
                              role: a.data.data.user.role,
                              id: a.data.data.user._id,
                            }),
                            (n = a.data.token),
                            localStorage.setItem("accessToken", n),
                            console.log("sucessfully logged in"),
                            e("/"),
                            g(""),
                            w(""),
                            (s.next = 19);
                          break;
                        case 16:
                          (s.prev = 16),
                            (s.t0 = s.catch(2)),
                            console.error("Login failed", s.t0);
                        case 19:
                        case "end":
                          return s.stop();
                      }
                  },
                  s,
                  null,
                  [[2, 16]]
                );
              })
            );
            return function () {
              return s.apply(this, arguments);
            };
          })();
        return (0, m.jsx)("div", {
          className: "bg-light min-vh-100 d-flex flex-row align-items-center",
          children: (0, m.jsx)(o.KB, {
            children: (0, m.jsx)(o.rb, {
              className: "justify-content-center",
              children: (0, m.jsx)(o.b7, {
                md: 8,
                children: (0, m.jsxs)(o.dL, {
                  children: [
                    (0, m.jsx)(o.xH, {
                      className: "p-4",
                      children: (0, m.jsx)(o.sl, {
                        children: (0, m.jsxs)(o.lx, {
                          children: [
                            (0, m.jsx)("h1", { children: "Login" }),
                            (0, m.jsx)("p", {
                              className: "text-medium-emphasis",
                              children: "Sign In to your account",
                            }),
                            (0, m.jsxs)(o.YR, {
                              className: "mb-3",
                              children: [
                                (0, m.jsx)(o.wV, { children: "@" }),
                                (0, m.jsx)(o.jO, {
                                  placeholder: "Email",
                                  autoComplete: "email",
                                  value: j,
                                  onChange: function (e) {
                                    return g(e.target.value);
                                  },
                                }),
                              ],
                            }),
                            (0, m.jsxs)(o.YR, {
                              className: "mb-4",
                              children: [
                                (0, m.jsx)(o.wV, {
                                  children: (0, m.jsx)(d.Z, { icon: u.U }),
                                }),
                                (0, m.jsx)(o.jO, {
                                  type: "password",
                                  placeholder: "Password",
                                  autoComplete: "current-password",
                                  value: b,
                                  onChange: function (e) {
                                    return w(e.target.value);
                                  },
                                }),
                              ],
                            }),
                            (0, m.jsxs)(o.rb, {
                              children: [
                                (0, m.jsx)(o.b7, {
                                  xs: 6,
                                  children: (0, m.jsx)(o.u5, {
                                    color: "primary",
                                    className: "px-4",
                                    onClick: N,
                                    children: "Login",
                                  }),
                                }),
                                (0, m.jsx)(o.b7, {
                                  xs: 6,
                                  className: "text-right",
                                  children: (0, m.jsx)(o.u5, {
                                    color: "link",
                                    className: "px-0",
                                    children: "Forgot password?",
                                  }),
                                }),
                              ],
                            }),
                          ],
                        }),
                      }),
                    }),
                    (0, m.jsx)(o.xH, {
                      className: "text-white bg-primary py-5",
                      style: { width: "44%" },
                      children: (0, m.jsx)(o.sl, {
                        className: "text-center",
                        children: (0, m.jsxs)("div", {
                          children: [
                            (0, m.jsx)("h2", { children: "Sign up" }),
                            (0, m.jsx)("p", {
                              children:
                                "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            }),
                            (0, m.jsx)(i.rU, {
                              to: "/register",
                              children: (0, m.jsx)(o.u5, {
                                color: "primary",
                                className: "mt-3",
                                active: !0,
                                tabIndex: -1,
                                children: "Register Now!",
                              }),
                            }),
                          ],
                        }),
                      }),
                    }),
                  ],
                }),
              }),
            }),
          }),
        });
      };
    },
    3647: function (e, r, s) {
      s.d(r, {
        U: function () {
          return t;
        },
      });
      var t = [
        "512 512",
        "<path fill='var(--ci-primary-color, currentColor)' d='M384,200V144a128,128,0,0,0-256,0v56H88V328c0,92.635,75.364,168,168,168s168-75.365,168-168V200ZM160,144a96,96,0,0,1,192,0v56H160ZM392,328c0,74.99-61.01,136-136,136s-136-61.01-136-136V232H392Z' class='ci-primary'/>",
      ];
    },
  },
]);
//# sourceMappingURL=57.109ccd69.chunk.js.map
