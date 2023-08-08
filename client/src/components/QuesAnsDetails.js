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

import {
  idToLanguage,
  languageToIcon,
  themes,
  langs,
  languageToId,
  scoreToMedal,
} from "../constants/languageOptions";
import {
  Typography,
  Chip,
  Divider,
  Button,
  SvgIcon,
  TextField,
  Grid,
  Box,
  Menu,
  MenuItem,
  Tooltip,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
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
    outputDetails,
    output,
    theme,
    language_id,
  } = quesAns;
  console.log({ quesAns });
  const [parsedOutput, setParsedOutput] = useState(null);
  useEffect(() => {
    if (output) {
      try {
        // Check if output is a valid base64 string
        if (atob(btoa(output)) === output) {
          const atobed = atob(output);
          const parsed = JSON.parse(atobed);
          setParsedOutput(parsed); // Save the parsed output in the state
        }
      } catch (error) {
        console.error("Failed to decode and parse output", error);
      }
    }
  }, [output]);
  useEffect(() => {
    console.log({ parsedOutput });
  }, [parsedOutput]);

  const firaCodeStyle = { fontFamily: "'Fira Code', monospace" };
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

  const getOutput = () => {
    let output = [];

    if (parsedOutput && parsedOutput.outputCases) {
      parsedOutput.outputCases.forEach((detail, index) => {
        let isPassed = detail.isPassed
          ? {
              text: `test_${index} [PASS] `,
              executionTime: `${detail.executionTime}ms`,
              color: "#14fbdc",
              msColor: "#6db1fe",
              arr: detail.arr,
              target: detail.target,
              tooltip: true,
            }
          : {
              text: `test_${index} [FAIL] `,
              executionTime: `${detail.executionTime}ms`,
              color: "#ffb76b",
              msColor: "#6db1fe",
              arr: detail.arr,
              target: detail.target,
              tooltip: true,
            };
        output.push(isPassed);

        if (!detail.isPassed) {
          output.push({
            color: "#ffb76b",
            text: `├── expect: ${JSON.stringify(detail.expected)}`,
            tooltip: false,
          });
          output.push({
            color: "#ffb76b",
            text: `└── actual: ${JSON.stringify(detail.output)}`,
            tooltip: false,
          });
        }
      });
    }
    return output;
  };
  const classes = useQuesPageStyles();
  const { user } = useAuthContext();
  const [editAnsOpen, setEditAnsOpen] = useState(false);
  const [editedAnswerBody, setEditedAnswerBody] = useState("");
  const [editedAlgo, setEditedAlgo] = useState("");
  const [editedAnswerDescription, setEditedAnswerDescription] = useState("");
  const [editedLanguage, setEditedLanguage] = useState("");
  const [editedTheme, setEditedTheme] = useState("");

  useEffect(() => {
    console.log("isAnswer", isAnswer);
    if (isAnswer) {
      setEditedAnswerBody(atob(quesAns?.code));
      setEditedAlgo(quesAns?.algo);
      setEditedAnswerDescription(quesAns?.answerDescription);
      setEditedLanguage(idToLanguage(quesAns?.language_id));
      setEditedTheme(quesAns?.theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quesAns.code]);

  const handleLangChange = (sl) => {
    console.log("sl", sl);
    setEditedLanguage(sl.value);
  };
  function handleThemeChange(theme) {
    console.log("theme", theme);
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
      languageToId(editedLanguage),
      editedTheme
    );
    closeEditInput();
  };

  return (
    <div className={classes.quesAnsWrapper}>
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
        {isAnswer && user && user.id === quesAuthor.id && (
          <AcceptAnswerButton
            checked={acceptedAnswer === id}
            handleAcceptAns={acceptAnswer}
          />
        )}
        {isAnswer &&
          acceptedAnswer === id &&
          (!user || user.id !== quesAuthor.id) && (
            <SvgIcon className={classes.checkedAcceptIcon}>
              <AcceptedIcon />
            </SvgIcon>
          )}
      </div>
      <div className={classes.quesBody}>
        {!editAnsOpen ? (
          isMainQuestion ? (
            <>
              {quesAns?.url && !hasAnswered && (
                <iframe
                  title="video"
                  width="100%"
                  height="400"
                  src={quesAns?.url}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen="allowfullscreen"
                ></iframe>
              )}
              <ReactQuill
                value={body}
                readOnly={true}
                theme="snow"
                modules={{ toolbar: false }}
              />
            </>
          ) : (
            <>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
              >
                <Grid item>
                  <SvgIcon className={classes.icon}>
                    {scoreToMedal(parsedOutput?.passed, parsedOutput?.total)}
                  </SvgIcon>
                </Grid>

                <Grid item>
                  <SvgIcon className={classes.icon}>
                    {languageToIcon(language_id)}
                  </SvgIcon>
                </Grid>
                <Grid item>
                  <Chip label={algo} variant="outlined" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body1"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {answerDescription}
                  </Typography>{" "}
                </Grid>
              </Grid>
              <Grid container direction="row">
                <Grid item xs={8}>
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

                <Grid item xs={4}>
                  <Box
                    style={{
                      maxHeight: editorHeight,
                      height: "100%",
                      width: "100%",
                      backgroundColor: "#1d1e18",
                      color: "#999",
                      padding: 16,
                      overflowY: "scroll",
                    }}
                  >
                    {getOutput().map((line, index) =>
                      typeof line === "string" ? (
                        <Typography
                          key={index}
                          style={{ ...firaCodeStyle, color: "#999" }}
                        >
                          {line}
                        </Typography>
                      ) : (
                        <div key={index}>
                          {line.tooltip ? (
                            <HtmlTooltip
                              title={
                                <Box
                                  style={{
                                    ...firaCodeStyle,
                                    fontSize: 14,
                                    padding: 8,
                                  }}
                                >
                                  <span style={{ color: "#6db1fe" }}>
                                    twoSum
                                  </span>
                                  (
                                  <span style={{ color: "#d9522d" }}>
                                    {JSON.stringify(line.arr)}
                                  </span>
                                  ,
                                  <span style={{ color: "#2d419f" }}>
                                    {JSON.stringify(line.target)}
                                  </span>
                                  )
                                </Box>
                              }
                            >
                              <Typography
                                style={{
                                  ...firaCodeStyle,
                                  color: line.color,
                                  display: "inline",
                                }}
                              >
                                {line.text}
                              </Typography>
                            </HtmlTooltip>
                          ) : (
                            <Typography
                              style={{
                                ...firaCodeStyle,
                                color: line.color,
                                display: "inline",
                              }}
                            >
                              {line.text}
                            </Typography>
                          )}
                          <Typography
                            style={{
                              ...firaCodeStyle,
                              color: line.msColor,
                              display: "inline",
                            }}
                          >
                            {line.executionTime}
                          </Typography>
                        </div>
                      )
                    )}
                  </Box>
                </Grid>
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
              <Grid item>
                <Select
                  placeholder={`Select Language`}
                  options={langs}
                  value={langs.find((obj) => obj.value === editedLanguage)}
                  onChange={(e) => handleLangChange(e)}
                />
              </Grid>
              <Grid item>
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
              <Grid item xs={2}>
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
              <Grid item xs={10}>
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
        {tags && (
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
        )}
        <div className={classes.bottomWrapper}>
          {!editAnsOpen && (
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
          <PostedByUser
            username={author.username}
            fullName={author.fullName}
            userId={author.id}
            createdAt={createdAt}
            updatedAt={updatedAt}
            filledVariant={true}
            isAnswer={isAnswer}
          />
        </div>
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

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);
