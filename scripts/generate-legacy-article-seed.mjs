import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const sourceArticlePath = path.join(rootDir, 'src', 'data', 'articles.ts');
const outputMigrationPath = path.join(
  rootDir,
  'supabase',
  'migrations',
  '20260402113000_seed_legacy_articles_with_translations.sql',
);

const assetCopies = [
  {
    variable: 'restApiGolangCover',
    source: path.join(rootDir, 'src', 'assets', 'article-rest-api-golang.png'),
    publicPath: '/legacy-articles/article-rest-api-golang.png',
  },
  {
    variable: 'expMe',
    source: path.join(rootDir, 'src', 'assets', 'article-exp-me.png'),
    publicPath: '/legacy-articles/article-exp-me.png',
  },
  {
    variable: 'dockerArticleCover',
    source: path.join(rootDir, 'src', 'assets', 'docker-artikel-1.png'),
    publicPath: '/legacy-articles/docker-artikel-1.png',
  },
  {
    variable: 'dockerContainerVsVmImage',
    source: path.join(rootDir, 'src', 'assets', 'docker-containervsvm.png'),
    publicPath: '/legacy-articles/docker-containervsvm.png',
  },
];

const escapeSqlString = (value) => `'${String(value).replace(/'/g, "''")}'`;

const toJsonbLiteral = (value) => `${escapeSqlString(JSON.stringify(value))}::jsonb`;

const toTextArrayLiteral = (items) => `array[${items.map(escapeSqlString).join(', ')}]::text[]`;

const toTimestamptzLiteral = (date) => `${escapeSqlString(`${date}T00:00:00.000Z`)}::timestamptz`;

const toArticleValueTuple = (article) => `(
  ${escapeSqlString(article.title)},
  ${escapeSqlString(article.slug)},
  ${escapeSqlString(article.excerpt)},
  ${toJsonbLiteral(article.sections)},
  ${toJsonbLiteral(article.translations ?? {})},
  ${escapeSqlString(article.image)},
  ${escapeSqlString(article.imageAlt)},
  ${escapeSqlString(article.category)},
  ${toTextArrayLiteral(article.tags)},
  ${escapeSqlString(article.readTime)},
  ${escapeSqlString(article.author)},
  null::uuid,
  'published'::text,
  ${toTimestamptzLiteral(article.date)}
)`;

const generateMigrationSql = (articles) => `insert into public.articles (
  title,
  slug,
  excerpt,
  content,
  translations,
  cover_image_url,
  cover_image_alt,
  category,
  tags,
  read_time,
  author_name,
  author_id,
  status,
  published_at
)
values
${articles.map(toArticleValueTuple).join(',\n')}
on conflict (slug) do update
set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  translations = excluded.translations,
  cover_image_url = excluded.cover_image_url,
  cover_image_alt = excluded.cover_image_alt,
  category = excluded.category,
  tags = excluded.tags,
  read_time = excluded.read_time,
  author_name = excluded.author_name,
  author_id = coalesce(public.articles.author_id, excluded.author_id),
  status = excluded.status,
  published_at = excluded.published_at;
`;

const copyLegacyAssets = async () => {
  const targetDir = path.join(rootDir, 'public', 'legacy-articles');
  await fs.mkdir(targetDir, { recursive: true });

  await Promise.all(assetCopies.map(async ({ source, publicPath }) => {
    const fileName = path.basename(publicPath);
    await fs.copyFile(source, path.join(targetDir, fileName));
  }));
};

const loadArticles = async () => {
  let source = await fs.readFile(sourceArticlePath, 'utf8');

  for (const { variable, publicPath } of assetCopies) {
    const importPattern = new RegExp(`import\\s+${variable}\\s+from\\s+'[^']+';`);
    source = source.replace(importPattern, `const ${variable} = '${publicPath}';`);
  }

  source = source.replace(/import type \{[^}]+\} from '\.\.\/types';\s*/g, '');

  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: sourceArticlePath,
  });

  const context = {
    exports: {},
    module: { exports: {} },
  };

  vm.runInNewContext(transpiled.outputText, context, {
    filename: 'generated-articles.cjs',
  });

  const exportedArticles = context.module.exports.articles ?? context.exports.articles;
  if (!Array.isArray(exportedArticles)) {
    throw new Error('Failed to evaluate src/data/articles.ts');
  }

  return exportedArticles;
};

const main = async () => {
  await copyLegacyAssets();

  const articles = await loadArticles();
  const sql = generateMigrationSql(articles);
  await fs.writeFile(outputMigrationPath, sql, 'utf8');

  process.stdout.write(
    `Generated ${path.relative(rootDir, outputMigrationPath)} for ${articles.length} article(s).\n`,
  );
};

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exitCode = 1;
});
