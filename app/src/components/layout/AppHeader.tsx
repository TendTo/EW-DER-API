import { Brightness4, Brightness7, Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useEtherBalance, useLookupAddress } from "@usedapp/core";
import { formatEther } from "ethers/lib/utils";
import React, { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  colorModeContext,
  RouterContextType,
  useIamContext,
  useRouterContext,
} from "../../context";
import { useLogin } from "../../hooks";

type PagesType = { label: string; route: RouterContextType }[];
const aggregatorPages: PagesType = [
  { label: "GENERAL.READINGS", route: "readings" },
  { label: "GENERAL.PRECISE_PROOFS", route: "rootHashes" },
  { label: "GENERAL.AGGREGATED_READINGS", route: "aggregatedRedings" },
  { label: "GENERAL.MATCH", route: "match" },
];
const prosumerPages: PagesType = [
  { label: "GENERAL.CREATE_READINGS", route: "createReadings" },
  { label: "GENERAL.READINGS", route: "readings" },
  { label: "GENERAL.PRECISE_PROOFS", route: "rootHashes" },
  { label: "GENERAL.AGGREGATED_READINGS", route: "aggregatedRedings" },
];

export function AppHeader() {
  const { t } = useTranslation();
  const { update: setRouter } = useRouterContext();
  const theme = useTheme();
  const { login, isLogged, isAggregator, account, logout } = useLogin();
  const { ens } = useLookupAddress(account);
  const balance = useEtherBalance(account);
  const { toggleColorMode } = useContext(colorModeContext);
  const { state: iam } = useIamContext();
  const [anchorElNav, setAnchorElNav] = useState<HTMLElement>();
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement>();

  const loggedIn = iam && iam.connected && account;

  const ethBalance = useMemo(() => {
    if (!balance) return "0 VT";
    const vt = formatEther(balance);
    const decimals = vt.indexOf(".");
    return `${vt.slice(0, decimals + 3)} VT`;
  }, [balance]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(undefined);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(undefined);
  };

  const handleLogin = async () => {
    setAnchorElUser(undefined);
    await login();
  };

  const handleLogout = () => {
    setAnchorElUser(undefined);
    logout();
  };

  const onClickAccount = () => {
    if (account) {
      navigator.clipboard.writeText(account);
    }
    setAnchorElUser(undefined);
  };

  const pages = isLogged ? (isAggregator ? aggregatorPages : prosumerPages) : [];
  const title = isLogged
    ? isAggregator
      ? "EW-DER manager - Aggregator"
      : "EW-DER manager - Prosumer"
    : "EW-DER manager";

  return (
    <AppBar position="static" enableColorOnDark>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            className="clickable"
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            onClick={() => setRouter("home")}
          >
            {title}
          </Typography>

          {pages.length > 0 && (
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.label}
                    onClick={() => {
                      handleCloseNavMenu();
                      setRouter(page.route);
                    }}
                  >
                    <Typography textAlign="center">{t(page.label)}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            EW-DER manager
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                onClick={() => {
                  handleCloseNavMenu();
                  setRouter(page.route);
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {t(page.label)}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {loggedIn ? (
                [
                  <MenuItem key="bar-account" onClick={onClickAccount}>
                    <Typography textAlign="center">{ens ?? account}</Typography>
                  </MenuItem>,
                  <MenuItem key="bar-balance" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{ethBalance}</Typography>
                  </MenuItem>,
                  <MenuItem key="bar-logout" onClick={handleLogout}>
                    <Typography textAlign="center">{t("GENERAL.LOGOUT")}</Typography>
                  </MenuItem>,
                ]
              ) : (
                <MenuItem key="bar-login" onClick={handleLogin}>
                  <Typography textAlign="center">{t("GENERAL.LOGIN")}</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
          <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
