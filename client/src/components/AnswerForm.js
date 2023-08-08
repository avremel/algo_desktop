import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import { classnames } from "../utils/general";
import { Link as RouterLink } from "react-router-dom";
import { useAuthContext } from "../context/auth";
import useKeyPress from "../hooks/useKeyPress";
import beautify from "js-beautify";

const defaultLang = "javascript";

const AnswerForm = ({
  quesId,
  tags,
  setOutputDetails,
  languages,
  outputDetails,
}) => {
  const { user } = useAuthContext();

  const [code, setCode] = useState("");
  const [answerCases, setAnswerCases] = useState([]);
  const [evalFunction, setEvalFunction] = useState([]);
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem("lang");
    return savedLang ? savedLang : defaultLang;
  });

  useEffect(() => {
    const newLanguageObj = languages.find((lang) => lang.name === language);

    if (newLanguageObj) {
      const { answer_cases, eval_function, default_code } = newLanguageObj;
      const formattedCode = beautify.js(default_code);
      setCode(formattedCode);
      setAnswerCases(answer_cases);
      setEvalFunction(eval_function);
    }
  }, [language, languages]);

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  return languages ? (
    <>
      <CodeEditorWindow
        code={code}
        answerCases={answerCases}
        evalFunction={evalFunction}
        setCode={setCode}
        onChange={onChange}
        language={language}
        setLanguage={setLanguage}
        editable={true}
        setOutputDetails={setOutputDetails}
        quesId={quesId}
      />
    </>
  ) : (
    <>loading</>
  );
};

export default AnswerForm;
