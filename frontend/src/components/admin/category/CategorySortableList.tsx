import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ConfirmDialog from "@/components/ui/dialog/confirmDialog";
//import { ChildCategoryButton } from "@/components/ui/buttons/admin/ChildCategoryButton";

interface Category {
  categorySeq: string;
  categoryName: string;
  sortOrder?: number;
}

interface CategorySortableListProps {
  categories: Category[];
  onCategoriesUpdate: (categories: Category[]) => void;
  categoryItems: { [key: string]: string };
  onCategoryChange: (categorySeq: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  formUpdateErrors: { [key: string]: { [key: string]: string } };
  executionPermission: (screenId: number, permission: number) => boolean;
  onChildCategoryClick: (categorySeq: string, categoryName: string) => void;
  onDeleteCategory?: (categorySeq: string) => void;
}

interface SortableItemProps {
  id: string;
  category: Category;
  categoryName: string;
  onChange: (categorySeq: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  executionPermission: (screenId: number, permission: number) => boolean;
  onChildCategoryClick: (categorySeq: string, categoryName: string) => void;
  onDeleteCategory?: (categorySeq: string) => void;
}

const SortableCategoryItem: React.FC<SortableItemProps> = ({
  id,
  category,
  categoryName,
  onChange,
  error,
  executionPermission,
  //onChildCategoryClick,
  onDeleteCategory,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    disabled: false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <td className="py-2 px-4 border-b text-left">
        <div className="flex items-center space-x-2">
          <DragIndicatorIcon
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            style={{ fontSize: "20px" }}
          />
          <div
            className="w-full"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <input
              id={`category_${category.categorySeq}`}
              name={`category_${category.categorySeq}`}
              type="text"
              value={categoryName || ""}
              onChange={onChange(category.categorySeq)}
              className="w-full px-3 py-2 mt-1 border rounded-md"
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        {error && <p className="error-message text-red-500 text-sm mt-1">{error}</p>}
      </td>
      {/* <td
        className="py-2 px-4 border-b text-center"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col space-y-1">
          {!category.categorySeq.toString().startsWith("new_") && (
            <ChildCategoryButton
              onClick={() => onChildCategoryClick(category.categorySeq, category.categoryName)}
              label="子階層"
            />
          )}
        </div>
      </td> */}
      <td
        className="py-2 px-4 border-b text-center"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {executionPermission(207, 2) ? (
          <ConfirmDialog
            title="カテゴリ削除"
            description="このカテゴリを削除しますか？"
            buttonTitle="削除"
            className="bg-red-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-40"
            dialogCancelClassName="bg-gray-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg"
            dialogClassName="bg-red-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg"
            onSubmit={() => onDeleteCategory?.(category.categorySeq.toString())}
            buttonText="削除"
          />
        ) : (
          <></>
        )}
      </td>
    </tr>
  );
};

export const CategorySortableList: React.FC<CategorySortableListProps> = ({
  categories,
  onCategoriesUpdate,
  categoryItems,
  onCategoryChange,
  formUpdateErrors,
  executionPermission,
  onChildCategoryClick,
  onDeleteCategory,
}) => {
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = categories.findIndex((category) => category.categorySeq === active.id);
      const newIndex = categories.findIndex((category) => category.categorySeq === over.id);
      const updatedCategories = arrayMove(categories, oldIndex, newIndex);

      // sortOrderを更新
      const categoriesWithSortOrder = updatedCategories.map((category, index) => ({
        ...category,
        sortOrder: index + 1,
      }));

      onCategoriesUpdate(categoriesWithSortOrder);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={categories.map((category) => category.categorySeq)}
        strategy={verticalListSortingStrategy}
      >
        <table className="w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 w-3/5 border-b">カテゴリ名</th>
              <th className="py-2 px-4 w-1/5 border-b"></th>
              {/* <th className="py-2 px-4 w-1/5 border-b"></th> */}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <SortableCategoryItem
                key={category.categorySeq}
                id={category.categorySeq}
                category={category}
                categoryName={categoryItems[`category_${category.categorySeq}`] || ""}
                onChange={onCategoryChange}
                error={formUpdateErrors?.[category.categorySeq]?.categoryName}
                executionPermission={executionPermission}
                onChildCategoryClick={onChildCategoryClick}
                onDeleteCategory={onDeleteCategory}
              />
            ))}
          </tbody>
        </table>
      </SortableContext>
    </DndContext>
  );
};
