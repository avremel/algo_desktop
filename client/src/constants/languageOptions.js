import { ReactComponent as JavascriptIcon } from "../svg/javascript.svg";
import { ReactComponent as CIcon } from "../svg/c.svg";
import { ReactComponent as CppIcon } from "../svg/cpp.svg";
import { ReactComponent as CSharpIcon } from "../svg/csharp.svg";
import { ReactComponent as DartIcon } from "../svg/dart.svg";
import { ReactComponent as ElixirIcon } from "../svg/elixir.svg";
import { ReactComponent as ErlangIcon } from "../svg/erlang.svg";
import { ReactComponent as GolangIcon } from "../svg/golang.svg";
import { ReactComponent as JavaIcon } from "../svg/java.svg";
import { ReactComponent as KotlinIcon } from "../svg/kotlin.svg";
import { ReactComponent as PhpIcon } from "../svg/php.svg";
import { ReactComponent as Python3Icon } from "../svg/python3.svg";
import { ReactComponent as PythonIcon } from "../svg/python.svg";
import { ReactComponent as RubyIcon } from "../svg/ruby.svg";
import { ReactComponent as RustIcon } from "../svg/rust.svg";
import { ReactComponent as ScalaIcon } from "../svg/scala.svg";
import { ReactComponent as SwiftIcon } from "../svg/swift.svg";
import { ReactComponent as TypescriptIcon } from "../svg/typescript.svg";
import { ReactComponent as CodeIcon } from "../svg/code.svg";

import { ReactComponent as BronzeMedal } from "../svg/3rd-place-medal.svg";
import { ReactComponent as SilverMedal } from "../svg/2nd-place-medal.svg";
import { ReactComponent as GoldMedal } from "../svg/1st-place-medal.svg";
import { ReactComponent as Hand } from "../svg/hand.svg";

export const idToLanguage = (id) => {
  const language = languageOptions.find((lang) => lang.id === id);
  return language ? language.value : "text";
};

export const languageToIcon = (language) => {
  const lang = languageOptions.find((lang) => lang.value === language);
  return lang ? lang.icon : <CodeIcon />;
};

export const scoreToMedal = (total_correct, total_testcases) => {
  if (total_correct === total_testcases) return <GoldMedal />;
  if (total_correct >= total_testcases * 0.95) return <SilverMedal />;
  if (total_correct >= total_testcases * 0.9) return <BronzeMedal />;
  return <Hand />;
};

export const languageToId = (language) => {
  const lang = languageOptions.find((lang) => lang.value === language);
  return lang ? lang.id : 63;
};

export const languageOptions = [
  {
    value: "javascript",
    icon: <JavascriptIcon />,
  },

  {
    value: "c",
    icon: <CIcon />,
  },
  {
    value: "cpp",
    icon: <CppIcon />,
  },

  {
    value: "csharp",
    icon: <CSharpIcon />,
  },

  {
    value: "dart",
    icon: <DartIcon />,
  },
  {
    value: "elixir",
    icon: <ElixirIcon />,
  },
  {
    value: "erlang",
    icon: <ErlangIcon />,
  },

  {
    value: "golang",
    icon: <GolangIcon />,
  },

  {
    value: "java",
    icon: <JavaIcon />,
  },

  {
    value: "kotlin",
    icon: <KotlinIcon />,
  },

  {
    value: "php",
    icon: <PhpIcon />,
  },

  {
    value: "python",
    icon: <PythonIcon />,
  },
  {
    value: "python3",
    icon: <Python3Icon />,
  },

  {
    value: "ruby",
    icon: <RubyIcon />,
  },
  {
    value: "rust",
    icon: <RustIcon />,
  },
  {
    value: "scala",
    icon: <ScalaIcon />,
  },

  {
    value: "swift",
    icon: <SwiftIcon />,
  },
  {
    value: "typescript",
    icon: <TypescriptIcon />,
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
