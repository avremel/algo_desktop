import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { POST_ANSWER } from "../graphql/mutations";
import { VIEW_QUESTION } from "../graphql/queries";
import AceEditor from "react-ace";
import beautify from "js-beautify";
import Select from "react-select";
import axios from "axios";
import {
  Divider,
  Button,
  Grid,
  Menu,
  MenuItem,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Chip,
  Typography,
} from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateContext } from "../context/state";
import { getErrorMsg } from "../utils/helperFuncs";
import { themes, langs } from "../constants/languageOptions";

const CodeEditorWindow = ({
  onChange,
  language,
  code,
  setCode,
  evalFunction,
  answerCases,
  setLanguage,
  setOutputDetails,
  quesId,
}) => {
  const firaCodeStyle = { fontFamily: "'Fira Code', monospace" };

  const defaultTheme = themes[Math.floor(Math.random() * themes.length)].value;

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : defaultTheme;
  });
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [modalOpen, setModalOpen] = useState(false);
  const [responseData, setResponseData] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [testCaseDialogOpen, setTestCaseDialogOpen] = useState(false);
  const [editingCaseIndex, setEditingCaseIndex] = useState(-1);
  const [arr, setNums] = useState(null);
  const [algo, setAlgo] = useState("");
  const [answerDescription, SetAnswerDescription] = useState("");
  const [targetNum, setTargetNum] = useState(null);
  const [expectedAnswer, setExpectedAnswer] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [testCases, setTestCases] = useState([]);

  useEffect(() => {
    setTestCases(
      answerCases.slice(0, 3).map((ac) => {
        return {
          arr: JSON.parse(ac.arr),
          target: JSON.parse(ac.target),
          expected: JSON.parse(ac.expected),
        };
      })
    );
  }, [answerCases]);

  const [processing, setProcessing] = useState(null);
  const { notify } = useStateContext();

  const [addAnswer, { loading }] = useMutation(POST_ANSWER, {
    onError: (err) => {
      notify(getErrorMsg(err), "error");
    },
  });

  const postAnswer = async (output) => {
    const formattedCode = beautify.js(code);

    addAnswer({
      variables: {
        quesId,
        algo,
        answerDescription,
        theme,
        code: btoa(formattedCode),
        output: output.stdout,
        language_id: output.language_id,
      },
      update: (proxy, { data }) => {
        const dataInCache = proxy.readQuery({
          query: VIEW_QUESTION,
          variables: { quesId },
        });

        const updatedData = {
          ...dataInCache.viewQuestion,
          answers: data.postAnswer,
        };

        proxy.writeQuery({
          query: VIEW_QUESTION,
          variables: { quesId },
          data: { viewQuestion: updatedData },
        });

        notify("Answer submitted!");
      },
    });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLangChange = (sl) => {
    setLanguage(sl.value);
  };

  function handleThemeChange(theme) {
    setTheme(theme.value);
  }
  const handleEditorChange = (value) => {
    setCode(value);
    onChange("code", value);
  };
  const compileTestCases = () => {
    var testInput = testCases.map((tc) => {
      return {
        arr: JSON.stringify(tc.arr),
        target: JSON.stringify(tc.target),
        expected: JSON.stringify(tc.expected),
      };
    });

    handleCompile(testInput, "test");
  };

  const compileRunCases = () => {
    handleCompile(answerCases, "submit");
  };
  const handleCompile = (testInputs, action) => {
    setProcessing(true);

    const fullCode = `
    ${code}
    ${evalFunction}
    console.log(JSON.stringify(runTests(${JSON.stringify(testInputs)})));
`;
    submitCode(fullCode, action);
  };

  const submitCode = async (fullCode, action) => {
    const formData = {
      language_id: 63, // 63 is for JavaScript (Node.js)
      source_code: btoa(fullCode),
    };
    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        const token = response.data.token;
        checkStatus(token, action);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response.status;
        if (status === 429) {
          console.log("too many requests", status);

          showErrorToast(
            `Quota of 100 requests exceeded for the Day!  `,
            10000
          );
        }
        setProcessing(false);
        console.log("catch block...", error);
      });
  };
  const checkStatus = async (token, action) => {
    const options = {
      method: "GET",
      url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token, action);
        }, 1000);
        return;
      } else if (statusId === 11) {
        showErrorToast(
          `Compilation error! ${response.data.status.description}`
        );
        setOutputDetails(response.data);
        setProcessing(false);
        return;
      } else {
        setProcessing(false);
        console.log("response.data", response.data);
        const { stdout } = response.data;
        const testResults = JSON.parse(atob(stdout));
        const { passed, total, outputCases } = testResults;
        setOutputDetails(outputCases);
        console.log("Test Results:", testResults);
        showSuccessToast(`Compiled Successfully! `);

        if (action === "submit") {
          if (passed === total) {
            postAnswer(response.data);
          } else {
            if (passed < total) {
              setErrorMsg(total - passed + " test cases failed");
              setResponseData(response.data);
              setModalOpen(true);
            } else {
              showErrorToast(
                `Compilation error! ${response.data.status.description}`
              );
            }
          }
        }
        setOutputDetails(outputCases || response.data);
        setProcessing(false);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const openAddTestCaseDialog = () => {
    setTestCaseDialogOpen(true);
    setEditingCaseIndex(-1);
    setNums(JSON.stringify([]));
    setTargetNum(null);
    setExpectedAnswer(null);
  };

  const openEditTestCaseDialog = (index) => {
    setTestCaseDialogOpen(true);
    setEditingCaseIndex(index);
    setNums(JSON.stringify(testCases[index].arr));
    setTargetNum(testCases[index].target);
    setExpectedAnswer(JSON.stringify(testCases[index].expected));
  };

  const handleTestCaseDialogClose = () => {
    setEditingCaseIndex(-1);
    setNums(JSON.stringify([]));
    setTargetNum(null);
    setExpectedAnswer(null);
    setTestCaseDialogOpen(false);
  };

  const handleAddOrEditTestCase = () => {
    const testCase = {
      arr: JSON.parse(arr),
      target: targetNum,
      expected: JSON.parse(expectedAnswer),
    };
    if (editingCaseIndex === -1) {
      // add a new test case
      setTestCases((old) => [...old, testCase]);
    } else {
      // edit an existing test case
      setTestCases((old) => {
        const newTestCases = [...old];
        newTestCases[editingCaseIndex] = testCase;
        return newTestCases;
      });
    }
    handleTestCaseDialogClose();
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={3}
      >
        <Grid item>
          <div>
            <Button
              size="small"
              variant="outlined"
              onClick={handleClick}
              color="secondary"
            >
              Test Cases +
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {testCases.map((testCase, index) => (
                <MenuItem
                  key={index}
                  onClick={() => openEditTestCaseDialog(index)}
                  style={{ ...firaCodeStyle }}
                >
                  <span style={{ color: "#2d419f" }}>twoSum</span>(
                  <span style={{ color: "#d9522d" }}>
                    {JSON.stringify(testCase.arr)}
                  </span>{" "}
                  ,{" "}
                  <span style={{ color: "#14fbdc" }}>
                    {JSON.stringify(testCase.target)}
                  </span>
                  )
                </MenuItem>
              ))}
              <MenuItem onClick={openAddTestCaseDialog}>
                Add a test case
              </MenuItem>
            </Menu>
          </div>
        </Grid>

        <Grid item>
          <Button
            onClick={compileTestCases}
            disabled={!code}
            variant="contained"
            size="small"
            color="secondary"
          >
            {processing ? `Processing 1/${testCases.length}` : "Run test cases"}
          </Button>
        </Grid>

        <Grid item>
          <Select
            placeholder={`Select Language`}
            options={langs}
            value={langs.find((obj) => obj.value === language)}
            onChange={(e) => handleLangChange(e)}
          />
        </Grid>
        <Grid item>
          <Select
            placeholder={`Select Theme`}
            options={themes}
            value={themes.find((obj) => obj.value === theme)}
            onChange={(e) => handleThemeChange(e)}
          />
        </Grid>
        <Grid item>
          <Button
            disabled={loading || !code || !algo || !answerDescription}
            size="small"
            color="secondary"
            variant="contained"
            style={{ marginTop: "0.8em" }}
            type="submit"
            onClick={compileRunCases}
          >
            {processing ? `Processing 1/10` : "Submit answer"}
          </Button>
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
              value={algo}
              onChange={(e) => setAlgo(e.target.value)}
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
              value={answerDescription}
              onChange={(e) => SetAnswerDescription(e.target.value)}
            />
          </Box>
        </Grid>
      </Grid>
      <Divider />
      <AceEditor
        placeholder="// Start Coding Here"
        mode="javascript"
        theme={theme}
        name="blah2"
        onChange={handleEditorChange}
        fontSize={24}
        width="99.90%"
        height="90%"
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={code}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: false,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
      <Dialog open={testCaseDialogOpen} onClose={handleTestCaseDialogClose}>
        <DialogTitle>
          {editingCaseIndex === -1 ? "Add Test Case" : "Edit Test Case"}
        </DialogTitle>
        <DialogTitle>
          <span style={{ color: "#2d419f", ...firaCodeStyle }}>twoSum</span>(
          <span style={{ color: "#d9522d", ...firaCodeStyle }}>{arr}</span> ,{" "}
          <span style={{ color: "#14fbdc", ...firaCodeStyle }}>
            {JSON.stringify(targetNum)}
          </span>
          )
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the arr as a array , target , and expected answer for
            the test case.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="arr"
            label="arr = [..., ..., ...]"
            style={{ ...firaCodeStyle }}
            fullWidth
            value={arr}
            onChange={(e) => setNums(e.target.value)}
          />
          <TextField
            margin="dense"
            id="targetNum"
            label="target"
            fullWidth
            value={targetNum}
            onChange={(e) => setTargetNum(Number(e.target.value))}
          />
          <TextField
            margin="dense"
            id="expectedAnswer"
            label="expected output"
            fullWidth
            value={expectedAnswer}
            onChange={(e) => setExpectedAnswer(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTestCaseDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddOrEditTestCase} color="primary">
            {editingCaseIndex === -1 ? "Add" : "Edit"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>{errorMsg}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Are you sure you want to submit your answer?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => setModalOpen(false)}
            color="primary"
            variant="outlined"
          >
            Go back
          </Button>
          <Button
            onClick={() => postAnswer(responseData)}
            color="primary"
            variant="outlined"
          >
            Submit with a need help flag
          </Button>
        </DialogActions>
      </Dialog>
      ;
    </>
  );
};

export default CodeEditorWindow;
