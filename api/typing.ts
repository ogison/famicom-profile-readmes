import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateTypingSvg, defaultOptions } from '../src/lib/generateSvg';

/**
 * タイピング風SVG生成APIエンドポイント
 *
 * 使用例:
 * GET /api/typing?text=HELLO+WORLD&color=E80000&bg=000000&speed=3
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      text,
      fontSize,
      width,
      height,
      color,
      bg,
      speed,
      font,
    } = req.query;

    // パラメータを解析
    const options = {
      text: parseString(text) || defaultOptions.text,
      fontSize: parseNumber(fontSize) || defaultOptions.fontSize,
      width: parseNumber(width) || defaultOptions.width,
      height: parseNumber(height) || defaultOptions.height,
      color: parseString(color) || defaultOptions.color,
      bg: parseString(bg) || defaultOptions.bg,
      speed: parseNumber(speed) || defaultOptions.speed,
      font: parseString(font) || defaultOptions.font,
    };

    // SVGを生成
    const svg = generateTypingSvg(options);

    // レスポンスヘッダーを設定
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');

    // SVGを返す
    res.status(200).send(svg);
  } catch (error) {
    console.error('SVG generation error:', error);
    res.status(500).send(generateErrorSvg('Internal Server Error'));
  }
}

/**
 * クエリパラメータを文字列として解析
 */
function parseString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

/**
 * クエリパラメータを数値として解析
 */
function parseNumber(value: string | string[] | undefined): number | undefined {
  const str = parseString(value);
  if (str === undefined) {
    return undefined;
  }
  const num = parseInt(str, 10);
  return isNaN(num) ? undefined : num;
}

/**
 * エラー表示用SVGを生成
 */
function generateErrorSvg(message: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="50">
  <rect width="100%" height="100%" fill="#1a1a1a"/>
  <text x="50%" y="50%" fill="#ff0000" font-family="monospace" font-size="14" text-anchor="middle" dominant-baseline="middle">
    Error: ${message}
  </text>
</svg>`;
}
