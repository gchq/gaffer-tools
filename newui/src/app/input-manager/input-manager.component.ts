import { Component, OnInit, Input } from "@angular/core";
import { SchemaService } from '../gaffer/schema.service';

@Component({
  selector: "app-input-manager",
  templateUrl: "./input-manager.component.html",
  styleUrls: ["./input-manager.component.css"]
})
export class InputManagerComponent implements OnInit {
  @Input('model') model;
  events;
  results;
  common;
  types;
  EVENT_NAME = "onOperationUpdate";
  ENTITY_SEED_CLASS = "uk.gov.gchq.gaffer.operation.data.EntitySeed";
  usePreviousOutput;
  constructor(private schema: SchemaService) {}

  ngOnInit() {
    if (!this.model) {
      throw "Input manager must be initialised with a model.";
    }
    this.updatePreviousOutputFlag(); // respond to 'onOperationUpdate' event here
    //this.events.subscribe(this.EVENT_NAME, this.updatePreviousOutputFlag);
  }

  /**
   * Controller for the Input Manager
   * @param {*} graph The Graph service for selecting all seeds
   * @param {*} input The input service for injecting getters and setters into child components
   */

  updatePreviousOutputFlag = function() {
    this.usePreviousOutput = this.model.input === null;
  };

  onDestroy = function() {
    this.events.unsubscribe(this.EVENT_NAME, this.updatePreviousOutputFlag);
  };

  onCheckboxChange = function() {
    if (this.usePreviousOutput) {
      this.model.input = null;
      this.model.inputPairs = null;
    } else {
      this.model.input = [];
      this.model.inputPairs = [];
    }
  };

  /**
   * Selects all seeds on the graph which in turn triggers an update event - causing the query input to be updated
   */
  useResults = function() {
    this.schema.get().then(function(gafferSchema) {
      var vertices = this.schema.getSchemaVertices();
      var vertexClass;
      if (vertices && vertices.length > 0 && undefined !== vertices[0]) {
        vertexClass = gafferSchema.types[vertices[0]].class;
      }

      var resultsData = this.results.get();
      var allSeeds = [];

      for (var i in resultsData.entities) {
        var vertex = {
          valueClass: vertexClass,
          parts: this.types.createParts(
            vertexClass,
            resultsData.entities[i].vertex
          )
        };
        this.common.pushObjectIfUnique(vertex, allSeeds);
      }

      for (var i in resultsData.edges) {
        var source = {
          valueClass: vertexClass,
          parts: this.types.createParts(
            vertexClass,
            resultsData.edges[i].source
          )
        };
        var destination = {
          valueClass: vertexClass,
          parts: this.types.createParts(
            vertexClass,
            resultsData.edges[i].destination
          )
        };
        this.common.pushObjectsIfUnique([source, destination], allSeeds);
      }

      for (var i in resultsData.other) {
        if (resultsData.other[i].class === this.ENTITY_SEED_CLASS) {
          vertex = {
            valueClass: vertexClass,
            parts: this.types.createParts(
              vertexClass,
              resultsData.other[i].vertex
            )
          };
          this.common.pushObjectIfUnique(vertex, allSeeds);
        }
      }

      this.common.pushObjectsIfUnique(allSeeds, this.model.input);

      this.events.broadcast(this.EVENT_NAME, []);
    });
  };
}
