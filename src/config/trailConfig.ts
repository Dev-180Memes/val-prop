// ============================================================
// TRAIL CONFIGURATION
// Edit this file to customize photos, messages, and settings.
// ============================================================

export interface TrailPhoto {
  id: string;
  /** URL to image or video (local or remote). Replace placeholders with your own. */
  imageUrl: string;
  /** Caption shown below the photo frame */
  caption: string;
  /** Position along the trail (z-axis, 0 = start, negative = further) */
  zPosition: number;
  /** Which side of the trail: 'left' | 'right' */
  side: 'left' | 'right';
  /** Media type: 'image' (default) or 'video'. Videos loop endlessly. */
  type?: 'image' | 'video';
}

export interface TrailMessage {
  id: string;
  /** Text to display on the sign */
  text: string;
  /** Position along the trail (z-axis) */
  zPosition: number;
  /** Which side of the trail */
  side: 'left' | 'right';
}

// ---- PHOTOS ALONG THE TRAIL ----
// Replace imageUrl with your own photo URLs or local paths in /photos/
export const trailPhotos: TrailPhoto[] = [
  {
    id: 'photo-1',
    imageUrl: '/photos/10.JPG',
    caption: 'Our first date 💕',
    zPosition: -15,
    side: 'left',
  },
  {
    id: 'photo-2',
    imageUrl: '/photos/2.JPG',
    caption: 'Up ManU',
    zPosition: -30,
    side: 'right',
  },
  {
    id: 'photo-3',
    imageUrl: '/photos/4.JPG',
    caption: 'I see this when i check the time 🕒',
    zPosition: -45,
    side: 'left',
  },
  {
    id: 'photo-4',
    imageUrl: '/photos/5.JPG',
    caption: 'Just You',
    zPosition: -60,
    side: 'right',
  },
  {
    id: 'photo-5',
    imageUrl: '/photos/6.JPG',
    caption: 'My favourite picture 🥂',
    zPosition: -75,
    side: 'left',
  },
  {
    id: 'photo-6',
    imageUrl: '/photos/7.JPG',
    caption: 'Chef Dessie 👩‍🍳',
    zPosition: -90,
    side: 'right',
  },
  {
    id: 'photo-7',
    imageUrl: '/photos/8.JPG',
    caption: 'Just you again 🌅',
    zPosition: -105,
    side: 'left',
  },
  {
    id: 'photo-8',
    imageUrl: '/photos/1.MP4',
    caption: 'I love you',
    zPosition: -120,
    side: 'right',
    type: 'video',
  },
  {
    id: 'photo-9',
    imageUrl: '/photos/9.JPG',
    caption: 'Just you again',
    zPosition: -135,
    side: 'left',
  },
  {
    id: 'photo-10',
    imageUrl: '/photos/3.MP4',
    caption: 'Just us ❤️',
    zPosition: -150,
    side: 'right',
    type: 'video',
  },
];

// ---- MESSAGES ALONG THE TRAIL ----
export const trailMessages: TrailMessage[] = [
  {
    id: 'msg-1',
    text: 'Every love story is beautiful...',
    zPosition: -8,
    side: 'right',
  },
  {
    id: 'msg-2',
    text: '...but ours is my favorite.',
    zPosition: -22,
    side: 'left',
  },
  {
    id: 'msg-3',
    text: 'You make every day brighter ☀️',
    zPosition: -52,
    side: 'right',
  },
  {
    id: 'msg-4',
    text: "I can't imagine life without you",
    zPosition: -82,
    side: 'left',
  },
  {
    id: 'msg-5',
    text: 'You are my everything 💗',
    zPosition: -112,
    side: 'right',
  },
  {
    id: 'msg-6',
    text: 'Keep walking... a surprise awaits! 🐾',
    zPosition: -142,
    side: 'left',
  },
];

// ---- PROPOSAL SETTINGS ----
export const proposalConfig = {
  /** The main question displayed */
  question: 'Will you be my Valentine? 💝',

  /** The date she already said yes (shown in angry dog sequence) */
  dateSheAlreadySaidYes: 'February 14, 2025',

  /** Where along the trail the proposal scene starts (z-axis) */
  proposalZPosition: -170,

  /** Trail length (total z-distance) */
  trailLength: 180,
};

// ---- LOVE LETTER ----
// Customize the handwritten letter shown after the celebration.
export const letterConfig = {
  /** Greeting at the top */
  greeting: 'Ayanfe,',

  /** The body paragraphs of the letter. Each string is a separate paragraph. */
  paragraphs: [
    "From the moment I met you, I knew my life would never be the same. You walked in and turned my world into something more beautiful than I ever imagined.",
    "Every laugh we've shared, every late-night conversation, every silly moment — they're all little treasures I keep close to my heart.",
    "You make the ordinary feel extraordinary. A simple walk becomes an adventure. A quiet evening becomes my favorite memory. You are the magic in my everyday.",
    "I don't just love you for who you are — I love who I am when I'm with you. You make me want to be better, braver, and kinder.",
    "So here's my promise: I will keep choosing you. Every single day. In every season. Through every chapter. You are my person, now and always.",
  ],

  /** Sign-off line */
  closing: 'Forever yours,',

  /** Your name */
  signature: '— Adeoluwa 🐾',

  /** Date on the letter */
  date: 'February 14, 2025',
};

// ---- THEME / COLORS ----
export const themeConfig = {
  /** Sky/atmosphere color */
  skyColor: '#fdb99b',
  /** Fog color (matches sunset) */
  fogColor: '#fdb99b',
  /** Ground color */
  groundColor: '#4a7c59',
  /** Trail/path color */
  trailColor: '#c4a882',
  /** Accent color for hearts, highlights */
  accentColor: '#ff1493',
  /** Text color for signs */
  signTextColor: '#5c3317',
  /** Photo frame color */
  frameColor: '#8B4513',
};
