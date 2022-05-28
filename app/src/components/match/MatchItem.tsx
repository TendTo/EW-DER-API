import { Person, SolarPower } from "@mui/icons-material";
import {
  alpha,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import { useMemo } from "react";
import { Asset } from "../../models";
type MatchItemProps = {
  selected: boolean;
  sufficient: boolean;
  asset: Asset;
  onClick: (asset: Asset) => void;
};

export function MatchItem({ selected, asset, onClick, sufficient }: MatchItemProps) {
  const theme = useTheme();
  const color = useMemo(
    () =>
      asset.isConsumer
        ? theme.palette.primary
        : sufficient
        ? theme.palette.success
        : theme.palette.error,
    [asset, theme, sufficient],
  );

  return (
    <ListItemButton
      selected={selected}
      onClick={() => onClick(asset)}
      sx={{
        "&.Mui-selected": {
          backgroundColor: alpha(color.main, 0.4),
          "&:hover": {
            backgroundColor: alpha(color.light, 0.4),
          },
        },
      }}
    >
      <ListItemIcon>{asset.isConsumer ? <Person /> : <SolarPower />}</ListItemIcon>
      <ListItemText
        primary={asset.assetDID}
        secondary={asset.value.toFixed(2)}
        primaryTypographyProps={{ textOverflow: "ellipsis", overflow: "hidden" }}
        secondaryTypographyProps={{ textOverflow: "ellipsis", overflow: "hidden" }}
      />
    </ListItemButton>
  );
}
