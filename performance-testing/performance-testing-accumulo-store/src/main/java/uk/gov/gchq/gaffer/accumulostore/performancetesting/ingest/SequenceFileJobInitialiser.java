/*
 * Copyright 2017-2019 Crown Copyright
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
package uk.gov.gchq.gaffer.accumulostore.performancetesting.ingest;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.SequenceFileInputFormat;

import uk.gov.gchq.gaffer.hdfs.operation.MapReduce;
import uk.gov.gchq.gaffer.hdfs.operation.handler.job.initialiser.JobInitialiser;
import uk.gov.gchq.gaffer.store.Store;

import java.io.IOException;
import java.util.Map;

public class SequenceFileJobInitialiser implements JobInitialiser {
    @Override
    public void initialiseJob(final Job job, final MapReduce operation, final Store store) throws IOException {
        initialiseInput(job, operation);
    }

    private void initialiseInput(final Job job, final MapReduce operation) throws IOException {
        job.setInputFormatClass(SequenceFileInputFormat.class);
        final Map<String, String> mapperPairs = operation.getInputMapperPairs();
        for (final String path : mapperPairs.keySet()) {
            SequenceFileInputFormat.addInputPath(job, new Path(path));
        }
    }
}
