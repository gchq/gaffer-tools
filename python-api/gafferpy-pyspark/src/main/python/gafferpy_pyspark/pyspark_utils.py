import pyspark.sql as sql

def flattenElementDict(inputt, schema=None):
    elementDict = inputt[0]
    if schema == None:
        res = {}
    else:
        res = schema
    for key in elementDict.keys():
        if key != 'properties':
            res[key] = elementDict[key]
        else:
            for propName in elementDict['properties']:
                res[propName] = elementDict['properties'][propName]
    return res

def mergeRowSchemasAsDict(rowSchemas):
    merged = {}
    for key in rowSchemas.keys():
        for entry in rowSchemas[key]:
            merged[entry] = None
    return merged

def toRow(element,rowSchemas):
    mergedSchemasDict = mergeRowSchemasAsDict(rowSchemas)
    flattened = flattenElementDict(element, mergedSchemasDict)
    return sql.Row(**flattened)
