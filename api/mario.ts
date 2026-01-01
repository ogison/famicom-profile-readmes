import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateMarioSvg, defaultMarioOptions, getSkillIconName } from '../src/lib/generateMarioSvg';

/**
 * Fetch skillicons.dev SVG content directly
 */
async function fetchSkillIconAsSvg(skillName: string, theme: 'light' | 'dark'): Promise<string> {
  try {
    const iconName = getSkillIconName(skillName);
    const url = `https://skillicons.dev/icons?i=${iconName}&theme=${theme}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch icon: ${response.status}`);
    }

    // Get SVG content as text
    const svgContent = await response.text();
    return svgContent;
  } catch (error) {
    console.error(`Failed to fetch skill icon for ${skillName}:`, error);
    // Return empty string on error
    return '';
  }
}

/**
 * GitHub Octocat-style SVG generation API endpoint (Famicom-style pixel art animation)
 *
 * Usage example:
 * GET /api/mario?text=FULL+STACK+DEVELOPER&skills=React,Vue,Java,Python&bg=5C94FC
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { text, fontSize, color, bg, skills, font, useSkillIcons, skillIconsTheme } = req.query;

    // Parse parameters
    // Note: width/height are fixed at 400x250 (user cannot customize)
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
      skillIconSvgs: {} as Record<string, string>,
    };

    // When using skillicons.dev, fetch each icon as SVG content
    if (options.useSkillIcons) {
      const skillsList = options.skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      // Fetch all icons in parallel
      const svgContents = await Promise.all(
        skillsList.map((skill) => fetchSkillIconAsSvg(skill, options.skillIconsTheme))
      );

      // Map skill names to SVG content
      skillsList.forEach((skill, index) => {
        options.skillIconSvgs[skill] = svgContents[index];
      });
    }

    // Generate SVG
    const svg = generateMarioSvg(options);

    // Set response headers
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');

    // Return SVG
    res.status(200).send(svg);
  } catch (error) {
    console.error('SVG generation error:', error);
    res.status(500).send(generateErrorSvg('Internal Server Error'));
  }
}

/**
 * Parse query parameter as string
 */
function parseString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

/**
 * Parse query parameter as number
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
 * Parse query parameter as boolean
 */
function parseBoolean(value: string | string[] | undefined): boolean | undefined {
  const str = parseString(value);
  if (str === undefined) {
    return undefined;
  }
  return str === 'true' || str === '1';
}

/**
 * Generate error display SVG
 */
function generateErrorSvg(message: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="50">
  <rect width="100%" height="100%" fill="#1a1a1a"/>
  <text x="50%" y="50%" fill="#ff0000" font-family="monospace" font-size="14" text-anchor="middle" dominant-baseline="middle">
    Error: ${message}
  </text>
</svg>`;
}
