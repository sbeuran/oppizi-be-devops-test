import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1703980800000 implements MigrationInterface {
    name = 'InitialSchema1703980800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create extension for UUID
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Create categories table
        await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                "name" VARCHAR NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Create tasks table
        await queryRunner.query(`
            CREATE TABLE "tasks" (
                "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                "title" VARCHAR NOT NULL,
                "description" TEXT,
                "due_date" TIMESTAMP,
                "status" VARCHAR NOT NULL DEFAULT 'todo',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "category_id" UUID,
                CONSTRAINT "fk_category" FOREIGN KEY ("category_id") 
                    REFERENCES "categories"("id") ON DELETE SET NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP EXTENSION "uuid-ossp"`);
    }
} 