import React from "react";
import { TAdminPaddleSelect } from "@/types/admin/paddle/management";
import { PaddleKbnPullDown } from "@/components/ui/pulldowns/PaddleKbnPullDown";
import { RegistButton } from "@/components/ui/buttons/admin/registButton";
import ConfirmDialog from "@/components/ui/dialog/confirmDialog";
import adminStyles from "@/styles/admin/AdminCommon.module.css";

interface PaddleSearchResultTableProps {
  fetchedData: TAdminPaddleSelect[];
  paddleKbnList: any[];
  paddleUpdateRequest: any;
  updateErrors: { [key: string]: string };
  onlineBidShoninRequest: any;
  onlineBidShoninErrors: { [key: string]: string };
  executionPermission: (screenId: number, permission: number) => boolean;
  onUpdateChange: (userId: string, field: string, value: string) => void;
  onPaddleDataUpdate: (row: any) => void;
  onOnlineBidShoninUpdate: (row: any) => void;
  onDeleteSubmit: (auctionSeq: string, userId: string) => void;
  texts: any;
}

export const PaddleSearchResultTable: React.FC<PaddleSearchResultTableProps> = ({
  fetchedData,
  paddleKbnList,
  paddleUpdateRequest,
  updateErrors,
  onlineBidShoninRequest,
  onlineBidShoninErrors,
  executionPermission,
  onUpdateChange,
  onPaddleDataUpdate,
  onOnlineBidShoninUpdate,
  onDeleteSubmit,
  texts,
}) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">{texts.member.userId} </th>
          <th className="py-2 px-4 border-b">{texts.member.userName}</th>
          <th className="py-2 px-4 border-b">{texts.member.companyName} </th>
          <th className="py-2 px-4 border-b w-72">{texts.paddle.paddleKbn}</th>
          <th className="py-2 px-4 border-b w-40">{texts.paddle.paddleNo}</th>
          <th className="py-2 px-4 border-b w-48">{texts.paddle.onlineBidshonin}</th>
          <th className="py-2 px-4 border-b w-40"></th>
          <th className="py-2 px-4 border-b w-40"></th>
        </tr>
      </thead>
      <tbody>
        {fetchedData.map((result) => (
          <tr key={result.userId} className="cursor-pointer hover:bg-gray-100">
            <td className="py-1 px-4 border-b text-left">{result.userId}</td>
            <td className="py-1 px-4 border-b text-left">{result.userName}</td>
            <td className="py-1 px-4 border-b text-left">{result.companyName}</td>
            <td className="py-1 px-4 border-b text-left">
              <PaddleKbnPullDown
                onChange={(value) => onUpdateChange(result.userId, "paddleKbn", value)}
                selectedId={result.paddleKbn}
                className={adminStyles.tabelCellInput}
                paddleKbnList={paddleKbnList}
              />
            </td>
            <td className="py-1 px-4 border-b w-40">
              <input
                type="text"
                value={result.paddleNo}
                onChange={(e) =>
                  onUpdateChange(result.userId, "paddleNo", e.target.value)
                }
                className={adminStyles.tabelCellInput}
              />
              {result.userId == paddleUpdateRequest?.userId && updateErrors?.paddleNo && (
                <p className="error-message">{updateErrors.paddleNo}</p>
              )}
              {result.userId == onlineBidShoninRequest?.userId &&
                onlineBidShoninErrors?.paddleNo && (
                  <p className="error-message">{updateErrors.paddleNo}</p>
                )}
            </td>
            <td className="py-1 px-4 border-b text-center">
              {result.paddleKbn == "2" ? (
                result.onlinebidShohinFlg ? (
                  <span>{texts.paddle.shoninzumi}</span>
                ) : (
                  <RegistButton
                    label={texts.button.onlineBidshoninOn}
                    onClick={() => onOnlineBidShoninUpdate(result)}
                  />
                )
              ) : null}
            </td>
            <td className="py-1 px-4 border-b text-center">
              {executionPermission(353, 2) ? (
                <RegistButton
                  label={texts.button.update}
                  onClick={() => onPaddleDataUpdate(result)}
                />
              ) : (
                <></>
              )}
            </td>
            <td className="py-1 px-4 border-b text-center">
              {executionPermission(353, 2) ? (
                <ConfirmDialog
                  title={texts.message.confirmDelete}
                  description={texts.label.delete_note_1}
                  buttonTitle={texts.button.delete}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-40"
                  dialogCancelClassName="lg:ml-2.5 mt-2 lg:mt-0 bg-white border border-solid border-red-500 text-red-500 font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
                  dialogClassName="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg w-40"
                  onSubmit={() => onDeleteSubmit(result.auctionSeq, result.userId)}
                  buttonText={texts.button.delete}
                />
              ) : (
                <></>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

