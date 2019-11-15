import { UIMappingDetail } from 'src/app/analytics/classes/uiMappingDetail.class';
import { MetaData } from 'src/app/analytics/classes/metaData.class';
import { Analytic } from 'src/app/analytics/classes/analytic.class';

const uiMappingDetail1 : UIMappingDetail = {
    label: 'Label',
    userInputType: 'TextBox',
    parameterName: 'param1',
    inputClass: 'java.lang.Integer',
    currentValue: 'value1'
  };
const uiMappingDetail2 : UIMappingDetail = {
    label: 'Label',
    userInputType: 'TextBox',
    parameterName: 'param2',
    inputClass: 'java.lang.Integer',
    currentValue: 'value2'
};
const uiMapping1 = new Map()
uiMapping1.set("key1",uiMappingDetail1);
uiMapping1.set("key2",uiMappingDetail2);

const metaData1 : MetaData = {
    icon: "test icon",
    colour: "test colour"
};

const outputVisualisation1 = {
    outputAdapter: "test output adapter",
    visualisationType: "test visualisation type"
};

let options1 = new Map();
options1.set("option1", "option1Value");

let testAnalytic: Analytic = {
    analyticName : "test analytic name",
    operationName : "test operation name",
    description : "test description",
    creatorId : "test creator id",
    readAccessRoles : [],
    writeAccessRoles : [],
    uiMapping : uiMapping1,
    options : options1,
    metaData : metaData1,
    outputVisualisation : outputVisualisation1,
    score : 5
}
export default testAnalytic;