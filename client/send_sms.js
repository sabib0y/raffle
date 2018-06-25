// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
const accountSid = 'ACf16e03a986d3e9665f1071e89cd992e2';
const authToken = '30d2235425fe00aaa16c6d07c6b077cf';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    body: 'Correct guy',
    from: '+447481358584',
    to: '+447447712444'
  })
  .then(message => console.log(message.sid), 'hghghghhg')
  .done();