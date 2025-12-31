/**
 * GitHub Octocat風SVG生成ライブラリ（ファミコン風ドット絵アニメーション）
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
 * Octocatキャラクターをドット絵で描画（3つのバリエーション）
 */
function createOctocatCharacter(
  x: number,
  y: number,
  scale: number = 1,
  variant: number = 0
): string {
  const s = scale * 3; // ピクセルサイズ

  // Octocatのドット絵パターン（10x10ピクセル、3種類のバリエーション）
  const octocatVariants = [
    // バリエーション1: 正面向き基本形
    [
      [0, 0, 0, 1, 0, 0, 1, 0, 0, 0], // 猫耳
      [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 2, 2, 1, 0], // 頭
      [1, 2, 2, 3, 2, 2, 3, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1], // 顔
      [1, 2, 2, 4, 4, 4, 4, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 2, 2, 1, 0], // 体
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 0, 1, 0, 0, 1, 0, 1, 0], // タコの足
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    ],
    // バリエーション2: 走っている形（足が動いている）
    [
      [0, 0, 0, 1, 0, 0, 1, 0, 0, 0], // 猫耳
      [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 2, 2, 1, 0], // 頭
      [1, 2, 2, 3, 2, 2, 3, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1], // 顔
      [1, 2, 2, 4, 4, 4, 4, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 2, 2, 1, 0], // 体
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 1, 1, 0, 1, 0, 0], // タコの足（動き1）
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    ],
    // バリエーション3: ジャンプしている形
    [
      [0, 0, 0, 1, 0, 0, 1, 0, 0, 0], // 猫耳
      [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 2, 2, 1, 0], // 頭
      [1, 2, 2, 3, 2, 2, 3, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1], // 顔
      [1, 2, 2, 4, 4, 4, 4, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 2, 2, 1, 0], // 体
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [1, 0, 0, 1, 0, 0, 1, 0, 0, 1], // タコの足（広がっている）
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    ],
  ];

  // 色の定義（GitHub Octocat風）
  // 0: 透明, 1: 黒（アウトライン）, 2: グレー（体）, 3: 白（目）, 4: ピンク（口）
  const colors = ['none', '#24292f', '#6e7781', '#ffffff', '#ff69b4'];

  const pixels = octocatVariants[variant % 3];

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
 * 技術名に対応するカラーを取得
 */
function getTechColor(tech: string): { bg: string; text: string } {
  const colors: Record<string, { bg: string; text: string }> = {
    React: { bg: '#61DAFB', text: '#000000' },
    Vue: { bg: '#4FC08D', text: '#000000' },
    Angular: { bg: '#DD0031', text: '#FFFFFF' },
    Java: { bg: '#007396', text: '#FFFFFF' },
    Python: { bg: '#3776AB', text: '#FFD43B' },
    Node: { bg: '#339933', text: '#FFFFFF' },
    TypeScript: { bg: '#3178C6', text: '#FFFFFF' },
    JavaScript: { bg: '#F7DF1E', text: '#000000' },
    Go: { bg: '#00ADD8', text: '#FFFFFF' },
    Rust: { bg: '#000000', text: '#F74C00' },
    PHP: { bg: '#777BB4', text: '#FFFFFF' },
    Ruby: { bg: '#CC342D', text: '#FFFFFF' },
    'C++': { bg: '#00599C', text: '#FFFFFF' },
    C: { bg: '#A8B9CC', text: '#000000' },
    'C#': { bg: '#239120', text: '#FFFFFF' },
    Docker: { bg: '#2496ED', text: '#FFFFFF' },
    Kubernetes: { bg: '#326CE5', text: '#FFFFFF' },
    AWS: { bg: '#FF9900', text: '#000000' },
    Git: { bg: '#F05032', text: '#FFFFFF' },
    GitHub: { bg: '#181717', text: '#FFFFFF' },
    GitLab: { bg: '#FC6D26', text: '#FFFFFF' },
    HTML: { bg: '#E34F26', text: '#FFFFFF' },
    CSS: { bg: '#1572B6', text: '#FFFFFF' },
    MongoDB: { bg: '#47A248', text: '#FFFFFF' },
    MySQL: { bg: '#4479A1', text: '#FFFFFF' },
    PostgreSQL: { bg: '#336791', text: '#FFFFFF' },
    Redis: { bg: '#DC382D', text: '#FFFFFF' },
    Figma: { bg: '#F24E1E', text: '#FFFFFF' },
    Linux: { bg: '#FCC624', text: '#000000' },
    VSCode: { bg: '#007ACC', text: '#FFFFFF' },
    Django: { bg: '#092E20', text: '#FFFFFF' },
    Flask: { bg: '#000000', text: '#FFFFFF' },
    Laravel: { bg: '#FF2D20', text: '#FFFFFF' },
    Express: { bg: '#000000', text: '#FFFFFF' },
    Kotlin: { bg: '#7F52FF', text: '#FFFFFF' },
    Swift: { bg: '#F05138', text: '#FFFFFF' },
    Flutter: { bg: '#02569B', text: '#FFFFFF' },
  };

  return colors[tech] || { bg: '#6e7781', text: '#FFFFFF' };
}

