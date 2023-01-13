import axiosInstance from "../utils/axiosInstace";

export const fetchBookmarks = async ({limit = 20, page = 1}) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance({
    method: "get",
    url: `/bookmarks/?limit=${limit}${page !== 1 ? `&page=${page}` : ""}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return {
    results: response.data.results,
    nextPage: response.data.next,
    count: response.data.count,
  };
};

export const bookmarkCours = async ({ id, userId }) => {
  const token = localStorage.getItem("token");
  return await axiosInstance({
    method: "post",
    url: `/bookmarks/`,
    data: {
      user: userId,
      course: id,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};

export const deleteBookmarkCours = async ({ id }) => {
  const token = localStorage.getItem("token");
  return await axiosInstance({
    method: "delete",
    url: `/bookmarks/${id}/`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};
