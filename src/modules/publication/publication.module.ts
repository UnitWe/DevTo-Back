import { Module } from '@nestjs/common';
import { PublicationService } from './services/publication.service';
import { PublicationController } from './publication.controller';

@Module({
  providers: [PublicationService],
  controllers: [PublicationController]
})
export class PublicationModule {}