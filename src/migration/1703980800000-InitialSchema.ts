import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1703980800000 implements MigrationInterface {
    name = 'InitialSchema1703980800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_categories" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "tasks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "description" text,
                "due_date" TIMESTAMP,
                "status" character varying NOT NULL DEFAULT 'todo',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "category_id" uuid,
                CONSTRAINT "PK_tasks" PRIMARY KEY ("id"),
                CONSTRAINT "FK_tasks_categories" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }
} 