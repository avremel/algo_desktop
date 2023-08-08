import { Link as RouterLink } from "react-router-dom";
import PostedByUser from "./PostedByUser";
import { ReactComponent as AcceptedIcon } from "../svg/accepted.svg";
import { useAuthContext } from "../context/auth";
import { Checkbox, SvgIcon } from "@material-ui/core";
import QuesSidePanel from "./QuesSidePanel";
import { Paper, Typography, Chip } from "@material-ui/core";
import { useQuesCardStyles } from "../styles/muiStyles";
import CheckIcon from "@material-ui/icons/Check";

const QuesCard = ({ question }) => {
  const classes = useQuesCardStyles();
  const { user } = useAuthContext();

  const {
    id,
    title,
    author,
    tags,
    points,
    views,
    answerCount,
    createdAt,
    question_preview,
    answersAuthorsArray,
    end_time,
  } = question;
  console.log("question", question);
  return (
    <>
      <Paper elevation={0} className={classes.root}>
        <div className={classes.infoWrapper}>
          <div className={classes.innerInfo}>
            <Typography variant="body2" className={classes.mainText}>
              {points}
            </Typography>
            <Typography variant="caption">votes</Typography>
          </div>
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
          <Typography
            variant="body2"
            color="secondary"
            className={classes.title}
            component={RouterLink}
            to={`/questions/${id}`}
          >
            <Checkbox
              checked={answersAuthorsArray.find((a) => a === user?.id)}
              style={{
                pointerEvents: "none",
              }}
              icon={
                <SvgIcon className={classes.acceptIcon}>
                  <AcceptedIcon />
                </SvgIcon>
              }
              checkedIcon={
                <SvgIcon className={classes.checkedAcceptIcon}>
                  <AcceptedIcon />
                </SvgIcon>
              }
            />
            {title}
          </Typography>
          <Typography variant="body2" style={{ wordWrap: "anywhere" }}>
            {question_preview}
          </Typography>
          <div className={classes.bottomWrapper}>
            <div className={classes.tagsWrapper}>
              {tags.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  variant="outlined"
                  color="primary"
                  size="small"
                  component={RouterLink}
                  to={`/tags/${t}`}
                  className={classes.tag}
                  clickable
                />
              ))}
            </div>
            <PostedByUser
              username={author.username}
              fullName={author.fullName}
              userId={author.id}
              createdAt={createdAt}
            />
          </div>
        </div>
        <QuesSidePanel
          answersAuthorsArray={answersAuthorsArray}
          end_time={end_time}
        />
      </Paper>
    </>
  );
};

export default QuesCard;
