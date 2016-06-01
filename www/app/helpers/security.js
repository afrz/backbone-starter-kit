/* global CryptoJS */

'use strict';

//TODO defined salt & complement data

/* Token-based authentication for ASP .NET MVC REST web services.
   Copyright (c) 2015 Kory Becker
   http://primaryobjects.com/kory-becker
   License MIT
*/

var SecurityManager = {

  salt: 'XXXXXXXXXXXXXXXXXXXX',

  //user credentials
  instanceId: localStorage['SM.instanceId'],
  userId: localStorage['SM.userId'],
  key: localStorage['SM.key'],

  //client @IP
  ip: null,

  //check if credentials have already been authentified once
  authorized: function () {
    return !_.isUndefined(this.key);
  },

  //renew token from existing credentials
  renewToken: function () {
    return this.generateToken();
  },

  //compute token from credentials
  generateToken: function (instanceId, userId, password) {
    //generates a token to be used for API calls. The first time during authentication, pass in a userId/password.
    //all subsequent calls can simply omit userId and password, as the same token key(hashed password) will be used.
    if (instanceId || userId) {
      // If the user is providing credentials, then create a new key.
      this.logout(true);
    }

    // Set the info.
    this.instanceId = this.instanceId || instanceId;
    this.userId = this.userId || userId;

    // Set the key to a hash of the user's password + salt.
    this.key = this.key || CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256([password, this.salt].join(':'), this.salt));

    // Persist key pieces.
    if (this.userId) {
      localStorage['SM.userId'] = this.userId;
      localStorage['SM.instanceId'] = this.instanceId;
      localStorage['SM.key'] = this.key;
    }

    // Get the (C# compatible) ticks to use as a timestamp. http://stackoverflow.com/a/7968483/2596404
    var ticks = ((new Date().getTime() * 10000) + 621355968000000000);
    // Construct the hash body by concatenating the userId, ip
    // and complement data (use static string because DOM property navigator.userAgent value is not the one which is sent in HTTP request headers in IE).
    var message = [this.instanceId, this.userId, this.ip, 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', ticks].join(':');
    // Hash the body, using the key.
    var hash = CryptoJS.HmacSHA256(message, this.key);

    // Base64-encode the hash to get the resulting token.
    var token = CryptoJS.enc.Base64.stringify(hash);
    var decryptedToken = CryptoJS.enc.Base64.parse(token);
    // Include the userId and timestamp on the end of the token, so the server can validate.
    var tokenId = [this.instanceId, this.userId, ticks].join(':');
    // Base64-encode the final resulting token.
    var tokenStr = CryptoJS.enc.Utf8.parse([token, tokenId].join(':'));
    //final token
    return CryptoJS.enc.Base64.stringify(tokenStr);
  },

  //log out user
  logout: function (cleanCreds) {

    if (cleanCreds) {
      //keep info for future access
      localStorage.removeItem('SM.instanceId');
      this.instanceId = null;

      localStorage.removeItem('SM.userId');
      this.userId = null;
    }

    localStorage.removeItem('SM.key');
    this.key = null;
  }
};

module.exports = SecurityManager;
