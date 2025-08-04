import React from "react";

interface TorihikiJissekiTableProps {
  title: string;
  data: any[];
  selectedIds: number[];
  selectAll: boolean;
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: (id: number) => void;
  onRowClick: (e: React.MouseEvent<HTMLTableRowElement>, goodsId: number) => void;
  columns: {
    key: string;
    label: string;
    width?: string;
    align?: "left" | "center" | "right";
    sortable?: boolean;
    onSort?: () => void;
  }[];
  isRakusatsu?: boolean;
}

export const TorihikiJissekiTableComponent: React.FC<TorihikiJissekiTableProps> = ({
  title,
  data,
  selectedIds,
  selectAll,
  onSelectAll,
  onSelect,
  onRowClick,
  columns,
}) => {
  return (
    <div className="min-w-full bg-white">
      <div className="flex flex-col sm:flex-row justify-start sm:justify-between sm:items-center p-1">
        <div className="text-left">
          <label className="text-lg font-semibold">{title}</label>
        </div>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b w-24">
              <input type="checkbox" checked={selectAll} onChange={onSelectAll} />
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`py-2 px-4 border-b ${column.width || ""} ${
                  column.sortable ? "cursor-pointer hover:bg-gray-50" : ""
                }`}
                onClick={column.onSort}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 &&
            data.map((item) => (
              <tr
                key={item.goodsId}
                className="cursor-pointer hover:bg-gray-100"
                onClick={(e) => onRowClick(e, item.goodsId)}
              >
                <td
                  className="py-2 px-4 border-b text-center w-24"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.goodsId)}
                    onChange={() => onSelect(item.goodsId)}
                  />
                </td>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`py-2 px-4 border-b ${column.width || ""} text-${
                      column.align || "left"
                    }`}
                  >
                    {item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
