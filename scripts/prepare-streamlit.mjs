/**
 * Streamlit Cloud 배포용 — dist 빌드 후 static/ 폴더로 복사
 */
import { cpSync, rmSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const env = {
  ...process.env,
  VITE_BASE_PATH: '/-/static/',
  VITE_GEMINI_API_KEY: '',
  VITE_YOUTUBE_API_KEY: '',
};

console.log('Building for Streamlit Cloud (base: /-/static/)...');
execSync('npm run build', { stdio: 'inherit', env });

if (existsSync('static')) rmSync('static', { recursive: true });
mkdirSync('static', { recursive: true });
cpSync('dist', 'static', { recursive: true });

writeFileSync(
  'static/runtime-config.js',
  'window.__RUNTIME_CONFIG__ = window.__RUNTIME_CONFIG__ || {};',
  'utf-8'
);

console.log('Done. static/ folder ready for Streamlit Cloud.');
