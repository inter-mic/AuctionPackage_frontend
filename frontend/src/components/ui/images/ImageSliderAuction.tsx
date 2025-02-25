import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import AuctionInfo from '@/components/member/schedule/AuctionInfoComponent';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// 型定義
import {  TAuction } from '@/types/common/MtAuction';

interface ImageSliderProps {
  auctionKaisaiChuList: TAuction[];
  isLogin: boolean;
}
interface CustomArrowProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // クリックイベント
}
const ImageSlider: React.FC<ImageSliderProps> = ({ auctionKaisaiChuList, isLogin }) => {

  const CustomPrevArrow: React.FC<CustomArrowProps> = ({  onClick }) => {
    return (
      <button className="auctionPrevArrow" onClick={onClick}>
         <ArrowBackIosNewIcon/>
      </button>
    );
  };
  
  const CustomNextArrow : React.FC<CustomArrowProps> = ({  onClick }) => {
    return (
      <button className="auctionNextArrow" onClick={onClick}>
        <ArrowForwardIosIcon/>
      </button>
    );
  };
  const settings = {
    dots: auctionKaisaiChuList.length > 1, // 下部にナビゲーション点を表示
    infinite: auctionKaisaiChuList && auctionKaisaiChuList.length > 1,
    slidesToShow: 1, // 表示するスライド数
    slidesToScroll: 1, // 一度にスクロールするスライド数
    autoplay: auctionKaisaiChuList.length > 1, // 1枚の場合は自動再生無効
    autoplaySpeed: 3000,
    prevArrow: auctionKaisaiChuList.length > 1 ? <CustomPrevArrow /> : undefined, 
    nextArrow: auctionKaisaiChuList.length > 1 ? <CustomNextArrow /> : undefined, 
  };

  return (
    <div className="imageSliderContainer"  style={{ width: '100%' }}>
      <Slider {...settings}>
        {auctionKaisaiChuList.map((auctionData) => (
            <div key={auctionData.auctionSeq} className="sliderContent">
              <AuctionInfo
                auctionData={auctionData}
                isToGoodsList={true}
                isLogin={isLogin}
              />
            </div>
          ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
