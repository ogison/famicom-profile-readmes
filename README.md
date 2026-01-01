# Typing SVG API

A Vercel Serverless Functions API that generates **typing animation SVGs** displayable on GitHub README.

**🎮 デプロイ済みURL**: https://famicom-profile-readmes.vercel.app/

## 日本語ガイド

### 使い方

GitHub READMEにタイピングアニメーションを追加できます。以下のようにMarkdownに記述するだけです：

```markdown
![Typing SVG](https://famicom-profile-readmes.vercel.app/api/typing?text=Hello+World)
```

### 基本的な使用例

#### シンプルなメッセージ
```markdown
![Typing SVG](https://famicom-profile-readmes.vercel.app/api/typing?text=HELLO+WORLD)
```

#### レトロゲーム風
```markdown
![Typing SVG](https://famicom-profile-readmes.vercel.app/api/typing?text=GAME+START&color=00FF00&bg=000000&fontSize=20)
```

#### ターミナル風
```markdown
![Typing SVG](https://famicom-profile-readmes.vercel.app/api/typing?text=$+npm+install&color=FFFFFF&bg=1E1E1E&font=monospace)
```

#### 複数行メッセージ
カンマ区切りでテキストを指定すると、順番にタイピングアニメーションが表示されます：

```markdown
![Typing SVG](https://famicom-profile-readmes.vercel.app/api/typing?text=Welcome,to+my+profile,Have+a+nice+day!&width=500&height=120)
```

### カスタマイズパラメータ

| パラメータ | 説明 | デフォルト値 | 例 |
| --- | --- | --- | --- |
| `text` | 表示するテキスト（カンマ区切りで複数行） | `Hello World` | `text=こんにちは+世界` |
| `fontSize` | フォントサイズ（px） | `20` | `fontSize=24` |
| `width` | SVGの幅（px） | `400` | `width=500` |
| `height` | SVGの高さ（px） | `50` | `height=100` |
| `color` | テキストの色（#なしのHEX） | `00FF00` | `color=E80000` |
| `bg` | 背景色（#なしのHEX） | `000000` | `bg=1a1a1a` |
| `speed` | アニメーション速度（1-5、5が最速） | `3` | `speed=4` |
| `font` | フォントファミリー | `Press Start 2P` | `font=monospace` |

### 注意事項

- GitHubのREADMEでは、キャッシュの影響で初回読み込み時のみアニメーションが再生される場合があります
- テキストが長すぎる、または行数が多すぎるとSVGサイズが大きくなり、パフォーマンスに影響する可能性があります
- テキストの長さに応じて`width`と`height`を適切に調整してください

---

## Overview

- **GitHub README Compatible**: Uses SMIL/CSS animations (no JavaScript required)
- **Customizable**: Specify text, colors, size, speed, and more via URL parameters
- **Multi-line Support**: Display multiple lines of text separated by commas
- **Retro Font**: Uses Press Start 2P font (Google Fonts)

## Deployment

### 1. Fork/Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/typing-svg-api.git
cd typing-svg-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Deploy to Vercel

#### Method A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Method B: From Vercel Dashboard

1. Log in to [Vercel](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Click "Deploy"

### 4. Deployment Complete

After deployment, you can access the API at a URL like:

```
https://your-project-name.vercel.app/api/typing?text=HELLO+WORLD
```

**Live Demo**: https://famicom-profile-readmes.vercel.app/

## Usage

### Basic Usage

```markdown
![Typing SVG](https://famicom-profile-readmes.vercel.app/api/typing?text=Hello+World)
```

### Customization Example

```markdown
![Typing SVG](https://famicom-profile-readmes.vercel.app/api/typing?text=HELLO+WORLD&color=E80000&bg=000000&speed=3&fontSize=24)
```

### Multi-line Text

Specify text separated by commas to display typing animations in sequence:

```markdown
![Typing SVG](https://famicom-profile-readmes.vercel.app/api/typing?text=Welcome,to+my+profile,Have+a+nice+day!&width=500&height=120)
```

## Parameters

| Parameter  | Description                                      | Default Value    | Example            |
| ---------- | ------------------------------------------------ | ---------------- | ------------------ |
| `text`     | Text to display (comma-separated for multi-line) | `Hello World`    | `text=HELLO+WORLD` |
| `fontSize` | Font size (px)                                   | `20`             | `fontSize=24`      |
| `width`    | SVG width (px)                                   | `400`            | `width=500`        |
| `height`   | SVG height (px)                                  | `50`             | `height=100`       |
| `color`    | Text color (HEX without #)                       | `00FF00`         | `color=E80000`     |
| `bg`       | Background color (HEX without #)                 | `000000`         | `bg=1a1a1a`        |
| `speed`    | Animation speed (1-5, 5 is fastest)              | `3`              | `speed=4`          |
| `font`     | Font family                                      | `Press Start 2P` | `font=monospace`   |

### Parameter Examples

#### Retro Game Style (Default)

```
/api/typing?text=GAME+START&color=00FF00&bg=000000
```

#### Terminal Style

```
/api/typing?text=$+npm+install&color=FFFFFF&bg=1E1E1E&font=monospace
```

#### Warning Message Style

```
/api/typing?text=WARNING:+System+Error&color=FF0000&bg=000000&speed=5
```

#### Multi-line Welcome Message

```
/api/typing?text=Welcome!,I+am+a+developer,Nice+to+meet+you&width=500&height=150&fontSize=16
```

## File Structure

```
/
├── api/
│   └── typing.ts          # API endpoint
├── src/
│   └── lib/
│       └── generateSvg.ts  # SVG generation library
├── package.json
├── tsconfig.json
├── vercel.json            # Vercel configuration
└── README.md
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Access `http://localhost:3000/api/typing?text=TEST` in your browser to test.

## Technical Specifications

- **Runtime**: Node.js (Vercel Serverless Functions)
- **Language**: TypeScript
- **Animation**: SMIL (Synchronized Multimedia Integration Language)
- **Font**: Google Fonts (Press Start 2P)
- **External Dependencies**: None (dotenv/config not used)

## Notes

- On GitHub README, some SMIL animations may only play once on initial load due to caching
- Very long text or many lines may increase SVG size and affect performance
- Adjust `width` and `height` appropriately based on text length

## License

MIT License

## References

- [github-readme-stats](https://github.com/anuraghazra/github-readme-stats)
- [readme-typing-svg](https://github.com/DenverCoder1/readme-typing-svg)
