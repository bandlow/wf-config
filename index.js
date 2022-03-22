/**
 * Testumgebung zum Auslesen der XML Config.
 * Für die einzelnen Abfragen werden XPath-Abfragen genutzt.
 * Beispiel:
 * //Step[@id='10']/Object[@key='step_beschreibung']
 * Zum Testen der XPath-Ausdrücke kann folgendes Tool genutzt werden
 * https://codebeautify.org/Xpath-Tester
 * 1. XML laden
 * 2. Beispiel XPath eintragen und testen :-)
 */

// Import stylesheets
import './style.css';
//import config from './wf.json';
//console.log(config);
// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>WF-Config Reader</h1>`;

let configDocument = null;
getConfiguration();

function getConfiguration() {
 // fetch-Aufruf mit Pfad zur XML-Datei
fetch ('./wf.xml')
.then (function (response) {
  // Antwort kommt als Text-String
  return response.text();
})
.then (function (data) {
  console.log (data);			  // schnell mal in der Konsole checken
  
  // String in ein XML-DOM-Objekt umwandeln
  let parser = new DOMParser (),
    xmlDoc = parser.parseFromString (data, 'text/xml');
  
  //und noch ein paar Test-Ausgaben in die Konsole
  console.log (xmlDoc.getElementsByTagName ('item'));
  console.log ("item "  + xmlDoc.getElementsByTagName ('item')[1].children[0].textContent);

  comicToday (xmlDoc);			// Funktion zur Bearbeitung mit dem geparsten xmlDoc aufrufen	
}).catch (function (error) {
 console.log ("Fehler: bei Auslesen der XML-Datei " + error);
});
}

function hideFields(stepId) {
  console.log("Hide Fields for StepId:" + stepId);
  // console.log(formHelper.getParameters());
    var hiddenFields = getParamByStepId(stepId, "hiddenFields").split(",").splice();
    console.log (hiddenFields);
    console.log("HiddenFields: " + getParamByStepId(stepId, "hiddenFields").split(",").splice());
    hiddenFields.forEach(item => {
        console.log("Hide Field: " + item);
        //if (item){
          // Maskenname 
          formHelper.getFieldByName(item).api.hide();
          // Besser so:
          // formHelper.getFieldByParameterName(item).api.hide();
        //}
    })
}

/**
 * Gets a parameter by step ID
 * 
 */
 function getParamByStepId(id, key) {
  var fieldElem, objElem;
  // "//Object[@id=""" & sId & """]/Field[@Name=""" & sValueName & """]"
  let myDoc = getConfiguration();
  var iterator = myDoc.evaluate("//Step[@id='" + id + "']/Object[@key='" + key + "']", myDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  console.log("StepID: " + id + " Name: " + key + "Value: " + iterator.singleNodeValue.textContent);
  return iterator.singleNodeValue.textContent;
}

/** 
* Sucht anhand des Namens der Activität die dazugehörige WF Schritt ID
* @param ame der Aktivität
* @return Number as String
*/
function getStepIdByName(name) {
  // var objectElements = getConfiguration().getElementsByTagName("Steps").item(0).getElementsByTagName("Object");
  let myDoc = getConfiguration();
  var iterator = myDoc.evaluate("//Object[@step_name='" + name + "']/@id", myDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  console.log(iterator.singleNodeValue.textContent);
  return iterator.singleNodeValue.textContent
}