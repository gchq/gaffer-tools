import { Component, OnInit, Injectable, Input } from "@angular/core";
import { SchemaService } from "../gaffer/schema.service";
import { EventsService } from "../dynamic-input/events.service";
import { TypesService } from "../gaffer/type.service";
@Component({
  selector: "app-seed-builder",
  templateUrl: "./seed-builder.component.html",
  styleUrls: ["./seed-builder.component.css"]
})
@Injectable()
export class SeedBuilderComponent implements OnInit {
  @Input('model') model;
  
  constructor(private schema: SchemaService,
              private events: EventsService,
              private types: TypesService) {}

  ngOnInit() {
    this.schema.get().subscribe(function(gafferSchema) {
      var vertices = this.schema.getSchemaVertices();
      if (vertices && vertices.length > 0 && undefined !== vertices[0]) {
        this.vertexClass = gafferSchema.types[vertices[0]].class;
      }
      this.recalculateSeeds(this.model);
      if (this.$routeParams[this.routeParam]) {
        if (Array.isArray(this.$routeParams[this.routeParam])) {
          this.seedVertices +=
            "\n" + this.$routeParams[this.routeParam].join("\n");
        } else {
          this.seedVertices += "\n" + this.$routeParams[this.routeParam];
        }
        this.addSeeds(true);
        this.$location.search(this.routeParam, null);
      }
    });

    this.events.subscribe("onPreExecute", this.addSeeds);
    this.events.subscribe("onOperationUpdate", this.onOperationUpdate);
  }

  /**
   * Controller which parses and unparses csv input
   * @param {*} schema The schema service
   * @param {*} csv The csv parser service
   * @param {*} types The type service
   * @param {*} error The error service
   * @param {*} events The events service
   * @param {*} common The common service
   * @param {*} $routeParams The route params service
   */
  csv;
  error;
  common;
  $routeParams;
  $location;
  seedVertices = "";

  onOperationUpdate = function() {
    this.recalculateSeeds(this.model);
  };

  /**
   * Creates the placeholder for the seed input
   */
  getPlaceHolder = function() {
    return this.usePrevious
      ? "Input is provided by the output of the previous operation"
      : "Enter your seeds, each seed on a new line\n" + this.getCsvHeader();
  };

  /**
   * At the end of the component's lifecycle, it unsubscribes from the event service to save
   * time unnecessary function calls
   */
  onDestroy = function() {
    this.events.unsubscribe("onOperationUpdate", this.onOperationUpdate);
    this.events.unsubscribe("onPreExecute", this.addSeeds);
  };

  /**
   * Gets all the fields available for a given type from the type service
   */
  getFields = function() {
    return this.types.getFields(this.vertexClass);
  };

  /**
   * Gets the csv header for the vertex class from the type service.
   */
  getCsvHeader = function() {
    return this.types.getCsvHeader(this.vertexClass);
  };

  /**
   * Goes through all lines from seed input box, removes trailing whitespace,
   * processes the line (returns if it fails), checks it's not too long,
   * adds it to an array, before finally updating the input service
   *
   * @param {boolean} suppressDuplicateError
   */
  addSeeds = function(suppressDuplicateError) {
    if (this.usePrevious) {
      this.model = null;
      return;
    }
    var newInput = [];
    var keys = this.getFields().map(function(field) {
      return field.key;
    });

    var lines = this.seedVertices.split("\n");
    for (var i in lines) {
      var line = lines[i].trim();
      if (line === "") {
        continue; // skip empty lines
      }
      var separated = this.csv.parse(line, this.handleError);
      if (separated === undefined) {
        // if something went wrong in the processing
        return;
      }
      if (!this.isValid(line, separated, keys)) {
        return;
      }
      var parts = {};
      var fields = this.getFields();
      for (var j in fields) {
        var value = separated[j];
        if (
          fields[j].class !== "java.lang.String" &&
          fields[j].type !== "text"
        ) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            console.log(
              "possible failure parsing " +
                fields[j].type +
                " from string: " +
                value +
                " for class: " +
                fields[j].class,
              e
            ); // Don't broadcast to UI.
          }
        }
        parts[fields[j].key] = value;
      }
      newInput.push(this.createSeed(parts));
    }

    // deduplicate the input
    var deduped = [];

    for (var i in newInput) {
      var value = newInput[i];
      if (!this.common.arrayContainsObject(deduped, value)) {
        deduped.push(value);
      } else if (!suppressDuplicateError) {
        this.error.handle(
          "Duplicate value: " +
            this.types.getShortValue(
              this.types.createJsonValue(value.valueClass, value.parts)
            ) +
            " was removed"
        ); // not invalid
      }
    }

    if (this.seedForm) {
      this.seedForm.multiSeedInput.$setValidity("csv", true);
    }
    this.model = deduped;
  };

  /**
   * Checks the length of the values returned is not greater than the number of keys.
   * If it is it broadcasts an error.
   *
   * @param {string} line The line of csv
   * @param {any[]} separated The processed values
   * @param {string[]} keys The keys associated with the fields of the vertex class
   *
   * @returns true if the line is valid, false if invalid
   */
  isValid = function(line, separated, keys) {
    if (separated.length > keys.length) {
      var simple =
        line +
        " contains " +
        separated.length +
        " parts. Only " +
        keys.length +
        " were expected";
      this.handleError(
        simple,
        simple + '. Please wrap values containing commas in "quotes"'
      );
      return false;
    }
    return true;
  };

  /**
   * Calls error.handle with message and error but also sets the validity of the form to false. Meaning that execute cannot be called
   * until the input it updated
   * @param {string} message The error message
   * @param {*} err The error (optional)
   */
  handleError = function(message, err) {
    this.error.handle(message, err);
    if (this.seedForm) {
      this.seedForm.multiSeedInput.$setValidity("csv", false);
    }
  };

  /**
   * Generates the CSV when supplied with values.
   * It makes sure to wrap stringified numbers and booleans with "quotes"
   * If fields are undefined, it adds commas without values
   * @param {any[]} updated The array of inputs
   */
  recalculateSeeds = function(updated) {
    if (updated === undefined || updated === null) {
      this.seedVertices = "";
      return;
    }
    var toParse = updated.map(function(input) {
      return input.parts;
    });

    var fields = this.getFields();

    var str = "";
    for (var i in toParse) {
      // for each value in the inputs
      var parts = toParse[i];
      for (var i in fields) {
        // for each field returned by the type service for the vertex class
        var field = fields[i].key;
        var part = parts[field]; // extract that field from the value
        if (part === undefined || part === null) {
          // if it doesn't exist
          str += ","; // then add a single comma
        } else if (typeof part === "string") {
          // or if it's a string
          if (
            part.indexOf(",") !== -1 ||
            !isNaN(this.part) ||
            part === "true" ||
            part === "false"
          ) {
            // but looks like a number or boolean.
            str += '"' + part + '",'; // wrap it in quotes
          } else {
            var parsed = part.replace(/\\/g, "\\\\").replace(/"/g, '\\"'); // otherwise escape backslashes and quotes
            str += parsed + ","; // then add it
          }
        } else {
          str += part + ","; // or if it's not a string, just add it
        }
      }

      str = str.replace(/,$/, "\n");
    }
    this.seedVertices = str.slice(0, -1);
  };

  createSeed = function(parts) {
    var vertex = { valueClass: this.vertexClass, parts: parts };
    return vertex;
  };
}
