import { GetServerSideProps } from 'next';
import breadcrumbStyles from '@/styles/breadcrumb.module.css';
import { texts } from '@/config/texts';
//ホック
import { withAuth } from '@/hocs/withAdminAuth';
import withAdminLayout from '@/hocs/withAdminLayout';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
import { useKengenRedirect } from '@/hooks/useKengenRedirect';
import { useExecutionPermission } from '@/hooks/useExecutionPermission';
//API
import { useLiveBidUnitSearchAPI } from '@/hooks/api/admin/live/useLiveBidUnitSearchAPI';
import { useLiveBidUnitInsertAPI } from '@/hooks/api/admin/live/useLiveBidUnitInsertAPI';
import { useLiveBidUnitUpdateAPI } from '@/hooks/api/admin/live/useLiveBidUnitUpdateAPI';
//型定義
import { PageProps } from '@/types/admin/adminPage';
import { TMtLiveBidUnit } from '@/types/admin/live/bidUnit';
//ボタン
import { RegistButton } from '@/components/ui/buttons/admin/registButton';

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
    return {
        props: {
            pageTitle: texts.menu.adminLiveBidUnitRegist
        },
    };
});

/*************  ✨ Codeium Command ⭐  *************/
/**
 * [PAGE] Live BidUnit Regist
 * 
 * @param {PageProps} props
 * @returns {JSX.Element}

/******  143ef128-11da-4846-9f80-a8fec9fa85f2  *******/
const Page: React.FC<PageProps> = ({ kengen }) => {
    const { useState, useEffect, useCallback, texts } = useCommonSetup();
    useKengenRedirect(kengen, 305);
    const { executionPermission } = useExecutionPermission(kengen);
    const { liveBidUnitList } = useLiveBidUnitSearchAPI();
    const [newLiveBidUnit, setNewLiveBidUnit] = useState<TMtLiveBidUnit>({
        seq: 0,
        unitFrom: "",
        unitTo: "",
        bitUnit: ""
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const handleNewLiveBidUnitChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const numericWithCommaRegex = /^[0-9,]*$/;
        if (!numericWithCommaRegex.test(value)) {
            return; // 無効な入力は無視
        }
        setNewLiveBidUnit((prev) => ({ ...prev, [name]: value.replace(/[^0-9]/g, '') }));
    };

    const handleInputChange = (seq: number, field: keyof TMtLiveBidUnit, value: number) => {
        
        setFetchList((prev) =>
            prev.map((item) => (item.seq === seq ? { ...item, [field]: value } : item))
        );
    };
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat().format(value);
      };
    const handleDelete = (seq: number) => {
        setFetchList((prev) => prev.filter((item) => item.seq !== seq)); // 指定した seq のアイテムを削除
    };
    const { errors, liveBidUnitInsertAPI } = useLiveBidUnitInsertAPI();
    const handleNewSubmit = () => {
        if (!newLiveBidUnit) {
            return;
        }
        liveBidUnitInsertAPI(newLiveBidUnit);
    };

    useEffect(() => {
        if (errors) { setFormErrors(errors); }
    }, [errors]);

    const [fetchList, setFetchList] = useState<TMtLiveBidUnit[]>([]);
    useEffect(() => {
        if (liveBidUnitList) {
            setFetchList(liveBidUnitList);
        }
    }, [liveBidUnitList]);

    const { updateErrors, liveBidUnitUpdateAPI } = useLiveBidUnitUpdateAPI();
    const handleUpdateSubmit = () => {
        if (!newLiveBidUnit) {
            return;
        }
        liveBidUnitUpdateAPI(fetchList);
    };
    useEffect(() => {
        if (updateErrors) { setFormErrors(updateErrors); }
    }, [updateErrors]);

    return (
        <div>
            <div className={breadcrumbStyles.breadcrumb}>
                <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminLiveBidUnitRegist}</span>
            </div>
            <div className="flex flex-col items-center justify-center my-3 bg-gray-100">
                <div className="w-full space-y-3 bg-white shadow-md md:max-w-full md:rounded">
                    <div className="p-4">
                        {texts.label.newRegist}
                        <div className="flex flex-col md:flex-row items-end space-y-4">
                            <table className="w-full sm:w-1/2 bg-white">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th colSpan={3} className="py-2 px-4 border">{texts.bidUnit.unitRange} </th>
                                        <th className="py-2 px-4 border">{texts.bidUnit.bidUnit} </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr >
                                        <td className="py-2 px-4 border">
                                            <input
                                                name="unitFrom"
                                                onChange={handleNewLiveBidUnitChange}
                                                className="w-full p-1 border rounded text-right"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border">～</td>
                                        <td className="py-2 px-4 border">
                                            <input
                                                name="unitTo"
                                                onChange={handleNewLiveBidUnitChange}
                                                className="w-full p-1 border rounded text-right"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border">
                                            <input
                                                name="bitUnit"
                                                onChange={handleNewLiveBidUnitChange}
                                                className="w-full p-1 border rounded text-right"
                                            />
                                        </td>

                                    </tr>
                                    <tr >
                                        <td className="py-2 px-4" style={{ border: 'none' }}>
                                            {formErrors?.unitFrom && <p className="error-message">{formErrors.unitFrom}</p>}
                                            {formErrors?.newUnitRange && <p className="error-message">{formErrors.newUnitRange}</p>}
                                        </td>
                                        <td className="py-2 px-4" style={{ border: 'none' }}></td>
                                        <td className="py-2 px-4" style={{ border: 'none' }}>
                                            {formErrors?.unitTo && <p className="error-message">{formErrors.unitTo}</p>}
                                        </td>
                                        <td className="py-2 px-4" style={{ border: 'none' }}>
                                            {formErrors?.bitUnit && <p className="error-message">{formErrors.bitUnit}</p>}
                                        </td>

                                    </tr>
                                </tbody>
                            </table>

                        </div>
                        {executionPermission(305, 2) ? (
                            <RegistButton label={texts.button.regist} onClick={handleNewSubmit} />
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
                                    <th colSpan={3} className="py-2 px-4 border">{texts.bidUnit.unitRange}</th>
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
                                                onChange={(e) => handleInputChange(item.seq, "unitFrom", Number(e.target.value))}
                                                className="w-full p-1 border rounded  text-right"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border">～</td>
                                        <td className="py-2 px-4 border">
                                            <input
                                                value={formatCurrency(Number(item.unitTo))}
                                                onChange={(e) => handleInputChange(item.seq, "unitTo", Number(e.target.value))}
                                                className="w-full p-1 border rounded text-right"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border">
                                            <input
                                                value={formatCurrency(Number(item.bitUnit))}
                                                onChange={(e) => handleInputChange(item.seq, "bitUnit", Number(e.target.value))}
                                                className="w-full p-1 border rounded text-right"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border">
                                            <button
                                                onClick={() => handleDelete(item.seq)}
                                                className="lg:ml-2.5 mt-2 lg:mt-0 bg-white border border-solid border-red-500 text-red-500 font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
                                            >
                                                {texts.button.delete}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="w-full sm:w-1/2 bg-white my-4">
                            {formErrors?.unitRange && <p className="error-message">{formErrors.unitRange}</p>}
                        </div>

                        {executionPermission(305, 2) ? (
                            <RegistButton label={texts.button.regist} onClick={handleUpdateSubmit} />
                        ) : (
                            <></>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default withAdminLayout(Page);