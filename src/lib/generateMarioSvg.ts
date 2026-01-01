/**
 * GitHub Octocat-style SVG generation library (Famicom-style pixel art animation)
 * GitHub README compatible (uses SMIL/CSS animations, no JS)
 */

import { PRESS_START_2P_FONT_BASE64 } from './fontData';

export interface MarioSvgOptions {
  /** Display text */
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
  /** Tech stack (comma-separated) */
  skills: string;
  /** Font family */
  font: string;
  /** Whether to use skillicons.dev icons */
  useSkillIcons: boolean;
  /** skillicons theme (light/dark) */
  skillIconsTheme: 'light' | 'dark';
  /** Skill icon SVG content (skill name -> SVG string mapping) */
  skillIconSvgs?: Record<string, string>;
}

/** Default settings */
export const defaultMarioOptions: MarioSvgOptions = {
  text: 'FULL STACK DEVELOPER',
  fontSize: 24,
  width: 400,
  height: 250,
  color: 'FFFF00',
  bg: '5C94FC',
  skills: 'React,Vue,Java,Python,Node',
  font: 'Press Start 2P',
  useSkillIcons: false,
  skillIconsTheme: 'dark',
};

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

/**
 * Draw Octocat character in pixel art (3 variations)
 */
function createOctocatCharacter(
  x: number,
  y: number,
  scale: number = 1,
  variant: number = 0
): string {
  const s = scale * 3; // Pixel size

  // Octocat pixel art patterns (10x10 pixels, 3 variations)
  const octocatVariants = [
    // Variation 1: Basic front-facing form
    [
      [0, 0, 0, 1, 0, 0, 1, 0, 0, 0], // Cat ears
      [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 2, 2, 1, 0], // Head
      [1, 2, 2, 3, 2, 2, 3, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1], // Face
      [1, 2, 2, 4, 4, 4, 4, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 2, 2, 1, 0], // Body
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 0, 1, 0, 0, 1, 0, 1, 0], // Tentacle legs
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    ],
    // Variation 2: Running form (legs moving)
    [
      [0, 0, 0, 1, 0, 0, 1, 0, 0, 0], // Cat ears
      [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 2, 2, 1, 0], // Head
      [1, 2, 2, 3, 2, 2, 3, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1], // Face
      [1, 2, 2, 4, 4, 4, 4, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 2, 2, 1, 0], // Body
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 1, 1, 0, 1, 0, 0], // Tentacle legs (movement 1)
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    ],
    // Variation 3: Jumping form
    [
      [0, 0, 0, 1, 0, 0, 1, 0, 0, 0], // Cat ears
      [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 2, 2, 1, 0], // Head
      [1, 2, 2, 3, 2, 2, 3, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1], // Face
      [1, 2, 2, 4, 4, 4, 4, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 2, 2, 1, 0], // Body
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [1, 0, 0, 1, 0, 0, 1, 0, 0, 1], // Tentacle legs (spread out)
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    ],
  ];

  // Color definitions (GitHub Octocat-style)
  // 0: Transparent, 1: Black (outline), 2: Gray (body), 3: White (eyes), 4: Pink (mouth)
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
 * Draw coin
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
 * Draw question block
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
 * Get skillicons.dev icon name from tech name
 */
