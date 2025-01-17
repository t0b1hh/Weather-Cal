// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: calendar;
/*

~

Welcome to Weather Cal. Run this script to set up your widget.

Add or remove items from the widget in the layout section below.

You can duplicate this script to create multiple widgets. Make sure to change the name of the script each time.

Happy scripting!

~

*/

// Specify the layout of the widget items.

/*
const layout = `
  
  row 
    column
      date
      sunset
      battery
      space
      events
    
    column(90)
      current
      future
      space
       
`
*/


const layout = `
  
  row 
    column
      date
      week
    
      sunset
      events
`


const settings = {
  setupMode: false,
  openApp: 'googlecalendar'
}



/*
 * CODE
 * Be more careful editing this section. 
 * =====================================
 */

// Names of Weather Cal elements.
const codeFilename = "Weather Cal code"
const gitHubUrl = "https://raw.githubusercontent.com/mzeryck/Weather-Cal/main/weather-cal-code.js"

// Determine if the user is using iCloud.
let files = FileManager.local()
const iCloudInUse = files.isFileStoredIniCloud(module.filename)

// If so, use an iCloud file manager.
files = iCloudInUse ? FileManager.iCloud() : files

// Determine if the Weather Cal code exists and download if needed.
const pathToCode = files.joinPath(files.documentsDirectory(), codeFilename + ".js")
if (!files.fileExists(pathToCode)) {
  const req = new Request(gitHubUrl)
  const codeString = await req.loadString()
  files.writeString(pathToCode, codeString)
}

// Import the code.
if (iCloudInUse) { await files.downloadFileFromiCloud(pathToCode) }
const code = importModule(codeFilename)

const custom = {

  // Custom items and backgrounds can be added here.

}

// Run the initial setup or settings menu.
let preview
if (config.runsInApp) {
  preview = await code.runSetup(Script.name(), iCloudInUse, codeFilename, gitHubUrl)
  if (!preview) return
}

if (config.runsInWidget) {

  // Set up the widget.
  const widget = await code.createWidget(layout, Script.name(), iCloudInUse)
  Script.setWidget(widget)

  // If we're in app, display the     preview.
  if (config.runsInApp) {
    if (preview == "small") { widget.presentSmall() }
    else if (preview == "medium")  { widget.presentMedium() }
    else { widget.presentLarge() }
  }

} else {
  
  const appleDate = new Date("2001/01/01");
  const timestamp = (new Date().getTime() - appleDate.getTime()) / 1e3;
  const callback = new CallbackURL(
      `${settings.openApp}:` + timestamp
    );
  callback.open();

}

Script.complete()