import axiosInstance from "../utils/axiosInstace";

export const fetchBookmarks = async () => {
  const token = localStorage.getItem("token");
  return await axiosInstance({
    method: "get",
    url: `/bookmarks/`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
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
