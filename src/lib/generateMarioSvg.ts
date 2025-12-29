/**
 * マリオ風SVG生成ライブラリ
 * GitHub README対応（SMIL/CSSアニメーション使用、JS不使用）
 */

import { PRESS_START_2P_FONT_BASE64 } from './fontData';

export interface MarioSvgOptions {
  /** 表示テキスト */
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
  /** 技術スタック（カンマ区切り） */
  skills: string;
  /** フォントファミリー */
  font: string;
}

/** デフォルト設定 */
export const defaultMarioOptions: MarioSvgOptions = {
  text: 'FULL STACK DEVELOPER',
  fontSize: 24,
  width: 800,
  height: 250,
  color: 'FFFF00',
  bg: '5C94FC',
  skills: 'React,Vue,Java,Python,Node',
  font: 'Press Start 2P',
};

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

/**
 * マリオキャラクターをドット絵で描画（簡略版）
 */
function createMarioCharacter(x: number, y: number, scale: number = 1): string {
  const s = scale * 3; // ピクセルサイズ

  // マリオの簡略版ドット絵（8x8ピクセル）
  const pixels = [
    [0,0,1,1,1,1,0,0], // 帽子
    [0,1,1,1,1,1,1,0],
    [0,2,2,3,3,2,0,0], // 顔
    [0,2,3,3,3,2,2,0],
    [0,2,3,3,3,2,2,2],
    [0,0,3,3,3,3,0,0],
    [0,4,1,4,4,1,4,0], // 体
    [4,4,4,0,0,4,4,4], // 足
  ];

  const colors = ['none', '#E80000', '#FFB991', '#000000', '#0000FF'];

  let pixelsSvg = '';
  pixels.forEach((row, i) => {
    row.forEach((colorIndex, j) => {
      if (colorIndex !== 0) {
        pixelsSvg += `<rect x="${x + j * s}" y="${y + i * s}" width="${s}" height="${s}" fill="${colors[colorIndex]}"/>`;
      }
    });
  });

  return `<g>${pixelsSvg}</g>`;
}

/**
 * コインを描画
 */
function createCoin(x: number, y: number, delay: number = 0): string {
  return `
    <g>
      <circle cx="${x}" cy="${y}" r="12" fill="#FFD700" stroke="#FFA500" stroke-width="2">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 ${x} ${y}"
          to="360 ${x} ${y}"
          dur="2s"
          begin="${delay}s"
          repeatCount="indefinite"
        />
      </circle>
      <text x="${x}" y="${y + 5}" font-size="16" font-weight="bold" fill="#FFA500" text-anchor="middle">$</text>
      <animate
        attributeName="opacity"
        values="0;1;1"
        keyTimes="0;0.3;1"
        dur="1s"
        begin="${delay}s"
        fill="freeze"
      />
    </g>`;
}

/**
 * ハテナブロックを描画
 */
function createQuestionBlock(x: number, y: number, delay: number = 0): string {
  return `
    <g>
      <rect x="${x}" y="${y}" width="30" height="30" fill="#E8A000" stroke="#8B5A00" stroke-width="2" rx="2"/>
      <rect x="${x + 2}" y="${y + 2}" width="26" height="26" fill="#F0B000" stroke="#8B5A00" stroke-width="1"/>
      <text x="${x + 15}" y="${y + 22}" font-size="20" font-weight="bold" fill="#FFFFFF" text-anchor="middle">?</text>
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0,0; 0,-10; 0,0"
        keyTimes="0;0.5;1"
        dur="0.6s"
        begin="${delay}s"
        fill="freeze"
      />
    </g>`;
}

/**
 * 技術スタックアイコンを作成（シンプルなロゴ風）
 */
function createTechIcon(tech: string, x: number, y: number, delay: number, opts: MarioSvgOptions): string {
  // 技術ごとの色とロゴ
  const techConfig: Record<string, { color: string; logo: string }> = {
    'React': { color: '#61DAFB', logo: '⚛' },
    'Vue': { color: '#42B883', logo: 'V' },
    'Angular': { color: '#DD0031', logo: 'A' },
    'Java': { color: '#007396', logo: '☕' },
    'Python': { color: '#3776AB', logo: '🐍' },
    'Node': { color: '#339933', logo: '⬢' },
    'TypeScript': { color: '#3178C6', logo: 'TS' },
    'JavaScript': { color: '#F7DF1E', logo: 'JS' },
    'Go': { color: '#00ADD8', logo: 'Go' },
    'Rust': { color: '#000000', logo: '🦀' },
    'PHP': { color: '#777BB4', logo: 'PHP' },
    'Ruby': { color: '#CC342D', logo: '💎' },
    'C++': { color: '#00599C', logo: 'C++' },
    'Docker': { color: '#2496ED', logo: '🐳' },
    'Kubernetes': { color: '#326CE5', logo: 'K8s' },
    'AWS': { color: '#FF9900', logo: 'AWS' },
    'Git': { color: '#F05032', logo: 'Git' },
  };

  const config = techConfig[tech] || { color: '#888888', logo: tech.substring(0, 2).toUpperCase() };

  return `
    <g id="tech-${tech}-${delay}">
      <!-- アイコンの背景 -->
      <rect x="${x}" y="${y}" width="50" height="50" rx="8" fill="${config.color}" stroke="#000" stroke-width="2">
        <animate
          attributeName="opacity"
          values="1;1;0"
          keyTimes="0;0.9;1"
          dur="0.3s"
          begin="mario-hit-${tech}.begin"
          fill="freeze"
        />
      </rect>

      <!-- ロゴテキスト -->
      <text x="${x + 25}" y="${y + 35}" font-size="24" font-weight="bold" fill="#FFF" text-anchor="middle">
        ${escapeXml(config.logo)}
        <animate
          attributeName="opacity"
          values="1;1;0"
          keyTimes="0;0.9;1"
          dur="0.3s"
          begin="mario-hit-${tech}.begin"
          fill="freeze"
        />
      </text>

      <!-- 技術名 -->
      <text x="${x + 25}" y="${y + 68}" font-size="10" fill="#FFF" text-anchor="middle" font-family="'Press Start 2P', monospace">
        ${escapeXml(tech)}
        <animate
          attributeName="opacity"
          values="1;1;0"
          keyTimes="0;0.9;1"
          dur="0.3s"
          begin="mario-hit-${tech}.begin"
          fill="freeze"
        />
      </text>

      <!-- 右から左への移動アニメーション -->
      <animateMotion
        path="M 0,0 L -${opts.width + 100},0"
        dur="5s"
        begin="${delay}s"
        fill="freeze"
      />

      <!-- ヒット時の回転・縮小アニメーション -->
      <animateTransform
        id="mario-hit-${tech}"
        attributeName="transform"
        type="rotate"
        from="0 ${x + 25} ${y + 25}"
        to="360 ${x + 25} ${y + 25}"
        dur="0.3s"
        begin="indefinite"
        fill="freeze"
      />
      <animateTransform
        attributeName="transform"
        type="scale"
        additive="sum"
        values="1;0"
        dur="0.3s"
        begin="mario-hit-${tech}.begin"
        fill="freeze"
      />
    </g>`;
}

