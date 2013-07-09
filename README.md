## node-uncaptcha

reCAPTCHA helper using decaptcher

## installation

    $ npm install uncaptcha

## super simple to use

getting a valid solved challenge

```javascript
var Uncaptcha = require('uncaptcha');

var uncaptcha = new Uncaptcha({key: /* reCAPTCHA key */, decaptcherKey: /* decaptcher key */});

uncaptcha.decode().done(
    function (result) {
        console.log(result); // { challenge: '...', decoded: '...', genTaskID: '...' }
    },
    function (error) {}
);
```

decoding an already provided challenge

```javascript
uncaptcha.decode(/* challenge */).done(
    function (result) {
        console.log(result); // { challenge: '...', decoded: '...', genTaskID: '...' }
    },
    function (error) {}
);
```

getting a refund for a bad solve from decaptcher

```javascript
uncaptcha.refund(/* genTaskID */).done(
    function (result) {
        console.log(result); // ok
    },
    function (error) {}
);
```