import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BsStar } from "react-icons/bs";
import bibleList from "@/lib/bibleList";
import { useEffect, useMemo, useRef, useState } from "react";
import kjv from "@/lib/versions/kjv";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useGlobalStore } from "@/store/globalStore";

// Identifies each part of the Scripture reference.
type Field = "book" | "chapter" | "verse";
const FIELDS: Field[] = ["book", "chapter", "verse"];

// Shared by the input and its ghost overlay so the two layers line up exactly.
const FIELD_TEXT = "h-8 px-1 text-sm leading-8 font-normal tracking-normal";

// Allows an optional leading 1-3 (e.g. "1 John"), then letters and spaces.
const BOOK_PATTERN = /^[1-3]?\s?[a-zA-Z\s]*$/;

const bibleText = kjv as Record<string, string[][]>;

function normalizeBook(value: string) {
  return value.toLowerCase().replace(/\s/g, "");
}

function selectAll(e: React.MouseEvent<HTMLInputElement>) {
  e.currentTarget.select();
}

const Library = () => {
  // The editable book text and the currently selected reference.
  const [bookValue, setBookValue] = useState("Genesis");
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const [chapter, setChapter] = useState(1);
  const [verse, setVerse] = useState(1);
  const setSelectedScripture = useGlobalStore((s) => s.setSelectedScripture);
  const setLiveOutput = useGlobalStore((s) => s.setLiveOutput);

  // References to the inputs so focus can be moved programmatically.
  const inputRefs = {
    book: useRef<HTMLInputElement>(null),
    chapter: useRef<HTMLInputElement>(null),
    verse: useRef<HTMLInputElement>(null),
  };
  const scriptureContainer = useRef<HTMLDivElement>(null);

  // Every verse of the selected book as one flat list.
  const scripture = bibleText[selectedBook] ?? [];
  const verses = useMemo(
    () =>
      scripture.flatMap((chapterVerses, c) =>
        chapterVerses.map((text, v) => ({
          chapter: c + 1,
          verse: v + 1,
          text,
        })),
      ),
    [scripture],
  );
  const activeVerseIndex = verses.findIndex(
    (item) => item.chapter === chapter && item.verse === verse,
  );
  const shortName =
    bibleList.find((b) => b.name === selectedBook)?.shortName ?? selectedBook;

  const verseVirtualizer = useVirtualizer({
    count: verses.length,
    getScrollElement: () => scriptureContainer.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  // Autocomplete suggestion: the first book that starts with what's typed.
  const match = bookValue
    ? bibleList.find(
        (b) =>
          normalizeBook(b.name).startsWith(normalizeBook(bookValue)) &&
          b.name.length > bookValue.length,
      )
    : undefined;
  const ghost = match ? match.name.slice(bookValue.length) : "";

  // Focuses and selects the complete value of a reference field.
  function focusField(field: Field) {
    inputRefs[field].current?.focus();
    inputRefs[field].current?.select();
  }

  // Sends a verse to the live output.
  function publishVerse(c = chapter, v = verse) {
    const text = scripture[c - 1]?.[v - 1];
    if (text === undefined) return;
    setLiveOutput({ book: selectedBook, chapter: c, verse: v, text });
  }

  function selectVerse(c: number, v: number) {
    setChapter(c);
    setVerse(v);
    scriptureContainer.current?.focus();
  }

  // Resets to 1:1 when the chapter or verse doesn't exist in the book.
  function resetIfOutOfRange(book: string, c: number, v: number) {
    const data = bibleList.find((b) => b.name === book);
    if (!data) return;

    const valid =
      c >= 1 &&
      c <= data.chapters.length &&
      v >= 1 &&
      v <= data.chapters[c - 1];
    if (!valid) {
      setChapter(1);
      setVerse(1);
      focusField("chapter");
    }
  }

  // Enter publishes the verse; left/right arrows move between the fields.
  function handleFieldKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    field: Field,
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      publishVerse();
      e.currentTarget.blur();
      return;
    }

    const step = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
    if (!step) return;

    e.preventDefault();
    const i = FIELDS.indexOf(field);
    focusField(FIELDS[(i + step + FIELDS.length) % FIELDS.length]);
  }

  // Tab or right arrow at the end accepts the suggestion and jumps to the chapter.
  function handleBookKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const { selectionStart, selectionEnd } = e.currentTarget;
    const atEnd =
      selectionStart === bookValue.length && selectionEnd === bookValue.length;

    if (match && (e.key === "Tab" || (e.key === "ArrowRight" && atEnd))) {
      e.preventDefault();
      setBookValue(match.name);
      setSelectedBook(match.name);
      focusField("chapter");
      resetIfOutOfRange(match.name, chapter, verse);
      return;
    }

    handleFieldKeyDown(e, "book");
  }

  // Only accepts text that could still become a known book.
  function handleBookChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    const typed = normalizeBook(value);
    const isKnownPrefix = bibleList.some((b) =>
      normalizeBook(b.name).startsWith(typed),
    );
    if (!BOOK_PATTERN.test(value) || !isKnownPrefix) return;

    setBookValue(value);

    const exact = bibleList.find((b) => normalizeBook(b.name) === typed);
    if (exact && exact.name in bibleText) {
      setSelectedBook(exact.name);
      resetIfOutOfRange(exact.name, chapter, verse);
    }
  }

  // Strips non-digits (including pasted text) and updates chapter or verse.
  function handleNumberChange(
    e: React.ChangeEvent<HTMLInputElement>,
    field: "chapter" | "verse",
  ) {
    const value = Number(e.currentTarget.value.replace(/\D/g, ""));

    if (field === "chapter") {
      setChapter(value);
      setVerse(1);
      resetIfOutOfRange(selectedBook, value, 1);
    } else {
      setVerse(value);
      resetIfOutOfRange(selectedBook, chapter, value);
    }
  }

  // In the verse list: Enter publishes, up/down moves through verses (across chapters).
  function handleListKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      publishVerse();
      return;
    }
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;

    e.preventDefault();
    if (activeVerseIndex < 0) return;

    const next = verses[activeVerseIndex + (e.key === "ArrowUp" ? -1 : 1)];
    if (next) selectVerse(next.chapter, next.verse);
  }

  // Keeps the selected verse in view.
  useEffect(() => {
    if (activeVerseIndex >= 0) {
      verseVirtualizer.scrollToIndex(activeVerseIndex, { align: "auto" });
    }
  }, [activeVerseIndex, selectedBook, verseVirtualizer]);

  // Shares the current selection with the rest of the app.
  useEffect(() => {
    const text = scripture[chapter - 1]?.[verse - 1];
    if (text === undefined) return;
    setSelectedScripture({ book: selectedBook, chapter, verse, text });
  }, [chapter, verse, selectedBook, scripture, setSelectedScripture]);

  return (
    <Card className="gap-0 pb-0">
      <CardHeader className="border-b">
        <h2 className="font-semibold">Scripture</h2>
        <div className="flex gap-2 items-center justify-between">
          <div className="flex items-center bg-background">
            <div className="relative">
              {/* Autocomplete completion shown behind the editable book input. */}
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
                ref={inputRefs.book}
                value={bookValue}
                onKeyDown={handleBookKeyDown}
                onClick={selectAll}
                onChange={handleBookChange}
              />
            </div>

            <input
              type="text"
              inputMode="numeric"
              className={`w-8 bg-transparent outline-none text-center ${FIELD_TEXT}`}
              ref={inputRefs.chapter}
              value={chapter || ""}
              onKeyDown={(e) => handleFieldKeyDown(e, "chapter")}
              onClick={selectAll}
              onChange={(e) => handleNumberChange(e, "chapter")}
            />

            <input
              type="text"
              inputMode="numeric"
              className={`w-8 bg-transparent outline-none text-center ${FIELD_TEXT}`}
              ref={inputRefs.verse}
              value={verse || ""}
              onKeyDown={(e) => handleFieldKeyDown(e, "verse")}
              onClick={selectAll}
              onChange={(e) => handleNumberChange(e, "verse")}
            />
          </div>

          {/* Marks the current Scripture reference as a favorite. */}
          <Button variant="outline" size="icon">
            <BsStar />
          </Button>
        </div>
      </CardHeader>

      {/* Scripture results for the selected book. */}
      <CardContent
        ref={scriptureContainer}
        className="overflow-y-auto max-h-64 px-0"
        tabIndex={0}
        onKeyDown={handleListKeyDown}
      >
        <div
          className="relative w-full"
          style={{ height: `${verseVirtualizer.getTotalSize()}px` }}
        >
          {verseVirtualizer.getVirtualItems().map((row) => {
            const item = verses[row.index];

            return (
              <div
                key={row.key}
                ref={verseVirtualizer.measureElement}
                data-index={row.index}
                className="absolute top-0 left-0 w-full"
                style={{ transform: `translateY(${row.start}px)` }}
              >
                <ScriptureItem
                  book={shortName}
                  chapter={item.chapter}
                  verse={item.verse}
                  text={item.text}
                  active={row.index === activeVerseIndex}
                  onSelect={() => selectVerse(item.chapter, item.verse)}
                  onPublish={() => publishVerse(item.chapter, item.verse)}
                />
              </div>
            );
          })}
        </div>
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
  onSelect,
  onPublish,
}: {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  active: boolean;
  onSelect: () => void;
  onPublish: () => void;
}) {
  return (
    <div
      className={`px-4 py-2 cursor-pointer ${active ? "bg-primary text-card!" : ""}`}
      onClick={onSelect}
      onDoubleClick={onPublish}
    >
      <p
        className={`text-xs ${active ? "text-card" : "text-muted-foreground"}`}
      >
        {text}
      </p>
      <p className="font-semibold text-right text-xs pt-1">
        {book} {chapter}:{verse}
      </p>
    </div>
  );
}

export default Library;
