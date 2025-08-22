import React from "react";
import Pagination from "@mui/material/Pagination";
import memberStyles from "@/styles/member/MemberCommon.module.css";

type Props = {
  children: React.ReactNode;
  currentPage: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  showPagination?: boolean;
};

export const Container: React.FC<Props> = ({
  children,
  currentPage,
  totalCount,
  itemsPerPage,
  onPageChange,
  showPagination = true,
}) => {
  return (
    <div className={memberStyles.memberContainer}>
      {children}
      {showPagination && totalCount > 0 && (
        <div className={memberStyles.paginationContainer}>
          <Pagination
            count={Math.ceil(totalCount / itemsPerPage)}
            page={currentPage}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};
