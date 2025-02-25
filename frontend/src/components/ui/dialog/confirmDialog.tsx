import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import styles from '@/styles/Button.module.css';
import { texts } from '@/config/texts';

interface ConfirmDialogProps {
  title: string;                         // ダイアログのタイトル
  description: string;                   // ダイアログの内容
  buttonTitle: string;                   // ボタンタイトル
  className: string;                     // クラス
  dialogCancelClassName: string;               // クラス
  dialogClassName: string;               // クラス
  onSubmit: () => void;                  // 実行する関数（API呼び出し）
  buttonText?: string;                   // ボタンのテキスト（省略可能）
}

export default function ConfirmDialogProps({
  title,
  description,
  buttonTitle,
  className,
  dialogCancelClassName,
  dialogClassName,
  onSubmit,
  buttonText = 'Delete',
}: ConfirmDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    onSubmit();  // ページごとのAPI呼び出しを実行
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
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="justify-between">
        <button  onClick={handleClose} className={dialogCancelClassName}>
            <span >{ texts.button.cancel }</span>
         </button>
         <button  onClick={handleSubmit}  className={dialogClassName}>
            <span > {buttonTitle}</span>
         </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}