/* global on log playerIsGM findObjs getObj getAttrByName sendChat globalconfig */ // eslint-disable-line no-unused-vars

/*
GMSheet %%version%%

A quick GM Cheatsheet for the D&D 5e OGL sheets on roll20.net.
Please use `!gmsheet` for inline help and examples.

arthurbauer@me.com
*/

on('ready', () => {
  const v = '%%version%%'; // version number
  const scname = 'GMSheet'; // script name
  log(`${scname} v${v} online. Select one or more party members, then use \`!gmsheet -h\``);
  let output = '';
  let collectedAttributes = '';
  let wantedAttributes;
  let columnjumper = 0;
  let myoutput = '';
  const resolveAttr = (cid, name) => ({
    name,
    current: getAttrByName(cid, name),
    max: getAttrByName(cid, name, 'max'),
  });
  const getCharMainAtt = (cid) => {
    output = '<table border=0><tr>';
    const cid2 = cid.id;
    wantedAttributes = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    wantedAttributes.forEach((myAtt) => {
      collectedAttributes = resolveAttr(cid2, myAtt);
      output += `<td><strong>${collectedAttributes.name.slice(0, 3).toUpperCase()}:</strong></td><td>${resolveAttr(cid, `${myAtt}_mod`).current > 0 ? `+${resolveAttr(cid2, `${myAtt}_mod`).current}` : resolveAttr(cid, `${myAtt}_mod`).current}</td><td><small>(${collectedAttributes.current})</small></td><td>&nbsp;&nbsp;</td>`;
      if (columnjumper == 1) {
        output += '</tr><tr>';
        columnjumper = 0;
      } else {
        columnjumper = 1;
      }
    });
    output += '</tr></table>';
    return output;
  };

  const getCharOtherAtt = (cid) => {
    output = '';
    cid = cid.id;

    output = `<br><small><i>${resolveAttr(cid, 'race').current} Lvl ${resolveAttr(cid, 'level').current} ${resolveAttr(cid, 'class').current}</i></small>`;
    output += (resolveAttr(cid, 'inspiration').current == 'on' ? " <strong style='color:white;text-shadow: 2px 2px 4px #009000;' title='Character has inspiration!'>&#127775;</strong>" : '');
    output += `<br><br><strong>HP:</strong> ${resolveAttr(cid, 'hp').current}/${resolveAttr(cid, 'hp').max} `;
    output += (parseInt(resolveAttr(cid, 'hp').current, 10) < parseInt(resolveAttr(cid, 'hp').max, 10) ? ` <small style='color:#9d0a0e' title='down by ${parseInt(resolveAttr(cid, 'hp').max, 10) - parseInt(resolveAttr(cid, 'hp').current, 10)} '>&#129301; ${parseInt(resolveAttr(cid, 'hp').current, 10) - parseInt(resolveAttr(cid, 'hp').max, 10)}</small> ` : '');
    output += (parseInt(resolveAttr(cid, 'hp_temp').current, 10) > 0 ? ` <span style='color:green'>+ ${resolveAttr(cid, 'hp_temp').current} TMP</span>` : '');
    output += `<br><strong>AC:</strong> ${resolveAttr(cid, 'ac').current}`;
    output += `<br><br>Speed: ${resolveAttr(cid, 'speed').current} ft, Passive Perception: ${resolveAttr(cid, 'passive_wisdom').current}<br>Initiative bonus: ${resolveAttr(cid, 'initiative_bonus').current > 0 ? `+${resolveAttr(cid, 'initiative_bonus').current}` : resolveAttr(cid, 'initiative_bonus').current}`;
    output += '<br><br>';
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
    } else {
      msg.selected.forEach((obj) => {
        const token = getObj('graphic', obj._id); // eslint-disable-line no-underscore-dangle
        let character;
        if (token) {
          character = getObj('character', token.get('represents'));
        }
        if (character) {
          /* get the attributes and assemble the output */
          const charname = character.get('name');
          const charicon = character.get('avatar');
          if (myoutput.length > 0) myoutput += '<br>';
          myoutput += `<div style='display:inline-block; font-variant: small-caps; color:##9d0a0e; font-size:1.8em;margin-top:5px;'><img src='${charicon}' style='height:48px;width:auto;margin-right:5px;margin-bottom:5px;vertical-align:middle'>${charname}</div>${getCharOtherAtt(character)}${getCharMainAtt(character)}`;
        }
      });
    }

    sendChat(scname, `/w gm <div style='border:1px solid black; background-color: #f9f7ec; padding:8px; border-radius: 6px; font-size:0.85em;line-height:0.95em;'>${myoutput}</div>`); // eslint-disable-line quotes
    myoutput = '';
  });
});
