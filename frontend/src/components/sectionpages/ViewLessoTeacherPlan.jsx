import React from "react";
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
import { useNavigate } from "react-router-dom";

import Submitlist from "../sectionpages/SubmitList";
import { Background, DEPED } from "../../assets";
import { useParams } from "react-router-dom";
import { useSchoolYear } from "../../context/SchoolYearProvider";
import TeacherLayout from "../layouts/TeacherLayout";

const AppBar = styled(MuiAppBar)({
  backgroundColor: "#2c8aad98",
});

export default function ListSubmit() {
  const { schoolYear, deadlines } = useSchoolYear();

  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  // const handleMenuClose = () => setAnchorEl(null);

  const navigate = useNavigate();

  return (
    <TeacherLayout>
      <Submitlist />
    </TeacherLayout>
  );
}
// <Box
//   sx={{
//     display: "flex",
//     height: "100vh",
//     overflow: "hidden",
//     flexDirection: "column",
//   }}
// >
//   <CssBaseline />

//   <AppBar position="fixed">
//     <Toolbar>
//       <Box
//         component="img"
//         src={DEPED}
//         alt="Logo"
//         sx={{ height: 40, width: "auto", mr: 2, cursor: "pointer" }}
//         onClick={() => navigate("/dashboard")}
//       />
//       <Typography variant="h6" sx={{ flexGrow: 1 }} />
//       <IconButton
//         // onClick={handleMenuOpen} //
//         color="inherit"
//       >
//         <AccountCircle />
//       </IconButton>
//       <Menu
//         id="account-menu"
//         // anchorEl={anchorEl}
//         // open={Boolean(anchorEl)}
//         // onClose={handleMenuClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         transformOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <MenuItem>Profile</MenuItem>
//         <MenuItem>Log out</MenuItem>
//       </Menu>
//     </Toolbar>
//   </AppBar>

//   <Box
//     sx={{
//       flexGrow: 1,
//       minHeight: "100vh",
//       position: "relative",
//       backgroundImage: `url(${Background})`,
//       backgroundSize: "cover",
//       backgroundPosition: "center",
//       backgroundAttachment: "fixed",
//       pt: { xs: "56px", sm: "64px" },
//       color: "white",
//       textAlign: "center",
//       mb: 2,
//     }}
//   >
//     <Box
//       sx={{
//         width: "100%",
//         maxHeight: "100%",
//         overflowY: "auto",
//       }}
//     ></Box>

//   </Box>
// </Box>
