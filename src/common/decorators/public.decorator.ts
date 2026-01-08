import { SetMetadata } from "@nestjs/common";


/**
 * Decorator to mark a route as public
 */
export const Public = () => SetMetadata('isPublic', true);
