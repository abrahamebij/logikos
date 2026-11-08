export interface BibleBook {
  name: string;
  shortName: string;
  chapters: number[];
}

const bibleList: BibleBook[] = [
  {
    name: "Genesis",
    shortName: "Gen",
    chapters: [
      31, 25, 24, 26, 32, 22, 24, 22, 29, 32,
      32, 20, 18, 24, 21, 16, 27, 33, 38, 18,
      34, 24, 20, 67, 34, 35, 46, 22, 35, 43,
      55, 32, 20, 31, 29, 43, 36, 30, 23, 23,
      57, 38, 34, 34, 28, 34, 31, 22, 33, 26,
    ],
  },
  {
    name: "Exodus",
    shortName: "Exo",
    chapters: [
      22, 25, 22, 31, 23, 30, 25, 32, 35, 29,
      10, 51, 22, 31, 27, 36, 16, 27, 25, 26,
      36, 31, 33, 18, 40, 37, 21, 43, 46, 38,
      18, 35, 23, 35, 35, 38, 29, 31, 43, 38,
    ],
  },
  {
    name: "Leviticus",
    shortName: "Lev",
    chapters: [
      17, 16, 17, 35, 19, 30, 38, 36, 24, 20,
      47, 8, 59, 57, 33, 34, 16, 30, 37, 27,
      24, 33, 44, 23, 55, 46, 34,
    ],
  },
  {
    name: "Numbers",
    shortName: "Num",
    chapters: [
      54, 34, 51, 49, 31, 27, 89, 26, 23, 36,
      35, 16, 33, 45, 41, 50, 13, 32, 22, 29,
      35, 41, 30, 25, 18, 65, 23, 31, 40, 16,
      54, 42, 56, 29, 34, 13,
    ],
  },
  {
    name: "Deuteronomy",
    shortName: "Deu",
    chapters: [
      46, 37, 29, 49, 33, 25, 26, 20, 29, 22,
      32, 32, 18, 29, 23, 22, 20, 22, 21, 20,
      23, 30, 25, 22, 19, 19, 26, 68, 29, 20,
      30, 52, 29, 12,
    ],
  },
  {
    name: "Joshua",
    shortName: "Jos",
    chapters: [
      18, 24, 17, 24, 15, 27, 26, 35, 27, 43,
      23, 24, 33, 15, 63, 10, 18, 28, 51, 9,
      45, 34, 16, 33,
    ],
  },
  {
    name: "Judges",
    shortName: "Jdg",
    chapters: [
      36, 23, 31, 24, 31, 40, 25, 35, 57, 18,
      40, 15, 25, 20, 20, 31, 13, 31, 30, 48,
      25,
    ],
  },
  {
    name: "Ruth",
    shortName: "Rut",
    chapters: [
      22, 23, 18, 22,
    ],
  },
  {
    name: "1 Samuel",
    shortName: "1Sa",
    chapters: [
      28, 36, 21, 22, 12, 21, 17, 22, 27, 27,
      15, 25, 23, 52, 35, 23, 58, 30, 24, 42,
      15, 23, 29, 22, 44, 25, 12, 25, 11, 31,
      13,
    ],
  },
  {
    name: "2 Samuel",
    shortName: "2Sa",
    chapters: [
      27, 32, 39, 12, 25, 23, 29, 18, 13, 19,
      27, 31, 39, 33, 37, 23, 29, 33, 43, 26,
      22, 51, 39, 25,
    ],
  },
  {
    name: "1 Kings",
    shortName: "1Ki",
    chapters: [
      53, 46, 28, 34, 18, 38, 51, 66, 28, 29,
      43, 33, 34, 31, 34, 34, 24, 46, 21, 43,
      29, 53,
    ],
  },
  {
    name: "2 Kings",
    shortName: "2Ki",
    chapters: [
      18, 25, 27, 44, 27, 33, 20, 29, 37, 36,
      21, 21, 25, 29, 38, 20, 41, 37, 37, 21,
      26, 20, 37, 20, 30,
    ],
  },
  {
    name: "1 Chronicles",
    shortName: "1Ch",
    chapters: [
      54, 55, 24, 43, 26, 81, 40, 40, 44, 14,
      47, 40, 14, 17, 29, 43, 27, 17, 19, 8,
      30, 19, 32, 31, 31, 32, 34, 21, 30,
    ],
  },
  {
    name: "2 Chronicles",
    shortName: "2Ch",
    chapters: [
      17, 18, 17, 22, 14, 42, 22, 18, 31, 19,
      23, 16, 22, 15, 19, 14, 19, 34, 11, 37,
      20, 12, 21, 27, 28, 23, 9, 27, 36, 27,
      21, 33, 25, 33, 27, 23,
    ],
  },
  {
    name: "Ezra",
    shortName: "Ezr",
    chapters: [
      11, 70, 13, 24, 17, 22, 28, 36, 15, 44,
    ],
  },
  {
    name: "Nehemiah",
    shortName: "Neh",
    chapters: [
      11, 20, 32, 23, 19, 19, 73, 18, 38, 39,
      36, 47, 31,
    ],
  },
  {
    name: "Esther",
    shortName: "Est",
    chapters: [
      22, 23, 15, 17, 14, 14, 10, 17, 32, 3,
    ],
  },
  {
    name: "Job",
    shortName: "Job",
    chapters: [
      22, 13, 26, 21, 27, 30, 21, 22, 35, 22,
      20, 25, 28, 22, 35, 22, 16, 21, 29, 29,
      34, 30, 17, 25, 6, 14, 23, 28, 25, 31,
      40, 22, 33, 37, 16, 33, 24, 41, 30, 24,
      34, 17,
    ],
  },
  {
    name: "Psalms",
    shortName: "Psa",
    chapters: [
      6, 12, 8, 8, 12, 10, 17, 9, 20, 18,
      7, 8, 6, 7, 5, 11, 15, 50, 14, 9,
      13, 31, 6, 10, 22, 12, 14, 9, 11, 12,
      24, 11, 22, 22, 28, 12, 40, 22, 13, 17,
      13, 11, 5, 26, 17, 11, 9, 14, 20, 23,
      19, 9, 6, 7, 23, 13, 11, 11, 17, 12,
      8, 12, 11, 10, 13, 20, 7, 35, 36, 5,
      24, 20, 28, 23, 10, 12, 20, 72, 13, 19,
      16, 8, 18, 12, 13, 17, 7, 18, 52, 17,
      16, 15, 5, 23, 11, 13, 12, 9, 9, 5,
      8, 28, 22, 35, 45, 48, 43, 13, 31, 7,
      10, 10, 9, 8, 18, 19, 2, 29, 176, 7,
      8, 9, 4, 8, 5, 6, 5, 6, 8, 8,
      3, 18, 3, 3, 21, 26, 9, 8, 24, 13,
      10, 7, 12, 15, 21, 10, 20, 14, 9, 6,
    ],
  },
  {
    name: "Proverbs",
    shortName: "Pro",
    chapters: [
      33, 22, 35, 27, 23, 35, 27, 36, 18, 32,
      31, 28, 25, 35, 33, 33, 28, 24, 29, 30,
      31, 29, 35, 34, 28, 28, 27, 28, 27, 33,
      31,
    ],
  },
  {
    name: "Ecclesiastes",
    shortName: "Ecc",
    chapters: [
      18, 26, 22, 16, 20, 12, 29, 17, 18, 20,
      10, 14,
    ],
  },
  {
    name: "Song of Solomon",
    shortName: "Sng",
    chapters: [
      17, 17, 11, 16, 16, 13, 13, 14,
    ],
  },
  {
    name: "Isaiah",
    shortName: "Isa",
    chapters: [
      31, 22, 26, 6, 30, 13, 25, 22, 21, 34,
      16, 6, 22, 32, 9, 14, 14, 7, 25, 6,
      17, 25, 18, 23, 12, 21, 13, 29, 24, 33,
      9, 20, 24, 17, 10, 22, 38, 22, 8, 31,
      29, 25, 28, 28, 25, 13, 15, 22, 26, 11,
      23, 15, 12, 17, 13, 12, 21, 14, 21, 22,
      11, 12, 19, 12, 25, 24,
    ],
  },
  {
    name: "Jeremiah",
    shortName: "Jer",
    chapters: [
      19, 37, 25, 31, 31, 30, 34, 22, 26, 25,
      23, 17, 27, 22, 21, 21, 27, 23, 15, 18,
      14, 30, 40, 10, 38, 24, 22, 17, 32, 24,
      40, 44, 26, 22, 19, 32, 21, 28, 18, 16,
      18, 22, 13, 30, 5, 28, 7, 47, 39, 46,
      64, 34,
    ],
  },
  {
    name: "Lamentations",
    shortName: "Lam",
    chapters: [
      22, 22, 66, 22, 22,
    ],
  },
  {
    name: "Ezekiel",
    shortName: "Ezk",
    chapters: [
      28, 10, 27, 17, 17, 14, 27, 18, 11, 22,
      25, 28, 23, 23, 8, 63, 24, 32, 14, 49,
      32, 31, 49, 27, 17, 21, 36, 26, 21, 26,
      18, 32, 33, 31, 15, 38, 28, 23, 29, 49,
      26, 20, 27, 31, 25, 24, 23, 35,
    ],
  },
  {
    name: "Daniel",
    shortName: "Dan",
    chapters: [
      21, 49, 30, 37, 31, 28, 28, 27, 27, 21,
      45, 13,
    ],
  },
  {
    name: "Hosea",
    shortName: "Hos",
    chapters: [
      11, 23, 5, 19, 15, 11, 16, 14, 17, 15,
      12, 14, 16, 9,
    ],
  },
  {
    name: "Joel",
    shortName: "Jol",
    chapters: [
      20, 32, 21,
    ],
  },
  {
    name: "Amos",
    shortName: "Amo",
    chapters: [
      15, 16, 15, 13, 27, 14, 17, 14, 15,
    ],
  },
  {
    name: "Obadiah",
    shortName: "Oba",
    chapters: [
      21,
    ],
  },
  {
    name: "Jonah",
    shortName: "Jon",
    chapters: [
      17, 10, 10, 11,
    ],
  },
  {
    name: "Micah",
    shortName: "Mic",
    chapters: [
      16, 13, 12, 13, 15, 16, 20,
    ],
  },
  {
    name: "Nahum",
    shortName: "Nam",
    chapters: [
      15, 13, 19,
    ],
  },
  {
    name: "Habakkuk",
    shortName: "Hab",
    chapters: [
      17, 20, 19,
    ],
  },
  {
    name: "Zephaniah",
    shortName: "Zep",
    chapters: [
      18, 15, 20,
    ],
  },
  {
    name: "Haggai",
    shortName: "Hag",
    chapters: [
      15, 23,
    ],
  },
  {
    name: "Zechariah",
    shortName: "Zec",
    chapters: [
      21, 13, 10, 14, 11, 15, 14, 23, 17, 12,
      17, 14, 9, 21,
    ],
  },
  {
    name: "Malachi",
    shortName: "Mal",
    chapters: [
      14, 17, 18, 6,
    ],
  },
  {
    name: "Matthew",
    shortName: "Mat",
    chapters: [
      25, 23, 17, 25, 48, 34, 29, 34, 38, 42,
      30, 50, 58, 36, 39, 28, 27, 35, 30, 34,
      46, 46, 39, 51, 46, 75, 66, 20,
    ],
  },
  {
    name: "Mark",
    shortName: "Mrk",
    chapters: [
      45, 28, 35, 41, 43, 56, 37, 38, 50, 52,
      33, 44, 37, 72, 47, 20,
    ],
  },
  {
    name: "Luke",
    shortName: "Luk",
    chapters: [
      80, 52, 38, 44, 39, 49, 50, 56, 62, 42,
      54, 59, 35, 35, 32, 31, 37, 43, 48, 47,
      38, 71, 56, 53,
    ],
  },
  {
    name: "John",
    shortName: "Jhn",
    chapters: [
      51, 25, 36, 54, 47, 71, 53, 59, 41, 42,
      57, 50, 38, 31, 27, 33, 26, 40, 42, 31,
      25,
    ],
  },
  {
    name: "Acts",
    shortName: "Act",
    chapters: [
      26, 47, 26, 37, 42, 15, 60, 40, 43, 48,
      30, 25, 52, 28, 41, 40, 34, 28, 41, 38,
      40, 30, 35, 27, 27, 32, 44, 31,
    ],
  },
  {
    name: "Romans",
    shortName: "Rom",
    chapters: [
      32, 29, 31, 25, 21, 23, 25, 39, 33, 21,
      36, 21, 14, 23, 33, 27,
    ],
  },
  {
    name: "1 Corinthians",
    shortName: "1Co",
    chapters: [
      31, 16, 23, 21, 13, 20, 40, 13, 27, 33,
      34, 31, 13, 40, 58, 24,
    ],
  },
  {
    name: "2 Corinthians",
    shortName: "2Co",
    chapters: [
      24, 17, 18, 18, 21, 18, 16, 24, 15, 18,
      33, 21, 14,
    ],
  },
  {
    name: "Galatians",
    shortName: "Gal",
    chapters: [
      24, 21, 29, 31, 26, 18,
    ],
  },
  {
    name: "Ephesians",
    shortName: "Eph",
    chapters: [
      23, 22, 21, 32, 33, 24,
    ],
  },
  {
    name: "Philippians",
    shortName: "Php",
    chapters: [
      30, 30, 21, 23,
    ],
  },
  {
    name: "Colossians",
    shortName: "Col",
    chapters: [
      29, 23, 25, 18,
    ],
  },
  {
    name: "1 Thessalonians",
    shortName: "1Th",
    chapters: [
      10, 20, 13, 18, 28,
    ],
  },
  {
    name: "2 Thessalonians",
    shortName: "2Th",
    chapters: [
      12, 17, 18,
    ],
  },
  {
    name: "1 Timothy",
    shortName: "1Ti",
    chapters: [
      20, 15, 16, 16, 25, 21,
    ],
  },
  {
    name: "2 Timothy",
    shortName: "2Ti",
    chapters: [
      18, 26, 17, 22,
    ],
  },
  {
    name: "Titus",
    shortName: "Tit",
    chapters: [
      16, 15, 15,
    ],
  },
  {
    name: "Philemon",
    shortName: "Phm",
    chapters: [
      25,
    ],
  },
  {
    name: "Hebrews",
    shortName: "Heb",
    chapters: [
      14, 18, 19, 16, 14, 20, 28, 13, 28, 39,
      40, 29, 25,
    ],
  },
  {
    name: "James",
    shortName: "Jas",
    chapters: [
      27, 26, 18, 17, 20,
    ],
  },
  {
    name: "1 Peter",
    shortName: "1Pe",
    chapters: [
      25, 25, 22, 19, 14,
    ],
  },
  {
    name: "2 Peter",
    shortName: "2Pe",
    chapters: [
      21, 22, 18,
    ],
  },
  {
    name: "1 John",
    shortName: "1Jn",
    chapters: [
      10, 29, 24, 21, 21,
    ],
  },
  {
    name: "2 John",
    shortName: "2Jn",
    chapters: [
      13,
    ],
  },
  {
    name: "3 John",
    shortName: "3Jn",
    chapters: [
      14,
    ],
  },
  {
    name: "Jude",
    shortName: "Jud",
    chapters: [
      25,
    ],
  },
  {
    name: "Revelation",
    shortName: "Rev",
    chapters: [
      20, 29, 22, 11, 14, 17, 17, 13, 21, 11,
      19, 17, 18, 20, 8, 21, 18, 24, 21, 15,
      27, 21,
    ],
  },
];

export default bibleList;