/**
 * マリオが走って技術アイコンを倒すアニメーション
 */
function generateRunningMario(opts: MarioSvgOptions): string {
  const color = normalizeColor(opts.color);
  const escapedText = escapeXml(opts.text);

  // 技術スタックを解析
  const skills = opts.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);

  // マリオの位置
  const marioY = opts.height - 120;
  const marioX = 100;

  // マリオキャラクター（走るアニメーション）
  const mario = `
    <g id="mario-runner">
      ${createMarioCharacter(marioX, marioY, 2.5)}
      <!-- 走るアニメーション（足の動き） -->
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0,0; 0,2; 0,0; 0,-2; 0,0"
        keyTimes="0;0.25;0.5;0.75;1"
        dur="0.4s"
        repeatCount="indefinite"
      />
    </g>`;

  // 技術アイコンを生成（右から流れてくる）
  const techIcons = skills.map((tech, i) => {
    const startX = opts.width + 100 + (i * 150);
    const iconY = marioY - 10;
    const delay = 2 + (i * 1.2); // 順番に出現

    return createTechIcon(tech, startX, iconY, delay, opts);
  }).join('');

  // テキスト表示（上部）
  const textY = 40;
  const text = `
    <text
      x="50%"
      y="${textY}"
      fill="#${color}"
      font-family="'${opts.font}', monospace"
      font-size="${opts.fontSize}"
      text-anchor="middle"
      stroke="#000000"
      stroke-width="3"
      paint-order="stroke"
    >
      ${escapedText}
      <animate
        attributeName="opacity"
        from="0"
        to="1"
        dur="1s"
        fill="freeze"
      />
    </text>`;

  // スコア表示（倒した技術の数）
  const scoreText = `
    <text
      x="30"
      y="30"
      fill="#FFFFFF"
      font-family="'${opts.font}', monospace"
      font-size="16"
      stroke="#000000"
      stroke-width="2"
      paint-order="stroke"
    >
      SCORE: ${skills.length * 100}
    </text>`;

  // コインエフェクト（倒した時に出現）
  const coinEffects = skills.map((tech, i) => {
    const delay = 2 + (i * 1.2) + 2.5; // アイコンが倒される時間
    return `
      <g>
        ${createCoin(marioX + 60, marioY - 20, delay)}
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,-50"
          dur="0.8s"
          begin="${delay}s"
          fill="freeze"
        />
      </g>`;
  }).join('');

  // 各技術アイコンのヒット判定トリガー
  const hitTriggers = skills.map((tech, i) => {
    const hitTime = 2 + (i * 1.2) + 2.5;
    return `
      <set attributeName="display" to="none" begin="${hitTime}s" />
      <animate attributeName="opacity" from="1" to="1" dur="0.01s" begin="${hitTime}s"
               onbegin="document.getElementById('tech-${tech}-${2 + (i * 1.2)}').getElementsByTagName('animateTransform')[3].beginElement();" />`;
  }).join('');

  return `${mario}${techIcons}${text}${scoreText}${coinEffects}`;
}

/**
 * マリオ風SVGを生成
 */
export function generateMarioSvg(options: Partial<MarioSvgOptions>): string {
  const opts: MarioSvgOptions = { ...defaultMarioOptions, ...options };

  const bg = normalizeColor(opts.bg);

  // マリオが走って技術を倒すアニメーション
  const content = generateRunningMario(opts);

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

  // 地面を追加（マリオらしさを出すため）
  const ground = `
    <rect x="0" y="${opts.height - 40}" width="${opts.width}" height="40" fill="#8B4513"/>
    <rect x="0" y="${opts.height - 38}" width="${opts.width}" height="4" fill="#A0522D"/>`;

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${opts.width}"
  height="${opts.height}"
  viewBox="0 0 ${opts.width} ${opts.height}"
>
  ${fontStyle}
  <rect width="100%" height="100%" fill="#${bg}" />
  ${ground}
  ${content}
</svg>`;
}
