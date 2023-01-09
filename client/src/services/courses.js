import axiosInstance from "../utils/axiosInstace";

export const searchCourses = async ({
  limit = 2,
  page,
  keyword,
  abschluss,
  studienbeginn,
  zulassungsmodus
}) => {
  // console.log({
  //   keyword,
  //   abschluss,
  //   studienbeginn,
  //   zulassungsmodus,
  // });

  const response = await axiosInstance({
    url: `/courses/?limit=${limit}${page !== 1 ? `&page=${page}` : ""}`, // endpoint must be changed to filter courses
  });
  return {
    results: response.data.results,
    nextPage: response.data.next,
    totalPages: response.data.count,
  };
};

export const fetchCourse = async (id) => {
  return await axiosInstance({
    method: "get",
    url: `/courses/${id}`,
  }).then((res) => res.data);
};
