import path from 'path';
import { fileURLToPath } from 'url';

export const getFileName = (importMetaUrl: string) => {
  const __filename = fileURLToPath(importMetaUrl);
  return path.basename(__filename);
}
