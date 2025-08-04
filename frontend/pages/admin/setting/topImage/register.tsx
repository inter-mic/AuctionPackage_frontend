import { GetServerSideProps } from "next";
import { texts } from "@/config/texts.ja";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminLayout from "@/hocs/withAdminLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useKengenRedirect } from "@/hooks/useKengenRedirect";
import { useExecutionPermission } from "@/hooks/useExecutionPermission";
//API
import { useTopImageSearchAPI } from "@/hooks/api/admin/topImage/useTopImageSearchAPI";
import { useTopImageRegistAPI } from "@/hooks/api/admin/topImage/useTopImageRegistAPI";
//型定義
import { PageProps } from "@/types/admin/adminPage";
import { TopImageData } from "@/types/admin/topImage/register";
//コンポーネント
import { ImageTopList } from "@/components/ui/images/ImageTop";
//ボタン
import { RegistButton } from "@/components/ui/buttons/admin/registButton";
//スタイル
import breadcrumbStyles from "@/styles/breadcrumb.module.css";

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminTopImageRegist,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect } = useCommonSetup();
  useKengenRedirect(kengen, 502);
  const { executionPermission } = useExecutionPermission(kengen);

  const { topImages, topImageSearch } = useTopImageSearchAPI();
  useEffect(() => {
    topImageSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (topImages) {
      const images = topImages.map((image: TopImageData) => ({
        imageSeq: String(image.imageSeq),
        isNewFlg: false,
        isDeleteFlg: false,
        topImageUrl: image.topImageUrl || "",
        linkUrl: String(image.linkUrl),
      }));
      setImages(images);
    }
  }, [topImages]);

  const [images, setImages] = useState<
    {
      imageSeq: string;
      isNewFlg: boolean;
      isDeleteFlg: boolean;
      topImageUrl: string;
      linkUrl: string;
    }[]
  >([]);
  const handleImagesUpdate = (
    updatedImages: {
      imageSeq: string;
      isNewFlg: boolean;
      isDeleteFlg: boolean;
      topImageUrl: string;
      linkUrl: string;
    }[]
  ) => {
    setImages(updatedImages);
  };

  //登録
  const { topImageRegistAPI } = useTopImageRegistAPI();

  const TopImageRegist = () => {
    topImageRegistAPI(images);
  };

  return (
    <div>
      <div className={breadcrumbStyles.breadcrumb}>
        <span className={breadcrumbStyles.breadcrumbItem}>{texts.menu.adminTopImageRegist}</span>
      </div>
      <div className="flex flex-col items-center justify-center my-3 bg-gray-100">
        <div className="w-full space-y-6 bg-white shadow-md md:max-w-full md:rounded mt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
          <div className="p-4">
            <ImageTopList images={images} onImagesUpdate={handleImagesUpdate} />
            <span>{texts.goods.image_note_2}</span>
            <br />
            <span>{texts.topImage.topImage_note_2}</span>
            {executionPermission(502, 2) && (
              <div className="text-right">
                <RegistButton label={texts.button.regist} onClick={TopImageRegist} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(Page);
