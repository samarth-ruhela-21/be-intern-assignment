import { MigrationInterface, QueryRunner } from "typeorm";

export class SocialFeatureSchema1771101703482 implements MigrationInterface {
    name = 'SocialFeatureSchema1771101703482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hashtags" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, CONSTRAINT "UQ_7fedde18872deb14e4889361d7b" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "post_likes" ("postsId" integer NOT NULL, "usersId" integer NOT NULL, PRIMARY KEY ("postsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e4b9fa42093474796954477662" ON "post_likes" ("postsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a2eba635b69777b11efb0ecca2" ON "post_likes" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "post_hashtags" ("postsId" integer NOT NULL, "hashtagsId" integer NOT NULL, PRIMARY KEY ("postsId", "hashtagsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aea7aa32b50c671eb48d7aeb82" ON "post_hashtags" ("postsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_93f4f6c26818edb5aa6b809856" ON "post_hashtags" ("hashtagsId") `);
        await queryRunner.query(`CREATE TABLE "user_follows" ("followerId" integer NOT NULL, "followingId" integer NOT NULL, PRIMARY KEY ("followerId", "followingId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6300484b604263eaae8a6aab88" ON "user_follows" ("followerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7c6c27f12c4e972eab4b3aaccb" ON "user_follows" ("followingId") `);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar(255) NOT NULL, "lastName" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "username" varchar(255) NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_4baf95322bd69fe419c26c5430c" UNIQUE ("username"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "firstName", "lastName", "email", "createdAt", "updatedAt") SELECT "id", "firstName", "lastName", "email", "createdAt", "updatedAt" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar(255) NOT NULL, "lastName" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "username" varchar(255) NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_4baf95322bd69fe419c26c5430c" UNIQUE ("username"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "firstName", "lastName", "email", "createdAt", "updatedAt", "username") SELECT "id", "firstName", "lastName", "email", "createdAt", "updatedAt", "username" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
        await queryRunner.query(`CREATE TABLE "temporary_posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, CONSTRAINT "FK_ae05faaa55c866130abef6e1fee" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_posts"("id", "content", "createdAt", "userId") SELECT "id", "content", "createdAt", "userId" FROM "posts"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`ALTER TABLE "temporary_posts" RENAME TO "posts"`);
        await queryRunner.query(`DROP INDEX "IDX_e4b9fa42093474796954477662"`);
        await queryRunner.query(`DROP INDEX "IDX_a2eba635b69777b11efb0ecca2"`);
        await queryRunner.query(`CREATE TABLE "temporary_post_likes" ("postsId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "FK_e4b9fa420934747969544776626" FOREIGN KEY ("postsId") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_a2eba635b69777b11efb0ecca24" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("postsId", "usersId"))`);
        await queryRunner.query(`INSERT INTO "temporary_post_likes"("postsId", "usersId") SELECT "postsId", "usersId" FROM "post_likes"`);
        await queryRunner.query(`DROP TABLE "post_likes"`);
        await queryRunner.query(`ALTER TABLE "temporary_post_likes" RENAME TO "post_likes"`);
        await queryRunner.query(`CREATE INDEX "IDX_e4b9fa42093474796954477662" ON "post_likes" ("postsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a2eba635b69777b11efb0ecca2" ON "post_likes" ("usersId") `);
        await queryRunner.query(`DROP INDEX "IDX_aea7aa32b50c671eb48d7aeb82"`);
        await queryRunner.query(`DROP INDEX "IDX_93f4f6c26818edb5aa6b809856"`);
        await queryRunner.query(`CREATE TABLE "temporary_post_hashtags" ("postsId" integer NOT NULL, "hashtagsId" integer NOT NULL, CONSTRAINT "FK_aea7aa32b50c671eb48d7aeb82b" FOREIGN KEY ("postsId") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_93f4f6c26818edb5aa6b809856f" FOREIGN KEY ("hashtagsId") REFERENCES "hashtags" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("postsId", "hashtagsId"))`);
        await queryRunner.query(`INSERT INTO "temporary_post_hashtags"("postsId", "hashtagsId") SELECT "postsId", "hashtagsId" FROM "post_hashtags"`);
        await queryRunner.query(`DROP TABLE "post_hashtags"`);
        await queryRunner.query(`ALTER TABLE "temporary_post_hashtags" RENAME TO "post_hashtags"`);
        await queryRunner.query(`CREATE INDEX "IDX_aea7aa32b50c671eb48d7aeb82" ON "post_hashtags" ("postsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_93f4f6c26818edb5aa6b809856" ON "post_hashtags" ("hashtagsId") `);
        await queryRunner.query(`DROP INDEX "IDX_6300484b604263eaae8a6aab88"`);
        await queryRunner.query(`DROP INDEX "IDX_7c6c27f12c4e972eab4b3aaccb"`);
        await queryRunner.query(`CREATE TABLE "temporary_user_follows" ("followerId" integer NOT NULL, "followingId" integer NOT NULL, CONSTRAINT "FK_6300484b604263eaae8a6aab88d" FOREIGN KEY ("followerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_7c6c27f12c4e972eab4b3aaccbf" FOREIGN KEY ("followingId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("followerId", "followingId"))`);
        await queryRunner.query(`INSERT INTO "temporary_user_follows"("followerId", "followingId") SELECT "followerId", "followingId" FROM "user_follows"`);
        await queryRunner.query(`DROP TABLE "user_follows"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_follows" RENAME TO "user_follows"`);
        await queryRunner.query(`CREATE INDEX "IDX_6300484b604263eaae8a6aab88" ON "user_follows" ("followerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7c6c27f12c4e972eab4b3aaccb" ON "user_follows" ("followingId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_7c6c27f12c4e972eab4b3aaccb"`);
        await queryRunner.query(`DROP INDEX "IDX_6300484b604263eaae8a6aab88"`);
        await queryRunner.query(`ALTER TABLE "user_follows" RENAME TO "temporary_user_follows"`);
        await queryRunner.query(`CREATE TABLE "user_follows" ("followerId" integer NOT NULL, "followingId" integer NOT NULL, PRIMARY KEY ("followerId", "followingId"))`);
        await queryRunner.query(`INSERT INTO "user_follows"("followerId", "followingId") SELECT "followerId", "followingId" FROM "temporary_user_follows"`);
        await queryRunner.query(`DROP TABLE "temporary_user_follows"`);
        await queryRunner.query(`CREATE INDEX "IDX_7c6c27f12c4e972eab4b3aaccb" ON "user_follows" ("followingId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6300484b604263eaae8a6aab88" ON "user_follows" ("followerId") `);
        await queryRunner.query(`DROP INDEX "IDX_93f4f6c26818edb5aa6b809856"`);
        await queryRunner.query(`DROP INDEX "IDX_aea7aa32b50c671eb48d7aeb82"`);
        await queryRunner.query(`ALTER TABLE "post_hashtags" RENAME TO "temporary_post_hashtags"`);
        await queryRunner.query(`CREATE TABLE "post_hashtags" ("postsId" integer NOT NULL, "hashtagsId" integer NOT NULL, PRIMARY KEY ("postsId", "hashtagsId"))`);
        await queryRunner.query(`INSERT INTO "post_hashtags"("postsId", "hashtagsId") SELECT "postsId", "hashtagsId" FROM "temporary_post_hashtags"`);
        await queryRunner.query(`DROP TABLE "temporary_post_hashtags"`);
        await queryRunner.query(`CREATE INDEX "IDX_93f4f6c26818edb5aa6b809856" ON "post_hashtags" ("hashtagsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_aea7aa32b50c671eb48d7aeb82" ON "post_hashtags" ("postsId") `);
        await queryRunner.query(`DROP INDEX "IDX_a2eba635b69777b11efb0ecca2"`);
        await queryRunner.query(`DROP INDEX "IDX_e4b9fa42093474796954477662"`);
        await queryRunner.query(`ALTER TABLE "post_likes" RENAME TO "temporary_post_likes"`);
        await queryRunner.query(`CREATE TABLE "post_likes" ("postsId" integer NOT NULL, "usersId" integer NOT NULL, PRIMARY KEY ("postsId", "usersId"))`);
        await queryRunner.query(`INSERT INTO "post_likes"("postsId", "usersId") SELECT "postsId", "usersId" FROM "temporary_post_likes"`);
        await queryRunner.query(`DROP TABLE "temporary_post_likes"`);
        await queryRunner.query(`CREATE INDEX "IDX_a2eba635b69777b11efb0ecca2" ON "post_likes" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e4b9fa42093474796954477662" ON "post_likes" ("postsId") `);
        await queryRunner.query(`ALTER TABLE "posts" RENAME TO "temporary_posts"`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer)`);
        await queryRunner.query(`INSERT INTO "posts"("id", "content", "createdAt", "userId") SELECT "id", "content", "createdAt", "userId" FROM "temporary_posts"`);
        await queryRunner.query(`DROP TABLE "temporary_posts"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar(255) NOT NULL, "lastName" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "username" varchar(255) NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_4baf95322bd69fe419c26c5430c" UNIQUE ("username"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "firstName", "lastName", "email", "createdAt", "updatedAt", "username") SELECT "id", "firstName", "lastName", "email", "createdAt", "updatedAt", "username" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar(255) NOT NULL, "lastName" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "firstName", "lastName", "email", "createdAt", "updatedAt") SELECT "id", "firstName", "lastName", "email", "createdAt", "updatedAt" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`DROP INDEX "IDX_7c6c27f12c4e972eab4b3aaccb"`);
        await queryRunner.query(`DROP INDEX "IDX_6300484b604263eaae8a6aab88"`);
        await queryRunner.query(`DROP TABLE "user_follows"`);
        await queryRunner.query(`DROP INDEX "IDX_93f4f6c26818edb5aa6b809856"`);
        await queryRunner.query(`DROP INDEX "IDX_aea7aa32b50c671eb48d7aeb82"`);
        await queryRunner.query(`DROP TABLE "post_hashtags"`);
        await queryRunner.query(`DROP INDEX "IDX_a2eba635b69777b11efb0ecca2"`);
        await queryRunner.query(`DROP INDEX "IDX_e4b9fa42093474796954477662"`);
        await queryRunner.query(`DROP TABLE "post_likes"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "hashtags"`);
    }

}
