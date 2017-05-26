module.exports = {
  "location": {
    "row": 8,
    "col": 47
  },
  "cssClass": "pop-left",
  "alignment": {
    "moral": "neutral",
    "ethical": "good"
  },
  "type": "thorpe",
  "story": [
	"Renown for their livestock this settlement irritated the wrong witch which resulted in a purple haze covering the",
	"area and some interesting effects"
  ],
  "modifiers": {
    "corruption": 0,
    "crime": 0,
    "economy": 0,
    "law": 0,
    "lore": 0,
    "society": 0
  },
  "localCasters": 0,
  "baseLimit": 0,
  "purchaseLimit": 0,
  "qualities": [
	'animal polyglot',
	'famed breeders'
  ],
  "danger": 0,
  "disadvantages": [
	function (data, warnings, modifiers) {
		const warn = warnings.findIndex((w) => w === 'Too Many Qualities (-1)');
		if(warn === -1) {
			warnings.push('Too Few Qualities (1)');
		} else {
			warnings.splice(warn, 1);
		}
		modifiers.push('Citizens of this settlement inexplicably cannot speak the common tounge')
		modifiers.push('GMNote: This should be removable via story stuff, if this is removed animal polyglot goes with it');
	}
  ],
  "government": "autocracy"
}
