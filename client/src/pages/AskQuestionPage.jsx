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
  const [body, setBody] = useState(editValues ? editValues.body : "");
  const [tagsOptions, setTagsOptions] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const { register, handleSubmit, reset, errors } = useForm({
    // defaultValues: {
    //   title: editValues ? editValues.title : "",
    //   body: editValues ? editValues.body : "",
    // },
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
      console.log(data.getAllTags);
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

  const postQuestion = async () => {
    if (tags.length === 0)
      return setErrorMsg("At least one tag must be added.");
    const tagArray = tags.map((tag) => (tag?.tagName ? tag.tagName : tag));
    console.log("postQuestion", tagArray);

    let response = await addQuestion({
      variables: {
        title: "Two Sum",
        question_preview:
          "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
        body: ` <div><p>Provided with an integer list <code>arr</code> and a separate integer <code>sum</code>, identify and return <em>the indices of two distinct numbers that together yield <code>sum</code></em>.</p>
        <p>It is assumed that every input will have <strong><em>just one unique solution</em></strong>, and the <em>identical</em> element should not be utilized twice.</p>
        <p>The solution can be given in any sequence.</p>
        <p>&nbsp;</p>
        <p><strong class="example">Example 1:</strong></p>
        <pre><strong>Input:</strong> arr = [1,9,10,16], sum = 11
        <strong>Output:</strong> [0,2]
        <strong>Explanation:</strong> As arr[0] + arr[2] == 11, we return [0, 2].
        </pre>
        <p><strong class="example">Example 2:</strong></p>
        <pre><strong>Input:</strong> arr = [4,1,5], sum = 6
        <strong>Output:</strong> [1,2]
        </pre>
        <p><strong class="example">Example 3:</strong></p>
        <pre><strong>Input:</strong> arr = [2,2], sum = 4
        <strong>Output:</strong> [0,1]
        </pre>
        <p>&nbsp;</p>
        <p><strong>Constraints:</strong></p>
        <ul>
          <li><code>2 &lt;= arr.length &lt;= 10<sup>4</sup></code></li>
          <li><code>-10<sup>9</sup> &lt;= arr[i] &lt;= 10<sup>9</sup></code></li>
          <li><code>-10<sup>9</sup> &lt;= sum &lt;= 10<sup>9</sup></code></li>
          <li><strong>There exists one unique solution.</strong></li>
        </ul>
        <p>&nbsp;</p>
        <strong>Additional Question:&nbsp;</strong>Are you capable of developing an algorithm with a time complexity less than <code>O(n<sup>2</sup>)&nbsp;</code>?</div>`,
        tags: tagArray,
        url: "https://www.youtube.com/embed/KLlXCFG5TnA",
        team: "frum_devs",
        start_time: new Date(),
        //48 hours from now
        end_time: new Date(Date.now() + 48 * 60 * 60 * 1000),
        languages: [
          {
            name: "javascript",
            default_code: `/**
            * @param {number[]} arr
            * @param {number} target
            * @return {number[]}
            */
            var twoSum = function(arr, target) {
                
            };`,
            eval_function: `  function runTests(testCases) {
              let passed = 0;
              let total = testCases.length;
              let outputCases = [];
          
              let originalConsoleLog = console.log; // Store original console.log function
          
              testCases.forEach((tc, index) => {
                  let consoles = []; // Array to hold console.log messages for this test case
                  console.log = function(...args) { // Override console.log
                    consoles.push(args); // Append arguments to consoles array
                  };
          
                  let arr = JSON.parse(tc.arr);
                  let target = JSON.parse(tc.target);
                  let expected = JSON.parse(tc.expected);
          
                  let result;
                  let isPassed;
                  let startTime = new Date().getTime(); // Capture start time
                  try {
                      result = twoSum(arr, target);
                      isPassed = JSON.stringify(result) === JSON.stringify(expected);
                      if (isPassed) {
                          passed++;
                      }
                  } catch (e) {
                      result = e.toString();
                      isPassed = false;
                  }
                  let endTime = new Date().getTime(); // Capture end time
          
                  let executionTime = endTime - startTime; // Calculate execution time
          
                  outputCases.push({index, arr, target, expected, output: result, isPassed, executionTime, consoles});
              });
          
              console.log = originalConsoleLog; // Restore original console.log
          
              return { passed, total, outputCases };
            } `,

            answer_cases: [
              {
                arr: "[2, 7, 11, 15]",
                target: "9",
                expected: "[0, 1]",
              },
              {
                arr: "[3, 2, 4]",
                target: "6",
                expected: "[1, 2]",
              },
              {
                arr: "[3, 3]",
                target: "6",
                expected: "[0, 1]",
              },
              {
                arr: "[0, 4, 3, 0]",
                target: "0",
                expected: "[0, 3]",
              },
              {
                arr: "[-1, -2, -3, -4, -5]",
                target: "-8",
                expected: "[2, 4]",
              },
              {
                arr: "[1, 3, 4, 2]",
                target: "6",
                expected: "[2, 3]",
              },
              {
                arr: "[1, 6, 4, 2]",
                target: "3",
                expected: "[0, 3]",
              },
              {
                arr: "[3, 5]",
                target: "8",
                expected: "[0, 1]",
              },
              {
                arr: "[3, 2, 4, 2]",
                target: "4",
                expected: "[1, 3]",
              },
              {
                arr: "[1, 2, 3, 4, 5, 6, 7, 8, 9]",
                target: "17",
                expected: "[7, 8]",
              },
            ],
          },
        ],
      },
      update: (_, { data }) => {
        history.push(`/questions/${data.postQuestion.id}`);
        reset();
        notify("Question posted!");
      },
    });
    // console.log(response.data.postQuestion.default_code);
    // let quesId = await response.data.postQuestion.id;

    // addAnswer({
    //   variables: {
    //     quesId,
    //     body: response.data.postQuestion.default_code,
    //     ai: "davinci",
    //   },
    //   update: (proxy, { data }) => {
    //     reset();

    //     const dataInCache = proxy.readQuery({
    //       query: VIEW_QUESTION,
    //       variables: { quesId },
    //     });

    //     const updatedData = {
    //       ...dataInCache.viewQuestion,
    //       answers: data.postAnswer,
    //     };

    //     proxy.writeQuery({
    //       query: VIEW_QUESTION,
    //       variables: { quesId },
    //       data: { viewQuestion: updatedData },
    //     });

    //     notify("Answer submitted!");
    //   },
    // });
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
  const getTags = async () => {
    console.log("getTags");
    setTags(["array", "string", "math"]);
    const response = await axios("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`,
      },
      data: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `Given the following problem:
  
          Title: ${title}
          Body: ${body}
          Tags: ${tags}
        
           Please generate a similar but distinct problem by rewriting the title, body, and generating new appropriate tags.
           Please ensure that the new problem does not deviate too much from the original one, as the solution video for the original problem should also be applicable to the new problem but understood by all.
           The new title should consist of at mst four words. Tags should be one word or, if multiple words are necessary, they should be connected with underscores instead of spaces.



  Format the response as follows:

        
          {{
          "title": "{rewrite_title}",
          "body": "{rewrite_body}",
          "tags": "{rewrite_tags}"
          }} `,
          },
        ],
        model: "gpt-4",
        max_tokens: 1000,
        temperature: 0.6,
      }),
    });

    if (response.status >= 200 && response.status < 300) {
      console.log(response);
      const text = response.data.choices[0].message.content.trim();
      if (text.startsWith("{") && text.endsWith("}")) {
        // Escape control characters
        let jsonString = text
          .replace(/\n/g, "\\n")
          .replace(/\r/g, "\\r")
          .replace(/\t/g, "\\t");

        let parsedObject;
        try {
          parsedObject = JSON.parse(jsonString);
        } catch (e) {
          console.error(e);
        }

        // Now you can access the properties of the object
        if (parsedObject) {
          console.log(parsedObject.title);
          setTitle(parsedObject.title);
          setBody(
            parsedObject.body
              .replace(/\\n/g, "\n")
              .replace(/\\r/g, "\r")
              .replace(/\\t/g, "\t")
          );
          setTags(parsedObject.tags).split(",");
        } else {
          console.log("parsedObject is null");
        }
      } else {
        console.log("text does not start with { and end with }");
        console.log(text);
      }
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
          <Typography variant="caption" color="secondary">
            A simple and to-the-point title works best
          </Typography>
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <div></div>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className={classes.inputWrapper}>
          <Typography variant="caption" color="secondary">
            Include all the information someone would need to answer your
            question
          </Typography>
          <TextField
            required
            multiline
            rows={5}
            fullWidth
            onChange={(e) => setBody(e.target.value)}
            value={body}
            name="body"
            placeholder="Question body"
            type="text"
            label="Body"
            variant="outlined"
            size="small"
            error={"body" in errors}
            helperText={"body" in errors ? errors.body.message : ""}
            className={classes.inputField}
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
              console.log("setting 349", value);

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
          <IconButton aria-label="get-tags" onClick={getTags}>
            🤖
          </IconButton>
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
