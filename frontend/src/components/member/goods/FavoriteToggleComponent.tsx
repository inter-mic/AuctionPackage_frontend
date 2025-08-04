import React, { useState, useCallback, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { useFavoriteOnOffAPI } from "@/hooks/api/member/goods/useFavoriteOnOffAPI";

interface Props {
  goodsId: number;
  initialFavoriteState: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const FavoriteToggleComponent: React.FC<Props> = ({ goodsId, initialFavoriteState }) => {
  const { favoriteOnOffAPI } = useFavoriteOnOffAPI();
  const [isFavorite, setIsFavorite] = useState<boolean>(initialFavoriteState);
  useEffect(() => {
    setIsFavorite(initialFavoriteState);
  }, [initialFavoriteState]);
  const toggleFavorite = useCallback(
    async (event: React.ChangeEvent<HTMLDivElement>, checked: boolean) => {
      const newFavoriteState = checked;
      setIsFavorite(newFavoriteState);
      await favoriteOnOffAPI(goodsId, newFavoriteState);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFavorite, goodsId, favoriteOnOffAPI]
  );

  const handleFavoriteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  return (
    <Checkbox
      icon={<FavoriteBorder />}
      checkedIcon={<Favorite sx={{ color: "red" }} />}
      checked={isFavorite}
      onChange={(event, checked) => toggleFavorite(event, checked)}
      sx={{ color: "gray" }}
      onClick={handleFavoriteClick as React.MouseEventHandler<HTMLButtonElement>}
    />
  );
};

export default FavoriteToggleComponent;
