import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
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
import { ContactModule } from './contact/contact.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ActivityLogController } from './activity-log/activity-log.controller';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SystemLogModule } from './system-log/system-log.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

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
    ContactModule,
    CloudinaryModule,
    ActivityLogModule,
    DashboardModule,
    SystemLogModule,
  ],
  controllers: [AppController, ActivityLogController],
  providers: [
    AppService,
    {
      provide: APP_FILTER, // Global exception filter registered
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR, // Global success response interceptor registered
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
