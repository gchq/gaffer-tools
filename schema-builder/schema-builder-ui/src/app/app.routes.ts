/*
 * Copyright 2016 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
