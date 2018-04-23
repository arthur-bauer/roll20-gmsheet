/* global on log playerIsGM findObjs getObj getAttrByName sendChat globalconfig */

/*
GMSheet %%version%%

A quick GM Cheatsheet for the D&D 5e OGL sheets on roll20.net.
Please use `!gmsheet` for inline help and examples.



arthurbauer@me.com
*/


on('ready',() => {

  const v = '%%version%%'; // version number
  const scname = 'GMSheet'; // script name
  let selectedsheet = 'OGL'; // You can set this to "5E-Shaped" if you're using the Shaped sheet

  var output = "";
  var collectedAttributes = "";
  var wantedAttributes = ["race","level","hp","ac","speed"];
  
  const resolveAttr = (cid,name) => ({
    name: name,
    current: getAttrByName(cid,name),
    max: getAttrByName(cid,name,'max')
  });
   
  
  const getCharMainAtt = (cid) => {
    output = "<table border=0>";
    cid = cid["id"];
    wantedAttributes=["strength","dexterity","constitution","intelligence","wisdom","charisma"]
    wantedAttributes.forEach((myAtt)=> {

      collectedAttributes =  resolveAttr(cid,myAtt);
      output += "<tr><td><strong>"+collectedAttributes['name'].slice(0,3).toUpperCase()+":</strong></td><td><small>("+collectedAttributes['current']+")</small></td><td>"+(resolveAttr(cid,myAtt+"_mod")['current']>0?"+"+resolveAttr(cid,myAtt+"_mod")['current']:resolveAttr(cid,myAtt+"_mod")['current'])+"</td></tr>";


    });
    output += "</table>";
    return output;
  };
  

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


  const getCharOtherAtt = (cid,wantedAttributes) => {
    output = "";
    cid = cid["id"];
    
    wantedAttributes.forEach((myAtt)=> {

      collectedAttributes =  resolveAttr(cid,myAtt);
      output += "<br>"+collectedAttributes['name'].toUpperCase()+":</strong> "+collectedAttributes['current'];
      if (collectedAttributes['max']) output+="/"+collectedAttributes['max'];
    });
    return output;
  };
  


on('chat:message', (msg) => {
    if (msg.type !== 'api' && !playerIsGM(msg.playerid)) return;
    if (msg.content.startsWith('!gmsheet') !== true) return;
    if (msg.selected == null) {
      sendChat(scname, '/w gm **ERROR:** You need to select at least one character.');
      
      /* will add a routine to save/load characters later */
      
      return;
    }


    if (msg.content.includes('-help') || msg.content.includes('-h')) {
      //! help
      sendChat(scname, `/w gm %%README%%`); // eslint-disable-line quotes
    }
    
    else
    {
  
      const partymember = Object.entries(msg.selected).length;
      msg.selected.forEach((obj) => {
        const token = getObj('graphic', obj._id); // eslint-disable-line no-underscore-dangle
        let character;
        if (token) {
          character = getObj('character', token.get('represents'));
        }
        if (character) {
  
      /* get the attributes and assemble the output */
        let myoutput;
        myoutput = character._name + getCharMainAtt(character);
        sendChat(scname, `/w gm `+ myoutput); // eslint-disable-line quotes
        }
      });
    }
  });
});