import axiosInstance from "../utils/axiosInstace";

export const fetchFilters = async () => {
  return await axiosInstance({
    method: "get",
    url: `/filters/`,
  }).then((res) => res.data);
};
