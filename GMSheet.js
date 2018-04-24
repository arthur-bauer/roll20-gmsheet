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
  let wantedAttributes ;
  var columnjumper = 0;
  var myoutput = "";

  const resolveAttr = (cid,name) => ({
    name: name,
    current: getAttrByName(cid,name),
    max: getAttrByName(cid,name,'max')
  });
   
  
  const getCharMainAtt = (cid) => {
    output = "<table border=0><tr>";
    cid = cid["id"];
    wantedAttributes=["strength","dexterity","constitution","intelligence","wisdom","charisma"]
    wantedAttributes.forEach((myAtt)=> {

      collectedAttributes =  resolveAttr(cid,myAtt);

      output += "<td><strong>"+collectedAttributes['name'].slice(0,3).toUpperCase()+":</strong></td><td>"+(resolveAttr(cid,myAtt+"_mod")['current']>0?"+"+resolveAttr(cid,myAtt+"_mod")['current']:resolveAttr(cid,myAtt+"_mod")['current'])+"</td><td><small>("+collectedAttributes['current']+")</small></td><td>&nbsp;&nbsp;</td>";

      if (columnjumper == 1) {
       output += "</tr><tr>";
       columnjumper=0;       
      }
      else {
        columnjumper=1;
      }

    });
    output += "</tr></table>";
    return output;
  };
  

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


  const getCharOtherAtt = (cid) => {

    output = "";
    cid = cid["id"];
    
    output = "<br>"+resolveAttr(cid,"race")['current']+" Lvl "+resolveAttr(cid,"level")['current']+" "+resolveAttr(cid,"class")['current'];
    output += (resolveAttr(cid,"inspiration")['current']=="on"?" <strong style='color:white;text-shadow: 2px 2px 4px #009000;' title='Character has inspiration!'>&#127775;</strong>":"");
    output += "<br><br><strong>HP:</strong> "+resolveAttr(cid,"hp")['current']+"/"+resolveAttr(cid,"hp")['max']+" ";
    output += (parseInt(resolveAttr(cid,"hp")['current']) < parseInt(resolveAttr(cid,"hp")['max'])?" <small style='color:#9d0a0e' title='down by "+(parseInt(resolveAttr(cid,"hp")['max'])-parseInt(resolveAttr(cid,"hp")['current']))+ " '>&#129301; "+(parseInt(resolveAttr(cid,"hp")['current'])-parseInt(resolveAttr(cid,"hp")['max']))+ "</small> ":"");   
    output += (parseInt(resolveAttr(cid,"hp_temp")['current']) > 0?" <span style='color:green'>+ "+resolveAttr(cid,"hp_temp")['current']+ " TMP</span>":"");
    output += "<br><strong>AC:</strong> "+resolveAttr(cid,"ac")['current'];
    output += "<br><br>Speed: "+resolveAttr(cid,"speed")['current']+" ft, Passive Perception: "+resolveAttr(cid,"passive_wisdom")['current']+"<br>Initiative bonus: "+(resolveAttr(cid,"initiative_bonus")['current']>0?"+"+resolveAttr(cid,"initiative_bonus")['current']:resolveAttr(cid,"initiative_bonus")['current']);
    output += "<br><br>";
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
        var charname=character.get("name");
        var charicon=character.get("avatar");
       if (myoutput.length>0) myoutput += "<br>"; 
       myoutput += "<div style='display:inline-block; font-variant: small-caps; color:##9d0a0e; font-size:1.8em;margin-top:5px;'><img src='" + charicon + "' style='height:48px;width:auto;margin-right:5px;margin-bottom:5px;vertical-align:middle'>" + charname + "</div>" + getCharOtherAtt(character) + getCharMainAtt(character);
        }
      });
    }
    
  sendChat(scname, "/w gm <div style='border:1px solid black; background-color: #f9f7ec; padding:8px; border-radius: 6px; font-size:0.85em;line-height:0.95em;'>" + myoutput + "</div>"); // eslint-disable-line quotes
  myoutput = "";
  });
});