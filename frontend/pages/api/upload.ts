import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, // formidableを使うため無効化
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const uploadDir = `${process.env.NEXT_PUBLIC_IMAGE_ZIP_PATH}`; 

  // ディレクトリがない場合は作成
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir: uploadDir,  // アップロードディレクトリ指定
    keepExtensions: true,  // 拡張子を保持
    multiples: false,      // 複数ファイルのアップロードを許可しない
    maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB
    maxTotalFileSize: 2 * 1024 * 1024 * 1024, // 2GB
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("File upload error:", err); // エラーログを出力
      return res.status(500).json({ error: "Upload failed", details: err.message });
    }

    if (!files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ファイルリネーム処理
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const timestamp = Date.now();
    const fileExt = path.extname(file.originalFilename || ".zip");
    const newFileName = `${timestamp}${fileExt}`;
    const targetPath = path.join(uploadDir, newFileName);

    fs.rename(file.filepath, targetPath, (renameErr) => {
      if (renameErr) {
        return res.status(500).json({ error: "Failed to move file" });
      }

      res.status(200).json({ message: "File uploaded", fileName: newFileName , originalFilename: file.originalFilename });
    });
  });
}
