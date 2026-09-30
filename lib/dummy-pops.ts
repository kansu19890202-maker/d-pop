export type Pop = {
  id: string;
  title: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
};

export const SAMPLE_AUTHOR = "Boomのがんちゃん";

export const popularTags = ["2025", "2024", "トーナメント", "チラシ"];

export const dummyPops: Pop[] = [
  {
    id: "1",
    title: "ヒューゴロー",
    date: "2025.04.20",
    author: SAMPLE_AUTHOR,
    image: "/sample/20250420-01.png",
    tags: ["2025"],
  },
  {
    id: "2",
    title: "井能実奈子",
    date: "2025.04.05",
    author: SAMPLE_AUTHOR,
    image: "/sample/20250405-02.png",
    tags: ["2025"],
  },
  {
    id: "3",
    title: "村松治樹 鈴木未来",
    date: "2025.03.19",
    author: SAMPLE_AUTHOR,
    image: "/sample/20250319-03.png",
    tags: ["2025"],
  },
  {
    id: "4",
    title: "2025.02.05",
    date: "2025.02.05",
    author: SAMPLE_AUTHOR,
    image: "/sample/20250205-04.png",
    tags: ["2025"],
  },
  {
    id: "5",
    title: "2024.11.06",
    date: "2024.11.06",
    author: SAMPLE_AUTHOR,
    image: "/sample/20241106-05.png",
    tags: ["2024"],
  },
  {
    id: "6",
    title: "シングルトーナメント",
    date: "2024.10.26",
    author: SAMPLE_AUTHOR,
    image: "/sample/20241026-06.png",
    tags: ["2024", "トーナメント"],
  },
  {
    id: "7",
    title: "黒田俊平 岩田夏海",
    date: "2024.10.25",
    author: SAMPLE_AUTHOR,
    image: "/sample/20241025-07.png",
    tags: ["2024"],
  },
  {
    id: "8",
    title: "三浦歌織",
    date: "2024.10.12",
    author: SAMPLE_AUTHOR,
    image: "/sample/20241012-08.png",
    tags: ["2024"],
  },
  {
    id: "9",
    title: "岩田夏海",
    date: "2024.09.06",
    author: SAMPLE_AUTHOR,
    image: "/sample/20240906-09.png",
    tags: ["2024"],
  },
  {
    id: "10",
    title: "2024.09.02",
    date: "2024.09.02",
    author: SAMPLE_AUTHOR,
    image: "/sample/20240902-10.png",
    tags: ["2024"],
  },
  {
    id: "11",
    title: "2024.08",
    date: "2024.08",
    author: SAMPLE_AUTHOR,
    image: "/sample/20240801-11.png",
    tags: ["2024"],
  },
  {
    id: "12",
    title: "チラシ",
    date: "2024.07.23",
    author: SAMPLE_AUTHOR,
    image: "/sample/20240723-12.png",
    tags: ["2024", "チラシ"],
  },
  {
    id: "13",
    title: "ハウトチラシ",
    date: "2024.06.30",
    author: SAMPLE_AUTHOR,
    image: "/sample/20240630-13.png",
    tags: ["2024", "チラシ"],
  },
];
