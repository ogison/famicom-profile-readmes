# Typing SVG API

GitHub README で表示可能な**タイピング風アニメーションSVG**を生成する Vercel Serverless Functions API です。

## 概要

- **GitHub README 対応**: SMIL/CSS アニメーションを使用（JavaScript 不使用）
- **カスタマイズ可能**: テキスト、色、サイズ、速度などをURLパラメータで指定
- **複数行対応**: カンマ区切りで複数行のテキストを表示
- **レトロフォント**: Press Start 2P フォント（Google Fonts）を使用

## デプロイ方法

### 1. リポジトリをフォーク/クローン

```bash
git clone https://github.com/YOUR_USERNAME/typing-svg-api.git
cd typing-svg-api
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. Vercel にデプロイ

#### 方法A: Vercel CLI を使用

```bash
# Vercel CLI をインストール
npm i -g vercel

# デプロイ
vercel
```

#### 方法B: Vercel ダッシュボードから

1. [Vercel](https://vercel.com) にログイン
2. 「New Project」をクリック
3. GitHub リポジトリを選択
4. 「Deploy」をクリック

### 4. デプロイ完了

デプロイ後、以下のようなURLでAPIにアクセスできます:

```
https://your-project-name.vercel.app/api/typing?text=HELLO+WORLD
```

## 使い方

### 基本的な使い方

```markdown
![Typing SVG](https://your-domain.vercel.app/api/typing?text=Hello+World)
```

### カスタマイズ例

```markdown
![Typing SVG](https://your-domain.vercel.app/api/typing?text=HELLO+WORLD&color=E80000&bg=000000&speed=3&fontSize=24)
```

### 複数行テキスト

カンマ区切りでテキストを指定すると、順番にタイピングアニメーションが表示されます:

```markdown
![Typing SVG](https://your-domain.vercel.app/api/typing?text=Welcome,to+my+profile,Have+a+nice+day!&width=500&height=120)
```

## パラメータ一覧

| パラメータ | 説明 | デフォルト値 | 例 |
|-----------|------|-------------|-----|
| `text` | 表示するテキスト（カンマ区切りで複数行） | `Hello World` | `text=HELLO+WORLD` |
| `fontSize` | フォントサイズ（px） | `20` | `fontSize=24` |
| `width` | SVGの幅（px） | `400` | `width=500` |
| `height` | SVGの高さ（px） | `50` | `height=100` |
| `color` | テキストの色（HEX、#なし） | `00FF00` | `color=E80000` |
| `bg` | 背景色（HEX、#なし） | `000000` | `bg=1a1a1a` |
| `speed` | アニメーション速度（1-5、5が最速） | `3` | `speed=4` |
| `font` | フォントファミリー | `Press Start 2P` | `font=monospace` |

### パラメータ使用例

#### レトロゲーム風（デフォルト）

```
/api/typing?text=GAME+START&color=00FF00&bg=000000
```

#### ターミナル風

```
/api/typing?text=$+npm+install&color=FFFFFF&bg=1E1E1E&font=monospace
```

#### 警告メッセージ風

```
/api/typing?text=WARNING:+System+Error&color=FF0000&bg=000000&speed=5
```

#### 複数行ウェルカムメッセージ

```
/api/typing?text=Welcome!,I+am+a+developer,Nice+to+meet+you&width=500&height=150&fontSize=16
```

## ファイル構成

```
/
├── api/
│   └── typing.ts          # API エンドポイント
├── src/
│   └── lib/
│       └── generateSvg.ts  # SVG 生成ライブラリ
├── package.json
├── tsconfig.json
├── vercel.json            # Vercel 設定
└── README.md
```

## ローカル開発

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:3000/api/typing?text=TEST` にアクセスして確認できます。

## 技術仕様

- **ランタイム**: Node.js (Vercel Serverless Functions)
- **言語**: TypeScript
- **アニメーション**: SMIL（Synchronized Multimedia Integration Language）
- **フォント**: Google Fonts (Press Start 2P)
- **外部依存**: なし（dotenv/config 不使用）

## 注意事項

- GitHub の README では、一部の SMIL アニメーションがキャッシュによって初回しか再生されない場合があります
- 非常に長いテキストや多くの行を指定すると、SVG のサイズが大きくなりパフォーマンスに影響する可能性があります
- `width` と `height` はテキストの長さに応じて適切に調整してください

## ライセンス

MIT License

## 参考

- [github-readme-stats](https://github.com/anuraghazra/github-readme-stats)
- [readme-typing-svg](https://github.com/DenverCoder1/readme-typing-svg)
