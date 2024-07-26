import type {SessionParams} from "@shopify/shopify-api";
import {Session} from "@shopify/shopify-api";
import type {PrismaClient} from "@prisma/client";
import {Prisma} from "@prisma/client";
import type {SessionStorage} from "@shopify/shopify-app-session-storage";

const UNIQUE_KEY_CONSTRAINT_ERROR_CODE = "P2002";



class MysqlSessionStorage<T extends PrismaClient> implements SessionStorage {
  prisma: T;
  ready;
  readonly tableName = "sessions";

  constructor(prisma: T) {
    this.prisma = prisma;
    this.ready = this.getSessionTable()
      .count()
      .catch((cause: Error) => {
        throw new MissingSessionTableError(`Prisma ${this.tableName} table does not exist. This could happen for a few reasons, see https://github.com/Shopify/shopify-app-js/tree/main/packages/apps/session-storage/shopify-app-session-storage-prisma#troubleshooting for more information`, cause);
      });
  }

  async storeSession(session: Session): Promise<boolean> {
    await this.ready;
    const createData = this.sessionToRow(session);
    const updateData = {...createData}
    try {
      await this.getSessionTable().upsert({
        where: {session_id: session.id},
        update: createData,
        create: updateData,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === UNIQUE_KEY_CONSTRAINT_ERROR_CODE) {
        console.log("Caught PrismaClientKnownRequestError P2002 - Unique Key Key Constraint, retrying upsert.");
        await this.getSessionTable().upsert({
          where: {session_id: session.id},
          update: createData,
          create: updateData,
        });
        return true;
      }
      throw error;
    }
    return true;
  }

  async loadSession(id: string): Promise<Session | undefined> {
    await this.ready;
    const row = await this.getSessionTable().findUnique({
      where: {session_id: id},
    });
    if (!row) {
      return undefined;
    }
    return this.rowToSession(row);
  }

  async deleteSession(id: string): Promise<boolean> {
    await this.ready;
    try {
      await this.getSessionTable().delete({where: {session_id:id}});
    } catch {
      return true;
    }
    return true;
  }

  async deleteSessions(ids: string[]): Promise<boolean> {
    await this.ready;
    await this.getSessionTable().deleteMany({where: {session_id: {in: ids}}});
    return true;
  }

  async findSessionsByShop(shop: string): Promise<Session[]> {
    await this.ready;
    const sessions = await this.getSessionTable().findMany({
      where: {shop},
      take: 25,
      orderBy: [{expires_at: "desc"}],
    });
    return sessions.map((session) => this.rowToSession(session));
  }

  sessionToRow(session: Session) {
    const sessionParams = session.toObject();
    return {
      created_at: new Date(),
      updated_at: new Date(),
      shop: session.shop,
      state: session.state,
      is_online: session.isOnline ? 1 : 0,
      session_id: session.id,
      scope: session.scope || null,
      expires_at: session.expires || null,
      access_token: session.accessToken || "",
      user_id: sessionParams.onlineAccessInfo?.associated_user
        .id ? BigInt(Math.floor(sessionParams.onlineAccessInfo?.associated_user
        .id)) : null,
      user_first_name: sessionParams.onlineAccessInfo?.associated_user.first_name || null,
      user_last_name: sessionParams.onlineAccessInfo?.associated_user.last_name || null,
      user_email: sessionParams.onlineAccessInfo?.associated_user.email || null,
      account_owner: sessionParams.onlineAccessInfo?.associated_user.account_owner ? 1 : 0,
      locale: sessionParams.onlineAccessInfo?.associated_user.locale || null,
      collaborator: sessionParams.onlineAccessInfo?.associated_user.collaborator ? 1 : 0,
      user_email_verified: sessionParams.onlineAccessInfo?.associated_user.email_verified ? 1 : 0,
    };
  }

  rowToSession(row: { session_id: string; shop: string; is_online: number; state: string; created_at: Date | null; updated_at: Date | null; scope: string | null; access_token: string | null; expires_at: Date | null; user_id: bigint | null; user_first_name: string | null; user_last_name: string | null; user_email: string | null; user_email_verified: number | null; account_owner: number | null; locale: string | null; collaborator: number | null; uid: bigint | null; }): Session {
    const sessionParams: SessionParams = {
      id: row.session_id,
      shop: row.shop ?? "",
      state: row.state ?? "",
      isOnline: !!row.is_online,
      userId: String(row.user_id),
      firstName: String(row.user_first_name),
      lastName: String(row.user_last_name),
      email: String(row.user_email),
      locale: String(row.locale),
    };
    if (row.account_owner !== null) {
      sessionParams.accountOwner = row.account_owner;
    }
    if (row.collaborator !== null) {
      sessionParams.collaborator = row.collaborator;
    }
    if (row.user_email_verified !== null) {
      sessionParams.emailVerified = row.user_email_verified;
    }
    if (row.expires_at) {
      sessionParams.expires = new Date(row.expires_at);
    }
    if (row.scope) {
      sessionParams.scope = row.scope;
    }
    if (row.access_token) {
      sessionParams.accessToken = row.access_token;
    }
    return Session.fromPropertyArray(Object.entries(sessionParams), true);
  }

  getSessionTable() {
    return this.prisma[this.tableName];
  }
}

class MissingSessionTableError extends Error {
  cause: Error;

  constructor(message: string, cause: Error) {
    super(message);
    this.cause = cause;
  }
}

export {MissingSessionTableError, MysqlSessionStorage};
//# sourceMappingURL=prisma.mjs.map
