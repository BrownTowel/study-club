import type { GlobalPermission, Session, PublicPage } from '@/lib/types/globals';

declare global {

  var PERMISSION_INFO: GlobalPermission | string;
  var SESSION: Session[];
  var SESSION_FILE_LOCK: boolean;
  var PUBLIC_PAGES: Promise<PublicPage[]>;
  var PRISMA_CLIENT: PrismaClient;
}

export {}
