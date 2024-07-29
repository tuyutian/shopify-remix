import {Session} from "@shopify/shopify-api";
import type {SessionStorage} from "@shopify/shopify-app-session-storage";
import type {PrismaClient, sessions as Row} from "@prisma/client";
import {Prisma} from "@prisma/client";
import AppService from "~/services/appService";

interface PrismaSessionStorageOptions {
  tableName?: string;
  connectionRetries?: number;
  connectionRetryIntervalMs?: number;
}

const UNIQUE_KEY_CONSTRAINT_ERROR_CODE = 'P2002';

export class PrismaSessionStorage<T extends PrismaClient>
  implements SessionStorage
{
  private ready: Promise<any>;
  private readonly tableName: string = 'sessions';
  private connectionRetries = 2;
  private connectionRetryIntervalMs = 5000;

  constructor(
    private prisma: T,
    {
      tableName,
      connectionRetries,
      connectionRetryIntervalMs,
    }: PrismaSessionStorageOptions = {},
  ) {
    if (tableName) {
      this.tableName = tableName;
    }

    if (connectionRetries !== undefined) {
      this.connectionRetries = connectionRetries;
    }

    if (connectionRetryIntervalMs !== undefined) {
      this.connectionRetryIntervalMs = connectionRetryIntervalMs;
    }

    if (this.getSessionTable() === undefined) {
      throw new Error(`PrismaClient does not have a ${this.tableName} table`);
    }

    this.ready = this.pollForTable().catch((cause) => {
      throw new MissingSessionTableError(
        `Prisma ${this.tableName} table does not exist. This could happen for a few reasons, see https://github.com/Shopify/shopify-app-js/tree/main/packages/apps/session-storage/shopify-app-session-storage-prisma#troubleshooting for more information`,
        cause,
      );
    });
  }

  public async storeSession(session: Session): Promise<boolean> {
    await this.ready;

    const data = this.sessionToRow(session);

    try {
      await this.getSessionTable().upsert({
        where: {session_id: session.id},
        update: data,
        create: data,
      });
      await this.createUserBySession(session)
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === UNIQUE_KEY_CONSTRAINT_ERROR_CODE
      ) {
        console.log(
          'Caught PrismaClientKnownRequestError P2002 - Unique Key Key Constraint, retrying upsert.',
        );
        await this.getSessionTable().upsert({
          where: {session_id: session.id},
          update: data,
          create: data,
        });
        await this.createUserBySession(session)
        return true;
      }
      throw error;
    }

    return true;
  }

  private async createUserBySession(session:Session) {
    if (session.id) {
      return await AppService.saveUser(session.id)
    }
    return true;
  }
  
  public async loadSession(id: string): Promise<Session | undefined> {
    await this.ready;

    const row = await this.getSessionTable().findUnique({
      where: {session_id: id},
    });

    if (!row) {
      return undefined;
    }

    return this.rowToSession(row);
  }

  public async deleteSession(id: string): Promise<boolean> {
    await this.ready;

    try {
      await this.getSessionTable().delete({where: {session_id:id}});
    } catch {
      return true;
    }

    return true;
  }

  public async deleteSessions(ids: string[]): Promise<boolean> {
    await this.ready;

    await this.getSessionTable().deleteMany({where: {session_id: {in: ids}}});

    return true;
  }

  public async findSessionsByShop(shop: string): Promise<Session[]> {
    await this.ready;

    const sessions = await this.getSessionTable().findMany({
      where: {shop},
      take: 25,
      orderBy: [{expires_at: 'desc'}],
    });

    return sessions.map((session) => this.rowToSession(session));
  }

  private async pollForTable(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let retries = 0;
      const doPoll = () => {
        this.getSessionTable()
          .count()
          .then(() => {
            resolve();
          })
          .catch((error) => {
            if (retries < this.connectionRetries) {
              retries++;
              setTimeout(doPoll, this.connectionRetryIntervalMs);
            } else {
              reject(error);
            }
          });
      };

      doPoll();
    });
  }

  private sessionToRow(session: Session): Row {
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

  rowToSession(row: Row): Session {
    const sessionParams: Record<string, boolean | string | number> = {
      id: row.session_id,
      shop: row.shop ?? "",
      state: row.state ?? "",
      isOnline: !!row.is_online,
      userId: String(row.user_id),
      firstName: String(row.user_first_name),
      lastName: String(row.user_last_name),
      email: String(row.user_email),
      locale: String(row.locale)
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
      sessionParams.expires = row.expires_at.getTime();
    }

    if (row.scope) {
      sessionParams.scope = row.scope;
    }
    if (row.access_token) {
      sessionParams.accessToken = row.access_token;
    }

    return Session.fromPropertyArray(Object.entries(sessionParams), true);
  }

  private getSessionTable(): T['sessions'] {
    return (this.prisma as any)[this.tableName];
  }
}

export class MissingSessionTableError extends Error {
  constructor(
    message: string,
    public readonly cause: Error,
  ) {
    super(message);
  }
}
