import React from "react";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TMtLiveBidUnit } from "@/types/common/bidUnit";
import { Errors } from "@/types/errors";
//ボタン
import { RegistButton } from "@/components/ui/buttons/admin/registButton";

interface BidUnitManagementComponentProps {
  breadcrumbText: string;
  kengenId: number;
  executionPermission: (kengenId: number, kengenKbn: number) => boolean;
  fetchList: TMtLiveBidUnit[];
  newLiveBidUnit: TMtLiveBidUnit;
  formErrors: Errors;
  onNewLiveBidUnitChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onInputChange: (seq: number, field: keyof TMtLiveBidUnit, value: string) => void;
  onDelete: (seq: number) => void;
  onNewSubmit: () => void;
  onUpdateSubmit: () => void;
}

export const BidUnitManagementComponent: React.FC<BidUnitManagementComponentProps> = ({
  breadcrumbText,
  kengenId,
  executionPermission,
  fetchList,
  newLiveBidUnit,
  formErrors,
  onNewLiveBidUnitChange,
  onInputChange,
  onDelete,
  onNewSubmit,
  onUpdateSubmit,
}) => {
  const { texts } = useCommonSetup();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat().format(value);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center my-3 bg-gray-100">
        <div className="w-full space-y-3 bg-white shadow-md md:max-w-full md:rounded">
          <div className="p-4">
            {texts.label.newRegist}
            <div className="flex flex-col md:flex-row items-end space-y-4">
              <table className="w-full sm:w-1/2 bg-white">
                <thead>
                  <tr className="bg-gray-200">
                    <th colSpan={3} className="py-2 px-4 border">
                      {texts.bidUnit.unitRange}{" "}
                    </th>
                    <th className="py-2 px-4 border">{texts.bidUnit.bidUnit} </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border">
                      <input
                        name="unitFrom"
                        value={
                          newLiveBidUnit.unitFrom
                            ? formatCurrency(Number(newLiveBidUnit.unitFrom))
                            : ""
                        }
                        onChange={onNewLiveBidUnitChange}
                        className="w-full p-1 border rounded text-right"
                        maxLength={9}
                      />
                    </td>
                    <td className="py-2 px-4 border">～</td>
                    <td className="py-2 px-4 border">
                      <input
                        name="unitTo"
                        value={
                          newLiveBidUnit.unitTo ? formatCurrency(Number(newLiveBidUnit.unitTo)) : ""
                        }
                        onChange={onNewLiveBidUnitChange}
                        className="w-full p-1 border rounded text-right"
                        maxLength={9}
                      />
                    </td>
                    <td className="py-2 px-4 border">
                      <input
                        name="bitUnit"
                        value={
                          newLiveBidUnit.bitUnit
                            ? formatCurrency(Number(newLiveBidUnit.bitUnit))
                            : ""
                        }
                        onChange={onNewLiveBidUnitChange}
                        className="w-full p-1 border rounded text-right"
                        maxLength={9}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4" style={{ border: "none" }}>
                      {formErrors?.unitFrom && (
                        <p className="error-message">{formErrors.unitFrom}</p>
                      )}
                      {formErrors?.newUnitRange && (
                        <p className="error-message">{formErrors.newUnitRange}</p>
                      )}
                    </td>
                    <td className="py-2 px-4" style={{ border: "none" }}></td>
                    <td className="py-2 px-4" style={{ border: "none" }}>
                      {formErrors?.unitTo && <p className="error-message">{formErrors.unitTo}</p>}
                    </td>
                    <td className="py-2 px-4" style={{ border: "none" }}>
                      {formErrors?.bitUnit && <p className="error-message">{formErrors.bitUnit}</p>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {executionPermission(kengenId, 2) ? (
              <RegistButton label={texts.button.regist} onClick={onNewSubmit} />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center my-3 bg-gray-100">
        <div className="w-full space-y-3 bg-white shadow-md md:max-w-full md:rounded">
          <div className="p-4">
            <table className="w-full sm:w-1/2 bg-white my-4">
              <thead>
                <tr className="bg-gray-200">
                  <th colSpan={3} className="py-2 px-4 border">
                    {texts.bidUnit.unitRange}
                  </th>
                  <th className="py-2 px-4 border">{texts.bidUnit.bidUnit}</th>
                  <th className="py-2 px-4 border"></th>
                </tr>
              </thead>
              <tbody>
                {fetchList.map((item) => (
                  <tr key={item.seq}>
                    <td className="py-2 px-4 border">
                      <input
                        value={formatCurrency(Number(item.unitFrom))}
                        onChange={(e) => onInputChange(item.seq, "unitFrom", e.target.value)}
                        className="w-full p-1 border rounded  text-right"
                        maxLength={9}
                      />
                    </td>
                    <td className="py-2 px-4 border">～</td>
                    <td className="py-2 px-4 border">
                      <input
                        value={formatCurrency(Number(item.unitTo))}
                        onChange={(e) => onInputChange(item.seq, "unitTo", e.target.value)}
                        className="w-full p-1 border rounded text-right"
                        maxLength={9}
                      />
                    </td>
                    <td className="py-2 px-4 border">
                      <input
                        value={formatCurrency(Number(item.bitUnit))}
                        onChange={(e) => onInputChange(item.seq, "bitUnit", e.target.value)}
                        className="w-full p-1 border rounded text-right"
                        maxLength={9}
                      />
                    </td>
                    <td className="py-2 px-4 border">
                      {executionPermission(kengenId, 2) ? (
                        <button
                          onClick={() => onDelete(item.seq)}
                          className="bg-red-500 hover:bg-opacity-50  text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
                        >
                          {texts.button.delete}
                        </button>
                      ) : (
                        <></>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="w-full sm:w-1/2 bg-white my-4">
              {formErrors?.unitRange && <p className="error-message">{formErrors.unitRange}</p>}
            </div>

            {executionPermission(kengenId, 2) ? (
              <RegistButton label={texts.button.regist} onClick={onUpdateSubmit} />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

