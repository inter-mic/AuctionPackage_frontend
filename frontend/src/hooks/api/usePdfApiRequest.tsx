import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const usePdfApiRequest = () => {
  const router = useRouter();

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

  const pdfApiRequest = async (
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
          render: "ログインが必要です",
          type: "warning",
          isLoading: false,
          autoClose: 3000,
        });
        return { status: res.status, data: false };
      }

      if (res.status === 200) {
        toast.dismiss(toastId);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        // 新しいタブでPDFを表示
        window.open(url, "_blank");

        // Content-Disposition からファイル名を取得
        const contentDisposition = res.headers.get("Content-Disposition");
        const extractFileName = (contentDisposition: string | null) => {
          if (!contentDisposition) return "download.pdf";
          const match = contentDisposition.match(/filename\*?=([^;]+)/);
          if (!match) return "download.pdf";
          const fileName = match[1].replace(/^UTF-8''/, "");
          return decodeURIComponent(fileName);
        };
        const fileName = extractFileName(contentDisposition);

        // ダウンロード用のリンクも作成
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
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
    } catch (error) {
      toast.update(toastId, {
        render: "通信エラーが発生しました",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return { status: 500 };
    }
  };

  return { pdfApiRequest };
};
