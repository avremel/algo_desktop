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
  } = question;
  const firaCodeStyle = { fontFamily: "'Fira Code', monospace" };

  const { user } = useAuthContext();
  const { setEditValues, notify } = useStateContext();
  const history = useHistory();
  const classes = useQuesPageStyles();

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
        <Grid item xs={12}>
          <div>
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
          <AnswerForm quesId={quesId} tags={tags} />
        )}
      </Grid>
    </div>
  );
};

export default QuesPageContent;
