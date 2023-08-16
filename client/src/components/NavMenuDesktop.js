import { useLocation, Link as RouterLink } from "react-router-dom";

import { MenuItem, useMediaQuery, Divider, Grid } from "@material-ui/core";
import { useAuthContext } from "../context/auth";
import { useMenuStyles } from "../styles/muiStyles";
import { useTheme } from "@material-ui/core/styles";
import PublicIcon from "@material-ui/icons/Public";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import PeopleIcon from "@material-ui/icons/People";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import FaceIcon from "@material-ui/icons/Face";
import CodeIcon from "@material-ui/icons/Code";
import WbIncandescentIcon from "@material-ui/icons/WbIncandescent";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

const DesktopNavMenu = () => {
  const { pathname } = useLocation();
  const classes = useMenuStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xl"));
  const { user } = useAuthContext();

  if (isMobile) return null;

  return (
    <Grid item>
      <div className={classes.rootPanel}>
        <div className={classes.list}>
          <MenuItem
            selected={
              pathname === "/" ||
              (!pathname.startsWith("/tag") &&
                !pathname.startsWith("/user") &&
                !pathname.startsWith("/ask") &&
                !pathname.startsWith("/leaderboard") &&
                !pathname.startsWith("/teams") &&
                !pathname.startsWith("/contact"))
            }
            component={RouterLink}
            to="/"
          >
            <CodeIcon className={classes.menuIcon} />
            Questions
          </MenuItem>
          <MenuItem
            selected={pathname.startsWith("/tag")}
            component={RouterLink}
            to="/tags"
          >
            <LocalOfferIcon className={classes.menuIcon} />
            Tags
          </MenuItem>
          {/* <MenuItem
            selected={pathname.startsWith("/leaderboard")}
            component={RouterLink}
            to="/leaderboard"
          >
            <EqualizerIcon className={classes.menuIcon} />
            Leaderboard
          </MenuItem> */}
          <MenuItem
            selected={pathname.startsWith("/user")}
            component={RouterLink}
            to="/users"
          >
            <FaceIcon className={classes.menuIcon} />
            Users
          </MenuItem>
          {/* <MenuItem
            selected={pathname.startsWith("/teams")}
            component={RouterLink}
            to="/teams"
          >
            <PeopleIcon className={classes.menuIcon} />
            Teams
          </MenuItem> */}
          {/* <MenuItem
            selected={pathname.startsWith("/contact")}
            component={RouterLink}
            to="/contact"
          >
            <WbIncandescentIcon className={classes.menuIcon} />
            Suggestions
          </MenuItem> */}
          {/* {user?.role === "ADMIN" && ( */}
          {/* <MenuItem
            selected={pathname.startsWith("/ask")}
            component={RouterLink}
            to="/ask"
          >
            <AddCircleOutlineIcon className={classes.menuIcon} />
            Create a Question
          </MenuItem> */}
          {/* )} */}
        </div>
        <Divider orientation="vertical" flexItem />
      </div>
    </Grid>
  );
};

export default DesktopNavMenu;
