import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BsStar } from "react-icons/bs";
import bibleList from "@/lib/bibleList";
import { useEffect, useRef, useState } from "react";
import kjv from "@/lib/versions/kjv";

// Identifies each part of the Scripture reference.
type Field = "book" | "chapter" | "verse";

// Shared by the input and its ghost overlay so the two layers line up exactly.
const FIELD_TEXT = "h-8 px-1 text-sm leading-8 font-normal tracking-normal";

// Allows an optional leading 1-3 (e.g. "1 John"), then letters and spaces.
const BOOK_PATTERN = /^[1-3]?\s?[a-zA-Z\s]*$/;

const Library = () => {
  // Stores the editable book text and the currently selected reference.
  const [bookValue, setBookValue] = useState("Genesis");
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const [chapterValue, setChapterValue] = useState(1);
  const [verseValue, setVerseValue] = useState(1);

  const [activeInput, setActiveInput] = useState<Field>("book");

  // Keeps references to the three inputs so focus can be moved programmatically.
  const bookInput = useRef<HTMLInputElement>(null);
  const chapterInput = useRef<HTMLInputElement>(null);
  const verseInput = useRef<HTMLInputElement>(null);
  const activeVerse = useRef<HTMLDivElement>(null);

  // Focuses and selects the complete value of a reference field.
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
  const scripture =
    selectedBook in kjv ? kjv[selectedBook as keyof typeof kjv] : [];

  // Accepts an autocomplete suggestion or moves to another reference field.
  function handleBookKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const atEnd =
      input.selectionStart === bookValue.length &&
      input.selectionEnd === bookValue.length;

    // Accept the suggestion and jump to the chapter field.
    if (
      match &&
      (e.key === "Tab" ||
        // e.key === " " ||
        (e.key === "ArrowRight" && atEnd))
    ) {
      e.preventDefault();
      setBookValue(match.name);
      setSelectedBook(match.name);
      focusField("chapter");
      checkBoundary(
        match.name,
        chapterValue,
        verseValue,
      );
      return;
    }

    // if (e.key === " ") {
    //   e.preventDefault();
    //   focusField("chapter");
    //   return;
    // }

    detectArrowKeys(e);
  }

  // Check whether the chapter and verse exists in the boundary of the selected book.
  function checkBoundary(book: string, chapter: number, verse: number) {
    const selectedBook = bibleList.find((b) => b.name === book);

    if (
      selectedBook &&
      (chapter < 1 ||
        chapter > selectedBook.chapters.length ||
        verse < 1 ||
        verse > selectedBook.chapters[chapter - 1])
    ) {
      setChapterValue(1);
      setVerseValue(1);
      focusField("chapter");
    }
  }

  function selectVerse(chapter: number, verse: number) {
    setChapterValue(chapter);
    setVerseValue(verse);
  }

  useEffect(() => {
    activeVerse.current?.scrollIntoView({ block: "nearest" });
  }, [selectedBook, chapterValue, verseValue]);

  // Renders the Scripture reference controls and placeholder Scripture results.
  return (
    <Card className="gap-0 pb-0">
      <CardHeader className="border-b">
        <h2 className="font-semibold">Scripture</h2>
        <div className="flex gap-2 items-center justify-between">
          <div className="flex items-center bg-background">
            <div className="relative">
              {/* Displays the autocomplete completion behind the editable book input. */}
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
                  if (BOOK_PATTERN.test(value)) {
                    setBookValue(value);
                    if (value in kjv) {
                      setSelectedBook(value);
                      checkBoundary(value, chapterValue, verseValue);
                    }
                  }
                }}
                value={bookValue}
              />
            </div>

            {/* Accepts only numeric chapter values. */}
            <input
              type="text"
              inputMode="numeric"
              className={`w-6 bg-transparent outline-none text-center ${FIELD_TEXT}`}
              ref={chapterInput}
              onKeyDown={detectArrowKeys}
              onClick={handleClick}
              onFocus={() => setActiveInput("chapter")}
              onChange={(e) => {
                filterNumber(e);
                const chapter = Number(e.currentTarget.value);
                setChapterValue(chapter);
                setVerseValue(1);
                checkBoundary(selectedBook, chapter, 1);
              }}
              value={chapterValue || ""}
            />

            {/* Accepts only numeric verse values. */}
            <input
              type="text"
              inputMode="numeric"
              className={`w-6 bg-transparent outline-none text-center ${FIELD_TEXT}`}
              ref={verseInput}
              onKeyDown={detectArrowKeys}
              onClick={handleClick}
              onFocus={() => setActiveInput("verse")}
              onChange={(e) => {
                filterNumber(e);
                const verse = Number(e.currentTarget.value);
                setVerseValue(verse);
                checkBoundary(selectedBook, chapterValue, verse);
              }}
              value={verseValue || ""}
            />
          </div>

          {/* Marks the current Scripture reference as a favorite. */}
          <Button variant="outline" size="icon">
            <BsStar />
          </Button>
        </div>
      </CardHeader>

      {/* Displays the Scripture results for the selected reference. */}
      <CardContent className="flex flex-col gap-2 overflow-y-scroll max-h-56 px-0">
        {scripture.map((chapters, chapterIndex) =>
          chapters.map((verse, verseIndex) => (
            <ScriptureItem
              key={`${chapterIndex + 1}-${verseIndex + 1}`}
              book={
                bibleList.find((book) => book.name === selectedBook)?.shortName ||
                selectedBook
              }
              chapter={chapterIndex + 1}
              verse={verseIndex + 1}
              text={verse}
              active={
                chapterIndex + 1 === chapterValue &&
                verseIndex + 1 === verseValue
              }
              itemRef={
                chapterIndex + 1 === chapterValue &&
                verseIndex + 1 === verseValue
                  ? activeVerse
                  : undefined
              }
              onSelect={() => selectVerse(chapterIndex + 1, verseIndex + 1)}
            />
          )),
        )}
      </CardContent>
    </Card>
  );
};

// Displays one Scripture result and its reference label.
function ScriptureItem({
  book,
  chapter,
  verse,
  text,
  active,
  itemRef,
  onSelect,
}: {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  active?: boolean;
  itemRef?: React.RefObject<HTMLDivElement | null>;
  onSelect: () => void;
}) {
  return (
    <div
      ref={itemRef}
      className={`px-4 py-2 cursor-pointer ${active ? "bg-primary text-white" : ""}`}
      onClick={onSelect}
    >
      <p className="text-xs text-muted-foreground">{text}</p>
      <p className="font-semibold text-right text-xs pt-1">
        {book.slice(0, 4)} {chapter}:{verse}
      </p>
    </div>
  );
}

export default Library;
