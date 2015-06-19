# Tadhack Lisbon 2015 - TADSlack

This is a project that I built in Lisbon in June of 2015 that ended up winning 2nd Grand Prize from Telestax.

This project combines the power of RestComm's Visual App Designer along with [Clarify.io's](http://clarify.io) Media Indexing API

## What This App Does
From the Slack console, you can make phone calls to any number, record the audio of the call, and search the audio contents of the call.  To see the app in action, check out my [demo video](https://www.youtube.com/watch?v=CqGhv27YNW0) from TADHack.

## Setting Everything Up
The setup for this application takes a bit of prep.

What You'll Need:
- A machine running NodeJS 12 (preferably)
- A Clarify API Key
- A working RestComm instance that has the Visual Designer installed and running
- A working Slack instance

### Installing Node and prereqs
Before you get started, you need to install the latest Node on your machine.
Then...
```
$ git clone git@github.com:scottbarstow/tadslack.git
$ cd tadslack
$ npm install -g grunt bower
$ npm install
$ cp lib/config.js.example lib/config.js

# Edit the config values to fit your setup, then

$ HOST=0.0.0.0 PORT=3000 npm start

#You should see
the server started on host: 0.0.0.0 and port: 3000

#If that all works, Ctl-C to break out of the app and continue setup
```

### Setting Up Clarify

First, you'll need to go to Clarify.io and get yourself set up with an account and get an API key.

- Once you've got your API Key, add the key to lib/config.js
- Next you'll need to set the url where Clarify should call back to when it's done indexing the recording.  To keep this simple, I've created another config entry in lib/config.js. 


### Setting Up Slack

You'll then need to go into Slack and configure both an Inbound Webhook integration and a Slash Command integration.

To set up the Incoming Webhook Integration, you must be an admin in your Slack subdomain.  Then...
- Click on the upside down carat to the right of your domain name and select 'Configure Integrations'
- Scroll to the bottom and click Add to the right of Incoming Webhook
- It will ask you to select the Default Channel to post to.  It doesn't matter what you select here, as you can override it in the app.
- Grab the Webhook Url you see on the screen and paste the value into lib/config.js under slack.webhookUrl
- Go ahead and configure the Default Channel and Default Username while you're in there.  I created a special channel called #tadslack in my Slack instance, but you can use whatever you like.  Remember to include the '#' at the start of the channel name.

Once you're done with the Incoming Webhook, you'll then need to create a 2nd integration, a Slash Command, to facilitate the app receiving messages from Slack.  To do this:
- Go to 'Configure Integrations' as before, and select 'Slash Commands' Add
- For the command, type /call
- For the Url, type in the full url to your app + /tadslack.  e.g. http://1.2.3.4:3000/tadslack
- Leave the method as 'POST' and everything else as defaults and click 'Save Integration'

### Setting up Restcomm

While I'm getting my app up to the Restcomm App Store, I've included screenshots links below so that you can see how to set up your RestComm app to work properly

[The RestComm App Welcome Screen](https://dl.dropboxusercontent.com/u/2127160/tadhack/lisbon/Welcome.jpg)
[The RestComm App Index Recording Screen](https://dl.dropboxusercontent.com/u/2127160/tadhack/lisbon/indexRecording.jpg)

- Once you've set up your RestComm Visual Designer App, click on the Web Trigger link at the top of the screen and grab the url you see in the instructions.  
- Paste everything except the query parameters into lib/config.js, under the restcomm.appUrl setting.  For example, mine looked like this: http://host:port/restcomm-rvd/services/apps/Tadslack/start

If you've got questions on any of this setup, [@ me](https://twitter.com/scottbarstow)

There's a lot of moving parts, so don't hesitate to ask.

## Example Config.js
```Javascript
"use strict";

module.exports = {
  clarify:{
    apiHost:"api.clarify.io",
    apiKey:"supersecretkey",
    // This is the url to your running Node app. Must be accessible 
    // from the outside
    notifyUrl:"http://1.1.1.1:3000/clarifyCallback" //make the IP whatever your outside IP is
  },
  restcomm:{
    // change the IP to whatever your Restcomm instance IP is
    appUrl:"http://1.1.1.1:8080/restcomm-rvd/services/apps/Tadslack/start",
    to:"client:tadslack"
  },
  slack:{
    // Paste this directly from your Slack Webhook Integration
    webhookUrl:"https://hooks.slack.com/services/somekey/someotherkey/somethingelse",
    defaultChannel:"#tadslack",
    defaultUsername: "TadSlack"
  }
}
```