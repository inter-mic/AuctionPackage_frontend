import { useState, useEffect, useCallback } from 'react';
import { useRouter }  from 'next/navigation';
//コンフィグ
import { texts } from '@/config/texts';
//カスタムフック
import { useApiRequest } from '@/hooks/api/useApiRequest';



export const useCommonSetup = () => {
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