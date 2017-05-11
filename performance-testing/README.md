<!--
Copyright 2017 Crown Copyright

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

Performance testing
===================

This module allows the performance of operations against graphs to be measured. Currently only ingest performance can be measured.

The `performance-testing-core` module contains tests that are independent of any particular `Store`. The `RandomElementIngestTest` class can be used to measure the time taken to ingest elements to a `Graph`.

The `performance-testing-accumulo-store` module contains a test that initialises an empty Accumulo table with sensible split points and then calls the standard `RandomElementIngestTest` to run the ingest test.
