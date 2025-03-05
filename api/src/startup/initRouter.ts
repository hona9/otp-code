import { Application } from 'express';

import mainRoutes from '../routes';

export default function MainRouter(app: Application): void {
  app.use('/api/v1', mainRoutes);
}
