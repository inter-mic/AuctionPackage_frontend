import React, { useRef, useState, useEffect, useCallback } from "react";
import Modal from "@mui/material/Modal";
import { useLocale } from "@/hooks/useLocale";
//API
import { useLiveJizenBidRegistAPI } from "@/hooks/api/member/goods/useLiveJizenBidRegistAPI";
//型定義
import { TMtLiveBidUnit } from "@/types/common/bidUnit";
//アイコン
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import CurrencyYenIcon from "@mui/icons-material/CurrencyYen";
//スタイル
import styles from "@/styles/member/auction/internetTender/BidModal.module.css";

interface Props {
  isOpen: boolean;
  toggleFilter: () => void;
  lot: string;
  goodsName: string;
  bidGoodsId: number;
  bidPrice: string;
  startPrice: string;
  liveBidUnitList?: TMtLiveBidUnit[];
}

const LiveJizenBidModalComponent: React.FC<Props> = ({
  isOpen,
  toggleFilter,
  lot,
  goodsName,
  bidGoodsId,
  bidPrice,
  startPrice,
  liveBidUnitList = [],
}) => {
  const parseCurrency = (value: string | number | undefined): number => {
    if (value === undefined || value === null) return 0;
    const stringValue = typeof value === 'string' ? value : String(value);
    return parseInt(stringValue.replace(/,/g, ""), 10) || 0;
  };
  const { texts } = useLocale();
  const initialPrice = parseCurrency(startPrice);

  const [currentBid, setCurrentBid] = useState<number>(parseCurrency(bidPrice));

  // 重複するbitUnitを除外したリストを作成
  const uniqueBidUnitList = React.useMemo(() => {
    const seen = new Set<number>();
    return liveBidUnitList.filter(unit => {
      const bitUnit = parseCurrency(unit.bitUnit);
      if (seen.has(bitUnit)) {
        return false;
      }
      seen.add(bitUnit);
      return true;
    });
  }, [liveBidUnitList]);

  // 各入札単位のボタンが有効かどうかを判定
  const isUnitButtonEnabled = useCallback((unitValue: number, isIncrease: boolean): boolean => {
    const newPrice = isIncrease ? currentBid + unitValue : currentBid - unitValue;
    
    // 減少の場合は初期価格未満にならないかチェック
    if (!isIncrease && newPrice < initialPrice) {
      return false;
    }

    if (liveBidUnitList.length === 0) {
      return true;
    }
   
    // 現在の価格と新しい価格がその単位の範囲内にあるかチェック
    for (const unit of liveBidUnitList) {
      const unitFrom = parseCurrency(unit.unitFrom);
      const unitTo = parseCurrency(unit.unitTo);
      const bidUnit = parseCurrency(unit.bitUnit);
      
      // この単位が使用可能かどうかを判定
      if (bidUnit === unitValue) {
        const isCurrentPriceInRange = currentBid >= unitFrom && currentBid <= unitTo;
        const isNewPriceInRange = newPrice >= unitFrom && newPrice <= unitTo;
        
        // +ボタンの場合：現在の価格がその範囲内にあればOK
        // -ボタンの場合：現在の価格と新しい価格の両方がその範囲内にあればOK
        if (isIncrease) {
          if (isCurrentPriceInRange) {
            return true;
          }
        } else {
          if (isNewPriceInRange) {
            return true;
          }
        }
      }
    }
    
    return false;
  }, [currentBid, initialPrice, liveBidUnitList]);

  // +ボタンで価格を増やす処理
  const handleIncrease = useCallback((unitValue: number) => {
    setCurrentBid((prev) => prev + unitValue);
  }, []);

  // -ボタンで価格を減らす処理
  const handleDecrease = useCallback((unitValue: number) => {
    setCurrentBid((prev) => Math.max(initialPrice, prev - unitValue));
  }, [initialPrice]);

  useEffect(() => {
    if (!isOpen) {
      // isOpen=falseのときのみ更新
      setCurrentBid(parseCurrency(bidPrice));
    }
  }, [bidPrice, isOpen]);

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
          inputRef.current.setSelectionRange(
            cursorPosition + positionOffset,
            cursorPosition + positionOffset
          );
        }
      }, 0);
    }
  };
  const { liveJizenBidResponseStatus, liveJizenBidErrors, liveJizenBidRegistAPI } =
    useLiveJizenBidRegistAPI();
  const handleSubmit = () => {
    liveJizenBidRegistAPI(bidGoodsId, currentBid);
  };
  const handleToggleFilter = () => {
    setFormErrors({}); // フォームエラーをクリア
    toggleFilter(); // 既存のフィルターの切り替え処理
  };
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (liveJizenBidErrors) {
      setFormErrors(liveJizenBidErrors);
    }
  }, [liveJizenBidErrors]);
  useEffect(() => {
    if (liveJizenBidResponseStatus === 200) {
      handleToggleFilter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveJizenBidResponseStatus]);

  useEffect(() => {
    if (liveJizenBidResponseStatus) {
      if (liveJizenBidResponseStatus == 200) {
        handleToggleFilter();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveJizenBidResponseStatus]);

  return (
    <Modal open={isOpen} onClose={handleToggleFilter}>
      <div className={styles.modalContent}>
        <button onClick={handleToggleFilter} className={styles.closeButton}>
          <CloseIcon />
        </button>
        <div className={styles.goodsInfo}>
          <span>
            Lot {lot} {goodsName}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* 左側（PCでは左、SPでは上）：入札金額入力 */}
          <div className="w-full md:w-1/2">
            <div className={styles.bidLabel}>{texts.goods.bidPrice}</div>
            <div className="flex items-center">
              <CurrencyYenIcon
                sx={{
                  color: "red",
                  fontSize: "2.5rem",
                  marginRight: "8px",
                }}
              />
              <input
                ref={inputRef}
                type="text"
                value={formatNumberWithCommas(currentBid.toString())}
                onChange={handleInputChange}
                className={styles.bidPriceInput}
              />
            </div>
          </div>

          {/* 右側（PCでは右、SPでは下）：＋－ボタン */}
          <div className="w-full md:w-1/2">
            <div className={styles.bidLabel}>&nbsp;</div>
            <div className="flex flex-col gap-2">
              {uniqueBidUnitList.map((unit) => {
                const unitValue = parseCurrency(unit.bitUnit);
                const isDecreaseEnabled = isUnitButtonEnabled(unitValue, false);
                const isIncreaseEnabled = isUnitButtonEnabled(unitValue, true);
                
                return (
                  <div key={unit.seq} className="flex gap-2">
                    <button
                      onClick={() => handleDecrease(unitValue)}
                      disabled={!isDecreaseEnabled}
                      className={`py-2 w-1/2 rounded-full ${
                        isDecreaseEnabled
                          ? "bg-yellow-200 text-gray-800 border border-yellow-400 hover:bg-opacity-90"
                          : "bg-gray-200 text-gray-400 border-2 border-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <RemoveIcon className="mr-2" />
                      <CurrencyYenIcon />
                      {unitValue.toLocaleString()}
                    </button>
                    <button
                      onClick={() => handleIncrease(unitValue)}
                      disabled={!isIncreaseEnabled}
                      className={`py-2 w-1/2 rounded-full ${
                        isIncreaseEnabled
                          ? "bg-yellow-200 text-gray-800 border border-yellow-400 hover:bg-opacity-90"
                          : "bg-gray-200 text-gray-400 border-2 border-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <AddIcon className="mr-2" />
                      <CurrencyYenIcon />
                      {unitValue.toLocaleString()}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {formErrors?.bidPrice && <p className="error-message">{formErrors.bidPrice}</p>}

        <div className={styles.confirmButtonContainer}>
          <button onClick={handleToggleFilter} className={styles.bidCancelButton}>
            <span>{texts.button.cancel}</span>
          </button>
          <button onClick={handleSubmit} className={styles.bidModalButton}>
            {texts.button.jizenBidToggle}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LiveJizenBidModalComponent;
