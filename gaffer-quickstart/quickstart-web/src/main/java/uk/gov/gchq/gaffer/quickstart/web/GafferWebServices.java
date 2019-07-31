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

package uk.gov.gchq.gaffer.quickstart.web;

import org.apache.catalina.LifecycleException;
import org.apache.catalina.startup.Tomcat;
import org.apache.commons.io.FileUtils;

import javax.servlet.ServletException;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GafferWebServices {

    private static boolean running = false;
    private String schemaPath;
    private String storePropertiesPath;
    private String graphConfigPath;
    private String restWarPath;
    private String uiWarPath;
    private String restOptionsPath;
    private int port;

    private Map<String, String> restOptions;


    public static void main(final String[] args) throws ServletException, LifecycleException, IOException {

        if (args.length != 7) {
            throw new IllegalArgumentException("I need a schemaPath, graphConfigPath, storePropertiesPath, restWarPath and uiWarPath");
        }

        GafferWebServices gafferWebServices = new GafferWebServices();

        gafferWebServices.setSchemaPath(args[0]);
        gafferWebServices.setGraphConfigPath(args[1]);
        gafferWebServices.setStorePropertiesPath(args[2]);
        gafferWebServices.setRestWarPath(args[3]);
        gafferWebServices.setUiWarPath(args[4]);
        gafferWebServices.setRestOptionsPath(args[5]);
        gafferWebServices.setPort(Integer.valueOf(args[6]));

        gafferWebServices.startServer();

    }

    public boolean serverRunning() {
        return running;
    }

    private void startServer() throws ServletException, LifecycleException, IOException {

        Runtime.getRuntime().addShutdownHook(new ServerShutDownHook());

        restOptions = getRestOptions(restOptionsPath);

        Tomcat tomcat = new Tomcat();
        String gafferHome = System.getenv("GAFFER_HOME");
        tomcat.setBaseDir(gafferHome + "/gaffer_web_services_working");
        tomcat.setPort(port);

        String restContextPath = "/rest";
        String restWarFilePath = restWarPath;

        String uiContextPath = "/ui";
        String uiWarFilePath = uiWarPath;

        tomcat.getHost().setAppBase(".");

        tomcat.addWebapp(restContextPath, restWarFilePath);
        tomcat.addWebapp(uiContextPath, uiWarFilePath);

        System.setProperty("gaffer.schemas", schemaPath);
        System.setProperty("gaffer.storeProperties", storePropertiesPath);
        System.setProperty("gaffer.graph.config", graphConfigPath);
        System.setProperty("gaffer.serialiser.json.modules", "uk.gov.gchq.gaffer.sketches.serialisation.json.SketchesJsonModules");

        for (final String key : restOptions.keySet()) {
            System.setProperty(key, restOptions.get(key));
        }

        tomcat.start();
        tomcat.getServer().await();
        running = true;
        while (running) {

        }

        System.exit(0);
    }

    private Map<String, String> getRestOptions(final String restOptionsPath) {
        Map<String, String> result = new HashMap<>();
        List<String> lines = null;
        try {
            lines = FileUtils.readLines(new File(restOptionsPath));
        } catch (final IOException e) {
            e.printStackTrace();
        }

        for (final String s : lines) {
            String[] t = s.split("=");
            result.put(t[0], t[1]);
        }
        return result;
    }

    private class ServerShutDownHook extends Thread {
        @Override
        public void run() {

            GafferWebServices.running = false;

        }
    }

    public String getSchemaPath() {
        return schemaPath;
    }

    public void setSchemaPath(final String schemaPath) {
        this.schemaPath = schemaPath;
    }

    public String getStorePropertiesPath() {
        return storePropertiesPath;
    }

    public void setStorePropertiesPath(final String storePropertiesPath) {
        this.storePropertiesPath = storePropertiesPath;
    }

    public String getGraphConfigPath() {
        return graphConfigPath;
    }

    public void setGraphConfigPath(final String graphConfigPath) {
        this.graphConfigPath = graphConfigPath;
    }

    public String getRestWarPath() {
        return restWarPath;
    }

    public void setRestWarPath(final String restWarPath) {
        this.restWarPath = restWarPath;
    }

    public String getUiWarPath() {
        return uiWarPath;
    }

    public void setUiWarPath(final String uiWarPath) {
        this.uiWarPath = uiWarPath;
    }

    public String getRestOptionsPath() {
        return restOptionsPath;
    }

    public void setRestOptionsPath(final String restOptionsPath) {
        this.restOptionsPath = restOptionsPath;
    }

    public int getPort() {
        return port;
    }

    public void setPort(final int port) {
        this.port = port;
    }
}
