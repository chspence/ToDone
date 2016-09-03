'use strict';

let app = require('../app');
let express = require('express');
let db_pool = require('../bin/db_pool');
let aes_tool = require('../bin/aes_tool');
let bcrypt = require('bcrypt-nodejs');
let redis_tool = require('../bin/redis_tool');
let session_tool = require('../bin/session_tool');

let uname_re = /^(\w{3,63})$/;

let router = express.Router();

router.get('/', function(req, res) {
  if (req.session.username) {
    if (uname_re.test(req.session.username)) {
      res.render('home');
    }
    else {
      console.log('Possible spoofed session username: ', req.session.username);
      req.session.destroy();
      res.render('lost');
    }
  }
  else {
    res.render('login');
  }
});

router.post('/login', function(req, res) {
  if (req.body.username && req.body.password) {
    let pass_re = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9!@#$%^&*/._+-]{8,31})$/;
    if (uname_re.test(req.body.username.trim()) && pass_re.test(req.body.password)) {
      db_pool.connect(function(err, client, done) {
        if (err) {
          console.log('Error fetching client from pool: ', err);
          let result = {
            "status": 500,
            "error": 'Database error.'
          };
          res.send(result);
        }
        else {
          let uname = req.body.username.trim().toLowerCase();
          client.query('SELECT password FROM public.td_user WHERE username=$1', [uname], function(err, result) {
            done();
            if (err) {
              console.log("Error fetching password for log in: ", err);
              let result = {
                "status": 500,
                "error": 'Database error.'
              };
              res.send(result);
            }
            else {
              if(result.rows[0] && bcrypt.compareSync(req.body.password, result.rows[0].password)) {
                req.session.username = uname;
                let result = {
                  "status": 200,
                  "was_successful": true
                };
                res.send(result);
              }
              else {
                let result = {
                  "status": 200,
                  "was_successful": false
                };
                res.send(result);
              }
            }
          });
        }
      });
    }
    else {
      let result = {
        "status": 400,
        "error": 'Invalid username and/or password.'
      };
      res.send(result);
    }
  }
  else {
    let result = {
      "status": 400,
      "error": 'Missing username and/or password.'
    };
    res.send(result);
  }
});

module.exports = router;

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
