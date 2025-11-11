import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useCsvApiRequest = () => {
  const router = useRouter();
  const { texts } = useLocale();
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
  const csvApiRequest = async (
    endPointKbn: string,
    endpoint: string,
    method: "GET" | "POST" | "PUT",
    body: object | null = null
  ) => {
    const toastId = toast.loading("Loading...");
    try {
      const baseUrl = getBaseUrl(endPointKbn);
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: body ? JSON.stringify(body) : null,
      });
      if (res.status === 401) {
        if (endPointKbn === "admin") {
          router.push("/admin/login");
        } else if (endPointKbn === "member") {
          router.push("/login");
        }
        toast.update(toastId, {
          render: texts.message.redirect,
          type: "warning",
          isLoading: false,
          autoClose: 3000,
        });
        return { status: res.status, data: false };
      }

      if (res.status === 200) {
        toast.dismiss(toastId);
        const blob = await res.blob();
        const contentDisposition = res.headers.get("content-disposition");
        // ファイル名を取得
        const extractFileName = (contentDisposition: string | null) => {
          if (!contentDisposition) return "download.csv";
          const match = contentDisposition.match(/filename\*?=([^;]+)/);
          if (!match) return "download.csv";
          const fileName = match[1].replace(/^UTF-8''/, "");
          return decodeURIComponent(fileName);
        };
        const fileName = extractFileName(contentDisposition);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = decodeURIComponent(fileName); // ヘッダーから取得したファイル名を使う
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else if (res.status === 400) {
        toast.update(toastId, {
          render: "エラーが発生しました",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        const errorMessage = await res.text();
        toast.update(toastId, {
          render: `エラーが発生しました: ${errorMessage}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch {
      toast.update(toastId, {
        render: "通信エラーが発生しました",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return { status: 500 };
    }
  };

  return { csvApiRequest };
};
