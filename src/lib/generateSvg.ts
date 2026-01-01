/**
 * タイピング風SVG生成ライブラリ
 * GitHub README対応（SMIL/CSSアニメーション使用、JS不使用）
 */

import { PRESS_START_2P_FONT_BASE64 } from './fontData';

export interface SvgOptions {
  /** 表示テキスト（カンマ区切りで複数行対応） */
  text: string;
  /** フォントサイズ（px） */
  fontSize: number;
  /** SVG幅（px） */
  width: number;
  /** SVG高さ（px） */
  height: number;
  /** テキスト色（HEX、#なし） */
  color: string;
  /** 背景色（HEX、#なし） */
  bg: string;
  /** アニメーション速度（1=遅い、5=速い） */
  speed: number;
  /** フォントファミリー */
  font: string;
}

/** デフォルト設定 */
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
 * テキストをパースして行配列に変換
 */
function parseTextLines(text: string): string[] {
  return text
    .split(',')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * HEXカラーを検証・正規化
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
 * 速度からアニメーション時間を計算（文字あたり）
 */
function getCharDuration(speed: number): number {
  const clampedSpeed = Math.max(1, Math.min(5, speed));
  // speed 1 = 0.3s/char, speed 5 = 0.05s/char
  return 0.35 - clampedSpeed * 0.06;
}

/**
 * タイピング風SVGを生成
 */
export function generateTypingSvg(options: Partial<SvgOptions>): string {
  const opts: SvgOptions = { ...defaultOptions, ...options };

  const lines = parseTextLines(opts.text);
  const color = normalizeColor(opts.color);
  const bg = normalizeColor(opts.bg);
  const charDuration = getCharDuration(opts.speed);

  // 行ごとの高さを計算
  const lineHeight = opts.fontSize * 1.5;
  const totalTextHeight = lines.length * lineHeight;
  const startY = (opts.height - totalTextHeight) / 2 + opts.fontSize;

  // 各行のアニメーションを生成
  const textElements: string[] = [];
  const cursorPositions: Array<{ x: number; y: number; time: number }> = [];
  let totalDelay = 0;

  lines.forEach((line, lineIndex) => {
    const y = startY + lineIndex * lineHeight;
    const chars = line.split('');

    // 各文字のX位置を計算（等幅フォント想定）
    const charWidth = opts.fontSize * 0.6;
    const lineWidth = chars.length * charWidth;
    const startX = (opts.width - lineWidth) / 2;

    // 行の最初の位置をカーソル位置に追加
    cursorPositions.push({
      x: startX,
      y: y,
      time: totalDelay,
    });

    chars.forEach((char, charIndex) => {
      const delay = totalDelay + charIndex * charDuration;
      const displayChar = char === ' ' ? '&#160;' : escapeXml(char);
      const x = startX + charIndex * charWidth;

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

      // 次の文字の位置をカーソル位置に追加
      cursorPositions.push({
        x: x + charWidth,
        y: y,
        time: delay + charDuration,
      });
    });

    // 次の行の開始遅延を計算
    totalDelay += chars.length * charDuration + 0.5;
  });

  // カーソルのアニメーション
  const cursorHeight = opts.fontSize;
  const totalDuration = totalDelay + 1;
  const cursorWidth = opts.fontSize * 0.1; // カーソルの幅を細く

  // animateのvalues属性用の位置とタイムを生成
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

  // フォントスタイルを生成（Press Start 2P フォントをBase64埋め込み）
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
 * XML特殊文字をエスケープ
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
