/**
 * Typing-style SVG generation library
 * GitHub README compatible (uses SMIL/CSS animations, no JS)
 */

import { PRESS_START_2P_FONT_BASE64 } from './fontData';

export interface SvgOptions {
  /** Display text (comma-separated for multi-line support) */
  text: string;
  /** Font size (px) */
  fontSize: number;
  /** SVG width (px) */
  width: number;
  /** SVG height (px) */
  height: number;
  /** Text color (HEX without #) */
  color: string;
  /** Background color (HEX without #) */
  bg: string;
  /** Animation speed (1=slow, 5=fast) */
  speed: number;
  /** Font family */
  font: string;
}

/** Default settings */
export const defaultOptions: SvgOptions = {
  text: 'Hello World',
  fontSize: 20,
  width: 400,
  height: 50,
  color: '00FF00',
  bg: '000000',
  speed: 3,
  font: 'Press Start 2P',
};

/**
 * Parse text and convert to line array
 */
function parseTextLines(text: string): string[] {
  return text
    .split(',')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Validate and normalize HEX color
 */
function normalizeColor(color: string): string {
  const cleaned = color.replace(/^#/, '');
  if (/^[0-9A-Fa-f]{3}$/.test(cleaned)) {
    return cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2];
  }
  if (/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
    return cleaned;
  }
  return '000000';
}

/**
 * Calculate animation duration per character from speed
 */
function getCharDuration(speed: number): number {
  const clampedSpeed = Math.max(1, Math.min(5, speed));
  // speed 1 = 0.3s/char, speed 5 = 0.05s/char
  return 0.35 - clampedSpeed * 0.06;
}

/**
 * Generate typing-style SVG
 */
export function generateTypingSvg(options: Partial<SvgOptions>): string {
  const opts: SvgOptions = { ...defaultOptions, ...options };

  const lines = parseTextLines(opts.text);
  const color = normalizeColor(opts.color);
  const bg = normalizeColor(opts.bg);
  const charDuration = getCharDuration(opts.speed);

  // Calculate height per line
  const lineHeight = opts.fontSize * 1.5;
  const totalTextHeight = lines.length * lineHeight;
  const startY = (opts.height - totalTextHeight) / 2 + opts.fontSize;

  // Generate animation for each line
  const textElements: string[] = [];
  const cursorPositions: Array<{ x: number; y: number; time: number }> = [];
  let totalDelay = 0;

  lines.forEach((line, lineIndex) => {
    const y = startY + lineIndex * lineHeight;
    const chars = line.split('');

    // Calculate X position for each character (assumes monospace font)
    const charWidth = opts.fontSize * 0.6;
    const lineWidth = chars.length * charWidth;
    const startX = (opts.width - lineWidth) / 2;

    chars.forEach((char, charIndex) => {
      const delay = totalDelay + charIndex * charDuration;
      const displayChar = char === ' ' ? '&#160;' : escapeXml(char);
      const x = startX + charIndex * charWidth;
      const cursorX = x + charWidth;

      // For the first character, add initial cursor position at time 0
      if (charIndex === 0 && lineIndex === 0) {
        cursorPositions.push({
          x: cursorX,
          y: y,
          time: 0,
        });
      }

      textElements.push(`
    <text
      x="${x}"
      y="${y}"
      fill="#${color}"
      font-family="'${opts.font}', monospace"
      font-size="${opts.fontSize}"
      opacity="0"
    >
      ${displayChar}
      <animate
        attributeName="opacity"
        from="0"
        to="1"
        dur="0.1s"
        begin="${delay.toFixed(2)}s"
        fill="freeze"
      />
    </text>`);

      // Add cursor position after character is fully displayed
      cursorPositions.push({
        x: cursorX,
        y: y,
        time: delay + 0.1, // Character display animation completes
      });
    });

    // Calculate start delay for next line
    totalDelay += chars.length * charDuration + 0.5;
  });

  // Cursor animation
  const cursorHeight = opts.fontSize;
  const totalDuration = totalDelay + 1;
  const cursorWidth = opts.fontSize * 0.1; // Make cursor width thin

  // Generate positions and times for animate values attribute
  const xValues = cursorPositions.map((pos) => pos.x).join(';');
  const yValues = cursorPositions
    .map((pos) => pos.y - cursorHeight + 4)
    .join(';');
  const keyTimes = cursorPositions
    .map((pos) => (pos.time / totalDuration).toFixed(3))
    .join(';');

  const cursor = `
    <rect
      x="0"
      y="0"
      width="${cursorWidth}"
      height="${cursorHeight}"
      fill="#${color}"
    >
      <animate
        attributeName="x"
        values="${xValues}"
        keyTimes="${keyTimes}"
        dur="${totalDuration}s"
        fill="freeze"
      />
      <animate
        attributeName="y"
        values="${yValues}"
        keyTimes="${keyTimes}"
        dur="${totalDuration}s"
        fill="freeze"
      />
      <animate
        attributeName="opacity"
        values="1;1;0;0"
        keyTimes="0;0.5;0.5;1"
        dur="0.5s"
        repeatCount="indefinite"
      />
    </rect>`;

  // Generate font style (embed Press Start 2P font as Base64)
  let fontStyle = '';
  if (opts.font === 'Press Start 2P' && PRESS_START_2P_FONT_BASE64) {
    fontStyle = `
  <defs>
    <style>
      @font-face {
        font-family: 'Press Start 2P';
        font-style: normal;
        font-weight: 400;
        src: url(data:font/woff2;base64,${PRESS_START_2P_FONT_BASE64}) format('woff2');
      }
    </style>
  </defs>`;
  }

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${opts.width}"
  height="${opts.height}"
  viewBox="0 0 ${opts.width} ${opts.height}"
>
  ${fontStyle}
  <rect width="100%" height="100%" fill="#${bg}" />
  ${textElements.join('')}
  ${cursor}
</svg>`;
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
