import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
} from "@mui/icons-material";
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
import { useEtherBalance, useEthers, useLookupAddress } from "@usedapp/core";
import { formatEther } from "ethers/lib/utils";
import React, { useContext, useState } from "react";
import { ColorModeContext } from "../context/colorModeContext";

const pages = ["Products", "Pricing", "Blog"];

function AppTopBar() {
  const theme = useTheme();
  const { activateBrowserWallet, account, deactivate } = useEthers();
  const name = useLookupAddress();
  const balance = useEtherBalance(account);
  const { toggleColorMode } = useContext(ColorModeContext);
  const [anchorElNav, setAnchorElNav] = useState<HTMLElement>();
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement>();

  const getBalance = () => {
    if (!balance) return "0 VT";
    const vt = formatEther(balance);
    const decimals = vt.indexOf(".");
    return `${vt.slice(0, decimals + 3)} VT`;
  };

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

  const handleLogin = () => {
    setAnchorElUser(undefined);
    activateBrowserWallet();
  };

  const handleLogout = () => {
    setAnchorElUser(undefined);
    deactivate();
  };

  const onClickAccount = () => {
    if (account) {
      navigator.clipboard.writeText(account);
    }
    setAnchorElUser(undefined);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            EW-DER manager
          </Typography>

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
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
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
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
              {account ? (
                [
                  <MenuItem key="bar-account" onClick={onClickAccount}>
                    <Typography textAlign="center">
                      {name ?? account}
                    </Typography>
                  </MenuItem>,
                  <MenuItem key="bar-balance" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{getBalance()}</Typography>
                  </MenuItem>,
                  <MenuItem key="bar-logout" onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>,
                ]
              ) : (
                <MenuItem key="bar-login" onClick={handleLogin}>
                  <Typography textAlign="center">Login</Typography>
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
export default AppTopBar;
