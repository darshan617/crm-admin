import { useCallback } from "react";
import { useRouter } from "next/router";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styles from "./Pagination.module.css";

export function usePageQuery(queryKey = "page") {
  const router = useRouter();
  const page = Math.max(1, Number(router.query?.[queryKey]) || 1);

  const setPage = useCallback(
    (nextPage, options) => {
      if (!router.isReady) return;

      const pageNumber = Math.max(1, Number(nextPage) || 1);
      const current = Math.max(1, Number(router.query?.[queryKey]) || 1);

      if (pageNumber === current) return;

      const query = { ...router.query };

      if (pageNumber <= 1) {
        delete query[queryKey];
      } else {
        query[queryKey] = String(pageNumber);
      }

      const navigate = options?.replace ? router.replace : router.push;

      navigate(
        { pathname: router.pathname, query },
        undefined,
        { shallow: true, scroll: false },
      );
    },
    [router, queryKey],
  );

  return { page, setPage, isReady: router.isReady };
}

const range = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

export function getPaginationItems(currentPage, totalPages, siblingCount = 1) {
  const total = Math.max(1, Number(totalPages) || 1);
  const current = Math.min(Math.max(1, Number(currentPage) || 1), total);
  const siblings = Math.max(0, Number(siblingCount) || 0);
  const totalPageNumbers = siblings * 2 + 5;

  if (total <= totalPageNumbers) {
    return range(1, total);
  }

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);
  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < total - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, 3 + siblings * 2), "end-ellipsis", total];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, "start-ellipsis", ...range(total - (3 + siblings * 2) + 1, total)];
  }

  return [1, "start-ellipsis", ...range(left, right), "end-ellipsis", total];
}

export default function Pagination({
  page,
  currentPage,
  totalPages,
  total,
  perPage = 10,
  lastPage,
  onChange,
  setCurrentPage,
  disabled = false,
  align = "center",
  siblingCount = 1,
  className = "",
  hideOnSinglePage = true,
}) {
  const activePage = Number(page ?? currentPage) || 1;
  const pageSize = Number(perPage) || 10;
  const resolvedTotalPages = Math.max(
    1,
    Number(
      totalPages ??
        lastPage ??
        (total != null ? Math.ceil(Number(total) / pageSize) : 1),
    ) || 1,
  );

  const changePage = (nextPage) => {
    const pageNumber = Math.min(
      Math.max(1, nextPage),
      resolvedTotalPages,
    );

    if (disabled || pageNumber === activePage) return;

    if (onChange) onChange(pageNumber);
    else setCurrentPage?.(pageNumber);
  };

  if (hideOnSinglePage && resolvedTotalPages <= 1) return null;

  const items = getPaginationItems(
    activePage,
    resolvedTotalPages,
    siblingCount,
  );

  return (
    <nav
      className={`${styles.pagination} ${styles[align] || styles.center} ${className}`.trim()}
      aria-label="Pagination"
    >
      <button
        type="button"
        className={styles.pageBtn}
        onClick={() => changePage(activePage - 1)}
        disabled={disabled || activePage <= 1}
        aria-label="Previous page"
      >
        <FiChevronLeft size={16} aria-hidden="true" />
      </button>

      {items.map((item) =>
        typeof item === "string" ? (
          <span key={item} className={styles.ellipsis} aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`${styles.pageBtn} ${
              item === activePage ? styles.active : ""
            }`}
            onClick={() => changePage(item)}
            disabled={disabled}
            aria-label={`Page ${item}`}
            aria-current={item === activePage ? "page" : undefined}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className={styles.pageBtn}
        onClick={() => changePage(activePage + 1)}
        disabled={disabled || activePage >= resolvedTotalPages}
        aria-label="Next page"
      >
        <FiChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}
