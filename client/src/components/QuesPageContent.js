import { useState } from "react";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { useMutation } from "@apollo/client";
import AceEditor from "react-ace";
import {
  VOTE_QUESTION,
  DELETE_QUESTION,
  ADD_QUES_COMMENT,
  EDIT_QUES_COMMENT,
  DELETE_QUES_COMMENT,
} from "../graphql/mutations";
import { VIEW_QUESTION } from "../graphql/queries";
import { useAuthContext } from "../context/auth";
import { useStateContext } from "../context/state";
import QuesAnsDetails from "./QuesAnsDetails";
import AnswerList from "./AnswerList";
import AnswerForm from "./AnswerForm";
import { upvote, downvote } from "../utils/voteQuesAns";
import { getErrorMsg } from "../utils/helperFuncs";
import { Divider, Grid, Button, Box, Typography } from "@material-ui/core";
import { useQuesPageStyles } from "../styles/muiStyles";
import AuthFormModal from "./AuthFormModal";

const Line = ({ text, color }) => (
  <Typography
    variant="body2"
    style={{
      color: color || "white",
      fontFamily: "monospace",
      fontSize: "0.75rem",
      lineHeight: "1.5",
    }}
  >
    {text}
  </Typography>
);

const QuesPageContent = ({ question, hasAnswered, setHasAnswered }) => {
  const {
    id: quesId,
    answers,
    acceptedAnswer,
    upvotedBy,
    downvotedBy,
    title,
    body,
    tags,
    author,
    languages,
  } = question;
  const firaCodeStyle = { fontFamily: "'Fira Code', monospace" };

  const { user } = useAuthContext();
  const { setEditValues, notify } = useStateContext();
  const history = useHistory();
  const classes = useQuesPageStyles();
  const [outputDetails, setOutputDetails] = useState(null);

  const getOutput = () => {
    if (outputDetails === null) return [];

    let output = [
      "test twoSum",
      "> building source...",
      "> executing " + outputDetails?.length + " tests...",
    ];

    let failedCaseEncountered = false;

    outputDetails?.forEach((detail, index) => {
      if (!failedCaseEncountered) {
        if (detail.consoles.length > 0) {
          console.log("detail.consoles", detail.consoles);
          detail.consoles.forEach((console, index) => {
            output.push({
              color: "#fff",
              text: `> ${JSON.stringify(console[0])}`,
            });
          });
        }
        let isPassed = detail.isPassed
          ? {
              text: `test_${index} [PASS] `,
              executionTime: `${detail.executionTime}ms`,
              color: "#14fbdc",
              msColor: "#6db1fe",
            }
          : {
              text: `test_${index} [FAIL] `,
              executionTime: `${detail.executionTime}ms`,
              color: "#ffb76b",
              msColor: "#6db1fe",
            };
        output.push(isPassed);

        if (!detail.isPassed) {
          failedCaseEncountered = true;
          output.push({
            color: "#ffb76b",
            text: `├── expect: ${JSON.stringify(detail.expected)}`,
          });
          output.push({
            color: "#ffb76b",
            text: `└── actual: ${JSON.stringify(detail.output)}`,
          });
        }
      }
    });

    return output;
  };
  const [submitVote] = useMutation(VOTE_QUESTION, {
    onError: (err) => {
      notify(getErrorMsg(err), "error");
    },
  });

  const [removeQuestion] = useMutation(DELETE_QUESTION, {
    onError: (err) => {
      notify(getErrorMsg(err), "error");
    },
  });

  const [postQuesComment] = useMutation(ADD_QUES_COMMENT, {
    onError: (err) => {
      notify(getErrorMsg(err), "error");
    },
  });

  const [updateQuesComment] = useMutation(EDIT_QUES_COMMENT, {
    onError: (err) => {
      notify(getErrorMsg(err), "error");
    },
  });

  const [removeQuesComment] = useMutation(DELETE_QUES_COMMENT, {
    onError: (err) => {
      notify(getErrorMsg(err), "error");
    },
  });

  const upvoteQues = () => {
    const { updatedUpvotedArr, updatedDownvotedArr, updatedPoints } = upvote(
      upvotedBy,
      downvotedBy,
      user
    );

    submitVote({
      variables: { quesId, voteType: "UPVOTE" },
      optimisticResponse: {
        __typename: "Mutation",
        voteQuestion: {
          __typename: "Question",
          id: quesId,
          upvotedBy: updatedUpvotedArr,
          downvotedBy: updatedDownvotedArr,
          points: updatedPoints,
        },
      },
    });
  };

  const downvoteQues = () => {
    const { updatedUpvotedArr, updatedDownvotedArr, updatedPoints } = downvote(
      upvotedBy,
      downvotedBy,
      user
    );

    submitVote({
      variables: { quesId, voteType: "DOWNVOTE" },
      optimisticResponse: {
        __typename: "Mutation",
        voteQuestion: {
          __typename: "Question",
          id: quesId,
          upvotedBy: updatedUpvotedArr,
          downvotedBy: updatedDownvotedArr,
          points: updatedPoints,
        },
      },
    });
  };

  const editQues = () => {
    setEditValues({ quesId, title, body, tags });
    history.push("/ask");
  };

  const deleteQues = () => {
    removeQuestion({
      variables: { quesId },
      update: () => {
        history.push("/");
        notify("Question deleted!");
      },
    });
  };

  const addQuesComment = (commentBody) => {
    postQuesComment({
      variables: { quesId, body: commentBody },
      update: (proxy, { data }) => {
        const dataInCache = proxy.readQuery({
          query: VIEW_QUESTION,
          variables: { quesId },
        });

        const updatedData = {
          ...dataInCache.viewQuestion,
          comments: data.addQuesComment,
        };

        proxy.writeQuery({
          query: VIEW_QUESTION,
          variables: { quesId },
          data: { viewQuestion: updatedData },
        });

        notify("Comment added to question!");
      },
    });
  };

  const editQuesComment = (editedCommentBody, commentId) => {
    updateQuesComment({
      variables: { quesId, commentId, body: editedCommentBody },
      update: () => {
        notify("Comment edited!");
      },
    });
  };

  const deleteQuesComment = (commentId) => {
    removeQuesComment({
      variables: { quesId, commentId },
      update: (proxy, { data }) => {
        const dataInCache = proxy.readQuery({
          query: VIEW_QUESTION,
          variables: { quesId },
        });

        const filteredComments = dataInCache.viewQuestion.comments.filter(
          (c) => c.id !== data.deleteQuesComment
        );

        const updatedData = {
          ...dataInCache.viewQuestion,
          comments: filteredComments,
        };

        proxy.writeQuery({
          query: VIEW_QUESTION,
          variables: { quesId },
          data: { viewQuestion: updatedData },
        });

        notify("Comment deleted!");
      },
    });
  };

  return (
    <div
      className={classes.content}
      style={{ height: "85vh", overflowY: "auto", overflowX: "hidden" }}
    >
      <Grid container spacing={2}>
        <Grid item xs={hasAnswered || user === null ? 12 : 5}>
          {!hasAnswered && user !== null ? (
            <div
              style={{
                height: "60vh",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <QuesAnsDetails
                quesAns={question}
                upvoteQuesAns={upvoteQues}
                downvoteQuesAns={downvoteQues}
                editQuesAns={editQues}
                deleteQuesAns={deleteQues}
                addComment={addQuesComment}
                editComment={editQuesComment}
                deleteComment={deleteQuesComment}
                isMainQuestion={true}
                hasAnswered={hasAnswered}
              />
            </div>
          ) : (
            <QuesAnsDetails
              quesAns={question}
              upvoteQuesAns={upvoteQues}
              downvoteQuesAns={downvoteQues}
              editQuesAns={editQues}
              deleteQuesAns={deleteQues}
              addComment={addQuesComment}
              editComment={editQuesComment}
              deleteComment={deleteQuesComment}
              isMainQuestion={true}
              hasAnswered={hasAnswered}
            />
          )}
          {!hasAnswered && user !== null && (
            <Box
              style={{
                height: "25vh",
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
                    <Typography
                      style={{
                        ...firaCodeStyle,
                        color: line.color,
                        display: "inline",
                      }}
                    >
                      {line.text}
                    </Typography>
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
          )}
          {(hasAnswered || user === null) && (
            <>
              <Divider />
              <AnswerList
                quesId={quesId}
                answers={answers}
                acceptedAnswer={acceptedAnswer}
                quesAuthor={author}
              />
              {user ? (
                <Button
                  variant="contained"
                  color="primary"
                  size={"small"}
                  onClick={() => setHasAnswered(false)}
                >
                  Answer Question
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  size={"small"}
                  style={{ minWidth: "9em" }}
                >
                  Sign in to Answer
                </Button>
              )}
            </>
          )}
        </Grid>

        {!hasAnswered && user !== null && (
          <Grid item xs={7}>
            <AnswerForm
              quesId={quesId}
              tags={tags}
              languages={languages}
              setOutputDetails={setOutputDetails}
              outputDetails={outputDetails}
            />
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default QuesPageContent;
