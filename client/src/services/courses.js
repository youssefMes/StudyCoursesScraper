import axiosInstance from "../utils/axiosInstace";

export const searchCourses = async ({
  limit = 20,
  page = 1,
  study_forms,
  degrees,
  languages,
  portals,
  cities,
  search
}) => {
  /*  console.log({
    study_forms,
    degrees,
    languages,
    portals,
    cities,
   }); */
  const getParam = (key , param) => {
    let url = ''
    for (const item of param) {
      url += `&${key}=${item}`
    }
    return url
  }
  
  const response = await axiosInstance({
    url: `/courses/?limit=${limit}${page !== 1 ? `&page=${page}` : ""}
    &search=${search}
    ${study_forms?.length > 0 ? `${getParam('study_forms', study_forms)}` : ''}
    ${degrees?.length > 0 ? `${getParam('degrees', degrees)}`  : ''}
    ${languages?.length > 0 ? `${getParam('languages', languages)}` : ''}
    ${cities?.length > 0 ? `${getParam('cities', cities)}` : ''}
    ${portals?.length > 0 ? `${getParam('portals', portals)}` : ''}
    `, // endpoint must be changed to filter courses
  });
  return {
    results: response.data.results,
    nextPage: response.data.next,
    count: response.data.count,
  };
};

export const fetchCourse = async (id) => {
  return await axiosInstance({
    method: "get",
    url: `/courses/${id}`,
  }).then((res) => res.data);
};
