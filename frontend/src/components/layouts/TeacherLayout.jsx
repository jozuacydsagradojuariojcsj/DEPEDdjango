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
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Gridbox from "../../components/GridBoxs/Gridbox";
import { FaBell } from "../../icons/index.js";
import { Background, DEPED } from "../../assets";
import { useAuth } from "../../context/AuthContext";
import { useAlerts } from "../../context/AlertsContext.jsx";

const TeacherLayout = ({ children }) => {
  const frontendURL = import.meta.env.VITE_FRONTEND_URL;
  const AppBar = styled(MuiAppBar)(({ theme }) => ({
    backgroundColor: "#2c8aad23",
  }));

  const { logout } = useAuth();
  const { modalNotification, markNotificationAsRead, unreadNotification } =
    useAlerts();
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

          <div className={"dropdown dropdown-end"}>
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost m-1 relative"
            >
              <FaBell className="size-5" />
              {unreadNotification > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-xxs w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {unreadNotification}
                </div>
              )}
            </div>

            <ul className="dropdown-content menu rounded-box z-1 w-50 sm:w-100 p-2 shadow-sm gap-y-3 bg-gray-300">
              {modalNotification.map((notif) => {
                const formattedDate = new Date(notif.created_at).toLocaleString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                );
                return (
                  <li key={notif.notification_id} className={`rounded-lg `}>
                    <Link
                      onClick={() => readNotifications(notif.notification_id)}
                      to={`${frontendURL}/submitlist/?planId=${notif.link}`}
                      className="flex flex-col items-start relative"
                    >
                      <div
                        className={`${notif.is_read ? "hidden" : "absolute"} top-1 right-1 rounded-full bg-red-500 size-3`}
                      />
                      <div
                        className={`text-xxs sm:text-base ${notif.is_read ? "font-normal" : "font-bold"}`}
                      >
                        {notif.message}
                      </div>
                      <div
                        className={`text-xxs sm:text-base ${notif.is_read ? "font-normal" : "font-bold"}`}
                      >
                        {formattedDate}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

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
