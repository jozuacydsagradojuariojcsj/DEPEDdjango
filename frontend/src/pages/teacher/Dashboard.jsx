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
import TeacherLayout from "../../components/layouts/TeacherLayout";

//teacher ni na dashboard

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: "#2c8aad00",
}));

export default function Dashboard({ children }) {
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

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        await axios.post(`${BASE_URL}/auth/jwt/blacklist/`, {
          refresh: refreshToken,
        });
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      toast.success("Logged out", {
        onClose: () => navigate("/"),
      });
    } catch (error) {
      console.error("Logout error", error.response?.data || error.message);

      // Even if blacklist fails, still logout locally
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/");
    }
  };

  // Check login status
  useEffect(() => {
    const checkLoggedInUser = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setIsLoggedIn(false);
        setFirstName("");
        return;
      }

      try {
        const response = await axios.get("http://192.168.1.30:8000/api/user/", {
          withCredentials: true,
        });

        setIsLoggedIn(true);
        setFirstName(response.data.first_name);
      } catch (error) {
        console.error("Invalid token", error);
        setIsLoggedIn(false);
        setFirstName("");
        //remove for the meantime for testing
        // optional but recommended
        // localStorage.removeItem("accessToken");
      }
    };

    checkLoggedInUser();
  }, []);

  const { logout } = useAuth();

  return (
    <TeacherLayout>
      {/*This Gridbox is both my lesson plan and submit lesson plan*/}
      <Gridbox />
    </TeacherLayout>
  );
}

{
  /* <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar position="fixed">
        <Toolbar>
          <Box
            component="img"
            src={DEPED}
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

      
      <ToastContainer position="top-right" autoClose={3000} />
    </Box> */
}
