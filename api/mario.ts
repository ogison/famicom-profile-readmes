import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateMarioSvg, defaultMarioOptions, getSkillIconName } from '../src/lib/generateMarioSvg';

/**
 * skillicons.devの画像を取得してBase64エンコードする
 */
async function fetchSkillIconAsDataUri(skillName: string, theme: 'light' | 'dark'): Promise<string> {
  try {
    const iconName = getSkillIconName(skillName);
    const url = `https://skillicons.dev/icons?i=${iconName}&theme=${theme}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch icon: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // SVG形式の場合
    const contentType = response.headers.get('content-type') || 'image/svg+xml';
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error(`Failed to fetch skill icon for ${skillName}:`, error);
    // エラーの場合は空のData URIを返す
    return '';
  }
}

/**
 * GitHub Octocat風SVG生成APIエンドポイント（ファミコン風ドット絵アニメーション）
 *
 * 使用例:
 * GET /api/mario?text=FULL+STACK+DEVELOPER&skills=React,Vue,Java,Python&bg=5C94FC
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { text, fontSize, color, bg, skills, font, useSkillIcons, skillIconsTheme } = req.query;

    // パラメータを解析
    // 注意: width/heightは常に400x250に固定（ユーザー設定不可）
    const options = {
      text: parseString(text) || defaultMarioOptions.text,
      fontSize: parseNumber(fontSize) || defaultMarioOptions.fontSize,
      width: 400,
      height: 250,
      color: parseString(color) || defaultMarioOptions.color,
      bg: parseString(bg) || defaultMarioOptions.bg,
      skills: parseString(skills) || defaultMarioOptions.skills,
      font: parseString(font) || defaultMarioOptions.font,
      useSkillIcons: parseBoolean(useSkillIcons) ?? defaultMarioOptions.useSkillIcons,
      skillIconsTheme: (parseString(skillIconsTheme) as 'light' | 'dark') || defaultMarioOptions.skillIconsTheme,
      skillIconDataUris: {} as Record<string, string>,
    };

    // skillicons.devを使用する場合、各アイコンをData URIとして取得
    if (options.useSkillIcons) {
      const skillsList = options.skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      // 並列で全てのアイコンを取得
      const dataUris = await Promise.all(
        skillsList.map((skill) => fetchSkillIconAsDataUri(skill, options.skillIconsTheme))
      );

      // スキル名とData URIをマッピング
      skillsList.forEach((skill, index) => {
        options.skillIconDataUris[skill] = dataUris[index];
      });
    }

    // SVGを生成
    const svg = generateMarioSvg(options);

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
 * クエリパラメータをブール値として解析
 */
function parseBoolean(value: string | string[] | undefined): boolean | undefined {
  const str = parseString(value);
  if (str === undefined) {
    return undefined;
  }
  return str === 'true' || str === '1';
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
