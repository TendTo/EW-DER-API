import { Stack, Container, Typography, Box } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import metamaskLogo from "../asset/icon/metamask.svg";

export function LoginPage() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm">
      <Stack justifyContent="center" marginTop={4}>
        <Box textAlign="center">
          <Typography
            variant="h4"
            gutterBottom
            component="div"
            textAlign="center"
          >
            {t("LOGIN.TITLE")}
          </Typography>
        </Box>
        <Stack
          justifyContent="center"
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <Box width="36px" height="36px">
            <img alt="metamask logo" src={metamaskLogo} />
          </Box>
          <p className="text-muted">{t("LOGIN.TEXT")}</p>
        </Stack>
        <br />
        <Stack
          justifyContent="space-evenly"
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          spacing={1}
        >
          <Stack alignItems="center">
            {t("LOGIN.NO_METAMASK")}
            <a href="https://metamask.io/download.html" className="ml-2">
              Download
            </a>
          </Stack>
          <Stack alignItems="center">
            {t("LOGIN.CONNECT_TO_VOLTA")}
            <a
              href="https://energyweb.atlassian.net/wiki/spaces/EWF/pages/703201459/Volta+Connecting+to+Remote+RPC+and+Metamask"
              className="ml-2"
            >
              {t("LOGIN.CONNECT")}
            </a>
          </Stack>
          <Stack alignItems="center">
            {t("LOGIN.WHAT_IS_EW")}
            <a href="https://www.energyweb.org/" className="ml-2">
              Energy Web
            </a>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
