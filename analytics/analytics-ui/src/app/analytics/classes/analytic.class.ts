/*
 * Copyright 2019 Crown Copyright
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

import { UIMappingDetail } from './uiMappingDetail.class';
import { OutputVisualisation } from './outputVisualisation.class';
import { MetaData } from './metaData.class';
import { Serializable } from './serializable.interface';

export class Analytic implements Serializable<Analytic> {
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

    deserialize(input: any) {
        this.analyticName = input.analyticName;
        this.operationName = input.operationName;
        this.description = input.description;
        this.creatorId = input.creatorId;
        this.readAccessRoles = input.readAccessRoles;
        this.writeAccessRoles = input.writeAccessRoles;

        let uiMapping = new Map();
        for (const key of Object.keys(input.uiMapping)) {
            uiMapping.set(key,new UIMappingDetail().deserialize(input.uiMapping[key]))
        }
        this.uiMapping = uiMapping as Map<string, UIMappingDetail>;
        
        this.options = input.options;
        this.metaData = new MetaData().deserialize(input.metaData);
        this.outputVisualisation = new OutputVisualisation().deserialize(input.outputVisualisation);
        this.score = input.score;
        
        return this;
    }
}
