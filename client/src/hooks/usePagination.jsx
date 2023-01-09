import { useEffect, useState } from "react";

export default function usePagination({ data, count = 5 }) {
  const [items, setItems] = useState(data);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(count);
  const currentPageNumber = pageNumber * pageSize - pageSize;
  const noOfPages = Math.ceil(data.length / count);

  const goToPageNumber = (page) => {
    setPageNumber(page + 1);
  };

  useEffect(() => {
    const _data = data;
    const paginatedPosts = _data.slice(
      currentPageNumber,
      pageSize + currentPageNumber
    );
    setItems(paginatedPosts);
  }, [pageNumber]);

  return {
    currentPage: pageNumber,
    noOfPages,
    goToPageNumber,
    items,
  };
}
