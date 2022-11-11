import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

const settings = ["Logout"];

function Navbar() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const router = useRouter();
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const auth = getAuth();
  const signedInUser = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user);
      return user;
    }
  });
  function handleLogout() {
    auth.signOut().then(() => {
      router.push("/");
    });
  }
  return (
    <AppBar position="static">
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: "5%",
          paddingRight: "5%",
        }}
      >
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          ORDER TRACKER
        </Typography>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src={signedInUser.photoURL} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <Typography textAlign="center" onClick={handleLogout}>
                  {setting}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;