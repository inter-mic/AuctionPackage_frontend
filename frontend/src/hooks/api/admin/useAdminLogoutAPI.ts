import { useRouter } from 'next/navigation';
export const useAdminLogoutAPI = () => {
    const adminLogout  = async ()=>{
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}logout`, {
          method: 'POST',
          credentials: 'include',
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

      } catch (error) {
        console.error('Failed to logout:', error);
      }
    };
   
    return { adminLogout };
  };
  export default useAdminLogoutAPI;



