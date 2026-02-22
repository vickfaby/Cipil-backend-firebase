import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route as public (no auth required).
 * Use on endpoints that must work without Authorization header (e.g. GET image for <img src>).
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
