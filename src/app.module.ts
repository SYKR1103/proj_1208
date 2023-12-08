import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DblistModule } from './dblist/dblist.module';

@Module({
  imports: [DblistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
