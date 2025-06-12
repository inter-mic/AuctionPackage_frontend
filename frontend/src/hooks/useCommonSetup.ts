import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
//カスタムフック
import { useApiRequest } from "@/hooks/api/useApiRequest";
import { useLocale } from "@/hooks/useLocale";

export const useCommonSetup = () => {
  const { texts } = useLocale();
  const { apiRequest } = useApiRequest();
  return {
    useState,
    useEffect,
    useCallback,
    useRouter,
    texts,
    apiRequest,
  };
};
