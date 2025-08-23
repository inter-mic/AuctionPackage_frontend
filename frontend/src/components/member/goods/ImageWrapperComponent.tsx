import React from "react";
import Image from "next/image";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { TGoodsImageData } from "@/types/common/goodsImage";
import styles from "@/styles/member/goods/GoodsDetail.module.css";

interface ImageWrapperComponentProps {
  mainImageSrc: string;
  thumImages: TGoodsImageData[];
  selectedImage: string | null;
  onMainImageClick: () => void;
  onThumbnailClick: (thumbnailUrl: string) => void;
  imageListCols?: number;
  thumbnailSize?: number;
}

export const ImageWrapperComponent: React.FC<ImageWrapperComponentProps> = ({
  mainImageSrc,
  thumImages,
  selectedImage,
  onMainImageClick,
  onThumbnailClick,
  imageListCols = 7,
  thumbnailSize = 100,
}) => {
  return (
    <div className={styles.imageWrapper}>
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "56.25%",
          marginBottom: "20px",
        }}
      >
        <Image
          src={mainImageSrc}
          alt=""
          fill
          quality={100}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: "contain", cursor: "pointer" }}
          onClick={onMainImageClick}
        />
      </div>

      <ImageList
        sx={{
          width: "100%",
          height: "auto",
          overflow: "visible",
        }}
        cols={imageListCols}
      >
        {thumImages.length > 0 ? (
          thumImages.map((data) => (
            <ImageListItem
              key={data.goodsImagesNo}
              sx={{
                border: selectedImage === data.thumbnailImageUrl ? "1px solid black" : "none",
              }}
            >
              <Image
                src={`${data.thumbnailImageUrl}`}
                alt=""
                width={thumbnailSize}
                height={thumbnailSize}
                quality={50}
                loading="lazy"
                onClick={() =>
                  data.thumbnailImageUrl && onThumbnailClick(data.thumbnailImageUrl)
                }
                style={{ cursor: "pointer" }}
              />
            </ImageListItem>
          ))
        ) : (
          <p></p>
        )}
      </ImageList>
    </div>
  );
};
