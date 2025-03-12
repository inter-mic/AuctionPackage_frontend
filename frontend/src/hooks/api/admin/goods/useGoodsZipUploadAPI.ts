import { useCommonSetup } from '@/hooks/useCommonSetup';
import { useApiRequest } from '@/hooks/api/useApiRequestProgress';
import { AxiosProgressEvent } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
// 型定義
import { Errors } from '@/types/errors';
import { ZipUpdateData } from '@/types/admin/goods/zipUpdate';





export const useGoodsZipUploadAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts } = useCommonSetup();
  const { apiRequest } = useApiRequest();
  const [zipUploadErrors, setErrors] = useState<Errors>();
  const [zipUploadResponseData, setResponseData] = useState<ZipUpdateData>();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const goodsZipUpload = async (zipUpdateData: ZipUpdateData, file: File | null) => {
    setLoading(true);
    setProgress(0); // 進捗をリセット
  
    if (!file) {
      setLoading(false);
      setErrors({ message: "No file selected" });
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    // XMLHttpRequest を使用して進捗を監視
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload", true);
  
    // アップロード進捗を監視
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        setProgress(percentCompleted);
      }
    };
  
    // アップロード完了時の処理
    xhr.onload = async () => {
      if (xhr.status !== 200) {
        setLoading(false);
        setErrors({ message: "File upload failed" });
        return;
      }
  
      const uploadData = JSON.parse(xhr.responseText);
      const apiFormData = new FormData();
      apiFormData.append("fileName", uploadData.fileName);
      apiFormData.append("originalFilename", uploadData.originalFilename);
  
      const endPoint = "goodszip/upload";
      const { status, data: responseData } =
        (await apiRequest("admin", endPoint, "POST", apiFormData, texts.message.regist, true, {}, {
          onUploadProgress: (event: AxiosProgressEvent) => {
            if (event.total) {
              const percentCompleted = Math.round((event.loaded * 100) / event.total);
              setProgress(percentCompleted); // CircularProgressWithLabel を更新
            }
          },
        })) || { status: 500, data: null };
  
      setLoading(false);
      if (status === 400) {
        setErrors(responseData);
      } else if (status === 200) {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    };
  
    // エラー処理
    xhr.onerror = () => {
      setLoading(false);
      setErrors({ message: "File upload failed due to network error" });
    };
  
    xhr.send(formData);
  };
  
  return { zipUploadResponseData, zipUploadErrors, goodsZipUpload, loading, progress };
  
};
