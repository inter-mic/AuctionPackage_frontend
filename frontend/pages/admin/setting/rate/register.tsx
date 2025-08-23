import React from "react";
import { GetServerSideProps } from "next";
import { texts } from "@/config/texts.ja";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminLayout from "@/hocs/withAdminLayout";
//API
//import { useRateSearchAPI } from "@/hooks/api/admin/rate/useRateSearchAPI";
//型定義
import { PageProps } from "@/types/admin/adminPage";

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminMailRegist,
    },
  };
});

const Page: React.FC<PageProps> = () => {
  //const { rate } = useRateSearchAPI();

  return <></>;
};

export default withAdminLayout(Page);
