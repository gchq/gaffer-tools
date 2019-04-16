/*
 * Copyright 2016-2019 Crown Copyright
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

package uk.gov.gchq.gaffer.python.controllers.entities;

import uk.gov.gchq.gaffer.user.User;

import java.util.List;

public class SecureUser extends User {

    private String token;

    private User user;

    public SecureUser(final String username,
                      final List<String> opRoles,
                      final List<String> dataRoles,
                      final String token) {
        this.setToken(token);

        this.setUser(new Builder()
                .userId(username)
                .dataAuths(dataRoles)
                .opAuths(opRoles)
                .build());
    }

    public String getToken() {
        return token;
    }

    private void setToken(final String token) {
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    private void setUser(final User user) {
        this.user = user;
    }

    @Override
    public boolean equals(final Object obj) {
        return super.equals(obj);
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }

}
