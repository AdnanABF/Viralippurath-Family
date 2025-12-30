import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApi() {
    return {
      message: 'Viralippurath Family Web API is running successfully',
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}
