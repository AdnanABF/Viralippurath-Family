import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    // MUST be first
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MUST come before EventsModule
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGODB_URI');

        if (!uri) {
          throw new Error('MONGODB_URI is not defined');
        }

        return { uri };
      },
    }),

    EventsModule,
  ],
})
export class AppModule {}
