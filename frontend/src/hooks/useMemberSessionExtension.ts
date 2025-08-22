import { useEffect } from "react";
import { useMemberSessionAPI } from "@/hooks/api/member/useMemberSessionAPI";

interface UseSessionExtensionProps {
  isLogin: boolean;
  intervalMinutes?: number;
}

export const useSessionExtension = ({ 
  isLogin, 
  intervalMinutes = 30 
}: UseSessionExtensionProps) => {
  const { memberSessionAPI } = useMemberSessionAPI();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isLogin) {
        memberSessionAPI();
      }
    }, intervalMinutes * 60 * 1000); // Convert minutes to milliseconds

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, intervalMinutes]);
};
