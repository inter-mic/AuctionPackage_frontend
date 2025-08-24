import { useCallback } from "react";

// Function overloads to handle both defined and potentially undefined state
export function useFavoriteToggle<T extends { favoriteCount: number | string }>(
  setState: React.Dispatch<React.SetStateAction<T>>
): { handleFavoriteToggle: (isFavorite: boolean) => void };

export function useFavoriteToggle<T extends { favoriteCount: number | string }>(
  setState: React.Dispatch<React.SetStateAction<T | undefined>>
): { handleFavoriteToggle: (isFavorite: boolean) => void };

export function useFavoriteToggle<T extends { favoriteCount: number | string }>(
  setState: React.Dispatch<React.SetStateAction<T | undefined>>
) {
  const handleFavoriteToggle = useCallback(
    (isFavorite: boolean) => {
      setState((prev) => {
        if (!prev) return prev;
        const currentCount = Number(prev.favoriteCount) || 0;
        return {
          ...prev,
          favoriteCount: isFavorite ? currentCount + 1 : currentCount - 1,
        };
      });
    },
    [setState]
  );

  return { handleFavoriteToggle };
}
