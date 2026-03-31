import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Item, ItemContent, ItemMedia, ItemTitle } from "./components/ui/item";
import { Spinner } from "./components/ui/spinner";
import { Button } from "./components/ui/button";
import "./App.css";

function App() {
  const [lang, setLang] = useState<string | null>("eng");
  const [fact, setFact] = useState<string | null>(null);
  const [picUrl, setPicUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);
  const LANGUAGES: Record<string, string | null> = {
    eng: "English",
    ces: "Czech",
    ger: "German",
    ben: "Bengali",
    esp: "Spanish",
    rus: "Russian",
    por: "Portuguese",
    fil: "Filipino",
    urd: "Urdu",
    ita: "Italian",
    zho: "Chinese",
    kor: "Korean",
  };

  function clear() {
    setFact(null);
    setPicUrl(null);
    setIsLoading(false);
    setErr(null);
  }

  function catFactAndPic() {
    setIsLoading(true);
    try {
      invoke("cat_fact", { language: lang ?? "eng" })
        .then((r) => {
          setFact(r as string);
        })
        .catch((err) => {
          setErr(err as string);
        });
      invoke("cat_pic")
        .then((r) => {
          setPicUrl(r as string);
        })
        .catch((err) => {
          setErr(err as string);
        });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container min-h-screen flex flex-col p-4">
      {/* Language selector — top right */}
      <div className="flex justify-end mb-6">
        <Select
          defaultValue="eng"
          value={lang ?? "eng"}
          onValueChange={setLang}
        >
          <SelectTrigger className="w-40">
            <SelectValue>{LANGUAGES[lang ?? "eng"]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Main content — centered */}
      <div className="flex flex-col items-center gap-6 flex-1">
        {isLoading && (
          <Item variant="muted" className="w-full max-w-sm">
            <ItemMedia>
              <Spinner />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="line-clamp-1">
                Crunching the most meowwy facts, just for you! 🐱
              </ItemTitle>
            </ItemContent>
          </Item>
        )}

        {!isLoading && !fact && !picUrl && !err && (
          <div className="flex flex-col items-center align-top">
            <h1 className="text-3xl font-bold bg-linear-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
              Welcome to Cat Facts!
            </h1>
            <h2 className="text-xl mb-2">
              A space where you can explore crunchy meowwy facts!😸
            </h2>
            <p className="text-neutral-500 italic mb-8">
              PS: if you change the language, you will get the facts in that
              language :)
            </p>
            <img src="home.jpeg" className="w-[50%] h-[50%]" />
          </div>
        )}

        {!isLoading && fact && picUrl && (
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <img
              src={picUrl}
              alt="A random cat"
              className="rounded-xl w-full object-cover"
            />
            <blockquote className="mt-6 border-l-2 pl-6 text-lg italic">
              {fact}
            </blockquote>
          </div>
        )}

        {!isLoading && err && <p>Error: {err}</p>}

        {/* Buttons — always at the bottom of content */}
        <div className="grid grid-cols-1 gap-3 pt-4 mb-auto align-middle mt-auto">
          <Button
            variant="default"
            onClick={catFactAndPic}
            disabled={isLoading}
            className="w-full rounded-lg bg-gray-300 border-solid border-gray-400 shadow-lg text-gray-700 hover:bg-gray-400 hover:text-gray-800"
          >
            Get a meeeowy fact! 🐾
          </Button>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={clear}
            className="w-full rounded-lg border-solid border-red-300 shadow-lg"
          >
            Clear
          </Button>
        </div>
      </div>
    </main>
  );
}

export default App;
