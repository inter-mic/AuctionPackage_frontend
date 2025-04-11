import { useRef, useState, useEffect, useCallback } from 'react';
import Modal from '@mui/material/Modal';
//カスタムフック
import ConfirmDialog from '@/components/ui/dialog/bidConfirmDialog';
//API
import { useAuctionBidAPI} from '@/hooks/api/member/goods/useAuctionBidAPI';
import { useTenderBidAPI } from '@/hooks/api/member/goods/useTenderBidAPI';
//アイコン
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
//スタイル
import styles from '@/styles/member/auction/internetTender/BidModal.module.css';
import { texts } from '@/config/texts';

interface Props {
  isOpen: boolean;
  toggleFilter: () => void;
  lot: string;
  goodsName: string;
  bidSpnkbn: string;
  bidGoodsId: number;
  bidPrice: string;
  bidUnit: string;
}

const BidModalComponent: React.FC<Props> = ({
  isOpen,
  toggleFilter,
  lot,
  goodsName,
  bidSpnkbn,
  bidGoodsId,
  bidPrice,
  bidUnit
}) => {

  const parseCurrency = (value: string): number =>
    parseInt(value.replace(/,/g, ''), 10);

  const initialPrice = parseCurrency(bidPrice);
  const unitPrice = parseCurrency(bidUnit);

  const [currentBid, setCurrentBid] = useState<number>(initialPrice);
  const unitValue = parseFloat(bidUnit.replace(/,/g, '')) || 0;
  // +ボタンで価格を増やす処理
  const handleIncrease = useCallback(() => {
    setCurrentBid((prev) => prev + unitPrice);
  }, [unitPrice]);

  // -ボタンで価格を減らす処理 (ただし初期価格未満には下げない)
  const handleDecrease = useCallback(() => {
    setCurrentBid((prev) => Math.max(initialPrice, prev - unitPrice));
  }, [initialPrice, unitPrice]);

  useEffect(() => {
    if (!isOpen) { // isOpen=falseのときのみ更新
      setCurrentBid(initialPrice);
    }
  }, [bidPrice, initialPrice, isOpen]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const formatNumberWithCommas = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // カンマを追加
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, ""); 
    if (!isNaN(Number(rawValue))) {
      const formattedValue = formatNumberWithCommas(rawValue);

      // カーソル位置の調整
    const cursorPosition = e.target.selectionStart || 0;
    const commaCountBefore = (e.target.value.slice(0, cursorPosition).match(/,/g) || []).length;
    setCurrentBid(Number(rawValue));

    setTimeout(() => {
      if (inputRef.current) {
        const newCommaCount = (formattedValue.slice(0, cursorPosition).match(/,/g) || []).length;
        const positionOffset = newCommaCount - commaCountBefore;
        inputRef.current.setSelectionRange(cursorPosition + positionOffset, cursorPosition + positionOffset);
      }
    }, 0);
    }
  };


  const {  auctionBidResponseStatus, auctionBidErrors, auctionBidAPI } = useAuctionBidAPI();
  const {  tenderBidResponseStatus, tenderBidErrors, tenderBidAPI } = useTenderBidAPI();  
  const handleSubmit = () => {
   if(bidSpnkbn == "3"){
      auctionBidAPI(bidGoodsId, currentBid);
    }else  if(bidSpnkbn == "4"){
      tenderBidAPI(bidGoodsId, currentBid);
    }
    
  };
  const handleToggleFilter = () => {
    setFormErrors({}); // フォームエラーをクリア
    toggleFilter(); // 既存のフィルターの切り替え処理
  };
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (auctionBidErrors) { setFormErrors(auctionBidErrors); }
    if (tenderBidErrors) { setFormErrors(tenderBidErrors); }
  }, [ auctionBidErrors, tenderBidErrors]);
  useEffect(() => {
      if (auctionBidResponseStatus === 200) {handleToggleFilter();}
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionBidResponseStatus]);
  
  useEffect(() => {
    if (auctionBidResponseStatus) {if(tenderBidResponseStatus == 200){handleToggleFilter();}}
    if (tenderBidResponseStatus) {if(tenderBidResponseStatus == 200){handleToggleFilter();}}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionBidResponseStatus, tenderBidResponseStatus]);

  return (
    <Modal open={isOpen} onClose={handleToggleFilter}>
    <div className={styles.modalContent}>
      <button onClick={handleToggleFilter} className={styles.closeButton}>
        <CloseIcon />
      </button>
      <div className={styles.goodsInfo}>
        <span >Lot {lot} {goodsName}</span>
      </div>

      <div className={styles.bidLabel}>{texts.goods.bidPrice}</div>
        <div className={styles.priceSection}>
          
        <div className={styles.inputContainer}>
            <CurrencyYenIcon  sx={{
        color: "red",
        fontSize: "2.5rem",
        paddingBottom: "10px",
      }}/>
            <input
              ref={inputRef}
              type="text"
              value={formatNumberWithCommas(currentBid.toString())} 
              onChange={handleInputChange}
              className={styles.bidPriceInput}
            />
          </div>

          <div className={styles.adjustButtonsContainer}>
          <button
            onClick={handleDecrease}
            className="bg-gray-300 text-white 
            hover:bg-opacity-50 py-2  ml-1 lg:w-44 w-32 rounded-full"
          >
            <RemoveIcon className="lg:mr-4"/><CurrencyYenIcon/>{unitValue.toLocaleString()}
          </button>
          <button
            onClick={handleIncrease}
            className="bg-gray-300 text-white  
            hover:bg-opacity-50 py-2  ml-1 lg:w-44 w-32 rounded-full"
          >
            <AddIcon className="lg:mr-4"/><CurrencyYenIcon/>{unitValue.toLocaleString()}
          </button>
        </div>
        
        </div>
        {formErrors?.bidPrice && <p className="error-message">{formErrors.bidPrice}</p>}
      

      <div className={styles.confirmButtonContainer}>
      <button  onClick={handleToggleFilter} className={styles.bidCancelButton}>
            <span >{ texts.button.cancel }</span>
         </button>
        <ConfirmDialog
          title={texts.button.bidConfirm}
          description={`${currentBid.toLocaleString()}`}
          buttonTitle={texts.button.bidConfirmed}
          className={styles.bidModalButton}
          onSubmit={handleSubmit}
          buttonText={texts.button.bidConfirm}
        />
      </div>
    </div>
  </Modal>
  );
};

export default BidModalComponent;