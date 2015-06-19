# Tadhack Lisbon 2015 - TADSlack

This is a project that I built in Lisbon in June of 2015 that ended up winning 2nd Grand Prize from Telestax.

This project combines the power of RestComm's Visual App Designer along with [Clarify.io's](http://clarify.io) Media Indexing API

## How It Works
The setup for this application takes a bit of prep.

Before you get started...
```
$ git clone 
```

First, you'll need to go to Clarify.io and get yourself set up with an account and get an API key.

You'll then need to go into Slack and configure both an Inbound Webhook integration and a Slash Command integration.

To set up the Incoming Webhook Integration, you must be an admin in your Slack subdomain.  Then...
- Click on the upside down carat to the right of your domain name and select 'Configure Integrations'
- Scroll to the bottom and click Add to the right of Incoming Webhook
- It will ask you to select the Default Channel to post to.  It doesn't matter what you select here, as you can override it in the app.
- Grab the Webhook Url you see on the screen and pa