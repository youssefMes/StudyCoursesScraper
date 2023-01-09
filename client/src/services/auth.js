import axiosInstance from "../utils/axiosInstace";

//load user
export const loadUser = async () => {
  let token = localStorage.getItem("token");
  return await axiosInstance({
    method: "get",
    url: `/users/me/`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};

export const register = async (data) => {
  return await axiosInstance({
    method: "post",
    url: `/users/`,
    data,
  }).then((res) => res.data);
};

export const activateAccount = async (data) => {
  return await axiosInstance({
    method: "post",
    url: `/users/activation/`,
    data,
  }).then((res) => res.data);
};

export const login = async (data) => {
  return await axiosInstance({
    method: "post",
    url: `/jwt/create/`,
    data,
  }).then((res) => res.data);
};
