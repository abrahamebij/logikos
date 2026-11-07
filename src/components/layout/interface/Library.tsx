import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BsStar } from "react-icons/bs";
import bibleList from "@/lib/bibleList";
import { useRef, useState } from "react";

type Field = "book" | "chapter" | "verse";

// Shared by the input and its ghost overlay so the two layers line up exactly.
const FIELD_TEXT = "h-8 px-1 text-sm leading-8 font-normal tracking-normal";

// Allows an optional leading 1-3 (e.g. "1 John"), then letters and spaces.
const BOOK_PATTERN = /^[1-3]?\s?[a-zA-Z\s]*$/;

const Library = () => {
  const [bookValue, setBookValue] = useState("Genesis");
  const [activeInput, setActiveInput] = useState<Field>("book");
  const bookInput = useRef<HTMLInputElement>(null);
  const chapterInput = useRef<HTMLInputElement>(null);
  const verseInput = useRef<HTMLInputElement>(null);

  function focusField(field: Field) {
    const el = { book: bookInput, chapter: chapterInput, verse: verseInput }[
      field
    ].current;
    setActiveInput(field);
    el?.focus();
    el?.select();
  }

  // Move between the reference fields and select the newly focused value.
  function detectArrowKeys(e: React.KeyboardEvent<HTMLInputElement>) {
    const order: Field[] = ["book", "chapter", "verse"];
    const i = order.indexOf(activeInput);

    let nextInput: Field | null = null;
    if (e.key === "ArrowLeft") {
      nextInput = order[(i + order.length - 1) % order.length];
    } else if (e.key === "ArrowRight") {
      nextInput = order[(i + 1) % order.length];
    }
    if (!nextInput) return;

    e.preventDefault();
    focusField(nextInput);
  }

  function handleClick(e: React.MouseEvent<HTMLInputElement>) {
    e.currentTarget.select();
  }

  // Keep chapter/verse numeric, including pasted input.
  function filterNumber(e: React.ChangeEvent<HTMLInputElement>) {
    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
  }

  // Autocomplete suggestion: the first book that starts with what's typed.
  const match = bookValue
    ? bibleList.find(
        (book) =>
          book.name.toLowerCase().startsWith(bookValue.toLowerCase()) &&
          book.name.length > bookValue.length,
      )
    : undefined;
  const ghost = match ? match.name.slice(bookValue.length) : "";

  function handleBookKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const atEnd =
      input.selectionStart === bookValue.length &&
      input.selectionEnd === bookValue.length;

    // Accept the suggestion and jump to the chapter field.
    if (
      match &&
      (e.key === "Tab" ||
        e.key === "Enter" ||
        (e.key === "ArrowRight" && atEnd))
    ) {
      e.preventDefault();
      setBookValue(match.name);
      focusField("chapter");
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      focusField("chapter");
      return;
    }

    detectArrowKeys(e);
  }

  return (
    <Card className="gap-0 pb-0">
      <CardHeader className="border-b">
        <h2 className="font-semibold">Scripture</h2>
        <div className="flex gap-2 items-center justify-between">
          <div className="flex items-center bg-background">
            <div className="relative">
              {/* Ghost layer: invisible copy of the typed text + the remaining letters */}
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-0 flex items-center whitespace-pre text-muted-foreground/50 ${FIELD_TEXT}`}
              >
                <span className="invisible">{bookValue}</span>
                {ghost}
              </span>
              <input
                type="text"
                spellCheck={false}
                autoComplete="off"
                className={`relative z-10 w-28 bg-transparent outline-none ${FIELD_TEXT}`}
                ref={bookInput}
                onKeyDown={handleBookKeyDown}
                onClick={handleClick}
                onFocus={() => setActiveInput("book")}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  if (BOOK_PATTERN.test(value)) setBookValue(value);
                }}
                value={bookValue}
              />
            </div>
            <input
              type="text"
              inputMode="numeric"
              className={`w-4 bg-transparent outline-none text-center ${FIELD_TEXT}`}
              ref={chapterInput}
              onKeyDown={detectArrowKeys}
              onClick={handleClick}
              onFocus={() => setActiveInput("chapter")}
              onChange={filterNumber}
              defaultValue={1}
            />
            <input
              type="text"
              inputMode="numeric"
              className={`w-4 bg-transparent outline-none text-center ${FIELD_TEXT}`}
              ref={verseInput}
              onKeyDown={detectArrowKeys}
              onClick={handleClick}
              onFocus={() => setActiveInput("verse")}
              onChange={filterNumber}
              defaultValue={1}
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
      <p className="text-xs text-muted-foreground">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste, optio.
      </p>
      <p className="font-semibold text-right text-sm">Gen 1:1</p>
    </div>
  );
}

export default Library;
