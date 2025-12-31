import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { GalleryModule } from './gallery/gallery.module';
import { MagazineModule } from './magazine/magazine.module';

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

    AuthModule,

    AdminModule,

    GalleryModule,

    MagazineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
