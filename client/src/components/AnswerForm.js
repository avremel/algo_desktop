import React, { useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import { useAuthContext } from "../context/auth";

const AnswerForm = ({ quesId }) => {
  const { user } = useAuthContext();

  const [code, setCode] = useState("");

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

  return (
    <>
      <CodeEditorWindow
        code={code}
        setCode={setCode}
        onChange={onChange}
        quesId={quesId}
      />
    </>
  );
};

export default AnswerForm;
