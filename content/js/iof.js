var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);

var sizeprefs = prefs.getBranch("extensions.digitalpalireader.sizes.");
var colorprefs = prefs.getBranch("extensions.digitalpalireader.colors.");
var miscprefs = prefs.getBranch("extensions.digitalpalireader.misc.");

function getColPref(name) {
    return colorprefs.getCharPref(name);
}
function getSizePref(name) {
    return sizeprefs.getIntPref(name);
}
function getMiscPref(name) {
    return miscprefs.getCharPref(name);
}
function setColPref(name,val) {
    return colorprefs.setCharPref(name,val);
}
function setSizePref(name,val) {
    return sizeprefs.setIntPref(name,val);
}
function setMiscPref(name,val) {
    return miscprefs.setCharPref(name,val);
}

function readFile(aFileKey)
{
    var DIR = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties);
    var dir = DIR.get("ProfD", Components.interfaces.nsIFile);
    dir.append("DPR");
    if ( !dir.exists() )
    {
        return false;
    }
    var aFile = dir.clone();
    aFile.append(aFileKey);
    try {
        var istream = Components.classes['@mozilla.org/network/file-input-stream;1'].createInstance(Components.interfaces.nsIFileInputStream);
        istream.init(aFile, 1, 0, false);
        var sstream = Components.classes['@mozilla.org/scriptableinputstream;1'].createInstance(Components.interfaces.nsIScriptableInputStream);
        sstream.init(istream);
        var content = sstream.read(sstream.available());
        sstream.close();
        istream.close();
        return content;
    }
    catch(ex)
    {
        return false;
    }
}

function writeFile(aFileKey, aContent, aChars)
{
    var DIR = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties);
    var dir = DIR.get("ProfD", Components.interfaces.nsIFile);
    dir.append("DPR");
    if ( !dir.exists() )
    {
        dir.create(dir.DIRECTORY_TYPE, 0700);
    }

    var aFile = dir.clone();
    aFile.append(aFileKey);
    if ( aFile.exists() ) aFile.remove(false);

    var UNICODE = Components.classes['@mozilla.org/intl/scriptableunicodeconverter'].getService(Components.interfaces.nsIScriptableUnicodeConverter);

    try {
        aFile.create(aFile.NORMAL_FILE_TYPE, 0666);
        var ostream = Components.classes['@mozilla.org/network/file-output-stream;1'].createInstance(Components.interfaces.nsIFileOutputStream);
        ostream.init(aFile, 0x02, 0666, 0);
		var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);  
		converter.init(ostream, "UTF-8", 0, 0);  
		converter.writeString(aContent);  
		converter.close();
        ostream.close();
    }
    catch(ex)
    {
        alert("ERROR: Failed to write file: " + aFile.leafName);
    }
}

function readDir() {
    var DIR = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties);
    var dir = DIR.get("ProfD", Components.interfaces.nsIFile);
    dir.append("DPR");
    if ( !dir.exists() )
    {
        dir.create(dir.DIRECTORY_TYPE, 0700);
    }
    
    var entries = dir.directoryEntries;
    var ca = [];
    
    while (entries.hasMoreElements()) {
      var file        = entries.getNext().QueryInterface(Components.interfaces.nsILocalFile);
      var isException = false;

      if (file.exists()) {
        ca.push(file.leafName);
      }
    }
    return ca;
}

function eraseItem(name) {
        var DIR = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties);
        var dir = DIR.get("ProfD", Components.interfaces.nsIFile);
        dir.append("DPR");
        if ( !dir.exists() )
        {
            dir.create(dir.DIRECTORY_TYPE, 0700);
        }

        var aFile = dir.clone();
        aFile.append("DPB"+name);
        if ( aFile.exists() ) aFile.remove(false);
        
        aFile = dir.clone();
        aFile.append("DPS"+name);
        if ( aFile.exists() ) aFile.remove(false);
        
        aFile = dir.clone();
        aFile.append("DPD"+name);
        if ( aFile.exists() ) aFile.remove(false);
        return false;
}

function eraseAll() {
        var DIR = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties);
        var dir = DIR.get("ProfD", Components.interfaces.nsIFile);
        dir.append("DPR");
        var entries = dir.directoryEntries;
        var ca = [];
        
        while (entries.hasMoreElements()) {
          var file        = entries.getNext().QueryInterface(Components.interfaces.nsILocalFile);
          var isException = false;

          if (file.exists()) {
            file.remove(false);
          }
        }
}

function changeName(name, nam) {
    var DIR = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties);
    var dir = DIR.get("ProfD", Components.interfaces.nsIFile);
    dir.append("DPR");

    var aFile = dir.clone();
    aFile.append("DPB"+name);
    if ( aFile.exists() ) aFile.moveTo(null, "DPB"+nam); 

    var bFile = dir.clone();
    bFile.append("DPS"+name);
    if ( bFile.exists() ) bFile.moveTo(null, "DPS"+nam);
    
    var cFile = dir.clone();
    cFile.append("DPD"+name);
    if ( cFile.exists() ) cFile.moveTo(null, "DPD"+nam);
    return false;
}