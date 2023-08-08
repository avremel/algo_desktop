import { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useLazyQuery } from "@apollo/client";
import { VIEW_QUESTION } from "../graphql/queries";
import { useStateContext } from "../context/state";
import { useAuthContext } from "../context/auth";
import QuesPageContent from "../components/QuesPageContent";
import RightSidePanel from "../components/RightSidePanel";
import AuthFormModal from "../components/AuthFormModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatDateAgo, getErrorMsg } from "../utils/helperFuncs";

import {
  Typography,
  Button,
  Divider,
  Grid,
  useMediaQuery,
  Container,
} from "@material-ui/core";
import { useQuesPageStyles } from "../styles/muiStyles";
import { useTheme } from "@material-ui/core/styles";

const QuestionPage = () => {
  const { clearEdit, notify } = useStateContext();
  const { user } = useAuthContext();
  console.log({ user });
  const { quesId } = useParams();
  const [question, setQuestion] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const classes = useQuesPageStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const [fetchQuestion, { data, loading }] = useLazyQuery(VIEW_QUESTION, {
    onError: (err) => {
      notify(getErrorMsg(err), "error");
    },
  });

  useEffect(() => {
    fetchQuestion({ variables: { quesId } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quesId]);

  useEffect(() => {
    if (data) {
      console.log(data.viewQuestion);
      setQuestion(data.viewQuestion);
      setHasAnswered(
        data.viewQuestion.answers.some((ans) => ans.author.id === user?.id) ||
          false
      );
    }
  }, [data]);

  if (loading || !question) {
    return (
      <div style={{ minWidth: "100%", marginTop: "20%" }}>
        <LoadingSpinner size={80} />
      </div>
    );
  }

  const { title, views, createdAt, updatedAt } = question;

  return hasAnswered || user === null ? (
    <Container disableGutters>
      <div className={classes.root}>
        <div className={classes.topBar}>
          <div className={classes.titleWrapper}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              color="secondary"
              style={{ wordWrap: "anywhere" }}
            >
              {title}
            </Typography>
          </div>
          <div className={classes.quesInfo}>
            <Typography variant="caption" style={{ marginRight: 10 }}>
              Asked <strong>{formatDateAgo(createdAt)} ago</strong>
            </Typography>
            {createdAt !== updatedAt && (
              <Typography variant="caption" style={{ marginRight: 10 }}>
                Edited <strong>{formatDateAgo(updatedAt)} ago</strong>
              </Typography>
            )}
            <Typography variant="caption">
              Viewed <strong>{views} times</strong>
            </Typography>
          </div>
        </div>
        <Divider />
        <Grid container direction="row" wrap="nowrap" justify="space-between">
          <QuesPageContent
            question={question}
            hasAnswered={hasAnswered}
            setHasAnswered={setHasAnswered}
          />
        </Grid>
      </div>
    </Container>
  ) : (
    <div className={classes.root}>
      <div className={classes.topBar}>
        <div className={classes.titleWrapper}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            color="secondary"
            style={{ wordWrap: "anywhere" }}
          >
            {title}
          </Typography>
        </div>
        <div className={classes.quesInfo}>
          <Typography variant="caption" style={{ marginRight: 10 }}>
            Asked <strong>{formatDateAgo(createdAt)} ago</strong>
          </Typography>
          {createdAt !== updatedAt && (
            <Typography variant="caption" style={{ marginRight: 10 }}>
              Edited <strong>{formatDateAgo(updatedAt)} ago</strong>
            </Typography>
          )}
          <Typography variant="caption">
            Viewed <strong>{views} times</strong>
          </Typography>
        </div>
      </div>
      <Divider />
      <Grid container direction="row" wrap="nowrap" justify="space-between">
        <QuesPageContent question={question} />
      </Grid>
    </div>
  );
};

export default QuestionPage;
