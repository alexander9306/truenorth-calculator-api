import { Module } from '@nestjs/common';

@Module({
  providers: [Node],
  exports: [Node],
})
export class SharedModule {}
