import React, { useState } from "react";
import { MuiFileInput } from "mui-file-input";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ClearIcon from "@mui/icons-material/Clear";
import { Box } from "@mui/material";
import { useLocale } from "@/hooks/useLocale";

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  allowedExtensions: string[];
  className?: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  allowedExtensions,
  className,
}) => {
  const { texts } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  // ファイル拡張子をチェックする関数
  const checkFileExtension = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension && allowedExtensions.includes(extension)) {
      return true;
    }
    return false;
  };

  const handleFileChange = (newFile: File | null) => {
    if (newFile) {
      if (checkFileExtension(newFile)) {
        setFile(newFile);
        onFileChange(newFile);
        setError(null); // エラーをクリア
      } else {
        setFile(null);
        onFileChange(null);
        setError(texts.label.imageUploadExtensionError);
      }
    } else {
      setFile(null);
      onFileChange(null);
      setError(null);
    }
  };
  const handleClear = () => {
    setFile(null);
    onFileChange(null);
  };

  return (
    <div>
      <Box display="flex" alignItems="center">
        <IconButton component="label">
          <AttachFileIcon />
          <input
            type="file"
            hidden
            accept={allowedExtensions.map((ext) => `.${ext}`).join(",")}
            onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
          />
        </IconButton>
        <MuiFileInput
          value={file}
          variant="outlined"
          className={className ?? ""}
          onChange={handleFileChange}
        />
        {file && (
          <IconButton onClick={handleClear}>
            <ClearIcon />
          </IconButton>
        )}
        {error && (
          <Typography color="error" variant="body2" mt={1}>
            {error}
          </Typography>
        )}
      </Box>
    </div>
  );
};
