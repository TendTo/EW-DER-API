import { Box, Button, Container, Stack, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import metamaskLogo from "../../asset/icon/metamask.svg";

export function LoginPage() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm">
      <Stack justifyContent="center" marginTop={4}>
        <Box textAlign="center">
          <Typography variant="h4" gutterBottom component="div" textAlign="center">
            {t("LOGIN.TITLE")}
          </Typography>
        </Box>
        <Stack justifyContent="center" alignItems="center" direction="row" spacing={2}>
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
          <Stack alignItems="center" gap={1.5}>
            {t("LOGIN.NO_METAMASK")}
            <Button variant="contained" href="https://metamask.io/download.html" target="_blank">
              Download
            </Button>
          </Stack>
          <Stack alignItems="center" gap={1.5}>
            {t("LOGIN.CONNECT_TO_VOLTA")}
            <Button
              variant="contained"
              href="https://energyweb.atlassian.net/wiki/spaces/EWF/pages/703201459/Volta+Connecting+to+Remote+RPC+and+Metamask"
              target="_blank"
            >
              {t("LOGIN.CONNECT")}
            </Button>
          </Stack>
          <Stack alignItems="center" gap={1.5}>
            {t("LOGIN.WHAT_IS_EW")}
            <Button variant="contained" href="https://www.energyweb.org" target="_blank">
              Energy Web
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
