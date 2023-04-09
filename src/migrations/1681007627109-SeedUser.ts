import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUser1681007627109 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    INSERT INTO user (username, password)
            VALUES ('admin@test.com', 'password1')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM user
            WHERE username = 'admin@test.com'
        `);
  }
}
