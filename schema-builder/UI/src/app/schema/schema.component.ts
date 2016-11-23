import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { GafferService } from '../services/gaffer.service';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.css'],
  providers: [GafferService]
})
export class SchemaComponent implements OnInit {

  schema: any;
  dataSchema: any;
  dataTypes: any;
  storeTypes: any;
  functions: any;
  commonTypes: any;
  validation: any;
  errorMessage: any;

  parseDataSchema() {
    this.dataSchema = {
      edges: {}
    };
    for (let key in this.schema.edges._data) {
      if (this.schema.edges._data.hasOwnProperty(key)) {
        let edge = this.schema.edges._data[key];
        let directed = 'true';
        if (edge.arrows !== 'to') {
          directed = 'false';
        }
        let formattedEdge = {
          source: this.schema.nodes._data[edge.from].label,
          destination: this.schema.nodes._data[edge.to].label,
          directed: directed
        };
        this.dataSchema.edges[edge.label] = formattedEdge;
      }
    }
  }

  parseDataTypes() {
    this.dataTypes = {
      types: {
        true: {
          class: 'java.lang.Boolean',
          validateFunctions: [
            {
              function: {
                class: 'gaffer.function.simple.filter.IsTrue'
              }
            }
          ]
        },
        false: {
          class: 'java.lang.Boolean',
          validateFunctions: [
            {
              function: {
                class: 'gaffer.function.simple.filter.IsFalse'
              }
            }
          ]
        }
      }
    };
    for (let key in this.schema.nodes._data) {
      if (this.schema.nodes._data.hasOwnProperty(key)) {
        let node = this.schema.nodes._data[key];
        let formattedNode = {
          class: this.schema.nodes._data[key].class || 'java.lang.String',
          validateFunctions: this.schema.nodes._data[key].validateFunctions || []
        };
        this.dataTypes.types[node.label] = formattedNode;
      }
    }
  }

  parseStoreTypes() {
    this.storeTypes = {
      types: {
        string: {
          position: 'VALUE',
          aggregateFunction: {
            separator: ',',
            class: 'gaffer.function.simple.aggregate.StringConcat'
          },
          serialiserClass: 'gaffer.serialisation.simple.StringSerialiser'
        },
        int: {
          position: 'VALUE',
          aggregateFunction: {
            mode: 'AUTO',
            class: 'gaffer.function.simple.aggregate.Sum'
          },
          serialiserClass: 'gaffer.serialisation.simple.IntegerSerialiser'
        }
      }
    };
  }

  constructor(private storage: LocalStorageService, private gafferService: GafferService) { }

  ngOnInit() {
    let storedNodes = this.storage.retrieve('graphNodes');
    let storedEdges = this.storage.retrieve('graphEdges');
    this.schema = {
      nodes: storedNodes,
      edges: storedEdges
    };
    this.gafferService.getSimpleFunctions('true', 'java.lang.String')
                   .subscribe(
                     functions => this.functions = functions,
                     error =>  this.errorMessage = <any>error);
    this.gafferService.getCommonTypes()
                   .subscribe(
                     commonTypes => this.commonTypes = commonTypes,
                     error =>  this.errorMessage = <any>error);
    if (storedEdges !== null && storedNodes !== null) {
      this.parseDataSchema();
      this.parseDataTypes();
      this.parseStoreTypes();
      this.gafferService.validateSchema(this.dataSchema, this.dataTypes, this.storeTypes)
                   .subscribe(
                     validation => this.validation = validation,
                     error =>  this.errorMessage = <any>error);
    }
  }
}
