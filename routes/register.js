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
    res.render('register');
  }
});

router.post('/', function(req, res) {
  if (req.body.username && req.body.email && req.body.password) {
    let email_re = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    let password_re = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9!@#$%^&*/._+-]{8,31})$/;
    if (uname_re.test(req.body.username.trim()) && email_re.test(req.body.email.trim()) && password_re.test(req.body.password)) {
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
            client.query('INSERT INTO public.td_user (username, password, email) VALUES($1, $2, $3)', [req.body.username.trim().toLowerCase(),req.body.password,req.body.email.trim().toLowerCase()], function(err, result) {
              done();
              if (err) {
                console.log("Error inserting new user: ", err);
                let result = {
                  "status": 500,
                  "error": 'Database error.'
                };
                res.send(result);
              }
              else {
                  let result = {
                    "status": 200,
                    "message": 'new user successfully created'
                  };
                  res.send(result);
              }
            });
          }
        });
      }
    }
    else {
      let result = {
        "status": 400,
        "error": 'Invalid parameters.'
      }
      res.send(result);
    }
  }
  else {
    let result = {
      "status": 400,
      "error": 'Missing required parameters.'
    }
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
