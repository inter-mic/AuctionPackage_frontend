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
import { useOyaCategorySearchAPI } from "@/hooks/api/admin/category/useOyaCategorySearchAPI";
import { useChildCategorySearchAPI } from "@/hooks/api/admin/category/useChildCategorySearchAPI";
import { useCategoryBulkUpdateAPI } from "@/hooks/api/admin/category/useCategoryBulkUpdateAPI";
import { useCategoryDeleteAPI } from "@/hooks/api/admin/category/useCategoryDeleteAPI";
//型定義
import { PageProps } from "@/types/admin/adminPage";
//ボタン
import { RegistButton } from "@/components/ui/buttons/admin/registButton";
import { CategoryAddButton } from "@/components/ui/buttons/admin/CategoryAddButton";
//コンポーネント
import { CategorySortableList } from "@/components/admin/category/CategorySortableList";
import { ChildCategorySortableList } from "@/components/admin/category/ChildCategorySortableList";

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminCategoryRegist,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, texts } = useCommonSetup();
  useKengenRedirect(kengen, 207);
  const { executionPermission } = useExecutionPermission(kengen);
  const { oyaCategory } = useOyaCategorySearchAPI();
  const { childCategory, childCategorySearchAPI } = useChildCategorySearchAPI();
  const { categoryBulkUpdateAPI, bulkUpdateErrors } = useCategoryBulkUpdateAPI();
  const { categoryDelete } = useCategoryDeleteAPI();

  const [formUpdateErrors, setFormUpdateErrors] = useState<{
    [key: string]: { [key: string]: string };
  }>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [childCategories, setChildCategories] = useState<any[]>([]);
  const [childCategoryItems, setChildCategoryItems] = useState<{ [key: string]: string }>({});
  const [selectedParentCategory, setSelectedParentCategory] = useState<string | null>(null);
  const [selectedParentCategoryName, setSelectedParentCategoryName] = useState<string>("");

  const [categoryItems, setCategoryItems] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (oyaCategory) {
      const initialState = oyaCategory.reduce((acc: any, item: any) => {
        acc[`category_${item.categorySeq}`] = item.categoryName || "";
        return acc;
      }, {});
      setCategoryItems(initialState);

      // カテゴリリストを初期化（sortOrder付き）
      const categoriesWithSortOrder = oyaCategory.map((item: any, index: number) => ({
        ...item,
        sortOrder: index + 1,
      }));
      setCategories(categoriesWithSortOrder);
    }
  }, [oyaCategory]);

  // 子カテゴリデータの処理
  useEffect(() => {
    if (childCategory) {
      const initialState = childCategory.reduce((acc: any, item: any) => {
        acc[`child_category_${item.categorySeq}`] = item.categoryName || "";
        return acc;
      }, {});
      setChildCategoryItems(initialState);

      // 子カテゴリリストを初期化（sortOrder付き）
      const childCategoriesWithSortOrder = childCategory.map((item: any, index: number) => ({
        ...item,
        sortOrder: index + 1,
      }));
      setChildCategories(childCategoriesWithSortOrder);
    }
  }, [childCategory]);

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

  const handleChildCategoryChange =
    (categorySeq: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setChildCategoryItems((prevItems) => ({
        ...prevItems,
        [`child_category_${categorySeq}`]: value,
      }));
    };

  const handleCategoriesUpdate = (updatedCategories: any[]) => {
    setCategories(updatedCategories);
  };

  const handleChildCategoriesUpdate = (updatedChildCategories: any[]) => {
    setChildCategories(updatedChildCategories);
  };

  const handleChildCategoryClick = async (categorySeq: string, categoryName: string) => {
    // 子カテゴリクリック時の処理
    setSelectedParentCategory(categorySeq);
    setSelectedParentCategoryName(categoryName);

    await childCategorySearchAPI(parseInt(categorySeq));
  };

  const handleAddCategory = () => {
    // 親カテゴリ追加時の処理
    const newCategory = {
      categorySeq: `new_${Date.now()}`, // 一時的なID
      categoryName: "",
      sortOrder: categories.length + 1,
    };
    setCategories([...categories, newCategory]);

    // 新しいカテゴリの入力値を初期化
    setCategoryItems((prev) => ({
      ...prev,
      [`category_${newCategory.categorySeq}`]: "",
    }));
  };

  const handleDeleteCategory = async (categorySeq: string) => {
    // カテゴリ削除時の処理
    // 削除成功時、リストから該当項目を削除
    setCategories(categories.filter((cat) => cat.categorySeq.toString() !== categorySeq));
    // 入力値からも削除
    const newCategoryItems = { ...categoryItems };
    delete newCategoryItems[`category_${categorySeq}`];
    setCategoryItems(newCategoryItems);
    if (!categorySeq.toString().startsWith("new_")) {
      await categoryDelete(parseInt(categorySeq));
    }
  };

  const handleAddChildCategory = () => {
    // 子カテゴリ追加時の処理
    if (!selectedParentCategory) return;

    const newChildCategory = {
      categorySeq: `new_child_${Date.now()}`, // 一時的なID
      categoryName: "",
      sortOrder: childCategories.length + 1,
      oyaCategorySeq: selectedParentCategory,
    };
    setChildCategories([...childCategories, newChildCategory]);

    // 新しい子カテゴリの入力値を初期化
    setChildCategoryItems((prev) => ({
      ...prev,
      [`child_category_${newChildCategory.categorySeq}`]: "",
    }));
  };

  const handleDeleteChildCategory = async (categorySeq: string) => {
    // 子カテゴリ削除時の処理
    setChildCategories(childCategories.filter((cat) => cat.categorySeq.toString() !== categorySeq));
    // 入力値からも削除
    const newChildCategoryItems = { ...childCategoryItems };
    delete newChildCategoryItems[`child_category_${categorySeq}`];
    setChildCategoryItems(newChildCategoryItems);
    if (!categorySeq.toString().startsWith("new_")) {
      await categoryDelete(parseInt(categorySeq));
    }
  };

  const handleBulkUpdate = async () => {
    const bulkUpdateData = categories.map((category) => ({
      categorySeq: category.categorySeq.toString().startsWith("new_")
        ? ""
        : category.categorySeq.toString(),
      sortOrder: category.sortOrder || 1,
      categoryName: categoryItems[`category_${category.categorySeq}`] || "",
    }));

    const result = await categoryBulkUpdateAPI(bulkUpdateData, true);
    if (result?.success) {
      // 成功時の処理（必要に応じてページをリロード）
      window.location.reload();
    }
  };

  const handleChildBulkUpdate = async () => {
    const bulkUpdateData = childCategories.map((category) => ({
      categorySeq: category.categorySeq.toString().startsWith("new_child_")
        ? ""
        : category.categorySeq.toString(),
      oyaCategorySeq: selectedParentCategory,
      sortOrder: category.sortOrder || 1,
      categoryName: childCategoryItems[`child_category_${category.categorySeq}`] || "",
    }));

    const result = await categoryBulkUpdateAPI(bulkUpdateData, false);
    if (result?.success) {
      // 成功時の処理（必要に応じてページをリロード）
      window.location.reload();
    }
  };

  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminCategoryRegist}</span>
      </div>

      {categories && categories.length > 0 ? (
        <div className="flex flex-row items-start  my-3 bg-gray-100 space-x-4">
          {/* 親カテゴリ一覧 */}
          <div className="w-1/2 space-y-3 bg-white shadow-md md:max-w-full md:rounded">
            <div className="p-4">
              {/* <h3 className="text-lg font-semibold mb-4">親カテゴリ一覧</h3> */}
              <div className="mt-4 mb-4">
                {executionPermission(207, 2) && (
                  <CategoryAddButton onClick={handleAddCategory} label="カテゴリ追加" />
                )}
              </div>
              <CategorySortableList
                categories={categories}
                onCategoriesUpdate={handleCategoriesUpdate}
                categoryItems={categoryItems}
                onCategoryChange={handleChange}
                formUpdateErrors={formUpdateErrors}
                executionPermission={executionPermission}
                onChildCategoryClick={handleChildCategoryClick}
                onDeleteCategory={handleDeleteCategory}
              />

              {/* 一括更新ボタン */}
              <div className="mt-4 text-center">
                {executionPermission(207, 2) ? (
                  <RegistButton onClick={handleBulkUpdate} label="カテゴリ登録" />
                ) : (
                  <></>
                )}
                {bulkUpdateErrors && (
                  <p className="error-message text-red-500 text-sm mt-2">{bulkUpdateErrors}</p>
                )}
              </div>
            </div>
          </div>

          {/* 子カテゴリ一覧 */}
          {selectedParentCategory && (
            <div className="w-1/2 space-y-3 bg-white shadow-md md:max-w-full md:rounded">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    子カテゴリ一覧 &gt;{selectedParentCategoryName}
                  </h3>
                </div>

                {/* 子カテゴリ追加ボタン */}
                <div className="mb-4">
                  {executionPermission(207, 2) && (
                    <CategoryAddButton onClick={handleAddChildCategory} label="子カテゴリ追加" />
                  )}
                </div>

                {childCategories && childCategories.length > 0 ? (
                  <>
                    <ChildCategorySortableList
                      categories={childCategories}
                      onCategoriesUpdate={handleChildCategoriesUpdate}
                      categoryItems={childCategoryItems}
                      onCategoryChange={handleChildCategoryChange}
                      formUpdateErrors={formUpdateErrors}
                      executionPermission={executionPermission}
                      onDeleteChildCategory={handleDeleteChildCategory}
                    />

                    {/* 子カテゴリ一括更新ボタン */}
                    <div className="mt-4 text-center">
                      {executionPermission(207, 2) ? (
                        <RegistButton onClick={handleChildBulkUpdate} label="子カテゴリ登録" />
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    子カテゴリが登録されていません
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default withAdminLayout(Page);
