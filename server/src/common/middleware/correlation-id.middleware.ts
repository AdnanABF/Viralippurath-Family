import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { correlationStorage } from '../correlation/correlation.storage';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 1. Get ID from headers (if provided) or generate a new one
    const correlationId =
      (req.headers['x-correlation-id'] as string) || randomUUID();

    // 2. Set the ID in the response headers so the client/frontend knows it
    res.set('x-correlation-id', correlationId);

    // 3. Wrap the rest of the request in the AsyncLocalStorage 'run' method
    // Anything inside this callback will have access to this specific ID
    correlationStorage.run(correlationId, () => {
      next();
    });
  }
}
