import React, { useEffect } from "react";
import styles from "./Pagination.module.css";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { useRouter } from "next/router";

const Pagination = ({
  pageNumbersArray,
  setCurrentPage,
  currentPage,
  itemPerPage,
  lastPage = pageNumbersArray?.length,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const pageNo = Number(router.query.page_no) || 1;

    if (pageNo !== currentPage) {
      setCurrentPage(pageNo);
    }
  }, [router.isReady, router.query.page_no]);

  useEffect(() => {
    if (!router.isReady) return;

    const pageNo = String(currentPage);
    const itemsPerPage = String(itemPerPage);

    if (
      router.query.page_no === pageNo &&
      router.query.items_per_page === itemsPerPage
    ) {
      return;
    }

    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page_no: pageNo,
          items_per_page: itemsPerPage,
        },
      },
      undefined,
      { shallow: true, scroll: false },
    );
  }, [router.isReady, currentPage, itemPerPage]);

  return (
    <div>
      {pageNumbersArray?.length > 0 && (
        <div className={styles.paginationContainer}>
          <button
            className={styles.paginationButton}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage <= 1}
          >
            <BiChevronLeft size={16} />
          </button>

          {pageNumbersArray?.map((page) => (
            <button
              className={styles.paginationButton}
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                backgroundColor: currentPage === page ? "var(--primary)" : "",
                color: currentPage === page ? "var(--white)" : "var(--dark)",
              }}
            >
              {page}
            </button>
          ))}

          <button
            className={styles.paginationButton}
            onClick={() =>
              setCurrentPage((prev) => Math.min(lastPage, prev + 1))
            }
            disabled={currentPage >= lastPage}
          >
            <BiChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