/**
 * 飛んでいく方向を計算（インデックスに基づいてバリエーション）
 */
function getFlyDirection(index: number): { x: number; y: number } {
  // 様々な方向に飛ばす（上方向をメインに、斜め方向も含む）
  const directions = [
    { x: -100, y: -400 }, // 左上に飛ぶ
    { x: 200, y: -350 }, // 右上に飛ぶ
    { x: -150, y: -300 }, // 左上（浅め）
    { x: 250, y: -450 }, // 右上（高め）
    { x: 0, y: -500 }, // 真上に飛ぶ
    { x: -200, y: -380 }, // 左上に飛ぶ
    { x: 180, y: -420 }, // 右上に飛ぶ
  ];
  return directions[index % directions.length];
}

/**
 * 技術スタックアイコンを作成（ファミコン風ピクセルアートバッジ）
 */
function createTechIcon(
  tech: string,
  x: number,
  y: number,
  delay: number,
  opts: MarioSvgOptions,
  index: number = 0
): string {
  const colors = getTechColor(tech);
  const iconSize = 50;
  const pixelSize = 4;
  const flyDir = getFlyDirection(index);

  // ファミコン風のピクセルアートバッジ
  const badge = `
    <!-- バッジ背景（ピクセル風の角丸） -->
    <rect x="${x + pixelSize}" y="${y}" width="${iconSize - pixelSize * 2}" height="${pixelSize}" fill="${colors.bg}"/>
    <rect x="${x}" y="${y + pixelSize}" width="${iconSize}" height="${iconSize - pixelSize * 2}" fill="${colors.bg}"/>
    <rect x="${x + pixelSize}" y="${y + iconSize - pixelSize}" width="${iconSize - pixelSize * 2}" height="${pixelSize}" fill="${colors.bg}"/>

    <!-- ピクセル風の枠線 -->
    <rect x="${x + pixelSize}" y="${y}" width="${iconSize - pixelSize * 2}" height="${pixelSize}" fill="none" stroke="#000" stroke-width="1"/>
    <rect x="${x}" y="${y + pixelSize}" width="${pixelSize}" height="${iconSize - pixelSize * 2}" fill="#000"/>
    <rect x="${x + iconSize - pixelSize}" y="${y + pixelSize}" width="${pixelSize}" height="${iconSize - pixelSize * 2}" fill="#000"/>
    <rect x="${x + pixelSize}" y="${y + iconSize - pixelSize}" width="${iconSize - pixelSize * 2}" height="${pixelSize}" fill="none" stroke="#000" stroke-width="1"/>

    <!-- 技術名の頭文字 -->
    <text
      x="${x + iconSize / 2}"
      y="${y + iconSize / 2 + 8}"
      font-size="20"
      font-weight="bold"
      fill="${colors.text}"
      text-anchor="middle"
      font-family="'Press Start 2P', monospace"
    >${escapeXml(tech.charAt(0).toUpperCase())}</text>
  `;

  return `
    <g id="tech-${tech}-${delay}">
      <g>
        ${badge}
        <animate
          attributeName="opacity"
          values="1;1;0"
          keyTimes="0;0.7;1"
          dur="0.8s"
          begin="mario-hit-${tech}.begin"
          fill="freeze"
        />
      </g>

      <!-- 技術名 -->
      <text x="${x + iconSize / 2}" y="${y + iconSize + 18}" font-size="10" fill="#FFF" text-anchor="middle" font-family="'Press Start 2P', monospace" stroke="#000" stroke-width="1" paint-order="stroke">
        ${escapeXml(tech)}
        <animate
          attributeName="opacity"
          values="1;1;0"
          keyTimes="0;0.7;1"
          dur="0.8s"
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

      <!-- ヒット時の回転アニメーション -->
      <animateTransform
        id="mario-hit-${tech}"
        attributeName="transform"
        type="rotate"
        from="0 ${x + iconSize / 2} ${y + iconSize / 2}"
        to="${720 + (index % 3) * 180} ${x + iconSize / 2} ${y + iconSize / 2}"
        dur="0.8s"
        begin="indefinite"
        fill="freeze"
      />
      <!-- ヒット時の画面外に飛ぶアニメーション -->
      <animateTransform
        attributeName="transform"
        type="translate"
        additive="sum"
        values="0,0; ${flyDir.x},${flyDir.y}"
        dur="0.8s"
        begin="mario-hit-${tech}.begin"
        fill="freeze"
      />
    </g>`;
}

