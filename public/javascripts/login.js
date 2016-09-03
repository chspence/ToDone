'use strict';

function setup() {
  $("#login_form").submit(function(e) {
    e.preventDefault();
  });
}

function login() {
  var username = $("#username").val();
  var password = $("#password").val();
  var uname_re = /^(\w{3,63})$/;
  var pass_re = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9!@#$%^&*/._+-]{8,31})$/;
  if (uname_re.test(username) && pass_re.test(password)) {
    var login_url = getServer()+"/login";
    var login_data = {
      username: username,
      password: password
    };
    $.ajax({
      type: "POST",
      url: login_url,
      data: login_data,
      success: function(response_data) {
        if (response_data.status === 200 && response_data.was_successful === true) {
          var tempUrl = getServer()+'/';
          window.location.replace(tempUrl);
        }
        else {
          badLogin();
        }
      }
    });
  }
  else {
    badLogin();
  }
}

function badLogin() {
  $("#login_error").removeClass("hidden");
}
