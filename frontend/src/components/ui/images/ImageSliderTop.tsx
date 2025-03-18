import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import Image from 'next/image';
import { useMediaQuery } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// 型定義
import { TTopImage } from '@/types/common/MtTopImage';

interface ImageSliderProps {
  images: TTopImage[];
}
interface CustomArrowProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // クリックイベント
}
const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {

  const CustomPrevArrow: React.FC<CustomArrowProps> = ({  onClick }) => {
    return (
      <button className="topImagePrevArrow" onClick={onClick}>
       <ArrowBackIosNewIcon/>
      </button>
    );
  };
  
  const CustomNextArrow : React.FC<CustomArrowProps> = ({  onClick }) => {
    return (
      <button className="topImageNextArrow" onClick={onClick}>
         <ArrowForwardIosIcon/>
      </button>
    );
  };
  const settings = {
    dots: images.length > 1, // 1枚の場合はdotsを非表示
    infinite: images.length > 1, // 1枚の場合はループ無効
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: images.length > 1, // 1枚の場合は自動再生無効
    autoplaySpeed: 3000,
    prevArrow: images.length > 1 ? <CustomPrevArrow /> : undefined, 
    nextArrow: images.length > 1 ? <CustomNextArrow /> : undefined, 
  };

  const isMobile = useMediaQuery('(max-width:767px)');

  return (
    <div style={{ width: '100%'  }}> {/* スライダー全体の幅を100%に */}
      <Slider {...settings}>
        {images.map((image, index) => (
          <div
            key={index}
            
          >
            <a  
              href={image.linkUrl || ''}
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!image.linkUrl) {
                  // href が空文字または null の場合、クリック時の遷移をキャンセル
                  e.preventDefault();
                }
              }}
              style={{
              position: 'relative',
              width: '100%',
              cursor: image.linkUrl ? 'pointer' : 'default',
              ...(isMobile
                ? {} // スマホの場合
                : { height: 'calc(100vh - 200px)', display: 'block', backgroundColor: '#000' }), // PCの場合
            }}>
              <Image
                src={image.topImageUrl || ''}
                alt={`Slide ${index + 1}`}
                {...(isMobile
                  ? { layout: 'responsive', width: 1280, height: 720 } // スマホの場合
                  : { fill: true })} // PCの場合
                quality={100}
                loading="lazy"
                style={{ objectFit: 'contain' }} 
              />
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
