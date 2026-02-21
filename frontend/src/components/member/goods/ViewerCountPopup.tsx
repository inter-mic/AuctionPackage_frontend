import React, { useEffect, useState } from "react";
import styles from "@/styles/member/goods/ViewerCountPopup.module.css";

interface Props {
  count: number;
  onClose: () => void;
}

export const ViewerCountPopup: React.FC<Props> = ({ count, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 10秒後に非表示にする
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300); // フェードアウトアニメーションの時間
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`${styles.popup} ${isVisible ? styles.visible : styles.hidden}`}>
      <div className={styles.content}>
        <p className={styles.message}>
          この商品は現在<span className={styles.count}>{count}</span>人が閲覧しています
        </p>
      </div>
    </div>
  );
};
