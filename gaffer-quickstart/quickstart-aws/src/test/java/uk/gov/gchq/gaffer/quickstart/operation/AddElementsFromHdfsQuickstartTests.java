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

package uk.gov.gchq.gaffer.quickstart.operation;

import org.junit.Test;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.operation.data.EntitySeed;
import uk.gov.gchq.gaffer.operation.impl.get.GetElements;
import uk.gov.gchq.gaffer.user.User;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.uk.gov.gchq.gaffer.quickstart.operation.AddElementsFromHdfsQuickstart;

public class AddElementsFromHdfsQuickstartTests {

    @Test
    public void loadDataTest(){

        Graph graph = null;

        try {
            graph = new Graph.Builder()
                    .addSchema(new FileInputStream(new File("/Users/58265/workspace/gaffer-tools/gaffer-quickstart/gaffer-tools/gaffer-quickstart/quickstart-aws/src/test/resources/schema.json")))
                    .config(new FileInputStream(new File("/Users/58265/workspace/gaffer-tools/gaffer-quickstart/gaffer-tools/gaffer-quickstart/quickstart-aws/src/test/resources/graphconfig.json")))
                    .storeProperties(new FileInputStream(new File("/Users/58265/workspace/gaffer-tools/gaffer-quickstart/gaffer-tools/gaffer-quickstart/quickstart-aws/src/test/resources/mock.accumulo.store.properties")))
                    .build();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        User user = new User.Builder()
                .userId("user")
                .build();

        AddElementsFromHdfsQuickstart addElementsFromHdfsQuickstart = new AddElementsFromHdfsQuickstart.Builder()
                .dataPath("/Users/58265/workspace/gaffer-tools/gaffer-quickstart/gaffer-tools/gaffer-quickstart/quickstart-aws/src/test/resources/data.csv")
                .elementGeneratorConfig("/Users/58265/workspace/gaffer-tools/gaffer-quickstart/gaffer-tools/gaffer-quickstart/quickstart-aws/src/test/resources/element-generator.json")
                .outputPath("/Users/58265/workspace/gaffer-tools/gaffer-quickstart/gaffer-tools/gaffer-quickstart/quickstart-aws/src/test/resources/output")
                .failurePath("/Users/58265/workspace/gaffer-tools/gaffer-quickstart/gaffer-tools/gaffer-quickstart/quickstart-aws/src/test/resources/failure")
                .build();

        try {
            graph.execute(addElementsFromHdfsQuickstart, user);
        } catch (OperationException e) {
            e.printStackTrace();
        }

        GetElements getElements = new GetElements.Builder()
                .input(new EntitySeed("1"))
                .build();

        try {
            for(Element e : graph.execute(getElements, user)){
                System.out.println(e);
            }
        } catch (OperationException e) {
            e.printStackTrace();
        }

    }
}
