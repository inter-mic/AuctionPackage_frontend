import React from "react";
import { useRef } from "react";
import { GetServerSideProps } from "next";
import { useSearchParams } from "next/navigation";
import { texts } from "@/config/texts.ja";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminLayout from "@/hocs/withAdminLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useKengenRedirect } from "@/hooks/useKengenRedirect";
import { useExecutionPermission } from "@/hooks/useExecutionPermission";
import { useLocale } from "@/hooks/useLocale";
//API
import { useGoodsSearchByGoodsIdAPI } from "@/hooks/api/admin/goods/useGoodsSearchByGoodsIdAPI";
import { useGoodsSearchImageAPI } from "@/hooks/api/admin/goods/useGoodsSearchImageAPI";
import { useGoodsRegistAPI } from "@/hooks/api/admin/goods/useGoodsRegistAPI";
import { useGoodsDeleteAPI } from "@/hooks/api/admin/goods/useGoodsDeleteAPI";
import { useGoodsKekkaUpdateAPI } from "@/hooks/api/admin/goods/useGoodsKekkaUpdateAPI";
import { useGoodsKekkaDeleteAPI } from "@/hooks/api/admin/goods/useGoodsKekkaDeleteAPI";
import { useGoodsAddinfoItemAPI } from "@/hooks/api/public/useGoodsAddinfoItemAPI";
import { useUserGetInfoAPI } from "@/hooks/api/admin/user/useUserGetInfoAPI";
import { useAuctionGetInfoAPI } from "@/hooks/api/admin/auction/useAuctionGetInfoAPI";
import { useGoodsSearchBeforeAfterLotAPI } from "@/hooks/api/common/useGoodsSearchBeforeAfterLotAPI";
//型定義
import {
  TGoodsData,
  initialGoodsData,
  TGoodsKekkaData,
  initialGoodsKekkaData,
  TGoodsImageData,
} from "@/types/admin/goods/register";
import { PageProps } from "@/types/admin/adminPage";
import { Errors } from "@/types/errors";
//コンポーネント
import { KaisaiListPullDown } from "@/components/ui/pulldowns/KaisaiListPullDown";
import { CategoryListPullDown } from "@/components/ui/pulldowns/CategoryPullDown";
import { ImageThumbnailList } from "@/components/ui/images/ImageThumbnail";
import { RequiredMark } from "@/components/ui/marks/RequiredMark";
import { GoodsListMark } from "@/components/ui/marks/GoodsListMark";
import ConfirmDialog from "@/components/ui/dialog/confirmDialog";
//ボタン
import { SearchButton } from "@/components/ui/buttons/admin/searchButton";
import { RegistButton } from "@/components/ui/buttons/admin/registButton";
import { ClearButton } from "@/components/ui/buttons/admin/clearButton";
import { FurakusatsuButton } from "@/components/ui/buttons/admin/furakusatsuButton";
import { LotNavigationButton } from "@/components/ui/buttons/admin/lotNavigationButton";
import { MemberRegisterButton } from "@/components/ui/buttons/admin/memberRegisterButton";
import { BidHistoryButton } from "@/components/ui/buttons/admin/bidHistoryButton";
import { BidHistoryModal } from "@/components/ui/dialog/bidHistoryModal";
import { FavoriteButton } from "@/components/ui/buttons/admin/favoriteButton";
import { FavoriteModal } from "@/components/ui/dialog/favoriteModal";
//スタイル
import breadcrumbStyles from "@/styles/breadcrumb.module.css";
import styles from "@/styles/admin/GoodsRegister.module.css";

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminGoodsRegist,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect } = useCommonSetup();
  useKengenRedirect(kengen, 201);
  const { executionPermission } = useExecutionPermission(kengen);
  const [spnKbn, setSpnkbn] = useState<string>("");
  const [goodsData, setGoodsData] = useState<TGoodsData>(initialGoodsData);
  const [kekkaData, setkekkaData] = useState<TGoodsKekkaData>(initialGoodsKekkaData);
  const [images, setImages] = useState<
    {
      no: string;
      isNewFlg: boolean;
      thumbnailImageUrl: string;
      originalImageUrl: string;
      squareImageUrl: string;
    }[]
  >([]);

  const [searchSelectedKaisai, setSearchSelectedKaisai] = useState<string | null>(null);
  const [searchLot, setSearchLot] = useState<string>("");
  const handleSearchKaisaiChange = (name: string, value: string) => {
    setSearchSelectedKaisai(value);
  };

  const handleSearchLotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchLot(e.target.value);
  };
  const { data, auctionGetInfo } = useAuctionGetInfoAPI();
  const [selectedKaisai, setSelectedKaisai] = useState<string>("");
  const handleKaisaiChange = (name: string, value: string) => {
    setSelectedKaisai(value);
    setGoodsData((prevGoodsData) => ({ ...prevGoodsData, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prevFormErrors) => ({
        ...prevFormErrors,
        [name]: "",
      }));
    }

    auctionGetInfo(Number(value));
  };
  useEffect(() => {
    if (data && data.spnKbn !== null && data.spnKbn !== undefined) {
      setSpnkbn(data.spnKbn);
      setGoodsData((prev) => ({
        ...prev,
        spnKbn: data.spnKbn,
      }));
    }
  }, [data]);
  //検索
  const { fetchGoodsData, fetchGoodsKekkaData, goodsSearchErrors, goodsSearchByGoodsIdAPI } =
    useGoodsSearchByGoodsIdAPI();
  const { beforeAfterGoodsId, goodsSearchBeforeAfterLotAPI } = useGoodsSearchBeforeAfterLotAPI();
  const { fetchImages, goodsSearchImage } = useGoodsSearchImageAPI();
  const { goodsAddInfo } = useGoodsAddinfoItemAPI();
  const [inputSeatchErrors, setInputSeatchErrors] = useState<Errors>();
  const formSearch = async () => {
    setFormErrors({});
    setGoodsData(initialGoodsData);
    setkekkaData(initialGoodsKekkaData);
    setImages([]);
    setSelectedKaisai("");
    setSelectedCategory("");
    setShimeFlg(false);
    setBitFlg(false);
    if (searchSelectedKaisai != null) {
      goodsSearchByGoodsIdAPI(false, 0, searchSelectedKaisai, searchLot);
    }
  };
  useEffect(() => {
    if (goodsSearchErrors) {
      setInputSeatchErrors(goodsSearchErrors);
    }
  }, [goodsSearchErrors]);
  const handleInputSearchFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;

    if (inputSeatchErrors != undefined && inputSeatchErrors[name]) {
      setInputSeatchErrors((preInputSeatchErrors) => ({
        ...preInputSeatchErrors,
        [name]: "",
      }));
    }
  };
  const params = useSearchParams();
  const paramsGoodsId = params ? params.get("goodsId") : null;
  useEffect(() => {
    if (paramsGoodsId) {
      goodsSearchByGoodsIdAPI(true, Number(paramsGoodsId), "", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsGoodsId]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const handleCategoryChange = (name: string, value: string) => {
    setSelectedCategory(value);
    setGoodsData((prevGoodsData) => ({ ...prevGoodsData, [name]: value }));
  };

  const [shimeFlg, setShimeFlg] = useState(false);
  const [bitFlg, setBitFlg] = useState(false);
  const [isBidHistoryModalOpen, setIsBidHistoryModalOpen] = useState(false);
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);
  //データセット
  useEffect(() => {
    if (fetchGoodsData) {
      setGoodsData(fetchGoodsData);
      setSearchSelectedKaisai(
        fetchGoodsData.auctionSeq !== null ? String(fetchGoodsData.auctionSeq) : null
      );
      setSearchLot(fetchGoodsData.lot !== null ? String(fetchGoodsData.lot) : "");
      if (fetchGoodsData.shimeTime != null) {
        setShimeFlg(true);
      } else {
        setShimeFlg(false);
      }
      if (fetchGoodsData.bidCount != "0" && fetchGoodsData.bidCount != "") {
        setBitFlg(true);
      } else {
        setBitFlg(false);
      }
      setSpnkbn(fetchGoodsData.spnKbn || "");
    }
    if (fetchGoodsKekkaData) {
      setkekkaData(fetchGoodsKekkaData);
    }
    if (fetchGoodsData.auctionSeq) {
      setSelectedKaisai(fetchGoodsData.auctionSeq.toString());
    }
    if (fetchGoodsData.categorySeq) {
      setSelectedCategory(fetchGoodsData.categorySeq.toString());
    }
  }, [fetchGoodsData, fetchGoodsKekkaData]);
  useEffect(() => {
    const auctionSeq = fetchGoodsData?.auctionSeq ?? 0;
    const lot = fetchGoodsData?.lot ?? "";
    if (auctionSeq != 0 && lot != "") {
      goodsSearchBeforeAfterLotAPI(auctionSeq, lot, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchGoodsData?.auctionSeq, fetchGoodsData?.lot]);
  useEffect(() => {
    if (fetchGoodsData.goodsId != null) {
      goodsSearchImage(Number(fetchGoodsData.goodsId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchGoodsData]);
  useEffect(() => {
    if (fetchImages) {
      const formattedImages = fetchImages.map((image: TGoodsImageData) => ({
        no: String(image.goodsImagesNo),
        isNewFlg: false,
        thumbnailImageUrl: image.thumbnailImageUrl || "",
        originalImageUrl: image.originalImageUrl || "",
        squareImageUrl: image.squareImageUrl || "",
      }));
      setImages(formattedImages);
    }
  }, [fetchImages]);

  const handleImagesUpdate = (
    updatedImages: {
      no: string;
      isNewFlg: boolean;
      thumbnailImageUrl: string;
      originalImageUrl: string;
      squareImageUrl: string;
    }[]
  ) => {
    setImages(updatedImages);
  };

  const {
    userName: shuppinUserName,
    companyName: shuppinCompanyName,
    userGetInfo: shuppinUserGetInfo,
  } = useUserGetInfoAPI();
  const {
    userName: rakusatsuUserName,
    companyName: rakusatsuCompanyName,
    userGetInfo: rakusatsuUserGetInfo,
  } = useUserGetInfoAPI();
  const handleGoodsDataChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    checked?: boolean
  ) => {
    const { name, value, type } = e.target;

    // 数値とカンマのみ許可する正規表現
    const numericWithCommaRegex = /^[0-9,]*$/;
    if (name === "startPrice" || name === "bidUnit" || name === "saiteiRakusatsuPrice") {
      if (!numericWithCommaRegex.test(value)) {
        return; // 無効な入力は無視
      }
    }

    if (type === "checkbox") {
      setGoodsData((prevGoodsData) => ({ ...prevGoodsData, [name]: checked }));
    } else {
      setGoodsData((prevGoodsData) => ({ ...prevGoodsData, [name]: value }));
    }
    if (name === "shuppinUserId") {
      setGoodsData((prevData) => ({
        ...prevData,
        shuppinUserName: "",
        shuppinCompanyName: "",
      }));
      if (value) {
        shuppinUserGetInfo(value);
      }
    }
    if (goodsRegistErrors?.[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };
  useEffect(() => {
    if (shuppinUserName) {
      setGoodsData((prevData) => ({
        ...prevData,
        shuppinUserName: shuppinUserName,
      }));
    }
    if (shuppinCompanyName) {
      setGoodsData((prevData) => ({
        ...prevData,
        shuppinCompanyName: shuppinCompanyName,
      }));
    }
  }, [shuppinUserName, shuppinCompanyName]);

  const handleKekkaDataChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    // 数値とカンマのみ許可する正規表現
    const numericWithCommaRegex = /^[0-9,]*$/;
    if (name === "rakusatsuPrice" || name === "rakusatsuTesuryoPrice") {
      if (!numericWithCommaRegex.test(value)) {
        return; // 無効な入力は無視
      }
    }
    setkekkaData((prevGoodsData) => ({ ...prevGoodsData, [name]: value }));
    if (name === "rakusatsuUserId") {
      setGoodsData((prevData) => ({
        ...prevData,
        rakusatsuUserName: "",
        rakusatsuCompanyName: "",
      }));
      if (value) {
        rakusatsuUserGetInfo(value);
      }
    }

    if (goodsKekkaRegistErrors != null && goodsKekkaRegistErrors[name]) {
      setFormKekkaErrors((prevFormErrors) => ({
        ...prevFormErrors,
        [name]: "",
      }));
    }
  };

  useEffect(() => {
    if (rakusatsuUserName) {
      setkekkaData((prevData) => ({
        ...prevData,
        rakusatsuUserName: rakusatsuUserName,
      }));
    }
    if (rakusatsuCompanyName) {
      setkekkaData((prevData) => ({
        ...prevData,
        rakusatsuCompanyName: rakusatsuCompanyName,
      }));
    }
  }, [rakusatsuUserName, rakusatsuCompanyName]);

  const formClear = () => {
    setGoodsData(initialGoodsData);
    setkekkaData(initialGoodsKekkaData);
    setImages([]);
    setSearchSelectedKaisai(null);
    setSelectedKaisai("");
    setSelectedCategory("");
    setSearchLot("");
    setBitFlg(false);
    setShimeFlg(false);
  };

  const lotInputRef = useRef<HTMLInputElement>(null);
  //商品情報登録
  const { responseGoodsData, responseGoodsKekkaData, goodsRegistErrors, goodsRegistAPI } =
    useGoodsRegistAPI();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const GoodsDataRegist = () => {
    goodsRegistAPI(goodsData, images);
  };
  useEffect(() => {
    if (responseGoodsData) {
      setGoodsData(responseGoodsData);
      setSearchSelectedKaisai(
        responseGoodsData.auctionSeq !== null ? String(responseGoodsData.auctionSeq) : null
      );
      setSearchLot(responseGoodsData.lot !== null ? String(responseGoodsData.lot) : "");
      if (responseGoodsData.shimeTime != null) {
        setShimeFlg(true);
      }
      if (responseGoodsData.bidCount != "0" && responseGoodsData.bidCount != "") {
        setBitFlg(true);
      }
    }
    if (responseGoodsKekkaData) {
      setkekkaData(responseGoodsKekkaData);
    }
    if (responseGoodsData.auctionSeq) {
      setSelectedKaisai(responseGoodsData.auctionSeq.toString());
    }
    if (responseGoodsData.categorySeq) {
      setSelectedCategory(responseGoodsData.categorySeq.toString());
    }
    if (lotInputRef.current) {
      lotInputRef.current.focus();
    }
  }, [responseGoodsData, responseGoodsKekkaData]);
  useEffect(() => {
    if (responseGoodsData.goodsId != null) {
      goodsSearchImage(Number(responseGoodsData.goodsId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseGoodsData]);
  useEffect(() => {
    if (goodsRegistErrors) {
      setFormErrors(goodsRegistErrors);
    }
  }, [goodsRegistErrors]);

  //落札結果登録
  const { goodsKekkaRegistErrors, goodsKekkaUpdateAPI } = useGoodsKekkaUpdateAPI();
  const [formKekkaErrors, setFormKekkaErrors] = useState<{ [key: string]: string }>({});
  const GoodsKekkaRegist = () => {
    goodsKekkaUpdateAPI(kekkaData);
  };
  useEffect(() => {
    if (goodsKekkaRegistErrors) {
      setFormKekkaErrors(goodsKekkaRegistErrors);
    }
  }, [goodsKekkaRegistErrors]);

  //削除処理
  const { goodsDeleteAPI } = useGoodsDeleteAPI();
  const handleDeleteSubmit = () => {
    if (goodsData.goodsId != null) {
      goodsDeleteAPI(goodsData.goodsId);
    }
  };
  //不落札に戻す
  const { goodsKekkaDeleteAPI } = useGoodsKekkaDeleteAPI();
  const GoodsKekkaDelete = () => {
    if (goodsData.goodsId != null) {
      goodsKekkaDeleteAPI(goodsData.goodsId);
    }
  };

  const handleBidHistoryClick = () => {
    setIsBidHistoryModalOpen(true);
  };

  const handleBidHistoryModalClose = () => {
    setIsBidHistoryModalOpen(false);
  };

  const handleFavoriteClick = () => {
    setIsFavoriteModalOpen(true);
  };

  const handleFavoriteModalClose = () => {
    setIsFavoriteModalOpen(false);
  };
  const { texts } = useLocale();
  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminGoodsRegist}</span>
      </div>

      <div className="flex flex-col items-center justify-center my-3 bg-gray-100">
        <div className="w-full space-y-3 bg-white shadow-md md:max-w-full md:rounded">
          <div className="grid grid-cols-1  gap-6">
            <div className="p-4">
              <div
                className="flex flex-col lg:flex-row lg:space-y-0 items-end"
                onFocus={handleInputSearchFocus}
              >
                <div className="w-full lg:w-[320px] h-24">
                  <label htmlFor="auction" className={styles.label}>
                    {texts.goods.auctionName}
                  </label>

                  <KaisaiListPullDown
                    className="border p-2 rounded h-10 w-full"
                    onChange={(value) => handleSearchKaisaiChange("auctionSeq", value)}
                    selectedId={searchSelectedKaisai ?? ""}
                    kaisaiStatus={0}
                    defaultSetOption={paramsGoodsId !== null ? 0 : 1}
                  />
                  {inputSeatchErrors?.auctionSeq && (
                    <p className="error-message">{inputSeatchErrors.auctionSeq}</p>
                  )}
                </div>
                <div className="w-full md:w-[160px] h-24">
                  <label htmlFor="lot" className={styles.label}>
                    {texts.goods.lot}
                  </label>
                  <input
                    id="lot"
                    type="text"
                    name="lot"
                    value={searchLot}
                    onChange={handleSearchLotChange}
                    className={`border p-2 rounded h-10 w-full sm:w-40`}
                    ref={lotInputRef}
                  />
                  {inputSeatchErrors?.lot && (
                    <p className="error-message w-full sm:w-40">{inputSeatchErrors.lot}</p>
                  )}
                </div>
                <div className="w-full md:w-auto flex flex-row  items-center text-center sm:ml-4 lg:pb-6">
                  <div className="w-1/2 md:w-auto">
                    <SearchButton onClick={formSearch} />
                  </div>
                  <div className="w-1/2 md:w-auto ml-1 -mt-2 lg:-mt-0 ">
                    <ClearButton onClick={formClear} />
                  </div>
                </div>
                <div className="w-full md:w-auto flex flex-row  items-center text-center sm:ml-4 lg:pb-6">
                  <div className="w-1/2 md:w-auto">
                    {Number(beforeAfterGoodsId?.beforeGoodsId) > 0 ? (
                      <LotNavigationButton
                        type="before"
                        onClick={() => {
                          goodsSearchByGoodsIdAPI(
                            true,
                            Number(beforeAfterGoodsId?.beforeGoodsId),
                            "",
                            ""
                          );
                        }}
                      />
                    ) : (
                      <div className="h-10" />
                    )}
                  </div>
                  <div className="w-1/2 md:w-auto ml-1 md:ml-0">
                    {Number(beforeAfterGoodsId?.afterGoodsId) > 0 ? (
                      <LotNavigationButton
                        type="after"
                        onClick={() => {
                          goodsSearchByGoodsIdAPI(
                            true,
                            Number(beforeAfterGoodsId?.afterGoodsId),
                            "",
                            ""
                          );
                        }}
                      />
                    ) : (
                      <div className="h-10" />
                    )}
                  </div>
                </div>

                {/* <div className="w-full md:w-auto text-center lg:pb-6"></div>
                <div className="w-full md:w-auto text-center lg:pb-6"></div> */}
              </div>
            </div>
          </div>
        </div>
        {(shimeFlg || bitFlg) && (
          <div className="p-4">
            {shimeFlg && <span>{texts.goods.goods_note_1}</span>}
            {shimeFlg && bitFlg && <br />}
            {bitFlg && <span>{texts.goods.goods_note_2}</span>}
          </div>
        )}

        <div className="w-full space-y-6 bg-white shadow-md md:max-w-full md:rounded mt-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4">
              <ImageThumbnailList images={images} onImagesUpdate={handleImagesUpdate} />
              <span>{texts.goods.image_note_1}</span>
              <br />
              <span>{texts.goods.image_note_2}</span>
            </div>
            <div className="p-4">
              {formErrors?.haita && <p className="error-message">{formErrors.haita}</p>}
              <div className="w-full">
                <label htmlFor="auction" className={styles.label}>
                  <RequiredMark />
                  {texts.goods.auctionName}
                </label>
                <KaisaiListPullDown
                  className={`${styles.input}`}
                  onChange={(value) => handleKaisaiChange("auctionSeq", value)}
                  selectedId={selectedKaisai !== null ? String(selectedKaisai) : ""}
                  disabled={bitFlg}
                  kaisaiStatus={0}
                />
                {formErrors?.auctionSeq && <p className="error-message">{formErrors.auctionSeq}</p>}
                <div className={styles.flexContainer}>
                  <div className={styles.flexItem}>
                    <label htmlFor="sku" className={styles.label}>
                      {texts.goods.sku}
                    </label>
                    <input
                      id="sku"
                      name="sku"
                      onChange={handleGoodsDataChange}
                      value={goodsData.sku || ""}
                      className={`${styles.input} `}
                    />
                    {formErrors?.sku && <p className="error-message">{formErrors.sku}</p>}
                  </div>
                  <div className={styles.flexItem}>
                    <label htmlFor="lot" className={styles.label}>
                      <GoodsListMark />
                      {texts.goods.lot}
                    </label>
                    <input
                      id="lot"
                      name="lot"
                      onChange={handleGoodsDataChange}
                      value={goodsData.lot || ""}
                      className={`${styles.input} `}
                      disabled={bitFlg}
                    />
                    {formErrors?.lot && <p className="error-message">{formErrors.lot}</p>}
                  </div>
                </div>
                <label htmlFor="auctionName" className={styles.label}>
                  <GoodsListMark />
                  {texts.goods.goodsName}
                </label>
                <input
                  id="goodsName"
                  name="goodsName"
                  onChange={handleGoodsDataChange}
                  value={goodsData.goodsName || ""}
                  className={`${styles.input}`}
                />
                {formErrors?.goodsName && <p className="error-message">{formErrors.goodsName}</p>}
                <label htmlFor="categorySeq" className={styles.label}>
                  {texts.goods.category}
                </label>
                <CategoryListPullDown
                  className={styles.input}
                  onChange={(value) => handleCategoryChange("categorySeq", value)}
                  selectedId={selectedCategory !== null ? String(selectedCategory) : ""}
                />
                <label htmlFor="goodsSetsumei" className={styles.label}>
                  <GoodsListMark />
                  {texts.goods.goodsSetsumei}
                  <br />
                  <label className={styles.note}>{texts.goods.goodsSetsumei_note1}</label>
                </label>

                <textarea
                  id="goodsSetsumei"
                  name="goodsSetsumei"
                  onChange={handleGoodsDataChange}
                  value={goodsData.goodsSetsumei || ""}
                  className={styles.goodsSetsumei}
                />

                <label htmlFor="biko" className={styles.label}>
                  {texts.goods.biko}
                  <br />
                  <label className={styles.note}>{texts.goods.biko_note1}</label>
                </label>
                <textarea
                  id="biko"
                  name="biko"
                  onChange={handleGoodsDataChange}
                  value={goodsData.biko || ""}
                  className={styles.textarea}
                />

                <div className={styles.flexContainer}>
                  <div className={styles.flexItem}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="chumokuFlg"
                          onChange={handleGoodsDataChange}
                          checked={goodsData.chumokuFlg || false}
                        />
                      }
                      className={styles.label}
                      label={<span>{texts.goods.chumokuFlg}</span>}
                    />
                  </div>
                  <div className={styles.flexItem}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="keisaiFlg"
                          onChange={handleGoodsDataChange}
                          checked={goodsData.keisaiFlg || false}
                        />
                      }
                      className={styles.label}
                      label={<span>{texts.goods.hikeisaiFlg}</span>}
                    />
                  </div>
                </div>
                <div className={styles.flexContainer}>
                  <div className={styles.flexItem}>
                    <label htmlFor="startPrice" className={styles.label}>
                      <RequiredMark />
                      {texts.goods.startPrice}
                    </label>
                    <input
                      id="startPrice"
                      name="startPrice"
                      onChange={handleGoodsDataChange}
                      value={goodsData.startPrice || ""}
                      className={`${styles.input} text-right `}
                      disabled={bitFlg}
                    />
                    {formErrors?.startPrice && (
                      <p className="error-message">{formErrors.startPrice}</p>
                    )}
                  </div>
                  <div className={styles.flexItem}>
                    {spnKbn !== "1" && (
                      <>
                        <label htmlFor="bidUnit" className={styles.label}>
                          <RequiredMark />
                          {texts.goods.bidUnit}
                        </label>
                        <input
                          id="bidUnit"
                          name="bidUnit"
                          onChange={handleGoodsDataChange}
                          value={goodsData.bidUnit || ""}
                          className={`${styles.input} text-right `}
                          disabled={bitFlg}
                        />
                        {formErrors?.bidUnit && (
                          <p className="error-message">{formErrors.bidUnit}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className={styles.flexContainer}>
                  <div className={styles.flexItem}>
                    {spnKbn !== "1" && (
                      <>
                        <label htmlFor="saiteiRakusatsuPrice" className={styles.label}>
                          {texts.goods.saiteiRakusatsuPrice}
                          <br />
                          <label className={styles.note}>
                            ※{texts.goods.saiteiRakusatsuPrice_note_1}
                          </label>
                        </label>
                        <input
                          id="saiteiRakusatsuPrice"
                          name="saiteiRakusatsuPrice"
                          onChange={handleGoodsDataChange}
                          value={goodsData.saiteiRakusatsuPrice || ""}
                          className={`${styles.input} text-right `}
                          disabled={bitFlg}
                        />
                        {formErrors?.saiteiRakusatsuPrice && (
                          <p className="error-message">{formErrors.saiteiRakusatsuPrice}</p>
                        )}
                      </>
                    )}
                  </div>
                  <div className={styles.flexItem}>
                    <label htmlFor="shuppinUserId" className={styles.label}>
                      {texts.goods.shuppinUserId}
                      <br />
                      <label className={styles.note}>※{texts.goods.shuppinUserId_note_1}</label>
                    </label>

                    <div className="flex items-center space-x-2">
                      <input
                        id="shuppinUserId"
                        name="shuppinUserId"
                        onChange={handleGoodsDataChange}
                        value={goodsData.shuppinUserId || ""}
                        className={`${styles.input} flex-1`}
                        disabled={bitFlg}
                      />
                      {goodsData.shuppinUserId && (
                        <MemberRegisterButton userId={goodsData.shuppinUserId} />
                      )}
                    </div>
                    {formErrors?.shuppinUserId && (
                      <p className="error-message">{formErrors.shuppinUserId}</p>
                    )}
                  </div>
                </div>
                <div className={styles.flexContainer}>
                  <div className={styles.flexItem}>
                    <label className={styles.label}>{texts.goods.shuppinUserName}</label>
                    <input
                      id="shuppinUserName"
                      name="shuppinUserName"
                      value={goodsData.shuppinUserName || ""}
                      className={styles.input}
                      disabled
                    />
                  </div>
                  <div className={styles.flexItem}>
                    <label className={styles.label}>{texts.goods.shuppinCompanyName}</label>
                    <input
                      id="shuppinCompanyName"
                      name="shuppinCompanyName"
                      value={goodsData.shuppinCompanyName || ""}
                      className={styles.input}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <label htmlFor="adminBiko" className={styles.label}>
                {texts.goods.adminBiko}
              </label>
              <textarea
                id="adminBiko"
                name="adminBiko"
                onChange={handleGoodsDataChange}
                value={goodsData.adminBiko || ""}
                className={styles.textarea}
              />
              {goodsAddInfo.map(
                (data) =>
                  data.goodsAddinfo && (
                    <React.Fragment key={data.seq}>
                      <div>
                        <label htmlFor={`addInfo${data.seq}`} className={styles.label}>
                          {data.goodsAddinfo}
                        </label>
                        <textarea
                          id={`addInfo${data.seq}`}
                          name={`addInfo${data.seq}`}
                          value={(goodsData as any)[`addInfo${data.seq}`] || ""}
                          onChange={handleGoodsDataChange}
                          className={styles.textarea}
                        />
                      </div>
                    </React.Fragment>
                  )
              )}
              {executionPermission(201, 2) && !shimeFlg && (
                <div className="p-4 relative mt-5">
                  <div className="sm:absolute bottom-0 right-0">
                    <RegistButton label={texts.button.goodsInfoRegist} onClick={GoodsDataRegist} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {goodsData.goodsId !== null && (
          <div className="w-full space-y-6 bg-white shadow-md md:max-w-full md:rounded mt-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4">
                <div className={styles.flexContainer}>
                  <div className={styles.flexItem}>
                    <label className={styles.label}>{texts.auction.displayKikan}</label>
                    <input value={goodsData.displayTime || ""} className={styles.input} disabled />
                  </div>
                </div>
                {spnKbn !== "1" && (
                  <>
                    <div className={styles.flexContainer}>
                      <div className={styles.flexItem}>
                        <label className={styles.label}>{texts.auction.bidKikan}</label>
                        <input value={goodsData.bidTime || ""} className={styles.input} disabled />
                      </div>
                    </div>
                  </>
                )}
                {(spnKbn === "1" || spnKbn === "2") && (
                  <>
                    <div className={styles.flexContainer}>
                      <div className={styles.flexItem}>
                        <label className={styles.label}>{texts.goods.connectionCount}</label>
                        <input
                          value={goodsData.connectionCount || ""}
                          className={`${styles.input} text-right`}
                          disabled
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className={styles.flexContainer}>
                  <div className={styles.flexItem}>
                    <label className={styles.label}>{texts.goods.favoriteCount}</label>
                    <div className="flex items-center space-x-2">
                      <input
                        value={goodsData.favoriteCount || ""}
                        className={`${styles.input} text-right flex-1`}
                        disabled
                      />
                      {goodsData.goodsId && goodsData.favoriteCount != "0" && (
                        <FavoriteButton goodsId={goodsData.goodsId} onClick={handleFavoriteClick} />
                      )}
                    </div>
                  </div>
                  {(spnKbn === "3" || spnKbn === "4") && (
                    <>
                      <div className={styles.flexItem}>
                        <label className={styles.label}>{texts.goods.bidCount}</label>
                        <div className="flex items-center space-x-2">
                          <input
                            value={goodsData.bidCount || ""}
                            className={`${styles.input} text-right flex-1`}
                            disabled
                          />
                          {goodsData.goodsId && goodsData.bidCount != "0" && (
                            <BidHistoryButton
                              goodsId={goodsData.goodsId}
                              onClick={handleBidHistoryClick}
                            />
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {(spnKbn === "3" || spnKbn === "4") && (
                <div className="p-4">
                  <div className={styles.flexContainer}>
                    <div className={styles.flexItem}>
                      <label className={styles.label}>
                        <GoodsListMark /> {texts.goods.currentPrice}
                      </label>
                      <input
                        id="currentPrice"
                        name="currentPrice"
                        value={goodsData.currentPrice || ""}
                        className={`${styles.input} text-right`}
                        disabled
                      />
                    </div>
                    <div className={styles.flexItem}>
                      <label className={styles.label}>{texts.goods.currentUserId}</label>
                      <div className="flex items-center space-x-2">
                        <input
                          id="currentKenriUserId"
                          name="currentKenriUserId"
                          value={goodsData.currentKenriUserId || ""}
                          className={`${styles.input} flex-1`}
                          disabled
                        />
                        {goodsData.currentKenriUserId && (
                          <MemberRegisterButton userId={goodsData.currentKenriUserId} />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.flexContainer}>
                    <div className={styles.flexItem}>
                      <label className={styles.label}>{texts.goods.currentUserName}</label>
                      <input
                        id="currentKenriUserName"
                        name="currentKenriUserName"
                        onChange={handleGoodsDataChange}
                        value={goodsData.currentKenriUserName || ""}
                        className={styles.input}
                        disabled
                      />
                    </div>
                    <div className={styles.flexItem}>
                      <label className={styles.label}>{texts.goods.currentCompanyName}</label>
                      <input
                        id="currentKenriCompanyName"
                        name="currentKenriCompanyName"
                        value={goodsData.currentKenriCompanyName || ""}
                        className={styles.input}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              )}

              {kekkaData.kekkaRegisttime != "" && (
                <div className="p-4 border-l border-gray-400">
                  <div className={styles.flexContainer}>
                    <div className={styles.flexItem}>
                      <label className={styles.label}>{texts.goods.rakusatsuPrice}</label>
                      <input
                        id="rakusatsuPrice"
                        name="rakusatsuPrice"
                        onChange={handleKekkaDataChange}
                        value={kekkaData.rakusatsuPrice || ""}
                        className={`${styles.input} text-right`}
                      />
                      {formKekkaErrors?.rakusatsuPrice && (
                        <p className="error-message">{formKekkaErrors.rakusatsuPrice}</p>
                      )}
                    </div>
                    <div className={styles.flexItem}>
                      <label className={styles.label}>{texts.goods.rakusatsuTesuryoPrice}</label>
                      <input
                        id="rakusatsuTesuryoPrice"
                        name="rakusatsuTesuryoPrice"
                        onChange={handleKekkaDataChange}
                        value={kekkaData.rakusatsuTesuryoPrice || ""}
                        className={`${styles.input} text-right`}
                      />
                      {formKekkaErrors?.rakusatsuTesuryoPrice && (
                        <p className="error-message">{formKekkaErrors.rakusatsuTesuryoPrice}</p>
                      )}
                    </div>
                  </div>
                  <div className={styles.flexContainer}>
                    <div className={styles.flexItem}>
                      <label className={styles.label}>{texts.goods.rakusatsuUserId}</label>
                      <div className="flex items-center space-x-2">
                        <input
                          id="rakusatsuUserId"
                          name="rakusatsuUserId"
                          onChange={handleKekkaDataChange}
                          value={kekkaData.rakusatsuUserId || ""}
                          className={`${styles.input} flex-1`}
                        />
                        {kekkaData.rakusatsuUserId && (
                          <MemberRegisterButton userId={kekkaData.rakusatsuUserId} />
                        )}
                      </div>
                      {formKekkaErrors?.rakusatsuUserId && (
                        <p className="error-message">{formKekkaErrors.rakusatsuUserId}</p>
                      )}
                    </div>
                    <div className={styles.flexItem}></div>
                  </div>
                  <div className={styles.flexContainer}>
                    <div className={styles.flexItem}>
                      <label className={styles.label}>{texts.goods.rakusatsuUserName}</label>
                      <input
                        id="rakusatsuUserName"
                        name="rakusatsuUserName"
                        value={kekkaData.rakusatsuUserName || ""}
                        className={styles.input}
                        disabled
                      />
                    </div>
                    <div className={styles.flexItem}>
                      <label className={styles.label}>{texts.goods.rakusatsuCompanyName}</label>
                      <input
                        id="rakusatsuCompanyName"
                        name="rakusatsuCompanyName"
                        value={kekkaData.rakusatsuCompanyName || ""}
                        className={styles.input}
                        disabled
                      />
                    </div>
                  </div>
                  <div className={styles.flexContainer}>
                    <div className={styles.flexItem}>
                      <label className={styles.label}>{texts.goods.kekkaRegisttime}</label>
                      <input
                        id="kekkaRegisttime"
                        name="kekkaRegisttime"
                        value={kekkaData.kekkaRegisttime || ""}
                        className={styles.input}
                        disabled
                      />
                    </div>
                    <div className={styles.flexItem}>
                      <label className={styles.label}></label>
                    </div>
                  </div>
                  {executionPermission(201, 2) && !shimeFlg && (
                    <>
                      <div className="p-4 relative mt-5">
                        <div className="sm:absolute bottom-0 right-0">
                          <RegistButton
                            label={texts.button.goodsKekkaRegist}
                            onClick={GoodsKekkaRegist}
                          />
                        </div>
                      </div>
                      {kekkaData.auctionKekkaStatus == 2 && (
                        <>
                          <div className="p-4 relative mt-5">
                            <div className="sm:absolute bottom-0 right-0">
                              <FurakusatsuButton onClick={GoodsKekkaDelete} />
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {executionPermission(201, 2) && !shimeFlg && goodsData.goodsId !== null && (
        <div className="w-full space-y-3 bg-white shadow-md md:max-w-full md:rounded p-4 relative mt-5 ">
          <div className="sm:flex sm:justify-between sm:items-center">
            <label className="text-gray-500 text-sm">
              {texts.label.delete_note_1}
              <br />
            </label>
            <ConfirmDialog
              title={texts.message.confirmDelete}
              description={texts.label.delete_note_1}
              buttonTitle={texts.button.delete}
              className="bg-red-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
              dialogClassName="bg-red-500 hover:bg-opacity-50 text-white font-bold py-4 px-4 rounded-lg w-40"
              dialogCancelClassName="bg-white hover:bg-opacity-50 border border-solid border-red-500 text-red-500 py-4 px-4 rounded-lg w-40"
              onSubmit={handleDeleteSubmit}
              buttonText={texts.button.delete}
            />
          </div>
        </div>
      )}

      <BidHistoryModal
        isOpen={isBidHistoryModalOpen}
        onClose={handleBidHistoryModalClose}
        goodsId={goodsData.goodsId || 0}
        auctionSeq={goodsData.auctionSeq || 0}
      />

      <FavoriteModal
        isOpen={isFavoriteModalOpen}
        onClose={handleFavoriteModalClose}
        goodsId={goodsData.goodsId || 0}
      />
    </div>
  );
};

export default withAdminLayout(Page);
