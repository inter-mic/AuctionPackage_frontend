import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { GoodsImageData } from "@/types/admin/goods/register";

interface ImagePopupComponentProps {
  open: boolean;
  onClose: () => void;
  images: GoodsImageData[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

const ImagePopupComponent: React.FC<ImagePopupComponentProps> = ({
  open,
  onClose,
  images,
  currentIndex,
  onPrev,
  onNext,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // SP判定
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const handleClose = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
    onClose();
  };

  const handlePrev = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
    onPrev();
  };

  const handleNext = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
    onNext();
  };

  // ズーム機能
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  // 画像移動機能
  const handleMoveUp = () => {
    if (zoomLevel > 1) {
      setImagePosition((prev) => ({ ...prev, y: prev.y + 50 }));
    }
  };

  const handleMoveDown = () => {
    if (zoomLevel > 1) {
      setImagePosition((prev) => ({ ...prev, y: prev.y - 50 }));
    }
  };

  const handleMoveLeft = () => {
    if (zoomLevel > 1) {
      setImagePosition((prev) => ({ ...prev, x: prev.x + 50 }));
    }
  };

  const handleMoveRight = () => {
    if (zoomLevel > 1) {
      setImagePosition((prev) => ({ ...prev, x: prev.x - 50 }));
    }
  };

  // ドラッグ機能
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  if (images.length === 0) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        style: {
          maxWidth: isMobile ? "90vw" : "95vw",
          maxHeight: isMobile ? "80vh" : "95vh",
          width: isMobile ? "90vw" : "95vw",
          height: isMobile ? "80vh" : "95vh",
          margin: 0,
          overflow: "hidden",
        },
      }}
    >
      <div
        style={{
          position: "relative",
          background: "#000",
          textAlign: "center",
          minHeight: isMobile ? "70vh" : "80vh",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <IconButton
          onClick={handleClose}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "black",
            backgroundColor: "#f5f5f5",
            zIndex: 2,
            width: "40px",
            height: "40px",
          }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>

        {/* ズームコントロール */}
        {!isMobile && (
          <div
            style={{ position: "absolute", top: 8, left: 8, zIndex: 2, display: "flex", gap: "8px" }}
          >
            <IconButton
              onClick={handleZoomOut}
              style={{
                color: "black",
                backgroundColor: "#f5f5f5",
                width: "40px",
                height: "40px",
              }}
              aria-label="zoom out"
            >
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>-</span>
            </IconButton>
            <IconButton
              onClick={handleResetZoom}
              style={{
                color: "black",
                backgroundColor: "#f5f5f5",
                width: "100px",
                height: "40px",
              }}
              aria-label="reset zoom"
            >
              <span style={{ fontSize: "16px" }}>リセット</span>
            </IconButton>
            <IconButton
              onClick={handleZoomIn}
              style={{
                color: "black",
                backgroundColor: "#f5f5f5",
                width: "40px",
                height: "40px",
              }}
              aria-label="zoom in"
            >
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>+</span>
            </IconButton>
          </div>
        )}

        <IconButton
          onClick={handlePrev}
          style={{
            position: "absolute",
            top: "50%",
            left: 8,
            color: "black",
            backgroundColor: "#f5f5f5",
            zIndex: 2,
            transform: "translateY(-50%)",
            width: "40px",
            height: "40px",
          }}
          aria-label="prev"
        >
          <KeyboardArrowLeftIcon fontSize="large" />
        </IconButton>

        {/* 画像移動ボタン */}
        {zoomLevel > 1 && !isMobile && (
          <div
            style={{
              position: "absolute",
              bottom: 16,
              right: 16,
              zIndex: 2,
              display: "grid",
              gridTemplateColumns: "repeat(3, 40px)",
              gridTemplateRows: "repeat(3, 40px)",
              gap: "4px",
            }}
          >
          {/* 上段 */}
          <div style={{ gridColumn: "2", gridRow: "1" }}>
            <IconButton
              onClick={handleMoveUp}
              style={{
                color: "black",
                backgroundColor: "#f5f5f5",
                width: "40px",
                height: "40px",
              }}
              aria-label="move up"
            >
              <KeyboardArrowUpIcon fontSize="large" />
            </IconButton>
          </div>

          {/* 中段 */}
          <div style={{ gridColumn: "1", gridRow: "2" }}>
            <IconButton
              onClick={handleMoveLeft}
              style={{
                color: "black",
                backgroundColor: "#f5f5f5",
                width: "40px",
                height: "40px",
              }}
              aria-label="move left"
            >
              <KeyboardArrowLeftIcon fontSize="large" />
            </IconButton>
          </div>
          <div style={{ gridColumn: "2", gridRow: "2" }}>{/* 中央は空 */}</div>
          <div style={{ gridColumn: "3", gridRow: "2" }}>
            <IconButton
              onClick={handleMoveRight}
              style={{
                color: "black",
                backgroundColor: "#f5f5f5",
                width: "40px",
                height: "40px",
              }}
              aria-label="move right"
            >
              <KeyboardArrowRightIcon fontSize="large" />
            </IconButton>
          </div>

          {/* 下段 */}
          <div style={{ gridColumn: "2", gridRow: "3" }}>
            <IconButton
              onClick={handleMoveDown}
              style={{
                color: "black",
                backgroundColor: "#f5f5f5",
                width: "40px",
                height: "40px",
              }}
              aria-label="move down"
            >
              <KeyboardArrowDownIcon fontSize="large" />
            </IconButton>
          </div>
        </div>
        )}

        <img
          src={images[currentIndex]?.originalImageUrl || ""}
          alt=""
          style={{
            maxHeight: "100vh",
            maxWidth: "100%",
            margin: "0 auto",
            display: "block",
            transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${zoomLevel})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.2s ease-in-out",
            cursor: zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "default",
            userSelect: "none",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
        <IconButton
          onClick={handleNext}
          style={{
            position: "absolute",
            top: "50%",
            right: 8,
            color: "black",
            backgroundColor: "#f5f5f5",
            zIndex: 2,
            transform: "translateY(-50%)",
            width: "40px",
            height: "40px",
          }}
          aria-label="next"
        >
          <KeyboardArrowRightIcon fontSize="large" />
        </IconButton>
      </div>
    </Dialog>
  );
};

export default ImagePopupComponent;
