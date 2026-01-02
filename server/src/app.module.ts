import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventsModule } from './events/events.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { GalleryModule } from './gallery/gallery.module';
import { MagazineModule } from './magazine/magazine.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    // MUST be first
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configuration is still here, but not forced globally
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100, // High default limit for general use
      },
    ]),

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
    AuthModule,
    AdminModule,
    GalleryModule,
    MagazineModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
