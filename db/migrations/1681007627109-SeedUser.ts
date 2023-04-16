import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUser1681007627109 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = await bcrypt.hash('Hosting2!', 10);

    await queryRunner.query(`
    INSERT INTO user (username, password)
            VALUES ('admin@test.com', '${password}');
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM user
            WHERE username = 'admin@test.com';
        `);
  }
}
