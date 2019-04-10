import { Component, OnInit, Injectable } from "@angular/core";
import { SchemaService } from '../gaffer/schema.service';
import { EventsService } from '../dynamic-input/events.service';
import { TypesService } from '../gaffer/type.service';

@Component({
  selector: "app-pair-builder",
  templateUrl: "./pair-builder.component.html",
  styleUrls: ["./pair-builder.component.css"]
})
@Injectable()
export class PairBuilderComponent implements OnInit {
  constructor(private schema: SchemaService,
              private events: EventsService,
              private types: TypesService) {}

  ngOnInit() {
    this.schema.get().subscribe(function(gafferSchema) {
      var vertices = this.schema.getSchemaVertices();
      if (vertices && vertices.length > 0 && undefined !== vertices[0]) {
        this.vertexClass = gafferSchema.types[vertices[0]].class;
      }
      if (this.$routeParams["input"]) {
        if (Array.isArray(this.$routeParams["input"])) {
          this.pairs += "\n" + this.$routeParams["input"].join("\n");
        } else {
          this.pairs += "\n" + this.$routeParams["input"];
        }
        this.addPairs(true);
        this.$location.search("input", null);
      }
    });

    this.events.subscribe("onOperationUpdate", this.onOperationUpdate);
    this.events.subscribe("onPreExecute", this.addPairs);
    this.recalculateSeeds(this.model);
  }

  /**
   * Controller which parses and unparses csv pairs
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
  pairs = "";
  model;

  onOperationUpdate = function() {
    this.recalculateSeeds(this.model);
  };

  /**
   * Creates the placeholder for the pair input
   */
  getPlaceHolder = function() {
    return this.usePrevious
      ? "Input is provided by the output of the previous operation"
      : "Enter your pairs of seeds, each pair on a new line.\n" +
          this.createExample();
  };

  /**
   * At the end of the component's lifecycle, it unsubscribes from the event service to reduce
   * unnecessary function calls
   */
  onDestroy = function() {
    this.events.unsubscribe("onOperationUpdate", this.recalculateSeeds);
    this.events.unsubscribe("onPreExecute", this.addPairs);
  };

  /**
   * Gets all the fields available for a given type from the type service
   */
  getFields = function() {
    return this.types.getFields(this.vertexClass);
  };

  /**
   * creates an example csv header - replacing empty headers with start and end
   */
  createExample = function() {
    var csvHeader = this.types.getCsvHeader(this.vertexClass);
    return csvHeader === "" ? "start,end" : csvHeader + "," + csvHeader;
  };

  /**
   * Goes through all lines from seed input box, removes trailing whitespace,
   * processes the line (returns if it fails), checks it's not too long,
   * adds it to an array, before finally updating the model
   */
  addPairs = function(suppressDuplicateError) {
    if (this.usePrevious) {
      this.model = null;
      return;
    }
    var newInput = [];
    var keys = this.getFields().map(function(field) {
      return field.key;
    });

    var lines = this.pairs.split("\n");
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
      var start = {};
      var end = {};
      var fields = this.getFields();

      for (var j in fields) {
        var startValue = separated[j];
        if (
          fields[j].class !== "java.lang.String" &&
          fields[j].type !== "text"
        ) {
          try {
            startValue = JSON.parse(startValue);
          } catch (e) {
            console.log(
              "possible failure parsing " +
                fields[j].type +
                " from string: " +
                startValue +
                " for class: " +
                fields[j].class,
              e
            ); // Don't broadcast to UI.
          }
        }
        start[fields[j].key] = startValue;

        var endValue = separated[+j + fields.length];
        if (
          fields[j].class !== "java.lang.String" &&
          fields[j].type !== "text"
        ) {
          try {
            endValue = JSON.parse(endValue);
          } catch (e) {
            console.log(
              "possible failure parsing " +
                fields[j].type +
                " from string: " +
                endValue +
                " for class: " +
                fields[j].class,
              e
            ); // Don't broadcast to UI.
          }
        }
        end[fields[j].key] = endValue;
      }
      newInput.push(this.createPair(start, end));
    }

    // deduplicate the input
    var deduped = [];

    for (var i in newInput) {
      var value = newInput[i];
      if (!this.common.arrayContainsObject(deduped, value)) {
        deduped.push(value);
      } else if (!suppressDuplicateError) {
        this.error.handle("Duplicate value was removed"); // not invalid
      }
    }

    if (this.pairForm) {
      this.pairForm.seedPairInput.$setValidity("csv", true);
    }
    this.model = deduped;
  };

  /**
   * Checks the length of the values returned is not equal to the number of keys x 2 (because there are two values in pairs).
   * If it is it broadcasts an error.
   *
   * @param {string} line The line of csv
   * @param {any[]} separated The processed values
   * @param {string[]} keys The keys associated with the fields of the vertex class
   *
   * @returns true if the line is valid, false if invalid
   */
  isValid = function(line, separated, keys) {
    if (separated.length !== keys.length * 2) {
      var simple =
        "Expected exactly " +
        keys.length * 2 +
        " parts but line '" +
        line +
        "' only contains " +
        separated.length;
      this.handleError(
        simple,
        simple +
          '. Please wrap values containing commas in "quotes" and include empty fields'
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
    if (this.pairForm) {
      this.pairForm.seedPairInput.$setValidity("csv", false);
    }
  };

  /**
   * Generates the CSV when supplied with values.
   * It makes sure to wrap stringified numbers and booleans with "quotes"
   * If fields are undefined, it adds commas without values
   * @param {any[]} updated The array of inputs
   */
  recalculateSeeds = function(toParse) {
    var fields = this.getFields();

    var str = "";
    for (var i in toParse) {
      // for each pair in the input
      var pair = toParse[i];
      for (var value in pair) {
        // for each first and second part of the pair
        var parts = pair[value].parts;
        for (var i in fields) {
          // for each field returned by the type service for the vertex class
          var key = fields[i].key;
          var part = parts[key]; // extract that field from the value
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
      }
      str = str.replace(/,$/, "\n");
    }
    this.pairs = str.slice(0, -1);
  };

  createPair = function(first, second) {
    return {
      first: {
        valueClass: this.vertexClass,
        parts: first
      },
      second: {
        valueClass: this.vertexClass,
        parts: second
      }
    };
  };
}
