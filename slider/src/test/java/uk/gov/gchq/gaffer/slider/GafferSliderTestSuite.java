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

package uk.gov.gchq.gaffer.slider;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.internal.runners.statements.Fail;
import org.junit.internal.runners.statements.RunAfters;
import org.junit.internal.runners.statements.RunBefores;
import org.junit.rules.RunRules;
import org.junit.rules.TestRule;
import org.junit.runner.notification.RunNotifier;
import org.junit.runners.Suite;
import org.junit.runners.model.FrameworkMethod;
import org.junit.runners.model.RunnerBuilder;
import org.junit.runners.model.Statement;
import org.junit.runners.model.TestClass;
import org.reflections.Reflections;

import uk.gov.gchq.gaffer.integration.AbstractStoreIT;

import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

/**
 * A custom JUnit test suite which deploys a Gaffer instance using {@link GafferSliderDeployer} before running each of
 * the Gaffer integration tests, ensuring that they are configured to be run against the deployed instance.
 */
public class GafferSliderTestSuite extends Suite {

    private final GafferSliderDeployer gafferDeployer;
    private final TestClass gafferDeployerClass;

    public GafferSliderTestSuite(final Class<?> clazz, final RunnerBuilder builder) throws Exception {
        super(builder, clazz, getTestClasses());
        this.gafferDeployer = new GafferSliderDeployer();
        this.gafferDeployerClass = new TestClass(GafferSliderDeployer.class);
    }

    public void setupAbstractStoreITs() {
        AbstractStoreIT.setStoreProperties(this.gafferDeployer.getGafferStoreProperties());
        AbstractStoreIT.setSkipTests(new HashMap<>());
    }

    private static Class[] getTestClasses() throws IllegalAccessException, InstantiationException {
        // Abstract Store ITs
        final Set<Class<? extends AbstractStoreIT>> classes = new Reflections(AbstractStoreIT.class.getPackage().getName()).getSubTypesOf(AbstractStoreIT.class);
        keepPublicConcreteClasses(classes);

        // TODO: Do something similar to identify Accumulo Store ITs to run

        return classes.toArray(new Class[classes.size()]);
    }

    private static void keepPublicConcreteClasses(final Set<Class<? extends AbstractStoreIT>> classes) {
        if (null != classes) {
            final Iterator<Class<? extends AbstractStoreIT>> itr = classes.iterator();
            for (Class clazz = null; itr.hasNext(); clazz = itr.next()) {
                if (null != clazz) {
                    final int modifiers = clazz.getModifiers();
                    if (Modifier.isAbstract(modifiers) || Modifier.isInterface(modifiers) || Modifier.isPrivate(modifiers) || Modifier.isProtected(modifiers)) {
                        itr.remove();
                    }
                }
            }
        }
    }

    @Override
    protected Statement classBlock(final RunNotifier notifier) {
        Method setupAbstractStoreITs;
        try {
            setupAbstractStoreITs = this.getClass().getMethod("setupAbstractStoreITs");
        } catch (final NoSuchMethodException e) {
            return new Fail(e);
        }

        // Be careful with the ordering of the following statements!
        // We want to run the normal JUnit test process for all of the ITs that have been identified...
        Statement statement = super.classBlock(notifier);
        // ...but we want to wrap them with processing that will set up and tear down a gaffer-slider instance:
        statement = new RunBefores(statement, Collections.singletonList(new FrameworkMethod(setupAbstractStoreITs)), this);
        statement = new RunAfters(statement, this.gafferDeployerClass.getAnnotatedMethods(After.class), this.gafferDeployer);
        statement = new RunAfters(statement, this.gafferDeployerClass.getAnnotatedMethods(AfterClass.class), null);
        statement = new RunBefores(statement, this.gafferDeployerClass.getAnnotatedMethods(Before.class), this.gafferDeployer);
        statement = new RunBefores(statement, this.gafferDeployerClass.getAnnotatedMethods(BeforeClass.class), null);
        statement = new RunRules(statement, this.gafferDeployerClass.getAnnotatedFieldValues(this.gafferDeployer, Rule.class, TestRule.class), this.getDescription());
        return statement;
    }

}
