import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

export const useApiRequest = () => {
  const router = useRouter();
  const { texts } = useLocale();
  const [isLoading, setIsLoading] = useState(false);

  // ローディング状態に応じてbodyタグのスタイルを変更
  useEffect(() => {
    if (isLoading) {
      document.body.style.pointerEvents = "none";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.pointerEvents = "auto";
      document.body.style.userSelect = "auto";
    }

    // クリーンアップ関数
    return () => {
      document.body.style.pointerEvents = "auto";
      document.body.style.userSelect = "auto";
    };
  }, [isLoading]);

  const getBaseUrl = (endPointKbn: string) => {
    switch (endPointKbn) {
      case "admin":
        return process.env.NEXT_PUBLIC_ADMIN_API_URL;
      case "member":
        return process.env.NEXT_PUBLIC_MEMBER_API_URL;
      case "public":
        return process.env.NEXT_PUBLIC_API_URL;
      default:
        throw new Error("無効なエンドポイント区分です");
    }
  };

  const apiRequest = async (
    endPointKbn: string,
    endpoint: string,
    method: "GET" | "POST" | "PUT",
    body: object | null = null,
    successMessage: string,
    returnJson: boolean = false,
    headers?: Record<string, string>,
    showToast: boolean = true
  ) => {
    setIsLoading(true);
    const toastId = showToast ? toast.loading("Loading...") : null;

    try {
      const baseUrl = getBaseUrl(endPointKbn);
      const fetchHeaders: Record<string, string> = headers || {};
      fetchHeaders["Accept-Language"] = router.locale || "ja";
      // FormData の場合、Content-Type ヘッダーを設定しない
      if (!(body instanceof FormData)) {
        fetchHeaders["Content-Type"] = "application/json";
      }

      const res = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: fetchHeaders,
        credentials: "include",
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
      });
      let responseData;
      if (res.status === 401) {
        if (endPointKbn === "admin") {
          router.push("/admin/login");
        } else if (endPointKbn === "member") {
          router.push("/login");
        }
        if (showToast) {
          toast.update(toastId!, {
            render: texts.message.redirect,
            type: "warning",
            isLoading: false,
            autoClose: 3000,
          });
        }
        return { status: res.status, data: false };
      } else if (res.status === 404) {
        if (showToast) {
          toast.update(toastId!, {
            render: texts.message.noResult,
            type: "warning",
            isLoading: false,
            autoClose: 3000,
          });
        }
        return { status: res.status, data: false };
      }

      if (res.status === 200) {
        let responseData;
        try {
          responseData = returnJson ? await res.json() : true;
        } catch {
          // エラーハンドリングは不要
        }

        if (successMessage) {
          toast.update(toastId!, {
            render: successMessage,
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        } else {
          toast.dismiss(toastId!);
        }
        return { status: res.status, data: responseData };
      } else if (res.status === 400) {
        responseData = await res.json();
        if (showToast) {
          toast.update(toastId!, {
            render: texts.message.error400,
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
        return { status: res.status, data: responseData.data };
      } else {
        if (showToast) {
          toast.update(toastId!, {
            render: `システムエラーが発生しました`,
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
        return { status: res.status, data: false };
      }
    } catch {
      if (showToast) {
        toast.update(toastId!, {
          render: "通信エラーが発生しました",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
      return { status: 500, data: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { apiRequest, isLoading };
};
