#!/usr/bin/env bash

set -e

openssl aes-256-cbc -K $encrypted_a7bb8cbce01c_key -iv $encrypted_a7bb8cbce01c_iv -in cd/codesigning.asc.enc -out cd/codesigning.asc -d
gpg --fast-import cd/codesigning.asc
