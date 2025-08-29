import { useState, useCallback } from "react";

interface ModalState {
  isBidHistoryModalOpen: boolean;
  isFavoriteModalOpen: boolean;
  selectedBidHistoryGoodsId: number;
  selectedBidHistoryAuctionSeq: number;
  selectedFavoriteGoodsId: number;
}

interface ModalHandlers {
  openBidHistoryModal: (goodsId: number, auctionSeq: number) => void;
  closeBidHistoryModal: () => void;
  openFavoriteModal: (goodsId: number) => void;
  closeFavoriteModal: () => void;
}

export const useModalManagement = (): ModalState & ModalHandlers => {
  const [isBidHistoryModalOpen, setIsBidHistoryModalOpen] = useState(false);
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);
  const [selectedBidHistoryGoodsId, setSelectedBidHistoryGoodsId] = useState<number>(0);
  const [selectedBidHistoryAuctionSeq, setSelectedBidHistoryAuctionSeq] = useState<number>(0);
  const [selectedFavoriteGoodsId, setSelectedFavoriteGoodsId] = useState<number>(0);

  const openBidHistoryModal = useCallback((goodsId: number, auctionSeq: number) => {
    setSelectedBidHistoryGoodsId(goodsId);
    setSelectedBidHistoryAuctionSeq(auctionSeq);
    setIsBidHistoryModalOpen(true);
  }, []);

  const closeBidHistoryModal = useCallback(() => {
    setIsBidHistoryModalOpen(false);
  }, []);

  const openFavoriteModal = useCallback((goodsId: number) => {
    setSelectedFavoriteGoodsId(goodsId);
    setIsFavoriteModalOpen(true);
  }, []);

  const closeFavoriteModal = useCallback(() => {
    setIsFavoriteModalOpen(false);
  }, []);

  return {
    isBidHistoryModalOpen,
    isFavoriteModalOpen,
    selectedBidHistoryGoodsId,
    selectedBidHistoryAuctionSeq,
    selectedFavoriteGoodsId,
    openBidHistoryModal,
    closeBidHistoryModal,
    openFavoriteModal,
    closeFavoriteModal,
  };
};
