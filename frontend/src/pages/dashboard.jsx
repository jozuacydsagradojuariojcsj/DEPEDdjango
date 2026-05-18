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
import background from "../assets/cover.jpg";
import digatImg from "../assets/DepED-Logo.png";
import Gridbox from "../components/GridBoxs/Gridbox";

//teacher ni na dashboard                                                           

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: "#2c8aad09",
}));

export default function Dashboard() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
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

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        const config = { headers: { Authorization: `Bearer ${accessToken}` } };
        await axios.post(
          "http://192.168.1.106:8000/api/logout/",
          { refresh: refreshToken },
          config,
        );
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setLoggedIn(false);
        setUsername("");
        toast.success("Logging out", { onClose: () => navigate("/") });
      }
    } catch (error) {
      console.error("Failed to logout", error.response?.data || error.message);
      toast.error("Logout failed");
    }
  };

  // Check login status
  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const response = await axios.get(
            "http://192.168.1.106:8000/api/user/",
            config,
          );
          setLoggedIn(true);
          setUsername(response.data.username);
        } else {
          setLoggedIn(false);
          setUsername("");
        }
      } catch (error) {
        setLoggedIn(false);
        setUsername("");
      }
    };
    checkLoggedInUser();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar position="fixed">
        <Toolbar>
          <Box
            component="img"
            src={digatImg}
            sx={{ height: 40, width: "auto", mr: 2 }}
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
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          position: "relative",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundAttachment: "fixed",
          pt: { xs: "56px", sm: "64px" }, // padding-top equal to AppBar
        }}
      >
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            mb: 2,
            color: "white",
            pt: { xs: "56px", sm: "64px" },
          }}
        >
          {isLoggedIn ? (
            <h2>Hello teacher {username}. Thanks for logging in!</h2>
          ) : (
            <h2 className="bg-red-500 text-white p-4" >Please Login</h2>
          )}
        </Box>
        <Gridbox />
      </Box>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
}
