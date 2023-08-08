import { ReactComponent as JavascriptIcon } from "../svg/javascript.svg";
import { ReactComponent as PythonIcon } from "../svg/python.svg";
import { ReactComponent as BronzeMedal } from "../svg/3rd-place-medal.svg";
import { ReactComponent as SilverMedal } from "../svg/2nd-place-medal.svg";
import { ReactComponent as GoldMedal } from "../svg/1st-place-medal.svg";
import { ReactComponent as Hand } from "../svg/hand.svg";

export const idToLanguage = (id) => {
  const language = languageOptions.find((lang) => lang.id === id);
  return language ? language.value : "text";
};

export const languageToIcon = (language) => {
  console.log(language);
  const lang = languageOptions.find((lang) => lang.id === language);
  return lang ? lang.icon : "file";
};

export const scoreToMedal = (passed, total) => {
  if (passed === total) return <GoldMedal />;
  if (passed >= total * 0.8) return <SilverMedal />;
  if (passed >= total * 0.7) return <BronzeMedal />;
  return <Hand />;
};

export const languageToId = (language) => {
  const lang = languageOptions.find((lang) => lang.value === language);
  return lang ? lang.id : 63;
};

export const languageOptions = [
  {
    id: 63,
    name: "JavaScript (Node.js 12.14.0)",
    label: "JavaScript (Node.js 12.14.0)",
    value: "javascript",
    icon: <JavascriptIcon />,
  },
  {
    id: 45,
    name: "Assembly (NASM 2.14.02)",
    label: "Assembly (NASM 2.14.02)",
    value: "assembly",
  },
  {
    id: 46,
    name: "Bash (5.0.0)",
    label: "Bash (5.0.0)",
    value: "bash",
  },
  {
    id: 47,
    name: "Basic (FBC 1.07.1)",
    label: "Basic (FBC 1.07.1)",
    value: "basic",
  },
  {
    id: 75,
    name: "C (Clang 7.0.1)",
    label: "C (Clang 7.0.1)",
    value: "c",
  },
  {
    id: 76,
    name: "C++ (Clang 7.0.1)",
    label: "C++ (Clang 7.0.1)",
    value: "cpp",
  },
  {
    id: 48,
    name: "C (GCC 7.4.0)",
    label: "C (GCC 7.4.0)",
    value: "c",
  },
  {
    id: 52,
    name: "C++ (GCC 7.4.0)",
    label: "C++ (GCC 7.4.0)",
    value: "cpp",
  },
  {
    id: 49,
    name: "C (GCC 8.3.0)",
    label: "C (GCC 8.3.0)",
    value: "c",
  },
  {
    id: 53,
    name: "C++ (GCC 8.3.0)",
    label: "C++ (GCC 8.3.0)",
    value: "cpp",
  },
  {
    id: 50,
    name: "C (GCC 9.2.0)",
    label: "C (GCC 9.2.0)",
    value: "c",
  },
  {
    id: 54,
    name: "C++ (GCC 9.2.0)",
    label: "C++ (GCC 9.2.0)",
    value: "cpp",
  },
  {
    id: 86,
    name: "Clojure (1.10.1)",
    label: "Clojure (1.10.1)",
    value: "clojure",
  },
  {
    id: 51,
    name: "C# (Mono 6.6.0.161)",
    label: "C# (Mono 6.6.0.161)",
    value: "csharp",
  },
  {
    id: 77,
    name: "COBOL (GnuCOBOL 2.2)",
    label: "COBOL (GnuCOBOL 2.2)",
    value: "cobol",
  },
  {
    id: 55,
    name: "Common Lisp (SBCL 2.0.0)",
    label: "Common Lisp (SBCL 2.0.0)",
    value: "lisp",
  },
  {
    id: 56,
    name: "D (DMD 2.089.1)",
    label: "D (DMD 2.089.1)",
    value: "d",
  },
  {
    id: 57,
    name: "Elixir (1.9.4)",
    label: "Elixir (1.9.4)",
    value: "elixir",
  },
  {
    id: 58,
    name: "Erlang (OTP 22.2)",
    label: "Erlang (OTP 22.2)",
    value: "erlang",
  },
  {
    id: 44,
    label: "Executable",
    name: "Executable",
    value: "exe",
  },
  {
    id: 87,
    name: "F# (.NET Core SDK 3.1.202)",
    label: "F# (.NET Core SDK 3.1.202)",
    value: "fsharp",
  },
  {
    id: 59,
    name: "Fortran (GFortran 9.2.0)",
    label: "Fortran (GFortran 9.2.0)",
    value: "fortran",
  },
  {
    id: 60,
    name: "Go (1.13.5)",
    label: "Go (1.13.5)",
    value: "go",
  },
  {
    id: 88,
    name: "Groovy (3.0.3)",
    label: "Groovy (3.0.3)",
    value: "groovy",
  },
  {
    id: 61,
    name: "Haskell (GHC 8.8.1)",
    label: "Haskell (GHC 8.8.1)",
    value: "haskell",
  },
  {
    id: 62,
    name: "Java (OpenJDK 13.0.1)",
    label: "Java (OpenJDK 13.0.1)",
    value: "java",
  },

  {
    id: 78,
    name: "Kotlin (1.3.70)",
    label: "Kotlin (1.3.70)",
    value: "kotlin",
  },
  {
    id: 64,
    name: "Lua (5.3.5)",
    label: "Lua (5.3.5)",
    value: "lua",
  },

  {
    id: 79,
    name: "Objective-C (Clang 7.0.1)",
    label: "Objective-C (Clang 7.0.1)",
    value: "objectivec",
  },
  {
    id: 65,
    name: "OCaml (4.09.0)",
    label: "OCaml (4.09.0)",
    value: "ocaml",
  },
  {
    id: 66,
    name: "Octave (5.1.0)",
    label: "Octave (5.1.0)",
    value: "octave",
  },
  {
    id: 67,
    name: "Pascal (FPC 3.0.4)",
    label: "Pascal (FPC 3.0.4)",
    value: "pascal",
  },
  {
    id: 85,
    name: "Perl (5.28.1)",
    label: "Perl (5.28.1)",
    value: "perl",
  },
  {
    id: 68,
    name: "PHP (7.4.1)",
    label: "PHP (7.4.1)",
    value: "php",
  },
  {
    id: 43,
    label: "Plain Text",
    name: "Plain Text",
    value: "text",
  },
  {
    id: 69,
    name: "Prolog (GNU Prolog 1.4.5)",
    label: "Prolog (GNU Prolog 1.4.5)",
    value: "prolog",
  },
  {
    id: 70,
    name: "Python (2.7.17)",
    label: "Python (2.7.17)",
    value: "python",
    icon: <PythonIcon />,
  },
  {
    id: 71,
    name: "Python (3.8.1)",
    label: "Python (3.8.1)",
    value: "python",
  },
  {
    id: 80,
    name: "R (4.0.0)",
    label: "R (4.0.0)",
    value: "r",
  },
  {
    id: 72,
    name: "Ruby (2.7.0)",
    label: "Ruby (2.7.0)",
    value: "ruby",
  },
  {
    id: 73,
    name: "Rust (1.40.0)",
    label: "Rust (1.40.0)",
    value: "rust",
  },
  {
    id: 81,
    name: "Scala (2.13.2)",
    label: "Scala (2.13.2)",
    value: "scala",
  },
  {
    id: 82,
    name: "SQL (SQLite 3.27.2)",
    label: "SQL (SQLite 3.27.2)",
    value: "sql",
  },
  {
    id: 83,
    name: "Swift (5.2.3)",
    label: "Swift (5.2.3)",
    value: "swift",
  },
  {
    id: 74,
    name: "TypeScript (3.7.4)",
    label: "TypeScript (3.7.4)",
    value: "typescript",
  },
  {
    id: 84,
    name: "Visual Basic.Net (vbnc 0.0.0.5943)",
    label: "Visual Basic.Net (vbnc 0.0.0.5943)",
    value: "vbnet",
  },
];
export const themes = [
  { value: "chrome", label: "Chrome", key: "chrome" },
  { value: "clouds", label: "Clouds" },
  { value: "crimson_editor", label: "Crimson Editor" },
  { value: "dawn", label: "Dawn" },
  { value: "dreamweaver", label: "Dreamweaver" },
  { value: "eclipse", label: "Eclipse" },
  { value: "github", label: "GitHub" },
  { value: "iplastic", label: "IPlastic" },
  { value: "katzenmilch", label: "KatzenMilch" },
  { value: "kuroir", label: "Kuroir" },
  { value: "solarized_light", label: "Solarized Light" },
  { value: "sqlserver", label: "SQL Server" },
  { value: "textmate", label: "TextMate" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "xcode", label: "XCode" },
  { value: "ambiance", label: "Ambiance" },
  { value: "chaos", label: "Chaos" },
  { value: "clouds_midnight", label: "Clouds Midnight" },
  { value: "cobalt", label: "Cobalt" },
  { value: "dracula", label: "Dracula" },
  { value: "gob", label: "Greeon on Black" },
  { value: "gruvbox", label: "Gruvbox" },
  { value: "idle_fingers", label: "idle Fingers" },
  { value: "kr_theme", label: "krTheme" },
  { value: "merbivore", label: "Merbivore" },
  { value: "merbivore_soft", label: "Merbivore Soft" },
  { value: "mono_industrial", label: "Mono Industrial" },
  { value: "monokai", label: "Monokai" },
  { value: "pastel_on_dark", label: "Pastel on Dark" },
  { value: "solarized_dark", label: "Solarized Dark" },
  { value: "terminal", label: "Terminal" },
  { value: "tomorrow_night", label: "Tomorrow Night" },
  { value: "tomorrow_night_blue", label: "Tomorrow Night Blue" },
  { value: "tomorrow_night_bright", label: "Tomorrow Night Bright" },
  { value: "tomorrow_night_eighties", label: "Tomorrow Night 80s" },
  { value: "twilight", label: "Twilight" },
  { value: "vibrant_ink", label: "Vibrant Ink" },
];
export const langs = [
  { label: "Javascript", value: "javascript" },
  // { label: "Python", value: "python", key: "python" },
];
