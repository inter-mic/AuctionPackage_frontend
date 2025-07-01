import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useLocale } from "@/hooks/useLocale";

interface ConfirmDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  disabled: boolean; // 無効化
  description: string; // ダイアログの内容
  buttonTitle: string; // ボタンタイトル
  className: string; // クラス
  dialogCancelClassName: string; // クラス
  dialogClassName: string; // クラス
  onSubmit: () => void; // 実行する関数（API呼び出し）
  buttonText?: string; // ボタンのテキスト（省略可能）
  onKeyDown?: (e: React.KeyboardEvent) => void; // ショートカットハンドラ（省略可能）
}

export default function ConfirmDialogProps({
  open,
  setOpen,
  disabled,
  description,
  buttonTitle,
  className,
  dialogCancelClassName,
  dialogClassName,
  onSubmit,
  buttonText,
  onKeyDown,
}: ConfirmDialogProps) {
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
  const { texts } = useLocale();
  return (
    <React.Fragment>
      <button onClick={handleClickOpen} className={className} disabled={disabled}>
        {buttonText}
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onKeyDown={onKeyDown}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{ whiteSpace: "pre-line" }}>
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="justify-between">
          <button onClick={handleClose} className={dialogCancelClassName}>
            <span>{texts.button.cancel}</span>
          </button>
          <button onClick={handleSubmit} className={dialogClassName}>
            <span> {buttonTitle}</span>
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
