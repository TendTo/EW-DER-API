import { GitHub } from "@mui/icons-material";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import ew_logo from "../../asset/icon/ew-logo.svg";
import gb from "../../asset/icon/gb.svg";
import it from "../../asset/icon/it.svg";

export function AppFooter() {
  const { t, i18n } = useTranslation();

  const onChangeLanguage = useCallback(() => {
    if (i18n.language.startsWith("en")) i18n.changeLanguage("it");
    else if (i18n.language.startsWith("it")) i18n.changeLanguage("en");
    else console.warn("Language not supported");
  }, [i18n]);

  return (
    <Box
      component="footer"
      sx={{
        py: 1,
        px: 2,
        bgcolor: "primary.main",
        color: "text.primary",
        mt: "auto",
      }}
    >
      <Grid container spacing={1} justifyContent="space-around" alignItems="center">
        <Grid item xs={12} sm={1} textAlign="center">
          <IconButton
            href="https://www.energyweb.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={ew_logo} alt="EW logo" style={{ width: "1em" }} />
          </IconButton>
        </Grid>
        <Grid item xs={12} sm={11} md={8}>
          <Typography textAlign="center" variant="body1">
            {t("FOOTER.LEGAL")}
          </Typography>
        </Grid>
        <Grid item xs={4} sm={1}>
          <Typography textAlign="center" variant="body1">
            ©2021
          </Typography>
        </Grid>
        <Grid item xs={4} sm={1} textAlign="center">
          <IconButton
            href="https://github.com/TendTo/EW-DER-API"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHub />
          </IconButton>
        </Grid>
        <Grid item xs={4} sm={1} textAlign="center">
          <IconButton onClick={onChangeLanguage}>
            <img
              src={i18n.language?.startsWith("it") ? gb : it}
              alt={i18n.language?.startsWith("it") ? gb : it + "flag"}
              style={{ width: "1em" }}
            />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
}
