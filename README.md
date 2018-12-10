# Translation Portal
A web application that functions as a Chinese-English translation portal.
The code is a generic [Node.js Express](https://expressjs.com/) application.
These instructions describe deployment on [App Engine
Standard](https://cloud.google.com/appengine/docs/standard/). The embedded
Chinese-English dictionary is provided by the
[chinesedict-js](https://www.npmjs.com/package/@alexamies/chinesedict-js)
JavaScript module.

## Prerequisites
Download and install [Node.js](https://nodejs.org/en/). Create a [Google Cloud
Platform](https://cloud.google.com/) (GCP) project and install the
[gcloud](https://cloud.google.com/sdk/gcloud/) command line tool.

## Setup
Clone this project from GitHub:
```
git clone https://github.com/alexamies/translation_portal
cd translation_portal
```

Set an environment variable to remember how to get back
```
PORTAL_HOME=`pwd`
```

## Build the dictionary
Get the [chinesedict-js](https://github.com/alexamies/chinesedict-js) module
```
cd web/static
npm install
CDICT_HOME=`pwd`/node_modules/@alexamies/chinesedict-js
```

Use the dictionary terms file from either the [Chinese
Notes](https://github.com/alexamies/chinesenotes.com) for modern or literary
Chinese of the [NTI Reader](https://github.com/alexamies/buddhist-dictionary)
project for Buddhist texts:
```
git clone https://github.com/alexamies/buddhist-dictionary.git
DICT_SOURCE_HOME=`pwd`/buddhist-dictionary
```

This contains a tab separated variable (TSV) dictionary file words.txt
that we will use for building the JSON format dictionary that can be loaded by
the JavaScriptmodule
```
cd $CDICT_HOME/build
npm install
node gen_dictionary.js $DICT_SOURCE_HOME/data/dictionary/words.txt
```

This generates the words.json file that should be copied to your web asset
directory:
```
cd $PORTAL_HOME/web/static
mkdir dist
cp $CDICT_HOME/build/words.json dist/.
```

## Configure the Browser Application Code
Copy the chinesedict-js module code and styles to the web asset directory
```
cp $CDICT_HOME/index.js dist/.
cp $CDICT_HOME/chinesedict.css dist/.
```

For cross-browser compatibility, copy the dialog-polyfill files to the web asset
directory
```
cp $PORTAL_HOME/web/static/node_modules/dialog-polyfill/dialog-polyfill.js dist/.
cp $PORTAL_HOME/web/static/node_modules/dialog-polyfill/dialog-polyfill.css dist/.
```

## Run locally
Run locally with Express:
```
cd $PORTAL_HOME/web
npm install
npm start
```

Browse to the app at http://localhost:8080

## Deploy to App Engine
Set the default GCP project:
```
PROJECT=[Your project id]
gcloud config set project $PROJECT
```

Deploy to App Engine:
```
gcloud app deploy -q
```

Browse to the app
```
gcloud app browse
```

## Restrict Access
To resrict the translation portal to a specific group of users, follow the
instructions in the Google Cloud [Identity Aware
Proxy](https://cloud.google.com/iap/docs/) (IAP). You will need to add the 
crossorigin attribute on the HTML [Script
element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) to
allow the JavaScript module to be loaded behind IAP.