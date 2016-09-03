'use strict';

let pg = require('pg');
let db_config = require('./secret_settings').db_config;
pg.defaults.ssl = require('./secret_settings').pg_ssl;
let db_pool = new pg.Pool(db_config);

console.log("connected to database");

module.exports = db_pool;

/*
Copyright 2016 DeveloperDemetri and chspence

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/