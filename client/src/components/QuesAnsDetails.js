import { useState, useEffect, useRef } from "react";
import AceEditor from "react-ace";
import Select from "react-select";
import { Link as RouterLink } from "react-router-dom";
import { UpvoteButton, DownvoteButton } from "./VoteButtons";
import { useAuthContext } from "../context/auth";
import PostedByUser from "./PostedByUser";
import CommentSection from "./CommentSection";
import AcceptAnswerButton from "./AcceptAnswerButton";
import DeleteDialog from "./DeleteDialog";
import AuthFormModal from "./AuthFormModal";
import { ReactComponent as AcceptedIcon } from "../svg/accepted.svg";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  languageToIcon,
  themes,
  langs,
  languageToId,
  scoreToMedal,
} from "../constants/languageOptions";
import {
  Typography,
  CircularProgress,
  LinearProgress,
  Chip,
  Divider,
  Button,
  SvgIcon,
  TextField,
  Grid,
  Box,
  Tooltip,
} from "@material-ui/core";
import { useQuesPageStyles } from "../styles/muiStyles";
import ReactQuill from "react-quill";

const QuesAnsDetails = ({
  quesAns,
  upvoteQuesAns,
  downvoteQuesAns,
  editQuesAns,
  deleteQuesAns,
  addComment,
  editComment,
  deleteComment,
  acceptAnswer,
  isAnswer,
  acceptedAnswer,
  quesAuthor,
  isMainQuestion,
  hasAnswered,
}) => {
  const {
    id,
    author,
    body,
    tags,
    comments,
    points,
    upvotedBy,
    downvotedBy,
    createdAt,
    updatedAt,
    answerDescription,
    algo,
    theme,
    lang,
    memory_percentile,
    runtime_percentile,
    total_correct,
    total_testcases,
    status_memory,
    status_runtime,
  } = quesAns;

  // const lineHeight = 22 / 18;
  const lineHeight = 1;
  const fontSize = 18;

  const [editorHeight, setEditorHeight] = useState("350px");

  useEffect(() => {
    try {
      // calculate the number of lines in your AceEditor's content
      const code = atob(quesAns.code);
      const numLines = code.split("\n").length;
      const calculatedHeight = `${numLines * fontSize * lineHeight}px`;
      setEditorHeight(calculatedHeight);
    } catch (e) {
      console.error("Error decoding base64 string:", e);
    }
  }, [quesAns.code]);

  const classes = useQuesPageStyles();
  const { user } = useAuthContext();
  const [editAnsOpen, setEditAnsOpen] = useState(false);
  const [editedAnswerBody, setEditedAnswerBody] = useState("");
  const [editedAlgo, setEditedAlgo] = useState("");
  const [editedAnswerDescription, setEditedAnswerDescription] = useState("");
  const [editedLanguage, setEditedLanguage] = useState("");
  const [editedTheme, setEditedTheme] = useState("");

  useEffect(() => {
    if (isAnswer) {
      setEditedAnswerBody(atob(quesAns?.code));
      setEditedAlgo(quesAns?.algo);
      setEditedAnswerDescription(quesAns?.answerDescription);
      setEditedTheme(quesAns?.theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quesAns.code]);

  function handleThemeChange(theme) {
    setEditedTheme(theme.value);
  }
  const openEditInput = () => {
    setEditAnsOpen(true);
  };

  const closeEditInput = () => {
    setEditAnsOpen(false);
  };

  const handleAnswerEdit = (e) => {
    e.preventDefault();
    editQuesAns(
      editedAnswerBody,
      id,
      editedAlgo,
      editedAnswerDescription,
      editedTheme
    );
    closeEditInput();
  };

  return (
    <div className={classes.quesAnsWrapper}>
      {!isMainQuestion && (
        <div className={classes.voteColumn}>
          {user ? (
            <UpvoteButton
              checked={user ? upvotedBy.includes(user.id) : false}
              user={user}
              handleUpvote={upvoteQuesAns}
            />
          ) : (
            <AuthFormModal buttonType="upvote" />
          )}
          <Typography variant="h6" color="secondary">
            {points}
          </Typography>
          {user ? (
            <DownvoteButton
              checked={user ? downvotedBy.includes(user.id) : false}
              user={user}
              handleDownvote={downvoteQuesAns}
            />
          ) : (
            <AuthFormModal buttonType="downvote" />
          )}
        </div>
      )}
      <div className={classes.quesBody}>
        {!editAnsOpen ? (
          !isMainQuestion && (
            <>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
              >
                <Grid item>
                  <Tooltip
                    title={`Passed ${total_correct} /${total_testcases} `}
                  >
                    <SvgIcon className={classes.icon}>
                      {scoreToMedal(total_correct, total_testcases)}
                    </SvgIcon>
                  </Tooltip>
                </Grid>

                <Grid item>
                  <Tooltip title={lang}>
                    <SvgIcon className={classes.icon}>
                      {languageToIcon(lang)}
                    </SvgIcon>
                  </Tooltip>
                </Grid>
                <Tooltip title={`Memory ${status_memory}`}>
                  <Box
                    position="relative"
                    display="inline-flex"
                    style={{ marginLeft: 2 }}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={runtime_percentile}
                      color="secondary"
                    />
                    <Box
                      top={0}
                      left={0}
                      bottom={0}
                      right={0}
                      position="absolute"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography
                        variant="caption"
                        component="div"
                        color="textSecondary"
                      >{`${Math.round(runtime_percentile)}%`}</Typography>
                    </Box>
                  </Box>
                </Tooltip>
                <Tooltip title={`Speed ${status_runtime}`}>
                  <Box position="relative" display="inline-flex">
                    <CircularProgress
                      variant="determinate"
                      value={memory_percentile}
                    />
                    <Box
                      top={0}
                      left={0}
                      bottom={0}
                      right={0}
                      position="absolute"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography
                        variant="caption"
                        component="div"
                        color="textSecondary"
                      >{`${Math.round(memory_percentile)}%`}</Typography>
                    </Box>
                  </Box>
                </Tooltip>
                <Grid item>
                  <Chip label={algo} variant="outlined" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {answerDescription}
                  </Typography>{" "}
                </Grid>
              </Grid>
              <Grid container direction="row">
                <AceEditor
                  theme={theme}
                  mode="javascript"
                  value={atob(quesAns.code)}
                  fontSize={fontSize}
                  readOnly={true}
                  width="100%"
                  maxLines={50}
                />
              </Grid>
            </>
          )
        ) : (
          //this is the edit answer form
          <form className={classes.smallForm} onSubmit={handleAnswerEdit}>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={3}
            >
              <Grid item xs={8}>
                <Box width={1}>
                  <TextField
                    fullWidth
                    multiline
                    margin="dense"
                    id="expectedAnswer"
                    label="Big O Notation *"
                    type="text"
                    variant="outlined"
                    value={editedAlgo}
                    onChange={(e) => setEditedAlgo(e.target.value)}
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                {" "}
                <Select
                  placeholder={`Select Theme`}
                  options={themes}
                  value={themes.find((obj) => obj.value === editedTheme)}
                  onChange={(e) => handleThemeChange(e)}
                />
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={12}>
                <Box width={1}>
                  <TextField
                    fullWidth
                    multiline
                    margin="dense"
                    id="expectedAnswer"
                    label="Algorithm Description *"
                    type="text"
                    variant="outlined"
                    value={editedAnswerDescription}
                    onChange={(e) => setEditedAnswerDescription(e.target.value)}
                  />
                </Box>
              </Grid>
            </Grid>

            <Divider />
            <AceEditor
              theme={editedTheme}
              mode={editedLanguage}
              value={editedAnswerBody}
              fontSize={fontSize}
              width="100%"
              maxLines={"Infinity"}
              onChange={(code) => setEditedAnswerBody(code)}
            />

            <div className={classes.submitCancelBtns}>
              <Button
                type="submit"
                size="small"
                variant="contained"
                color="primary"
                style={{ marginRight: 9 }}
              >
                Update Answer
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => setEditAnsOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className={!isMainQuestion && classes.bottomWrapper}>
          {!editAnsOpen && !isMainQuestion && (
            <div className={classes.btnsWrapper}>
              {user && user.id === author.id && (
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  style={{ marginRight: 6 }}
                  className={classes.bottomBtns}
                  onClick={isAnswer ? openEditInput : editQuesAns}
                >
                  Edit
                </Button>
              )}
              {user && (user.id === author.id || user.role === "ADMIN") && (
                <DeleteDialog
                  bodyType={isAnswer ? "answer" : "question"}
                  handleDelete={deleteQuesAns}
                />
              )}
            </div>
          )}
          {!isMainQuestion && (
            <PostedByUser
              username={author.username}
              fullName={author.fullName}
              userId={author.id}
              createdAt={createdAt}
              updatedAt={updatedAt}
              filledVariant={true}
              isAnswer={isAnswer}
            />
          )}
        </div>
        {isMainQuestion && !hasAnswered && (
          <iframe
            title="video"
            width="100%"
            height="300"
            src={quesAns?.url}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen="allowfullscreen"
          ></iframe>
        )}
        <CommentSection
          user={user}
          comments={comments}
          addComment={addComment}
          editComment={editComment}
          deleteComment={deleteComment}
          quesAnsId={id}
        />
      </div>
    </div>
  );
};

export default QuesAnsDetails;
