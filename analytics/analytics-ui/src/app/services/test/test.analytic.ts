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
    analyticName : 'test analytic name',
    operationName : 'test operation name',
    description : 'test description',
    creatorId : 'test creator id',
    readAccessRoles : [],
    writeAccessRoles : [],
    uiMapping : uiMapping1,
    options : options1,
    metaData : metaData1,
    outputVisualisation : outputVisualisation1,
    score : 5
};
export { testAnalytic };
