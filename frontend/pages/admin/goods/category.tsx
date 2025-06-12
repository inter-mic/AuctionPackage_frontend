import { GetServerSideProps } from "next";
import breadcrumbStyles from "@/styles/breadcrumb.module.css";
import { texts } from "@/config/texts.ja";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminLayout from "@/hocs/withAdminLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useKengenRedirect } from "@/hooks/useKengenRedirect";
import { useExecutionPermission } from "@/hooks/useExecutionPermission";
//API
import { useCategorySearchAPI } from "@/hooks/api/admin/category/useCategorySearchAPI";
import { useCategoryRegistAPI } from "@/hooks/api/admin/category/useCategoryRegistAPI";
//型定義
import { PageProps } from "@/types/admin/adminPage";
//ボタン
import { RegistButton } from "@/components/ui/buttons/admin/registButton";
import { CategoryUpdateButton } from "@/components/ui/buttons/admin/CategoryUpdateButton";
import { CategoryDeleteButton } from "@/components/ui/buttons/admin/CategoryDeleteButton";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.adminCategoryRegist,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, useCallback, texts } = useCommonSetup();
  useKengenRedirect(kengen, 207);
  const { executionPermission } = useExecutionPermission(kengen);
  const { category } = useCategorySearchAPI();

  const [newCategory, setNewCategory] = useState<{ [key: string]: string }>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formUpdateErrors, setFormUpdateErrors] = useState<{
    [key: string]: { [key: string]: string };
  }>({});

  const handleNewCategoryChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewCategory((prevCategory) => ({ ...prevCategory, [name]: value }));
  };

  const { responseData, errors, categoryRegist } = useCategoryRegistAPI();
  const handleSubmit = () => {
    categoryRegist(null, newCategory);
  };

  useEffect(() => {
    if (errors) {
      setFormErrors(errors);
    }
  }, [errors]);

  const [categoryItems, setCategoryItems] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (category) {
      const initialState = category.reduce((acc: any, item: any) => {
        acc[`category_${item.categorySeq}`] = item.categoryName || "";
        return acc;
      }, {});
      setCategoryItems(initialState);
    }
  }, [category]);

  const handleChange = (categorySeq: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCategoryItems((prevItems) => ({
      ...prevItems,
      [`category_${categorySeq}`]: value,
    }));
    if (formUpdateErrors?.[categorySeq]?.categoryName) {
      setFormUpdateErrors((prevErrors) => ({
        ...prevErrors,
        [categorySeq]: {
          ...prevErrors[categorySeq],
          categoryName: "",
        },
      }));
    }
  };

  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminCategoryRegist}</span>
      </div>
      <div className="flex flex-col items-center justify-center my-3 bg-gray-100">
        <div className="w-full space-y-3 bg-white shadow-md md:max-w-full md:rounded">
          <div className="p-4">
            {texts.label.newRegist}
            <div className="flex flex-col md:flex-row items-end space-y-4">
              <div className="w-full sm:w-1/3">
                <input
                  id="categoryName"
                  type="text"
                  name="categoryName"
                  onChange={handleNewCategoryChange}
                  className="w-full border p-2 rounded h-10"
                />
              </div>
              {executionPermission(207, 2) ? (
                <RegistButton label={texts.button.regist} onClick={handleSubmit} />
              ) : (
                <></>
              )}
            </div>
            <div className="w-full sm:w-1/3">
              {formErrors?.categoryName && (
                <p className="error-message">{formErrors.categoryName}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {category && category.length > 0 ? (
        <div className="flex flex-col items-center justify-center my-3 bg-gray-100">
          <div className="w-full space-y-3 bg-white shadow-md md:max-w-full md:rounded">
            <div className="p-4">
              <table className="w-full sm:w-1/2 bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 w-3/5 border-b">{texts.category.categoryName}</th>
                    <th className="py-2 px-4 w-1/5 border-b"></th>
                    <th className="py-2 px-4 w-1/5 border-b"></th>
                  </tr>
                </thead>
                <tbody>
                  {category.map((result) => (
                    <tr key={result.categorySeq}>
                      <td className="py-2 px-4 border-b text-left">
                        <input
                          id={`category_${result.categorySeq}`}
                          name={`category_${result.categorySeq}`}
                          type="text"
                          value={categoryItems[`category_${result.categorySeq}`] || ""}
                          onChange={handleChange(result.categorySeq)}
                          className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300`}
                        />
                        {formUpdateErrors?.[result.categorySeq]?.categoryName && (
                          <p className="error-message">
                            {formUpdateErrors?.[result.categorySeq]?.categoryName}
                          </p>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {executionPermission(207, 2) ? (
                          <CategoryUpdateButton
                            categorySeq={result.categorySeq}
                            categoryName={categoryItems[`category_${result.categorySeq}`] || ""}
                            setFormUpdateErrors={setFormUpdateErrors}
                          />
                        ) : (
                          <></>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {executionPermission(207, 2) ? (
                          <CategoryDeleteButton categorySeq={result.categorySeq} />
                        ) : (
                          <></>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default withAdminLayout(Page);
