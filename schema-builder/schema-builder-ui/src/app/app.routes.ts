import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { graphRoutes } from './graph/graph.routes';
import { propertiesRoutes } from './properties/properties.routes';
import { schemaRoutes } from './schema/schema.routes';
import { typesRoutes } from './types/types.routes';

export const routes: Routes = [
  {
      path: '',
      redirectTo: '/graph',
      pathMatch: 'full'
  },
  ...graphRoutes,
  ...propertiesRoutes,
  ...schemaRoutes,
  ...typesRoutes
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);