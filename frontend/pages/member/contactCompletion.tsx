import { GetServerSideProps } from "next";
import { getTexts } from "@/config/texts";
import { withAuth } from "@/hocs/withMemberAuth";
import ContactPageCompletionComponent from "@/components/member/contact/ContactPageCompletionComponent";
import withMemberisLoginLayout from "@/hocs/withMemberisLoginLayout";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const { locale } = context;
  const texts = getTexts(locale);
  return {
    props: {
      pageTitle: texts.menu.memberContactCompletion,
    },
  };
});

export default withMemberisLoginLayout(ContactPageCompletionComponent, true);