export function getSkillIconName(tech: string): string {
  const mapping: Record<string, string> = {
    React: 'react',
    Vue: 'vue',
    Angular: 'angular',
    Java: 'java',
    Python: 'python',
    Node: 'nodejs',
    TypeScript: 'ts',
    JavaScript: 'js',
    Go: 'go',
    Rust: 'rust',
    PHP: 'php',
    Ruby: 'ruby',
    'C++': 'cpp',
    C: 'c',
    'C#': 'cs',
    Docker: 'docker',
    Kubernetes: 'kubernetes',
    AWS: 'aws',
    Git: 'git',
    GitHub: 'github',
    GitLab: 'gitlab',
    HTML: 'html',
    CSS: 'css',
    MongoDB: 'mongodb',
    MySQL: 'mysql',
    PostgreSQL: 'postgres',
    Redis: 'redis',
    Figma: 'figma',
    Linux: 'linux',
    VSCode: 'vscode',
    Django: 'django',
    Flask: 'flask',
    Laravel: 'laravel',
    Express: 'express',
    Kotlin: 'kotlin',
    Swift: 'swift',
    Flutter: 'flutter',
    NextJS: 'nextjs',
    NuxtJS: 'nuxtjs',
    Svelte: 'svelte',
    Tailwind: 'tailwind',
    Bootstrap: 'bootstrap',
    Sass: 'sass',
    Webpack: 'webpack',
    Vite: 'vite',
    Firebase: 'firebase',
    Supabase: 'supabase',
    GraphQL: 'graphql',
    Prisma: 'prisma',
    Vercel: 'vercel',
    Netlify: 'netlify',
    Heroku: 'heroku',
    Nginx: 'nginx',
    Bash: 'bash',
    PowerShell: 'powershell',
    Vim: 'vim',
    Neovim: 'neovim',
    Electron: 'electron',
    'React Native': 'react',
    Unity: 'unity',
    Unreal: 'unreal',
    Blender: 'blender',
    Postman: 'postman',
    Jest: 'jest',
    Cypress: 'cypress',
    Selenium: 'selenium',
    Jenkins: 'jenkins',
    Azure: 'azure',
    GCP: 'gcp',
    Cloudflare: 'cloudflare',
    DigitalOcean: 'digitalocean',
    Terraform: 'terraform',
    Ansible: 'ansible',
  };

  return mapping[tech] || tech.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Get color corresponding to tech name
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
 * Calculate fly direction (unified to upper-right diagonal)
 */
function getFlyDirection(index: number): { x: number; y: number } {
  // All fly straight at 45 degrees to the upper right
  return { x: 350, y: -350 };
}

/**
 * Create tech stack icon (Famicom-style pixel art badge or skillicons.dev)
 */
function createTechIcon(
  tech: string,
  x: number,
  y: number,
  delay: number,
  opts: MarioSvgOptions,
  index: number = 0,
  octocatX: number = 100
): string {
  const colors = getTechColor(tech);
  const iconSize = 50;
  const pixelSize = 4;
  const flyDir = getFlyDirection(index);

  // Position-based collision detection
  // Calculate Octocat size (scale 2.2, pixel size 3, 10x10 dots)
  const octocatScale = 2.2;
  const octocatPixelSize = 3;
  const octocatWidth = 10 * octocatPixelSize * octocatScale; // About 66 pixels

  // Collision position (where Octocat's center and icon's center overlap)
  const collisionX = octocatX + octocatWidth / 2 + iconSize / 2;

  // Icon movement parameters (move from each icon's start position to off-screen)
  const totalMoveDistance = x + 100; // Move from start position beyond left edge
  const animationDuration = 5; // Seconds

  // Distance from icon's start position to collision
  const moveToCollision = x - collisionX;

  // When using skillicons.dev
  let badge: string;
  if (opts.useSkillIcons) {
    // Use SVG content if provided, otherwise fall back to pixel art
    if (opts.skillIconSvgs && opts.skillIconSvgs[tech] && opts.skillIconSvgs[tech].trim() !== '') {
      const svgContent = opts.skillIconSvgs[tech];
      // Extract the inner content of the SVG (remove outer <svg> tag)
      const svgMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
      const innerSvg = svgMatch ? svgMatch[1] : svgContent;

      // Use <g> tag instead of nested <svg> to avoid GitHub sanitizer issues
      // Scale from 256x256 (skillicons viewBox) to iconSize (50)
      const scale = iconSize / 256;

      badge = `
    <!-- skillicons.dev icon embedded -->
    <g transform="scale(${scale})">
      ${innerSvg}
    </g>
  `;
    } else {
      // Fall back to pixel art badge if SVG content is not available
      const colors = getTechColor(tech);
      badge = `
    <!-- Badge background (pixel-style rounded corners) -->
    <rect x="${x + pixelSize}" y="${y}" width="${iconSize - pixelSize * 2}" height="${pixelSize}" fill="${colors.bg}"/>
    <rect x="${x}" y="${y + pixelSize}" width="${iconSize}" height="${iconSize - pixelSize * 2}" fill="${colors.bg}"/>
    <rect x="${x + pixelSize}" y="${y + iconSize - pixelSize}" width="${iconSize - pixelSize * 2}" height="${pixelSize}" fill="${colors.bg}"/>

    <!-- Pixel-style border -->
    <rect x="${x + pixelSize}" y="${y}" width="${iconSize - pixelSize * 2}" height="${pixelSize}" fill="none" stroke="#000" stroke-width="1"/>
    <rect x="${x}" y="${y + pixelSize}" width="${pixelSize}" height="${iconSize - pixelSize * 2}" fill="#000"/>
    <rect x="${x + iconSize - pixelSize}" y="${y + pixelSize}" width="${pixelSize}" height="${iconSize - pixelSize * 2}" fill="#000"/>
    <rect x="${x + pixelSize}" y="${y + iconSize - pixelSize}" width="${iconSize - pixelSize * 2}" height="${pixelSize}" fill="none" stroke="#000" stroke-width="1"/>

    <!-- First letter of tech name -->
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
    }
  } else {
    // Famicom-style pixel art badge
    const colors = getTechColor(tech);
    badge = `
    <!-- Badge background (pixel-style rounded corners) -->
    <rect x="${x + pixelSize}" y="${y}" width="${iconSize - pixelSize * 2}" height="${pixelSize}" fill="${colors.bg}"/>
    <rect x="${x}" y="${y + pixelSize}" width="${iconSize}" height="${iconSize - pixelSize * 2}" fill="${colors.bg}"/>
    <rect x="${x + pixelSize}" y="${y + iconSize - pixelSize}" width="${iconSize - pixelSize * 2}" height="${pixelSize}" fill="${colors.bg}"/>

    <!-- Pixel-style border -->
    <rect x="${x + pixelSize}" y="${y}" width="${iconSize - pixelSize * 2}" height="${pixelSize}" fill="none" stroke="#000" stroke-width="1"/>
    <rect x="${x}" y="${y + pixelSize}" width="${pixelSize}" height="${iconSize - pixelSize * 2}" fill="#000"/>
    <rect x="${x + iconSize - pixelSize}" y="${y + pixelSize}" width="${pixelSize}" height="${iconSize - pixelSize * 2}" fill="#000"/>
    <rect x="${x + pixelSize}" y="${y + iconSize - pixelSize}" width="${iconSize - pixelSize * 2}" height="${pixelSize}" fill="none" stroke="#000" stroke-width="1"/>

    <!-- First letter of tech name -->
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
  }

  // Calculate animation duration
  const collisionDuration = (moveToCollision / totalMoveDistance) * animationDuration; // Duration until collision
  const flyDuration = 0.8; // Duration of flight
  const totalAnimDuration = collisionDuration + flyDuration;

  // Calculate keyTimes (collision time position in 0-1 range)
  const collisionKeyTime = collisionDuration / totalAnimDuration;

  return `
    <g id="tech-${tech}-${delay}">
      <g transform="translate(${x}, ${y})">
        ${badge}
        <animate
          attributeName="opacity"
          values="1;1;0"
          keyTimes="0;${collisionKeyTime};1"
          dur="${totalAnimDuration}s"
          begin="${delay}s"
          repeatCount="indefinite"
        />
      </g>

      <!-- Tech name -->
      <text x="${x + iconSize / 2}" y="${y + iconSize + 18}" font-size="10" fill="#FFF" text-anchor="middle" font-family="'Press Start 2P', monospace" stroke="#000" stroke-width="1" paint-order="stroke">
        ${escapeXml(tech)}
        <animate
          attributeName="opacity"
          values="1;1;0"
          keyTimes="0;${collisionKeyTime};1"
          dur="${totalAnimDuration}s"
          begin="${delay}s"
          repeatCount="indefinite"
        />
      </text>

      <!-- Movement animation: horizontal movement until collision, then straight diagonal flight -->
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0,0; -${moveToCollision},0; ${-moveToCollision + flyDir.x},${flyDir.y}"
        keyTimes="0; ${collisionKeyTime}; 1"
        dur="${totalAnimDuration}s"
        begin="${delay}s"
        repeatCount="indefinite"
      />
    </g>`;
}

/**
 * Octocat running and knocking down tech icons animation
 */
function generateRunningMario(opts: MarioSvgOptions): string {
  // Parse tech stack
  const skills = opts.skills
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // Octocat position (left-aligned for width 400)
  const octocatY = opts.height - 130;
  const octocatX = 50;

  // Octocat character (running animation switching between 3 variations)
  const octocat = `
    <g id="octocat-runner">
      <!-- Variation 1: Basic form -->
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
      <!-- Variation 2: Running -->
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
      <!-- Variation 3: Jump -->
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
      <!-- Running animation (up and down movement) -->
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0,0; 0,3; 0,0; 0,-3; 0,0"
        keyTimes="0;0.25;0.5;0.75;1"
        dur="0.6s"
        repeatCount="indefinite"
      />
    </g>`;

  // Generate tech icons (flowing from right, looped for continuous stream)
  const hasSkills = skills.length > 0;
  const minFlowIcons = 8;
  const flowCount = hasSkills ? Math.max(skills.length, minFlowIcons) : 0;
  const flowSkills = hasSkills
    ? Array.from({ length: flowCount }, (_, i) => skills[i % skills.length])
    : [];
  const delaySpacing = 0.8;
  const baseDelay = 0.5;
  const startX = opts.width + 50;

  const techIcons = flowSkills
    .map((tech, i) => {
      const iconY = octocatY - 10;
      const delay = baseDelay + i * delaySpacing; // Appear in sequence (steady tempo)

      return createTechIcon(tech, startX, iconY, delay, opts, i, octocatX);
    })
    .join('');

  // Score display (number of tech knocked down)
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

  return `${octocat}${techIcons}${scoreText}`;
}

/**
 * Generate GitHub Octocat-style SVG (Famicom-style pixel art)
 */
export function generateMarioSvg(options: Partial<MarioSvgOptions>): string {
  const opts: MarioSvgOptions = { ...defaultMarioOptions, ...options };

  const bg = normalizeColor(opts.bg);

  // Octocat running and knocking down tech animation
  const content = generateRunningMario(opts);

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

  // Add ground (retro game style)
  const ground = `
    <rect x="0" y="${opts.height - 40}" width="${opts.width}" height="40" fill="#8B4513"/>
    <rect x="0" y="${opts.height - 38}" width="${opts.width}" height="4" fill="#A0522D"/>`;

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
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
