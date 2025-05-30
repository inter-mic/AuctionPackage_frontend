export const useMemberLogoutAPI = () => {
  const memberLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEMBER_API_URL}logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // エラーハンドリングは不要
    }
  };

  return { memberLogout };
};
export default useMemberLogoutAPI;
