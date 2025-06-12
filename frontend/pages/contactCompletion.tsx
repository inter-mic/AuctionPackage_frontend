import { GetServerSideProps } from "next";
import { getTexts } from "@/config/texts";
import { withSystemSetting } from "@/hocs/withSystemSetting";
import ContactPageCompletionComponent from "@/components/member/contact/ContactPageCompletionComponent";
import withMemberisLoginLayout from "@/hocs/withMemberisLoginLayout";

export const getServerSideProps: GetServerSideProps = withSystemSetting(
  async (context) => {
    const { locale } = context;
    const texts = getTexts(locale);
    return {
      props: {
        pageTitle: texts.menu.memberContact,
      },
    };
  },
  false,
  false
);
export default withMemberisLoginLayout(ContactPageCompletionComponent, false);
