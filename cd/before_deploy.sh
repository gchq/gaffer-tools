#!/usr/bin/env bash

if [ "$TRAVIS_BRANCH" = 'master' ] && [ "$TRAVIS_PULL_REQUEST" == 'false' ]; then
    openssl aes-256-cbc -K $encrypted_a7bb8cbce01c_key -iv $encrypted_a7bb8cbce01c_iv -in codesigning.asc.enc -out codesigning.asc -d    
    gpg --fast-import cd/codesigning.asc
fi