/**
 * Octocatが走って技術アイコンを倒すアニメーション
 */
function generateRunningMario(opts: MarioSvgOptions): string {
  // 技術スタックを解析
  const skills = opts.skills
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // Octocatの位置
  const octocatY = opts.height - 130;
  const octocatX = 100;

  // Octocatキャラクター（3つのバリエーションを切り替えながら走るアニメーション）
  const octocat = `
    <g id="octocat-runner">
      <!-- バリエーション1: 基本形 -->
      <g id="octocat-var-0">
        ${createOctocatCharacter(octocatX, octocatY, 2.2, 0)}
        <animate
          attributeName="opacity"
          values="1;0;0;1"
          keyTimes="0;0.33;0.67;1"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </g>
      <!-- バリエーション2: 走り -->
      <g id="octocat-var-1">
        ${createOctocatCharacter(octocatX, octocatY, 2.2, 1)}
        <animate
          attributeName="opacity"
          values="0;1;0;0"
          keyTimes="0;0.33;0.67;1"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </g>
      <!-- バリエーション3: ジャンプ -->
      <g id="octocat-var-2">
        ${createOctocatCharacter(octocatX, octocatY, 2.2, 2)}
        <animate
          attributeName="opacity"
          values="0;0;1;0"
          keyTimes="0;0.33;0.67;1"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </g>
      <!-- 走るアニメーション（上下の動き） -->
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0,0; 0,3; 0,0; 0,-3; 0,0"
        keyTimes="0;0.25;0.5;0.75;1"
        dur="0.6s"
        repeatCount="indefinite"
      />
    </g>`;

  // 技術アイコンを生成（右から流れてくる）
  const techIcons = skills
    .map((tech, i) => {
      const startX = opts.width + 100 + i * 150;
      const iconY = octocatY - 10;
      const delay = 2 + i * 1.2; // 順番に出現

      return createTechIcon(tech, startX, iconY, delay, opts, i);
    })
    .join('');

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
  const coinEffects = skills
    .map((tech, i) => {
      const delay = 2 + i * 1.2 + 2.5; // アイコンが倒される時間
      return `
      <g>
        ${createCoin(octocatX + 70, octocatY - 20, delay)}
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,-50"
          dur="0.8s"
          begin="${delay}s"
          fill="freeze"
        />
      </g>`;
    })
    .join('');

  // 各技術アイコンのヒット判定トリガー
  const hitTriggers = skills
    .map((tech, i) => {
      const hitTime = 2 + i * 1.2 + 2.5;
      return `
      <set attributeName="display" to="none" begin="${hitTime}s" />
      <animate attributeName="opacity" from="1" to="1" dur="0.01s" begin="${hitTime}s"
               onbegin="document.getElementById('tech-${tech}-${2 + i * 1.2}').getElementsByTagName('animateTransform')[3].beginElement();" />`;
    })
    .join('');

  return `${octocat}${techIcons}${scoreText}${coinEffects}`;
}

/**
 * GitHub Octocat風SVGを生成（ファミコン風ドット絵）
 */
export function generateMarioSvg(options: Partial<MarioSvgOptions>): string {
  const opts: MarioSvgOptions = { ...defaultMarioOptions, ...options };

  const bg = normalizeColor(opts.bg);

  // Octocatが走って技術を倒すアニメーション
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

  // 地面を追加（レトロゲーム風）
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
