import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { POST_ANSWER } from "../graphql/mutations";
import { VIEW_QUESTION } from "../graphql/queries";
import AceEditor from "react-ace";
import beautify from "js-beautify";
import Select from "react-select";
import axios from "axios";
import { Button, Grid, Box, TextField, Tooltip } from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateContext } from "../context/state";
import { getErrorMsg } from "../utils/helperFuncs";
import { themes, langs } from "../constants/languageOptions";

const CodeEditorWindow = ({ onChange, code, setCode, quesId }) => {
  const defaultTheme = themes[Math.floor(Math.random() * themes.length)].value;
  const [lang, setLang] = useState("javascript");
  const [acceptedSolution, setAcceptedSolution] = useState();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : defaultTheme;
  });
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    function handleMessage(event) {
      if (
        event.data.extension === "algoTeams" &&
        event.data.event === "accepted"
      ) {
        const objSubmission = JSON.parse(event.data.submission);

        setCode(objSubmission.typed_code);
        setLang(objSubmission.lang);
      } else if (
        event.data.extension === "algoTeams" &&
        event.data.event === "acceptedAnswer"
      ) {
        setAcceptedSolution(event.data.acceptedSolution);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const [algo, setAlgo] = useState("");
  const [answerDescription, SetAnswerDescription] = useState("");

  const { notify } = useStateContext();

  const [addAnswer, { loading }] = useMutation(POST_ANSWER, {
    onError: (err) => {
      notify(getErrorMsg(err), "error");
    },
  });

  const postAnswer = async () => {
    const formattedCode = beautify.js(code);
    console.log("acceptedSolution", acceptedSolution);
    addAnswer({
      variables: {
        quesId,
        algo,
        answerDescription,
        theme,
        code: btoa(formattedCode),
        ...acceptedSolution,
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

  function handleThemeChange(theme) {
    setTheme(theme.value);
  }
  const handleEditorChange = (value) => {
    setCode(value);
    onChange("code", value);
  };

  return (
    <Box style={{ paddingLeft: "10px", width: "625px" }}>
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

      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button
            disabled={
              loading ||
              !code ||
              !algo ||
              !answerDescription ||
              !acceptedSolution
            }
            size="small"
            color="secondary"
            variant="contained"
            type="submit"
            onClick={postAnswer}
          >
            Submit answer
          </Button>
        </Grid>
        <Grid item xs>
          <Select
            placeholder={`Select Theme`}
            options={themes}
            value={themes.find((obj) => obj.value === theme)}
            onChange={(e) => handleThemeChange(e)}
            styles={{
              menu: (provided) => ({ ...provided, zIndex: 9999 }),
            }}
          />
        </Grid>
      </Grid>

      <Box width={1} style={{ marginTop: "1em" }}>
        <AceEditor
          placeholder="// On leetcode submit will add your code here"
          mode={lang}
          theme={theme}
          name="blah2"
          onChange={handleEditorChange}
          fontSize={22}
          width="625px"
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
      </Box>
    </Box>
  );
};

export default CodeEditorWindow;
