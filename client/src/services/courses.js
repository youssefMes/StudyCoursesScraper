import axiosInstance from "../utils/axiosInstace";

export const searchCourses = async ({
  keyword,
  abschluss,
  studienbeginn,
  zulassungsmodus,
}) => {
  console.log({
    keyword,
    abschluss,
    studienbeginn,
    zulassungsmodus,
  });
  return await axiosInstance({
    method: "get",
    url: `/courses/`, // endpoint must be changed to filter courses
  }).then((res) => res.data);
};

export const fetchCourse = async (id) => {
  return await axiosInstance({
    method: "get",
    url: `/courses/${id}`,
  }).then((res) => res.data);
};
