import { useState, useEffect } from "react";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { GET_ALL_USERS } from "../graphql/queries";
import { Link as RouterLink } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { useStateContext } from "../context/state";
import { getErrorMsg } from "../utils/helperFuncs";

import {
  Typography,
  Tooltip,
  Paper,
  useMediaQuery,
  Grid,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { useRightSidePanelStyles } from "../styles/muiStyles";

const QuesSidePanel = ({ answersAuthorsArray, end_time }) => {
  function calculateTimeLeft() {
    let diff = moment(end_time).diff(moment());
    if (diff <= 0) {
      return null; // Time is up
    } else {
      return moment.duration(diff);
    }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  // Update countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    // Clear interval on component unmount
    return () => {
      clearInterval(timer);
    };
  }, []);

  let countdown;
  if (timeLeft) {
    countdown = `Time left: ${timeLeft?.days()}D ${timeLeft?.hours()}h ${timeLeft?.minutes()}m ${timeLeft?.seconds()}s`;
  } else {
    // AUg 4th 8:30pm
    countdown = `Ended: ${moment(end_time).format("MMM Do h:mm a")}`;
  }
  const classes = useRightSidePanelStyles();
  const { notify } = useStateContext();
  const theme = useTheme();
  const isNotDesktop = useMediaQuery(theme.breakpoints.down("sm"));
  const { data, loading } = useQuery(GET_ALL_USERS, {
    onError: (err) => {
      notify(getErrorMsg(err), "error");
    },
  });

  if (isNotDesktop) return null;

  const squareSize = 15; // Adjust to control the size of the squares
  const squareMargin = 1; // Adjust to control the space between squares

  const getAnswerCountColor = (id) => {
    const count = answersAuthorsArray.filter(
      (authorId) => authorId === id
    ).length;

    switch (count) {
      case 0:
        return "grey";
      case 1:
        return "lightgreen";
      case 2:
        return "limegreen";
      default:
        return "darkgreen";
    }
  };

  return (
    <Grid item>
      <div className={classes.rootPanel}>
        <div className={classes.content}>
          <div className={classes.progressColumn}>
            <Typography
              variant="h6"
              color={
                timeLeft && timeLeft?.asHours() < 1 ? "error" : "secondary"
              }
            >
              {countdown}
            </Typography>
            {!loading && data ? (
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {data.getAllUsers.map(
                  (u) =>
                    u.id !== "64d19aa1e71da54d5c7d2916" && (
                      <Tooltip title={u.fullName} key={u.id}>
                        <Paper
                          style={{
                            width: squareSize,
                            height: squareSize,
                            margin: squareMargin,
                            backgroundColor: getAnswerCountColor(u.id),
                          }}
                        />
                      </Tooltip>
                    )
                )}
              </div>
            ) : (
              <div style={{ minWidth: "200px" }}>
                <LoadingSpinner size={40} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Grid>
  );
};

export default QuesSidePanel;
