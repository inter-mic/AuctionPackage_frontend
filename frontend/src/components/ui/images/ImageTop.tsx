import React, { useState, useEffect } from "react";
import { useLocale } from "@/hooks/useLocale";
import { DndContext, closestCenter, DragOverEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "react-toastify";
import { getTexts } from "@/config/texts";
import Image from "next/image";
interface Image {
  imageSeq: string;
  isNewFlg: boolean;
  isDeleteFlg: boolean;
  topImageUrl: string;
  linkUrl: string;
}

interface ImageSortableListProps {
  images: Image[];
  onImagesUpdate: (updatedImages: Image[]) => void;
}

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  linkUrl: string;
  onChange: (id: string, e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onDelete: (id: string) => void;
}

const ImageThumbnail: React.FC<SortableItemProps> = ({
  id,
  children,
  linkUrl,
  onChange,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    borderRadius: 4,
    width: "100%",
    height: "auto",
    backgroundColor: "white",
  };

  const buttonStyle = {
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    borderRadius: 4,
    width: "100%",
    height: "50px",
    border: "1px solid red",
    color: "red",
    backgroundColor: "white",
  };

  const handleLinkUrlChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChange(id, e);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    onDelete(id);
  };

  return (
    <div className="w-1/3 p-2">
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
      <input
        id={`linkUrl_${id}`}
        name={`linkUrl_${id}`}
        type="text"
        placeholder="URL設定項目"
        className={`border border-black rounded w-full h-12 m-1 p-2`}
        value={linkUrl || ""}
        onChange={handleLinkUrlChange}
      />
      <button style={buttonStyle} onClick={handleDeleteClick}>
        削除
      </button>
    </div>
  );
};

export const ImageTopList: React.FC<ImageSortableListProps> = ({ images, onImagesUpdate }) => {
  const handleDeleteImage = (id: string) => {
    // const updatedImages = images.filter(image => image.imageSeq !== id);

    const updatedImages = images.map((image) =>
      image.imageSeq === id ? { ...image, isDeleteFlg: true } : image
    );
    onImagesUpdate(updatedImages);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = images.findIndex((image) => image.imageSeq === active.id);
      const newIndex = images.findIndex((image) => image.imageSeq === over.id);
      const updatedImages = arrayMove(images, oldIndex, newIndex);
      onImagesUpdate(updatedImages);
    }
  };
  const [dropZoneActive, setDropZoneActive] = useState(false);
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDropZoneActive(true);
  };

  const handleDragLeave = () => {
    setDropZoneActive(false);
  };
  const { texts } = useLocale();
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDropZoneActive(false);

    // ドロップされたファイルを取得
    const files = Array.from(event.dataTransfer.files);
    // jpg または png ファイルのみをフィルタリング
    const validFiles = files.filter((file) => {
      const fileType = file.type;
      return fileType === "image/jpeg" || fileType === "image/png";
    });

    if (validFiles.length === 0) {
      toast.error(texts.goods.image_note_2);
      return;
    }

    // 現在の最大 no 値を取得
    const maxNo = getMaxNo(images);

    const promises = files.map((file, index) => {
      return new Promise<Image>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          resolve({
            imageSeq: `${maxNo + index + 1}`,
            isNewFlg: true,
            isDeleteFlg: false,
            topImageUrl: imageUrl,
            linkUrl: "",
          });
        };
        reader.readAsDataURL(file);
      });
    });

    // すべての画像を読み込んでから更新
    Promise.all(promises).then((newImages) => {
      onImagesUpdate([...images, ...newImages]);
    });
  };
  const getMaxNo = (images: Image[]): number => {
    const maxNo = images.reduce((max, image) => Math.max(max, parseInt(image.imageSeq, 10)), 0);
    return maxNo;
  };

  const handleChange = (
    id: string,
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedImages = images.map((image) =>
      image.imageSeq === id ? { ...image, linkUrl: value } : image
    );
    onImagesUpdate(updatedImages);
  };

  return (
    <div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={images.map((image) => image.imageSeq)}
          strategy={verticalListSortingStrategy}
        >
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {images.map((image) =>
              !image.isDeleteFlg ? (
                <ImageThumbnail
                  key={image.imageSeq}
                  id={image.imageSeq}
                  linkUrl={image.linkUrl}
                  onChange={handleChange}
                  onDelete={handleDeleteImage}
                >
                  <Image
                    src={image.topImageUrl}
                    alt=""
                    width={600}
                    height={300}
                    style={{
                      width: "100%",
                      height: "300px", // 高さは自動で調整
                      maxWidth: "600px", // 最大幅を指定
                      maxHeight: "300px", // 最大高さを指定
                      objectFit: "contain", // 画像を縮小して全体を表示
                    }}
                  />
                </ImageThumbnail>
              ) : null
            )}
          </div>
        </SortableContext>
      </DndContext>

      <div
        style={{
          width: "100%",
          height: "100px",
          border: "2px dashed #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: dropZoneActive ? "#e0e0e0" : "#f9f9f9",
          marginTop: "20px",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        ドロップエリア
      </div>
    </div>
  );
};
