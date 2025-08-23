import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import styles from "@/styles/member/auction/internetTender/BidModal.module.css";
import { useLocale } from "@/hooks/useLocale";
interface ConfirmDialogProps {
  title: string; // ダイアログのタイトル
  description: string; // ダイアログの内容
  buttonTitle: string; // ボタンタイトル
  className: string; // クラス
  onSubmit: () => void; // 実行する関数（API呼び出し）
  buttonText?: string; // ボタンのテキスト（省略可能）
}

export default function ConfirmDialogProps({
  title,
  description,
  buttonTitle,
  className,
  onSubmit,
  buttonText,
}: ConfirmDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { texts } = useLocale();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    onSubmit(); // ページごとのAPI呼び出しを実行
    handleClose(); // ダイアログを閉じる
  };

  return (
    <React.Fragment>
      <button onClick={handleClickOpen} className={className}>
        {buttonText}
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            width: "600px", // ダイアログの幅
            height: "280px", // ダイアログの高さ
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className="text-red-600 text-xl h-20">
            <div className={styles.bidModalConfirmLabel}>
              <span className="text-black">{texts.goods.bidPrice}</span>
              <span className="text-3xl">¥{description}</span>
            </div>
            <span className={styles.bidModalConfirmNote}>
              入札後は取消できません。
              <br />
              この金額でよろしいでしょうか？
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className={styles.confirmButtonContainer}>
            <button onClick={handleClose} className={styles.bidCancelButton}>
              <span>{texts.button.cancel}</span>
            </button>
            <button onClick={handleSubmit} className={className}>
              <span> {buttonTitle}</span>
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
