/**
 * フォントをBase64エンコードして静的ファイルとして出力するスクリプト
 */

import * as fs from 'fs';
import * as path from 'path';

const FONT_PATHS = [
  'node_modules/@fontsource/press-start-2p/files/press-start-2p-latin-400-normal.woff2',
  'src/fonts/PressStart2P.woff2',
];

const OUTPUT_PATH = 'src/lib/fontData.ts';

function main() {
  let fontBase64 = '';

  for (const fontPath of FONT_PATHS) {
    const fullPath = path.join(process.cwd(), fontPath);
    if (fs.existsSync(fullPath)) {
      const fontBuffer = fs.readFileSync(fullPath);
      fontBase64 = fontBuffer.toString('base64');
      console.log(`Font loaded from: ${fontPath}`);
      break;
    }
  }

  if (!fontBase64) {
    console.error('Font file not found!');
    process.exit(1);
  }

  const content = `/**
 * Press Start 2P フォントのBase64データ
 * このファイルはビルド時に自動生成されます
 */

export const PRESS_START_2P_FONT_BASE64 = '${fontBase64}';
`;

  const outputFullPath = path.join(process.cwd(), OUTPUT_PATH);
  fs.writeFileSync(outputFullPath, content, 'utf-8');
  console.log(`Font data written to: ${OUTPUT_PATH}`);
  console.log(`Base64 length: ${fontBase64.length} characters`);
}

main();
