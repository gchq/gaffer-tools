import { UIMappingDetail } from 'src/app/analytics/classes/uiMappingDetail.class';
import { MetaData } from 'src/app/analytics/classes/metaData.class';
import { Analytic } from 'src/app/analytics/classes/analytic.class';
import { OutputVisualisation } from 'src/app/analytics/classes/outputVisualisation.class';

const uiMappingDetail1 = {
    label: 'Label',
    userInputType: 'TextBox',
    parameterName: 'param1',
    inputClass: 'java.lang.Integer',
    currentValue: 'value1'
  };
const uiMappingDetail2 = {
    label: 'Label',
    userInputType: 'TextBox',
    parameterName: 'param2',
    inputClass: 'java.lang.Integer',
    currentValue: 'value2'
};
const uiMapping1 = new Map()
uiMapping1.set("key1",new UIMappingDetail().deserialize(uiMappingDetail1));
uiMapping1.set("key2",new UIMappingDetail().deserialize(uiMappingDetail2));

const metaData1 = {
    icon: "test icon",
    colour: "test colour"
};

const outputVisualisation1 = {
    outputAdapter: "test output adapter",
    visualisationType: "test visualisation type"
};

let options1 = new Map();
options1.set("option1", "option1Value");

let testAnalytic = {
    analyticName : "test analytic name",
    operationName : "test operation name",
    description : "test description",
    creatorId : "test creator id",
    readAccessRoles : [],
    writeAccessRoles : [],
    uiMapping : uiMapping1,
    options : options1,
    metaData : new MetaData().deserialize(metaData1),
    outputVisualisation : new OutputVisualisation().deserialize(outputVisualisation1),
    score : 5
}
export default new Analytic().deserialize(testAnalytic);