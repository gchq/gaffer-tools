/*
 * Copyright 2019-2020 Crown Copyright
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

import { UIMappingDetail } from './uiMappingDetail.interface';
import { OutputVisualisation } from './outputVisualisation.interface';
import { MetaData } from './metaData.interface';

export interface Analytic {
    analyticName: string;
    operationName: string;
    description: string;
    creatorId: string;
    readAccessRoles: Array<string>;
    writeAccessRoles: Array<string>;
    uiMapping: Map<string, UIMappingDetail>;
    options: Map<string, string>;
    metaData: MetaData;
    outputVisualisation: OutputVisualisation;
    score: number;

}

