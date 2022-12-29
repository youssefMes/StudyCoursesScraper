import axiosInstance from "../utils/axiosInstace";

//load user
export const loadUser = async () => {
  let token = localStorage.getItem("token");
  return await axiosInstance({
    method: "get",
    url: `/admin/load`, 
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};
