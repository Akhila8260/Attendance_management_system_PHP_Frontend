import api from "./axios";

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

export const loginApi = (data, role) => {
  const routes = {
    admin: "/login",
    teacher: "/teacher/login",
    student: "/student/login",
  };

  return api.post(routes[role], data);
};

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

export const logoutApi = (role) => {
  const routes = {
    admin: "/admin/logout",
    teacher: "/teacher/logout",
    student: "/student/logout",
  };

  return api.post(routes[role]);
};

/*
|--------------------------------------------------------------------------
| RESET PASSWORD
|--------------------------------------------------------------------------
*/

export const resetPasswordApi = (data, role) => {
  const routes = {
    teacher: "/teacher/reset-password",
    student: "/student/reset-password",
  };

  return api.post(routes[role], data);
};
