import { useState, useEffect } from "react";
import moment from "moment";
import { Link as RouterLink } from "react-router-dom";
import PostedByUser from "./PostedByUser";
import { ReactComponent as AcceptedIcon } from "../svg/accepted.svg";
import { useQuery } from "@apollo/client";
import { GET_ALL_USERS } from "../graphql/queries";
import {
  Paper,
  Typography,
  Grid,
  Tooltip,
  Checkbox,
  SvgIcon,
} from "@material-ui/core";
import { useQuesCardStyles } from "../styles/muiStyles";
import CheckIcon from "@material-ui/icons/Check";
import LoadingSpinner from "./LoadingSpinner";
import { useStateContext } from "../context/state";
import { getErrorMsg } from "../utils/helperFuncs";
import { useAuthContext } from "../context/auth";
import { useHistory } from "react-router-dom";
import { useTheme } from "@material-ui/core/styles";

const QuesCard = ({ question }) => {
  const classes = useQuesCardStyles();
  const { user } = useAuthContext();
  const history = useHistory();

  const {
    id,
    title,
    author,
    tags,
    points,
    views,
    answerCount,
    createdAt,
    slug,
    answersAuthorsArray,
    end_time,
  } = question;
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
    countdown = ` - ${timeLeft?.days()}D ${timeLeft?.hours()}h ${timeLeft?.minutes()}m ${timeLeft?.seconds()}s`;
  } else {
    // AUg 4th 8:30pm
    countdown = ` - Ended: ${moment(end_time).format("MMM Do h:mm a")}`;
  }
  const { notify } = useStateContext();
  const theme = useTheme();
  const { data, loading } = useQuery(GET_ALL_USERS, {
    onError: (err) => {
      notify(getErrorMsg(err), "error");
    },
  });

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
    <>
      <Paper elevation={0} className={classes.root}>
        <div className={classes.infoWrapper}>
          <div className={classes.innerInfo}>
            <Typography variant="body2" className={classes.mainText}>
              {answerCount}
            </Typography>
          </div>
          <div className={classes.innerInfo}>
            <Typography variant="body2" className={classes.mainText}>
              {answersAuthorsArray.length}
            </Typography>
            <Typography variant="caption">answers</Typography>
          </div>
          <Typography variant="caption" noWrap>
            {views} views
          </Typography>
        </div>

        <div className={classes.quesDetails}>
          <Grid item>
            <div>
              <Typography
                variant="h6"
                color={
                  timeLeft && timeLeft?.asHours() < 1 ? "error" : "secondary"
                }
                onClick={() => {
                  // if its a iframe then send message to parent window
                  if (window.parent !== window) {
                    console.log("iframe");
                    window.parent.location.href = `https://leetcode.com/problems/${slug}/`; // open in the parent tab
                  } else {
                    // if (answersAuthorsArray.includes(user.id)) {
                    //   history.push(`/questions/${id}`);
                    // } else {
                    window.open(
                      `https://leetcode.com/problems/${slug}/`,
                      "_blank"
                    );
                    // }
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                {answersAuthorsArray.find((a) => a === user?.id) && (
                  <Checkbox
                    checked={true}
                    style={{
                      pointerEvents: "none",
                    }}
                    checkedIcon={
                      <SvgIcon className={classes.answerSubmittedIcon}>
                        <AcceptedIcon />
                      </SvgIcon>
                    }
                  />
                )}

                {title}
                {countdown}
              </Typography>
              {!loading && data ? (
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {data.getAllUsers.map(
                    (u) =>
                      u.id !== "64dcfc269667b01df4b8ee48" && (
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
          </Grid>
        </div>
      </Paper>
    </>
  );
};

export default QuesCard;
