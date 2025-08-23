import React from "react";
import Pagination from "@mui/material/Pagination";
import adminStyles from "@/styles/admin/AdminCommon.module.css";

type AdminPaginationProps = {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  itemsPerPage: number;
};

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  count,
  page,
  onChange,
  itemsPerPage,
}) => {
  return (
    <div>
      <Pagination
        className={adminStyles.paginationContainer}
        count={Math.max(1, Math.ceil(count / itemsPerPage))}
        page={page}
        onChange={onChange}
      />
    </div>
  );
};

