import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_TAGS } from "../graphql/queries";
import {
  POST_QUESTION,
  EDIT_QUESTION,
  POST_ANSWER,
} from "../graphql/mutations";
import { VIEW_QUESTION } from "../graphql/queries";
import { useStateContext } from "../context/state";
import ErrorMessage from "../components/ErrorMessage";
import { getErrorMsg } from "../utils/helperFuncs";
import {
  Typography,
  TextField,
  Button,
  InputAdornment,
  Chip,
  IconButton,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useAskQuesPageStyles } from "../styles/muiStyles";
import axios from "axios";

const AskQuestionPage = () => {
  const classes = useAskQuesPageStyles();
  const history = useHistory();
  const { editValues, clearEdit, notify } = useStateContext();
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(editValues ? editValues.tags : []);
  const [title, setTitle] = useState(editValues ? editValues.title : "");
  const [slug, setSlug] = useState(editValues ? editValues.slug : "");
  const [url, setUrl] = useState(editValues ? editValues.url : "");
  const [team, setTeam] = useState(editValues ? editValues.team : "frum_devs");
  const [startTime, setStartTime] = useState(
    editValues ? editValues.start_time : ""
  );
  const [endTime, setEndTime] = useState(editValues ? editValues.end_time : "");

  const [tagsOptions, setTagsOptions] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const { register, handleSubmit, reset, errors } = useForm({
    mode: "onChange",
  });

  const [addQuestion, { loading: addQuesLoading }] = useMutation(
    POST_QUESTION,
    {
      onError: (err) => {
        setErrorMsg(getErrorMsg(err));
      },
    }
  );

  // alias  loading  as tgLoading
  const { data } = useQuery(GET_ALL_TAGS, {
    onError: (err) => {
      notify(getErrorMsg(err), "error");
    },
  });

  useEffect(() => {
    if (data) {
      setTagsOptions(data.getAllTags);
    }
  }, [data]);

  const [updateQuestion, { loading: editQuesLoading }] = useMutation(
    EDIT_QUESTION,
    {
      onError: (err) => {
        setErrorMsg(getErrorMsg(err));
      },
    }
  );
  const formatDateTimeForBackend = (dateTimeStr) => {
    const dateObj = new Date(dateTimeStr);
    return dateObj.toISOString();
  };

  const convertToEmbedURL = (url) => {
    // Use a regular expression to match various YouTube URL formats
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([\w\-]{10,12}).*/;
    const match = url.match(regex);

    return match && match[1]
      ? `https://www.youtube.com/embed/${match[1]}`
      : null;
  };
  const postQuestion = async () => {
    if (tags.length === 0)
      return setErrorMsg("At least one tag must be added.");
    const tagArray = tags.map((tag) => (tag?.tagName ? tag.tagName : tag));

    let response = await addQuestion({
      variables: {
        title,
        slug,
        tags: tagArray,
        url: convertToEmbedURL(url),
        team,
        start_time: formatDateTimeForBackend(startTime),
        end_time: formatDateTimeForBackend(endTime),
      },
      update: (_, { data }) => {
        history.push(`/questions/${data.postQuestion.id}`);
        reset();
        notify("Question posted!");
      },
    });
  };

  const editQuestion = ({ title, body }) => {
    if (tags.length === 0)
      return setErrorMsg("At least one tag must be added.");

    updateQuestion({
      variables: { quesId: editValues.quesId, title, body, tags },
      update: (_, { data }) => {
        history.push(`/questions/${data.editQuestion.id}`);
        clearEdit();
        notify("Question edited!");
      },
    });
  };

  const handleTags = (e) => {
    if (!e || (!e.target.value && e.target.value !== "")) return;
    const value = e.target.value.toLowerCase().trim();
    setTagInput(value);

    const keyCode = e.target.value
      .charAt(e.target.selectionStart - 1)
      .charCodeAt();

    if (keyCode === 32 && value.trim() !== "") {
      if (tags.includes(value))
        return setErrorMsg(
          "Duplicate tag found! You can't add the same tag twice."
        );
      setTags((prevTags) => [...prevTags, value]);
      setTagInput("");
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h5" color="secondary">
        {editValues ? "Edit Your Question" : "Ask A Question"}
      </Typography>
      <form
        className={classes.quesForm}
        onSubmit={
          editValues ? handleSubmit(editQuestion) : handleSubmit(postQuestion)
        }
      >
        <div className={classes.inputWrapper}>
          <TextField
            required
            fullWidth
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            name="title"
            placeholder="Question title"
            type="text"
            label="Title"
            variant="outlined"
            size="small"
            error={"title" in errors}
            helperText={"title" in errors ? errors.title.message : ""}
            className={classes.inputField}
          />
        </div>
        <div className={classes.inputWrapper}>
          <TextField
            required
            fullWidth
            onChange={(e) => setSlug(e.target.value)}
            value={slug}
            name="slug"
            placeholder="Question slug"
            type="text"
            label="Slug"
            variant="outlined"
            size="small"
            className={classes.inputField}
          />
        </div>
        <div className={classes.inputWrapper}>
          <TextField
            required
            fullWidth
            onChange={(e) => setUrl(e.target.value)}
            value={url}
            name="url"
            placeholder="video url"
            type="text"
            label="video Url"
            variant="outlined"
            size="small"
            className={classes.inputField}
          />
        </div>
        <div className={classes.inputWrapper}>
          <TextField
            required
            fullWidth
            onChange={(e) => setTeam(e.target.value)}
            value={team}
            name="team"
            placeholder="team"
            type="text"
            label="team"
            variant="outlined"
            size="small"
            className={classes.inputField}
          />
        </div>
        {/* Start Time */}
        <div className={classes.inputWrapper}>
          <TextField
            required
            onChange={(e) => setStartTime(e.target.value)}
            value={startTime}
            name="start_time"
            label="Start Time"
            type="datetime-local"
            variant="outlined"
            size="small"
            className={classes.inputField}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            required
            onChange={(e) => setEndTime(e.target.value)}
            value={endTime}
            name="end_time"
            label="End Time"
            type="datetime-local"
            variant="outlined"
            size="small"
            className={classes.inputField}
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div className={classes.inputWrapper}>
          <Typography variant="caption" color="secondary">
            Enter space button to add tags, Algorithm name, pattern etc.
          </Typography>
          <Autocomplete
            multiple
            freeSolo
            options={tagsOptions}
            getOptionLabel={(option) => option.tagName}
            value={tags}
            inputValue={tagInput}
            onInputChange={(e, value) => handleTags(e, value)}
            onChange={(e, value, reason) => {
              setTags(value?.tagname || value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Tags"
                placeholder="Enter space button to add tags"
                onKeyDown={handleTags}
                fullWidth
                className={classes.inputField}
                size="small"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option?.tagName || option}
                  color="primary"
                  size="small"
                  {...getTagProps({ index })}
                />
              ))
            }
          />
        </div>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          size="large"
          className={classes.submitBtn}
          disabled={addQuesLoading || editQuesLoading}
        >
          {editValues ? "Update Your Question" : "Post Your Question"}
        </Button>
        <ErrorMessage
          errorMsg={errorMsg}
          clearErrorMsg={() => setErrorMsg(null)}
        />
      </form>
    </div>
  );
};

export default AskQuestionPage;
