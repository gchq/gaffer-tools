/*
 * Copyright 2019-2020 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Analytic } from '../../analytics/interfaces/analytic.interface';

const uiMappingDetail1 = {
    label: 'Label',
    userInputType: 'TextBox',
    parameterName: 'param1',
    inputClass: 'java.lang.String',
    currentValue: 'value1'
};
const uiMappingDetail2 = {
    label: 'Label',
    userInputType: 'TextBox',
    parameterName: 'param2',
    inputClass: 'java.lang.Integer',
    currentValue: 2
};

const uiMapping1 = {
    key1: uiMappingDetail1,
    key2: uiMappingDetail2
};

const metaData1 = {
    icon: 'test icon',
    colour: 'test colour'
};

const outputVisualisation1 = {
    outputAdapter: 'test output adapter',
    visualisationType: 'test visualisation type'
};

const options1 = {
    option1: 'option1value'
};

const testAnalytic = {
    analyticName: 'test analytic name',
    operationName: 'test operation name',
    description: 'test description',
    creatorId: 'test creator id',
    readAccessRoles: [],
    writeAccessRoles: [],
    uiMapping: uiMapping1,
    options: options1,
    metaData: metaData1,
    outputVisualisation: outputVisualisation1,
    score: 5
};
export { testAnalytic };
