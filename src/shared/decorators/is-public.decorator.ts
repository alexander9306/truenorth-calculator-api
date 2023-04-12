import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants';

/**
 * Decorator to mark an endpoint as public, indicating that it does not require
 * authentication or authorization.
 */
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
