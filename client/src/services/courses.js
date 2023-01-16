import axiosInstance from "../utils/axiosInstace";

export const searchCourses = async ({
  limit = 20,
  page = 1,
  study_forms,
  degrees,
  languages,
  portals,
  cities,
  search,
}) => {
  const getParam = (key, param) => {
    let url = "";
    for (const item of param) {
      url += `&${key}=${item}`;
    }
    return url;
  };

  const response = await axiosInstance({
    url: `/courses/?limit=${limit}${page !== 1 ? `&page=${page}` : ""}
    &search=${search}
    ${study_forms?.length > 0 ? `${getParam("study_forms", study_forms)}` : ""}
    ${degrees?.length > 0 ? `${getParam("degrees", degrees)}` : ""}
    ${languages?.length > 0 ? `${getParam("languages", languages)}` : ""}
    ${cities?.length > 0 ? `${getParam("cities", cities)}` : ""}
    ${portals?.length > 0 ? `${getParam("portals", portals)}` : ""}
    `,
  });
  return {
    results: response.data.results,
    nextPage: response.data.next,
    previousPage: response.data.previous,
    count: response.data.count,
  };
};

export const fetchCourse = async (id) => {
  return await axiosInstance({
    method: "get",
    url: `/courses/${id}`,
  }).then((res) => res.data);
};

export const validateCourse = async (id) => {
  const token = localStorage.getItem("token");
  return await axiosInstance({
    method: "patch",
    url: `/courses/${id}/validate/`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const inValidateCourse = async (id) => {
  const token = localStorage.getItem("token");
  return await axiosInstance({
    method: "patch",
    url: `/courses/${id}/invalidate/`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
