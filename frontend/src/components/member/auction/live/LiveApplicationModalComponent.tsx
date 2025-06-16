import React from "react";
import Modal from "react-modal";

//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//API
import { useLiveApplicationAPI } from "@/hooks/api/member/live/useLiveApplicationAPI";

//スタイル
import styles from "@/styles/member/Live/LiveApplication.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  auctionSeq: number;
  auctionName: string;
};

export const LiveApplicationModalComponent: React.FC<Props> = ({
  isOpen,
  onClose,
  auctionSeq,
  auctionName,
}) => {
  const { texts } = useCommonSetup();
  const { fetchPaddleNo, liveApplicationAPI } = useLiveApplicationAPI();

  const handleSubmit = async () => {
    await liveApplicationAPI(auctionSeq);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{auctionName} 参加申込</h2>
        <div className={styles.buttonContainer}>
          <button onClick={onClose} className={styles.closeButton}>
            {texts.button.cancel}
          </button>
          <button onClick={handleSubmit} className={styles.submitButton}>
            {texts.button.toLiveApplication}
          </button>
        </div>
      </div>
    </Modal>
  );
};
