export const useAdminLogoutAPI = () => {
  const adminLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch {
      // エラーハンドリングは不要
    }
  };

  return { adminLogout };
};
export default useAdminLogoutAPI;
