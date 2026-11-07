import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BsStar } from "react-icons/bs";
import bibleList from "@/lib/bibleList";
import { useRef, useState } from "react";

const Library = () => {
  const [activeInput, setActiveInput] = useState<"book" | "chapter" | "verse">(
    "book",
  );
  const bookInput = useRef<HTMLInputElement>(null);
  const chapterInput = useRef<HTMLInputElement>(null);
  const verseInput = useRef<HTMLInputElement>(null);

  function detectArrowKeys(e: React.KeyboardEvent<HTMLInputElement>) {
    let nextInput: "book" | "chapter" | "verse" | null = null;

    if (e.key === "ArrowLeft") {
      if (activeInput === "book") {
        nextInput = "verse";
      } else if (activeInput === "chapter") {
        nextInput = "book";
      } else if (activeInput === "verse") {
        nextInput = "chapter";
      }
    } else if (e.key === "ArrowRight") {
      if (activeInput === "book") {
        nextInput = "chapter";
      } else if (activeInput === "chapter") {
        nextInput = "verse";
      } else if (activeInput === "verse") {
        nextInput = "book";
      }
    }

    if (!nextInput) {
      return;
    }

    e.preventDefault();
    setActiveInput(nextInput);

    if (nextInput === "book") {
      bookInput.current?.focus();
    } else if (nextInput === "chapter") {
      chapterInput.current?.focus();
    } else {
      verseInput.current?.focus();
    }
  }

  return (
    <Card className="gap-0 pb-0">
      <CardHeader className="border-b">
        <h2 className="font-semibold">Scripture</h2>
        <div className="flex gap-2 items-center justify-between">
          <div className="flex bg-background">
            <input
              type="text"
              className="w-fit"
              ref={bookInput}
              onKeyDown={detectArrowKeys}
              onFocus={() => setActiveInput("book")}
              defaultValue={"Genesis"}
            />
            <input
              type="text"
              className="w-4"
              ref={chapterInput}
              onKeyDown={detectArrowKeys}
              onFocus={() => setActiveInput("chapter")}
            />
            <input
              type="text"
              className="w-4"
              ref={verseInput}
              onKeyDown={detectArrowKeys}
              onFocus={() => setActiveInput("verse")}
            />
          </div>

          <Button variant="outline" size="icon">
            <BsStar />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 py-4 overflow-y-scroll max-h-56">
        <ScriptureItem />
        <ScriptureItem />
        <ScriptureItem />
        <ScriptureItem />
      </CardContent>
    </Card>
  );
};

function ScriptureItem() {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste, optio.
      </p>
      <p className="font-semibold text-right">Gen 1:1</p>
    </div>
  );
}

export default Library;
