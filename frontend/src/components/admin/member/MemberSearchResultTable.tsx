import React from "react";
import { TAdminUserSelect } from "@/types/admin/member/search";
import { MemberShoninOnButton, MemberShoninOffButton } from "@/components/ui/buttons/admin/memberShoninButton";

interface MemberSearchResultTableProps {
  memberData: TAdminUserSelect[];
  selectAll: boolean;
  selectedIds: number[];
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: (id: number) => void;
  onRowClick: (e: React.MouseEvent<HTMLTableRowElement>, userId: number) => void;
  onShoninUpdate: (userId: number, newFlg: boolean) => void;
  executionPermission: (kengenId: number, kengenLevel: number) => boolean;
  texts: any;
}

export const MemberSearchResultTable: React.FC<MemberSearchResultTableProps> = ({
  memberData,
  selectAll,
  selectedIds,
  onSelectAll,
  onSelect,
  onRowClick,
  onShoninUpdate,
  executionPermission,
  texts,
}) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">
            <input type="checkbox" checked={selectAll} onChange={onSelectAll} />
          </th>
          <th className="py-2 px-4 border-b">{texts.member.userId}</th>
          <th className="py-2 px-4 border-b">{texts.member.userName} </th>
          <th className="py-2 px-4 border-b">{texts.member.companyName}</th>
          <th className="py-2 px-4 border-b">{texts.member.address}</th>
          <th className="py-2 px-4 border-b">{texts.common.mail}</th>
          <th className="py-2 px-4 border-b w-72">{texts.member.adminBiko}</th>
          <th className="py-2 px-4 border-b">{texts.member.shonin}</th>
        </tr>
      </thead>
      <tbody>
        {memberData.map((result) => (
          <tr
            key={result.userId}
            className={`cursor-pointer hover:bg-gray-100 ${
              result.teishiFlg ? "bg-gray-300" : ""
            }`}
            onClick={(e) => onRowClick(e, result.userId)}
          >
            <td
              className="py-2 px-4 border-b text-center"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(result.userId)}
                onChange={() => onSelect(result.userId)}
              />
            </td>
            <td className="py-1 px-4 border-b text-left">{result.userId}</td>
            <td className="py-1 px-4 border-b text-left">{result.userName}</td>
            <td className="py-1 px-4 border-b text-left">{result.companyName}</td>
            <td className="py-1 px-4 border-b text-left">{result.fullAddress}</td>
            <td className="py-1 px-4 border-b text-left">{result.mail}</td>
            <td
              className={`py-1 px-4 border-b text-left w-72 ${
                result.adminBiko ? "line-clamp-2" : ""
              }`}
            >
              {result.adminBiko}
            </td>

            <td className="py-1 px-4 border-b text-center">
              {executionPermission(102, 2) ? (
                result.shoninFlg ? (
                  <MemberShoninOffButton
                    userId={result.userId}
                    onUpdate={onShoninUpdate}
                  />
                ) : (
                  <MemberShoninOnButton userId={result.userId} onUpdate={onShoninUpdate} />
                )
              ) : (
                <span></span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

