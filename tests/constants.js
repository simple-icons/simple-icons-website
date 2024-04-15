import path from 'node:path';
import {getDirnameFromImportMeta} from 'simple-icons/sdk';

const __dirname = getDirnameFromImportMeta(import.meta.url);

export const ARTIFACTS_DIR = path.resolve(__dirname, '_artifacts');
