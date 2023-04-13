import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedOperations1681426423325 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    INSERT INTO operation (type, cost)
            VALUES
            ('addition', 10),
            ('subtraction', 10),
            ('multiplication', 20),
            ('division', 20),
            ('square_root', 30),
            ('random_string', 50);
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM operation
            WHERE type IN (
              'addition',
              'subtraction',
              'multiplication',
              'division',
              'square_root',
              'random_string'
            );
        `);
  }
}
