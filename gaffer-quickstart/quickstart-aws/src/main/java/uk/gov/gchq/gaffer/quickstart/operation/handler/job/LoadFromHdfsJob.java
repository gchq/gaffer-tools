/*
 * Copyright 2016-2018 Crown Copyright
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

package uk.gov.gchq.gaffer.quickstart.operation.handler.job;

import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.user.User;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import uk.gov.gchq.gaffer.quickstart.operation.AddElementsFromHdfsQuickstart;

public class LoadFromHdfsJob {

    private static final int numArgs = 7;

    private String dataPath;
    private String generatorPath;
    private String outputPath;
    private String failurePath;

    private String schemaPath;
    private String graphConfigPath;
    private String storePropertiesPath;

    public static void main(String[] args){

        if(args.length != numArgs){
            throw new IllegalArgumentException("not enough args: got " + args.length +", need " + numArgs);
        }

        new LoadFromHdfsJob().run(args);

    }

    public void run(String[] args){
        this.dataPath = args[0];
        this.generatorPath = args[1];
        this.outputPath = args[2];
        this.failurePath = args[3];

        this.schemaPath = args[4];
        this.graphConfigPath = args[5];
        this.storePropertiesPath = args[6];

        Graph graph = null;

        try {
            graph = new Graph.Builder()
                    .addSchema(new FileInputStream(new File(schemaPath)))
                    .config(new FileInputStream(new File(graphConfigPath)))
                    .storeProperties(new FileInputStream(new File(storePropertiesPath)))
                    .build();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        AddElementsFromHdfsQuickstart addOp = new AddElementsFromHdfsQuickstart.Builder()
                .dataPath(dataPath)
                .elementGeneratorConfig(generatorPath)
                .outputPath(outputPath)
                .failurePath(failurePath)
                .build();

        User user = new User.Builder()
                .userId("user")
                .build();

        try {
            graph.execute(addOp, user);
        } catch (OperationException e) {
            e.printStackTrace();
        }

    }

}
