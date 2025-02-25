import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragOverEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'react-toastify';
import { texts } from '@/config/texts';
import Image from 'next/image';
interface Image {
    no: string;
    isNewFlg: boolean;
    thumbnailImageUrl: string;
    originalImageUrl: string;
    squareImageUrl: string;
}

interface ImageSortableListProps {
    images: Image[];
    onImagesUpdate: (updatedImages: Image[]) => void;
}

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
    onDelete: (id: string) => void;

}

const ImageThumbnail: React.FC<SortableItemProps> = ({ id, children, onDelete }) => {
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: 4,
        borderRadius: 4,
        width: "100%",
        height: "50px",
        border: "1px solid red",
        backgroundColor: "white",
        color:"red"
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        onDelete(id);
    };

    return (
        <div style={{ width: '15%', padding: '5px', boxSizing: 'border-box' }}>
            <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                {children}
            </div>
            <div style={buttonStyle}>
                <button onClick={handleDeleteClick}>削除</button>
            </div>
        </div>
    );
};

export const ImageThumbnailList: React.FC<ImageSortableListProps> = ({ images, onImagesUpdate }) => {

    const handleDeleteImage = (id: string) => {
        const updatedImages = images.filter(image => image.no !== id);
        onImagesUpdate(updatedImages);

    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = images.findIndex(image => image.no === active.id);
            const newIndex = images.findIndex(image => image.no === over.id);
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
                        no: `${maxNo + index + 1}`,
                        isNewFlg:true,
                        thumbnailImageUrl: imageUrl,
                        originalImageUrl: imageUrl,
                        squareImageUrl: imageUrl
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        // すべての画像を読み込んでから更新
        Promise.all(promises).then(newImages => {
            onImagesUpdate([...images, ...newImages]);
        });
    };
    const getMaxNo = (images: Image[]): number => {
        const maxNo = images.reduce((max, image) => Math.max(max, parseInt(image.no, 10)), 0);
        return maxNo;
    };


    return (
        <div>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={images.map((image) => image.no)} strategy={verticalListSortingStrategy}>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {images.map((image) => (
                            <ImageThumbnail
                                key={image.no}
                                id={image.no}
                                onDelete={handleDeleteImage}
                            >
                                <Image
                                    src={image.squareImageUrl} 
                                    alt=""
                                    width={100}
                                    height={100}
                                    style={{ width: 'auto', height: '80px', margin: '10px' }}
                                />
                            </ImageThumbnail>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <div
                style={{
                    width: '100%',
                    height: '100px',
                    border: '2px dashed #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: dropZoneActive ? '#e0e0e0' : '#f9f9f9',
                    marginTop: '20px',
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
