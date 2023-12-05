import type { Request, Response, NextFunction } from 'express';
import type { autoIndexOptions } from './interface';
/**
 * `express-autoindex` middleware reproduces a directory listing like Nginx, Apache, etc...
 *
 * @param {string} root path to the public directory
 * @param {autoIndexOptions | undefined} options middleware options
 */
declare const _default: (root: string, options?: autoIndexOptions | undefined) => (req: Request, res: Response, next: NextFunction) => void;
export default _default;
//# sourceMappingURL=index.d.ts.map