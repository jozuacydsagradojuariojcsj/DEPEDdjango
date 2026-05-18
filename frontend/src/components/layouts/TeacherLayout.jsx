import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Gridbox from "../../components/GridBoxs/Gridbox";

import { Background, DEPED } from "../../assets";
import { useAuth } from "../../context/AuthContext";

const TeacherLayout = ({ children }) => {
  const AppBar = styled(MuiAppBar)(({ theme }) => ({
    backgroundColor: "#2c8aad23",
  }));

  const { logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  // Menu for account icon
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="flex flex-col w-screen h-screen">
      <CssBaseline />
      <AppBar position="fixed"></AppBar>
      <span className="absolute w-full z-10 bg-dashboard drop-shadow-2xl shadow-lg">
        <Toolbar>
          <Box
            component="img"
            src={DEPED}
            sx={{ height: 40, width: "auto", mr: 2, cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          />
          <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>

          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            aria-controls={menuOpen ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? "true" : undefined}
          >
            <AccountCircle />
          </IconButton>

          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={logout}>Log out</MenuItem>
          </Menu>
        </Toolbar>
      </span>

      <div
        className="relative flex flex-1 items-center justify-center bg-cover bg-center bg-fixed flex-row gap-6 p-2"
        style={{ backgroundImage: `url(${Background})` }}
      >
        {children}
      </div>
    </div>
  );
};

export default TeacherLayout;
