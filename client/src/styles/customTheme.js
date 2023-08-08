import { createMuiTheme } from "@material-ui/core/styles";

const customTheme = (darkMode) =>
  createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#e7e9eb" : "#0d0d0e",
      },
      secondary: {
        main: darkMode ? "#33a7ff" : "#1174cc",
      },
    },

    overrides: {
      MuiMenuItem: {
        root: {
          "&$selected": {
            borderRight: `4px solid #f48225`,
            fontWeight: "700",
          },
        },
      },
      MuiPopover: {
        paper: {
          borderRadius: 2,
        },
      },
      MuiButton: {
        root: {
          borderRadius: 4,
          textTransform: "none",
        },
      },
      MuiChip: {
        root: {
          borderRadius: 3,
          padding: "0px",
        },
        outlined: {
          backgroundColor: darkMode ? "#c197db15" : "#964ec215",
        },
      },
    },
    props: {
      MuiButton: {
        disableElevation: true,
      },
    },
  });

export default customTheme;
