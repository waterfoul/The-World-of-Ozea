import React from 'react';
import './App.css';
import './Settlement.css';

function isFunction(object) {
 return object && typeof object === 'function';
}

function applyAlignment(data) {
	if(data.alignment.moral === 'lawful') {
		data.modifiers.law++;
	} else if(data.alignment.moral === 'neutral') {
		data.modifiers.lore++;
	} else if(data.alignment.moral === 'chaotic') {
		data.modifiers.crime++;
	}
	
	if(data.alignment.ethical === 'good') {
		data.modifiers.society++;
	} else if(data.alignment.ethical === 'neutral') {
		data.modifiers.lore++;
	} else if(data.alignment.ethical === 'evil') {
		data.modifiers.corruption++;
	}
}

function toAll(data, mod) {
	for(var i in data.modifiers) {
		data[i] += mod;
	}
}

function checkQualities(data, warnings, count) {
	if(data.government === 'theocracy') {
		count++;
	}
	if(data.qualities.length < count) {
		warnings.push('Too Few Qualities (' + (count - data.qualities.length) + ')');
	} else if(data.qualities.length > count) {
		warnings.push('Too Many Qualities (' + (count - data.qualities.length) + ')');
	}
}

export const Settlement = ({name, data}) => {
	data = {...data};
	const warnings = [];
	const modifiers = [];
	applyAlignment(data);
	
	switch(data.government) {
		case 'colonial':
			data.modifiers.corruption += 2;
			data.modifiers.economy += 1;
			data.modifiers.law += 1;
			break;
		case 'council':
			data.modifiers.society += 4;
			data.modifiers.lore -= 2;
			data.modifiers.law -=	 2;
			break;
		case 'dynasty':
			data.modifiers.corruption += 1;
			data.modifiers.law += 1;
			data.modifiers.society -= 2;
			break;
		case 'magical':
			data.modifiers.lore += 2;
			data.modifiers.corruption -= 2;
			data.modifiers.society -= 2;
			data.localCasters += 1;
			modifiers.push("An individual or group with potent magical power, such as A high priest, an archwizard, or even a magical monster, leads the community.");
			break;
		case 'military':
			data.modifiers.law += 3;
			data.modifiers.corruption -= 1;
			data.modifiers.society -= 1;
			break;
		case 'overlord':
			data.modifiers.law += 2;
			data.modifiers.corruption += 2;
			data.modifiers.crime -= 2;
			data.modifiers.society -= 2;
			break;
		case 'secret syndicate':
			data.modifiers.corruption += 2;
			data.modifiers.economy += 2;
			data.modifiers.crime += 2;
			data.modifiers.law -= 6;
			break;
		case 'theocracy':
			applyAlignment(data);
			// Add one of desecrate/hallow, Holy Site, Pious, Racial Enclave, Racially Intolerant, Unholy Site as extra quality
			break;
		case 'plutocracy':
			data.modifiers.corruption += 2;
			data.modifiers.economy += 3;
			data.modifiers.crime += 2;
			data.modifiers.society -= 2;
			break;
		case 'utopian experiment':
			data.modifiers.lore += 1;
			data.modifiers.society += 2;
			data.modifiers.corruption -= 2;
			data.modifiers.crime -= 1;
			break;
	}
	
	switch(data.type) {
		case 'thorpe':
			toAll(data, -4);
			checkQualities(data, warnings, 1);
			data.localCasters += 1;
			data.baseLimit += 50;
			data.purchaseLimit += 500;
			data.danger -= 10;
			break;
		case 'hamlet':
			toAll(data, -2);
			checkQualities(data, warnings, 1);
			data.localCasters += 2;
			data.baseLimit += 200;
			data.purchaseLimit += 1000;
			data.danger -= 5;
			break;
		case 'village':
			toAll(data, -1);
			checkQualities(data, warnings, 2);
			data.localCasters += 3;
			data.baseLimit += 500;
			data.purchaseLimit += 2500;
			data.danger -= 0;
			break;
		case 'small town':
			toAll(data, 0);
			checkQualities(data, warnings, 2);
			data.localCasters += 4;
			data.baseLimit += 1000;
			data.purchaseLimit += 5000;
			data.danger -= 0;
			break;
		case 'large town':
			toAll(data, 0);
			checkQualities(data, warnings, 3);
			data.localCasters += 5;
			data.baseLimit += 2000;
			data.purchaseLimit += 10000;
			data.danger += 5;
			break;
		case 'small city':
			toAll(data, 1);
			checkQualities(data, warnings, 4);
			data.localCasters += 6;
			data.baseLimit += 4000;
			data.purchaseLimit += 25000;
			data.danger += 5;
			break;
		case 'large city':
			toAll(data, 2);
			checkQualities(data, warnings, 5);
			data.localCasters += 7;
			data.baseLimit += 8000;
			data.purchaseLimit += 50000;
			data.danger += 10;
			break;
		case 'metropolis':
			toAll(data, 4);
			checkQualities(data, warnings, 6);
			data.localCasters += 8;
			data.baseLimit += 16000;
			data.purchaseLimit += 100000;
			data.danger += 10;
			break;
	}
	
	data.qualities.forEach((q) => {
		switch(q) {
			case 'abundant':
				data.modifiers.economy += 1;
				modifiers.push('Reduce the purchase price of most forms of locally-grown food and livestock by 25% or more.');
				modifiers.push('The settlement has access to extraordinary natural resources: rich farmland, a deep lake, excellent hunting grounds nearby or even a convenient source of magical sustenance. The local food surplus makes the settlement a major exporting hub, and increases the standard of living for its inhabitants.');
				break;
			case 'abstinent':
				if(data.alignment.moral !== 'lawful') {
					warnings.push('Only Lawful communities can be Abstinent');
				}
				modifiers.push('The settlement religious or moral convictions force it to deny some of the world’s more common vices. The settlement prohibits a common vice: usually alcohol is prohibited, but other abstinent settlements might ban stronger drugs, tobacco, prostitution, or even ‘indulgent’ foods like fine pastries, meat, or similar.');
				data.modifiers.corruption += 2;
				data.modifiers.law += 1;
				data.modifiers.society -= 2;
				break;
			case 'academic':
				modifiers.push('The settlement possesses a school, training facility, or university of great renown.');
				data.modifiers.lore += 1;
				data.localCasters += 1;
				break;
			case 'adventure site':
				data.modifiers.society += 2;
				data.purchaseLimit *= 1.5;
				modifiers.push('Proximity to a famous adventuring location has long drawn curious adventures from across the land.');
				break;
			case 'animal polyglot':
				data.modifiers.economy -= 1;
				data.modifiers.lore += 1;
				data.localCasters += 1;
				modifiers.push('Add the settlement’s Lore modifier to Handle Animal checks made within the settlement.');
				modifiers.push('All creatures of the Animal type gain the ability to speak and think while within the settlement’s borders. Animals act as if their INT scores were 6, and gain ability to speak Common; they lose these benefits as soon as they pass the settlement’s borders.');
				modifiers.push('There are likely to be few butcher shops within the settlement’s borders….');
				break;
			case 'anthropomorphizing':
				data.modifiers.society -= 1;
				data.modifiers.lore += 1;
				modifiers.push('Increase spellcasting by +1 levels when casting Transmutation spells only.');
				modifiers.push('Non-anthro characters can become both Anthros and citizens by undergoing a day-long religious ritual led by the settlements druids or clerics. The ritual requires the donation of goods or treasure to the community worth at least 5,000 gp. At the end of the ritual, the supplicant loses his or her original racial traits and becomes an Anthro. Select an Order and spend build points as normal to build an Anthro character.');
				modifiers.push('This settlement is a haven for those with fur and feathers. Fascinatingly inhuman Anthros walk the streets; the settlements are powerful boar-men or lion anthros; its prostitutes are glamorous bird or cat-women, its wizards a hybrid between ferret and man, and so on….');
				break;
			case 'artifact gatherer':
				data.modifiers.economy += 2;
				data.baseLimit *= 1.5;
				modifiers.push('The sale of a certain kind of rare item is heavily restricted. This may be items of a magical, technological, or psychic origin.');
				break;
			case 'artist’s colony':
				data.modifiers.economy += 1;
				data.modifiers.society += 1;
				modifiers.push('Add the settlement’s Economy modifier on all Craft checks, not just those made to earn a living.');
				modifiers.push('The settlement is renowned for the excellence of its local artists, performers and craftsfolk.');
				break;
			case 'asylum':
				data.modifiers.economy += 1;
				data.modifiers.society -= 2;
				modifiers.push('The settlement is host to an infamous madhouse or asylum (or perhaps a prison, gaol or notorious workhouse). The presence of these dangerous, mad souls has hardened the townsfolk, making them suspicious of strangers and paranoid about the possibility of an escape or other tragedy.');
				break;
			case 'broad minded':
				data.modifiers.lore += 1;
				data.modifiers.society += 1;
				modifiers.push('The citizens are open, friendly, and tolerant, and react positively towards visitors.');
				break;
			case 'city of the dead':
				data.modifiers.economy -= 2;
				data.modifiers.lore += 2;
				data.modifiers.law += 1;
				modifiers.push('Add the settlement’s Lore modifier to Knowledge (history) and Knowledge (nobility) checks.');
				modifiers.push('The settlement abuts a massive, historically significant graveyard, massive tomb or mausoleum complex. Its monuments are well maintained, and a powerful ancestor cult exists within the city, either in replacement or addition to traditional religions.');
				break;
			case 'cruel watch':
				if(data.alignment.moral !== 'lawful') {
					warnings.push('Only Lawful communities can have Cruel Watch');
				}
				data.modifiers.corruption += 1;
				data.modifiers.law += 2;
				data.modifiers.crime -= 3;
				data.modifiers.society -= 3;
				modifiers.push('The settlement’s civic watch or police force is infamous for its brutality, effectiveness, cruelty and corruption.');
				break;
			case 'cultured':
				data.modifiers.society += 1;
				data.modifiers.law -= 1;
				modifiers.push('Always counts as a prosperous city for the purpose of perform checks.');
				modifiers.push('The settlement is well known for its culture of artistry, particularly among actors and musicians.');
				break;
			case 'darkvision':
				data.modifiers.economy += 1;
				data.modifiers.crime -= 1;
				modifiers.push('Most of the citizens have darkvision, and thus nights provide no cover for thieves and other criminals.Merchants lose little inventory to dishonesty.');
				break;
			case 'decadent':
				if(data.alignment.ethical !== 'evil') {
					warnings.push('Only Evil communities can be Decadant');
				}
				data.modifiers.corruption += 1;
				data.modifiers.crime += 1;
				data.modifiers.economy += 1;
				data.modifiers.society += 1;
				data.danger += 10;
				data.baseLimit *= 1.25;
				modifiers.push('The settlement’s vast wealth and proud, ancient heritage has made it a haven for corruption and sin.');
				break;
			case 'deep traditions':
				data.modifiers.law += 2;
				data.modifiers.crime -= 2;
				data.modifiers.society -= 2;
				modifiers.push('The settlement is bolstered by it’s strong traditions, but it’s citizens have difficulty interacting with visitors.');
				break;
			case 'defensible':
				data.modifiers.corruption += 1;
				data.modifiers.crime += 1;
				data.modifiers.economy += 1;
				data.modifiers.society -= 1;
				modifiers.push('The settlement is strategically situated to make it easier to defend, giving its inhabitants confidence and making the settlement a major local trade hub.');
				break;
			case 'defiant':
				data.modifiers.society += 1;
				data.modifiers.law += 1;
				modifiers.push('The citizends of this settlement have a natural predilection for free thinking that borders on rebellious action.');
				break;
			case 'desecrate':
				if(data.alignment.ethical !== 'evil') {
					warnings.push('Only Evil communities can be desecrate');
				}
				modifiers.push('The entire settlement is under the effects of a permanent desecrate effect of incredible power. This effect can be suppressed in small areas within the settlement. The caster level for the effect is equal to 20 + the settlement’s size modifier, for the purpose of dispelling.');
				break;
			case 'hallow':
				if(data.alignment.ethical !== 'good') {
					warnings.push('Only Good communities can be hallow');
				}
				modifiers.push('The entire settlement is under the effects of a permanent hallow effect of incredible power. This effect can be suppressed in small areas within the settlement. The caster level for the effect is equal to 20 + the settlement’s size modifier, for the purpose of dispelling.');
				break;
			case 'eldritch':
				data.modifiers.lore += 2;
				data.danger += 13;
				modifiers.push('Increase spellcasting by +2 levels when casting divination or necromancy spells only.');
				modifiers.push('The town has a strange and unnatural air, and is a popular place for sorcerers and oracles.');
				break;
			case 'famed breeders':
				data.modifiers.economy += 1;
				modifiers.push('Increase Base Value and Base Purchase Limit by +20% when dealing with mounts and associated gear.');
				modifiers.push('Characters can purchase mounts or live stock in the settlement at a +10% discount.');
				modifiers.push('The settlement is known for the excellent quality of the animals bred there, from the mundane (horses, mules, cattle, pigs) to the exotic (talking tigers, Pegasai, griffons). People come from far and wide to purchase livestock, draft animals, mounts and animal companions.');
				break;
			case 'financial center':
				if(data.alignment.moral === 'chaotic') {
					warnings.push('Chaotic communities can not be Financial Centers');
				}
				data.modifiers.economy += 2;
				data.modifiers.law += 2;
				data.baseLimit *= 1.4
				data.purchaseLimit *= 1.4
				modifiers.push('This settlement is home to powerful banks, mints, trading houses, currency exchanges and other powerful financial and mercantile organizations.');
				break;
			case 'free city':
				if(data.alignment.moral !== 'chaotic') {
					warnings.push('Only Chaotic communities can be Free Cities');
				}
				data.modifiers.crime += 2;
				data.modifiers.law -= 2;
				data.danger += 5;
				modifiers.push('The city’s libertarian laws make it a haven for fugitives and outcasts of all kinds, from runaway children, serfs who escaped their lord’s lands, criminals and escaped slaves alike. Foreign adventurers and bounty hunters cannot arrest or capture fugitives within the settlement’s borders.');
				break;
			case 'gambling':
				data.modifiers.crime += 2;
				data.modifiers.corruption += 2;
				data.modifiers.economy += 2;
				data.modifiers.law -= 1;
				data.purchaseLimit *= 1.1;
				modifiers.push('The settlement caters to vice and greed.');
				modifiers.push('Casinos, gaming houses, opium dens and bordellos are all common here, and serve as the town’s major industry.');
				break;
			case 'god ruled':
				if(data.government !== 'thocracy' && data.government !== 'utopian experiment') {
					warnings.push('Only Chaotic communities can be Free Cities');
				}
				data.modifiers.corruption -= 2;
				data.modifiers.society -= 2;
				modifiers.push('Add one dice to the number of medium magic items for sale in the settlement.');
				modifiers.push('The settlement has no real government; instead it is ruled by religious codes and omens. Gods or other powerful spiritual beings or outsiders intervene directly in the settlement’s politics and daily life. Ordinary citizens are possessed by spirits to speak decrees, unmistakable oracles appear as flaming messages written on walls or in the sky, or perhaps each and every citizen has prophetic dreams that tell them what they must do in the coming day for the settlement to thrive.');
				break;
			case 'good roads':
				data.modifiers.economy += 2;
				modifiers.push('The settlement has an extensive road network. These roads are well-maintained and allow for quick movement of troops and merchandise.');
				break;
			case 'guilds':
				data.modifiers.corruption += 1;
				data.modifiers.economy += 1;
				data.modifiers.lore -= 1;
				modifiers.push('A variety of trade and mercantile guilds control the town’s industry and trade. These guilds are highly specialized (a printer’s guild, an eggler’s guild, a swordsmith’s guild, a diamond cutter’s guild,ect), and usually semi-hereditary, with children following their parents into the guild.');
				break;
			case 'holy site':
				data.modifiers.corruption -= 2;
				data.localCasters += 2
				modifiers.push('The settlement hosts a shrine, temple, or landmark with great significance to one or more religions. The settlement has a higher percentage of divine spellcasters in its population.');
				break;
			case 'insular':
				data.modifiers.law += 1;
				data.modifiers.crime -= 1;
				modifiers.push('The settlement is isolated, perhaps physically or even spiritually. Its citizens are fiercely loyal to one another.');
				break;
			case 'legendary marketplace':
				data.modifiers.economy += 2;
				data.modifiers.crime += 2;
				switch(data.type) {
					case 'thorpe':
						data.baseLimit += 150;
						data.purchaseLimit += 500;
						break;
					case 'hamlet':
						data.baseLimit += 300;
						data.purchaseLimit += 1500;
						break;
					case 'village':
						data.baseLimit += 500;
						data.purchaseLimit += 2500;
						break;
					case 'small town':
						data.baseLimit += 1000;
						data.purchaseLimit += 5000;
						break;
					case 'large town':
						data.baseLimit += 2000;
						data.purchaseLimit += 10000;
						break;
					case 'small city':
						data.baseLimit += 4000;
						data.purchaseLimit += 25000;
						break;
					case 'large city':
						data.baseLimit += 8000;
						data.purchaseLimit += 50000;
						break;
					case 'metropolis':
						data.baseLimit += 16000;
						data.purchaseLimit += 100000;
						break;
				}
				modifiers.push('The settlement is justly famed for its markets: almost anything may be for sale here! (Reflected in limits)');
				break;
			case 'living forest':
				data.modifiers.lore += 1;
				data.modifiers.society += 2;
				data.modifiers.crime -= 2;
				data.modifiers.economy -= 4;
				modifiers.push('Increase Spellcasting by 4 levels (druidic spells only).');
				modifiers.push('This settlement is a magical place, carved from the living heart of an ancient forest.');
				modifiers.push('The trees form themselves into homes, and branches bend to provide the settlement’s inhabitants with food, in the form of magical, druid-tended fruits and berries.');
				break;
			case 'long memory':
				modifiers.push('The people of this settlement have a deep-seated hatred for a specific group or faction. Any such individual who makes their presence known in town is attacked within 1d4 hours, and either violently out of the settlement or executed.');
				modifiers.push('Similarly, residents look upon those who deal with this enemy faction with suspicion, and they must pay 200% the normal price for goods and services and may face mockery, insult, or even violence.');
				break;
			case 'magically attuned':
				data.baseLimit *= 1.2;
				data.purchaseLimit *= 1.2;
				data.localCasters += 2;
				modifiers.push('The settlement is a haven for spellcasters due to its location; for example, it may lie at the convergence of multiple ley lines or near a well-known magical site.');
				break;
			case 'magical polyglot':
				data.modifiers.economy += 1;
				data.modifiers.lore += 1;
				data.modifiers.society += 1;
				modifiers.push('The settlement is blessed with a magical aura that allows all sentient creatures within its borders to understand one another as if they shared a common language. This permanent magical effect is similar to the tongues spell, and has no effect on written language, only the words spoken by the settlement’s inhabitants.');
				break;
			case 'majestic':
				data.localCasters += 1;
				modifiers.push('Add +1d8 to the number of the most expensive category of magic items the settlement offers for sale, as determined by its size.');
				modifiers.push('The settlement is known for its dramatic, sweeping architecture, monumental statuary and is built to a scale alien to most Medium size humanoids. Perhaps the settlement was once a domain of giants, or simply a human metropolis hewn to an epic scale for the sake of grandeur.');
				break;
			case 'militarized':
				data.modifiers.law += 4;
				data.modifiers.society -= 4;
				modifiers.push('The populace is devoted to the armed forces. Civil and military law is intertwined, punishments are harsh, and loyalty to the state is expected.');
				break;
			case 'mobile: frontlines':
				data.modifiers.corruption -= 1;
				data.modifiers.economy -= 1;
				data.modifiers.society -= 1;
				modifiers.push('Increase the Base Value and Purchase Limit of the settlement by 25% when trading weapons and armor.');
				modifiers.push('The entire settlement can move, albeit slowly, not much faster than an average man could walk. Perhaps it floats on a cushion of magical air, hundreds of feet above the landscape, is a fortress- castle growing from the back of some impossibly large creature, or is some kind of enormous steampunk or magi-tech tank.');
				modifiers.push('This city is designed to patrol its kingdom or territory, responding to threats and offering the city’s defenses to those in need.');
				break;
			case 'mobile: sanctuary':
				data.modifiers.economy += 1;
				data.modifiers.society -= 1;
				modifiers.push('The entire settlement can move, albeit slowly, not much faster than an average man could walk. Perhaps it floats on a cushion of magical air, hundreds of feet above the landscape, is a fortress- castle growing from the back of some impossibly large creature, or is some kind of enormous steampunk or magi-tech tank.');
				modifiers.push('This mobile settlement is designed to retreat from danger, moving to a safer location when threatened by natural disasters, invasion or famine threatens.');
				break;
			case 'morally permissive':
				data.modifiers.corruption += 1;
				data.modifiers.Economy += 1;
				modifiers.push('Decrease divine spellcasting by -1 level.');
				modifiers.push('Divine indulgence or perhaps just a corrupt church selling indulgences has made this settlement famous (or infamous) for its lax morals. Select 1d4+1 acts that would normally be considered sinful or immoral; these acts are not crimes or sins within the settlement, and committing these acts does not violate a paladin or cleric’s moral code, so long as the offense is limited to within the settlement’s borders.');
				break;
			case 'mythic sanctum':
				data.modifiers.corruption -= 2;
				modifiers.push('The settlement is a seat of power for one or more living mythic characters, granting each of the mythic characters additional influence so long as they reside here.');
				modifiers.push('Increase each resident mythic character’s effective mythic tier for the purpose of granting spells to followers.');
				break;
			case 'No Questions Asked':
				data.modifiers.society += 1;
				data.modifiers.lore -= 1;
				modifiers.push('The citizens mind their own business and respect a visitor’s privacy.');
				break;
			case 'Notorious':
				data.modifiers.crime += 1;
				data.modifiers.law -= 1;
				data.danger += 10;
				data.baseLimit *= 1.3;
				data.purchaseLimit *= 1.5;
				modifiers.push('The settlement has a reputation (deserved or not) for being a den of iniquity. Thieves, rogues, and cutthroats are much more common here.');
				break;
			case 'Peacebonding':
				data.modifiers.law += 1;
				data.modifiers.crime -= 1;
				modifiers.push('By local law, any weapon larger than a dagger and all wands and rods must either be peacebound or stored at the local sherrif’s office or jail (at the settlement’s option) for the duration of the visit. Peacebonding a weapon involves winding a colored cord tightly around the weapon and its scabbard, and then impressing the local seal in wax. Removing the peacebond requires a full round action before the item can be drawn. (Disable Device DC 12 to untangle the bond as a move equivalent action; bond hp 5, no hardness)');
				break;
			case 'Phantasmal':
				data.modifiers.economy -= 2;
				data.modifiers.society -= 2;
				modifiers.push('Increase spellcasting by two levels when dealing with planar magic or conjuration (summoning or teleportation) spells only.');
				modifiers.push('The settlement simply isn’t always there!');
				modifiers.push('This magical settlement might only appear in the moonlight, appear out of the mist on particularly holy or infamous dates, or only appear in this plane during thunderstorms or on particularly hot days. At other times, the settlement simply doesn’t exist on this plane; powerful, plane-crossing magic is required to access the settlement outside of the ‘proper’ time. The highly magical settlement is insular and clannish as a result of its isolation from the outside world.');
				break;
			case 'Pious':
				data.localCasters += 1;
				modifiers.push('The settlement is known for its inhabitants’ good manners, friendly spirit, and deep devotion to a deity (this deity must be of the same alignment as the community).');
				modifiers.push('Any faith more than one alignment step different than the community’s official religion is at best unwelcome and at worst outlawed—obvious worshipers of an outlawed deity must pay 150% of the normal price for goods and services and may face mockery, insult, or even violence)');
				break;
			case 'Planar Crossroads':
				data.modifiers.crime += 3;
				data.modifiers.economy += 2;
				data.danger += 20;
				data.localCasters += 2;
				data.baseLimit *= 1.25;
				modifiers.push('Natural or artificial planar gates near the settlement make it a cross-roads for planar travel. Creatures from across the multiverse, both malevolent and benign, can be found here, as can their artifacts.');
				modifiers.push('The Planar Crossroads settlement is the point of origin for many breed of monstrous player characters. Reduce the ECL of any monstrous player race if that race has its origin in this settlement, making heroic versions of these creatures more common in the region.');
				break;
			case 'Planned Community':
				if(data.alignment.moral !== 'lawful') {
					warnings.push('Only Lawful communities can be Planned Communities');
				}
				data.modifiers.crime -= 1;
				data.modifiers.society -= 1;
				data.modifiers.economy += 1;
				modifiers.push('The community’s design was determined in advance, every detail planned out before the first keystone was laid. Streets are wide, straight and laid out on an orderly grid, neighborhoods and districts are segregated by purpose, as are the living quarters of the city’s inhabitants.');
				break;
			case 'Pocket Universe':
				data.modifiers.economy -= 2;
				data.localCasters += 2;
				modifiers.push('Depending on the nature of the settlement and its relationship with the outside world, the settlement might be impossible to find. It may skill checks to even find the entrance to the settlement: usually a DC 20 Knowledge (local) or Knowledge (the planes) check. The settlement’s size modifier is applied to this check, albeit inverted. After all, it’s easier to find a Metropolis (DC 16) than a Thorpe (DC 24).');
				modifiers.push('Thanks to a magical fold in space and time, the settlement exists in a place far too small to sustain it. A sleepy hamlet might be found in an old mansion’s disused pantry, a huge fortress might hide the space between two old oaks, or a planar metropolis might be contained within a single cramped alley of a much less important city-state.');
				break;
			case 'Population Surge':
				data.modifiers.crime += 1;
				data.modifiers.society += 2;
				modifiers.push('This settlement is home to a greater than usual percentage of children, making it energetic and lively.');
				break;
			case 'Prosperous':
				data.modifiers.economy += 1;
				data.baseLimit *= 1.3;
				data.purchaseLimit *= 1.5;
				modifiers.push('The settlement is a popular hub for trade. Merchants are wealthy and the citizens live well.');
				break;
			case 'Racially Intolerant':
				modifiers.push('The community is prejudiced against one or more races, which are listed in parentheses. (Members of the unwelcome race or races must pay 150% of the normal price for goods and services and may face mockery, insult, or even violence)');
				break;
			case 'Racial Enclave':
				data.modifiers.society -= 1;
				modifiers.push('Members of one or more races, chosen when the settlement is founded, is especially welcome in the tight-knit and homogeneous settlement. Members of this race can purchase goods and services in the settlement at a 25% discount.');
				modifiers.push('The settlement is dominated by a single race: a pleasant halfling farming community, an elven capitol, a collection of half-orc yurts on the open plains, ect.');
				break;
			case 'Resettled Ruins':
				data.modifiers.economy += 1;
				data.modifiers.lore += 1;
				modifiers.push('Add +1d3 to the amount of magic items in any category the settlement’s size would allow it to normally offer. If the settlement’s size would not normally allow it to have magic items of a particular category, it always has at least one randomly chosen item of that category for sale. However, if a buyer rolls a natural one on any Appraise or Diplomacy check made to examine or purchase a locally bought magic item, that item is always cursed.');
				modifiers.push('The settlement is built amid the ruins of a more ancient structure. The settlement might be little more than a collection of tents and yurts erected in ruined plazas, or a thriving metropolis whose stones were recycled from long-forgotten temples and fortresses. While ruins provide a ready source of building materials, near-by dungeons to plunder and ancient artifacts to explore, they might also provide a hiding place for modern dangers or old curses.');
				break;
			case 'Religious Tolerance':
				data.modifiers.lore += 1;
				data.modifiers.society += 1;
				modifiers.push('Increase divine spellcasting by +2 levels.');
				modifiers.push('The settlement is known for its widespread religious tolerance, and many faiths have temples, cathedrals or monasteries here. Religious debates in the public square are common.');
				break;
			case 'Resource Surplus':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Restrictive':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Romantic':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Royal Accommodations':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Rule of Might':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Rumormongering Citizens':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Rural':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Sacred Animals':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Sexist':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Slumbering Monster':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Small-Folk Settlement':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Strategic Location':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Subterranean':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Superstitious':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Supportive':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Timid Citizens':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Therapeutic':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Trading Post':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Tourist Attraction':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Unaging':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Under-City':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Unholy Site':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Untamed':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Well Educated':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
			case 'Wealth Disparity':
				data.modifiers.a += 1;
				modifiers.push('');
				break;
		}
	});
	
	data.disadvantages.forEach((d) => {
		if(isFunction(d)) {
			d(data, warnings, modifiers);
		} else {
		}
	})

    return (
		<span
			className={`row-${data.location.row} col-${data.location.col} ${data.type} settlement hasCard ${data.cssClass}`}
		>
			<div className="card">
					<div className="label half">
						Name
					</div>
					<div className="data half">
						{name}
					</div>
					<div className="label half">
						Location
					</div>
					<div className="data half">
						{data.location.col}x{data.location.row}
					</div>
					<div className="label half">
						Alignment
					</div>
					<div className="data half">
						{data.alignment.moral === data.alignment.ethical ?
							data.alignment.moral :
							data.alignment.moral + ' ' + data.alignment.ethical
						}
					</div>
					<div className="label half">
						Local Spellcasting
					</div>
					<div className="data half">
						{data.localCasters}
					</div>
					<div className="label half">
						Government
					</div>
					<div className="data half">
						{data.government}
					</div>
					<div className="label half">
						Base Limit
					</div>
					<div className="data half">
						{Math.round(data.baseLimit)}
					</div>
					<div className="label half">
						Type
					</div>
					<div className="data half">
						{data.type}
					</div>
					<div className="label half">
						Purchase Limit
					</div>
					<div className="data half">
						{Math.round(data.purchaseLimit)}
					</div>
					<div className="label half">
						Corruption
					</div>
					<div className="data half">
						{data.modifiers.corruption}
					</div>
					<div className="label half">
						Crime
					</div>
					<div className="data half">
						{data.modifiers.crime}
					</div>
					<div className="label half">
						Economy
					</div>
					<div className="data half">
						{data.modifiers.economy}
					</div>
					<div className="label half">
						Law
					</div>
					<div className="data half">
						{data.modifiers.law}
					</div>
					<div className="label half">
						Lore
					</div>
					<div className="data half">
						{data.modifiers.lore}
					</div>
					<div className="label half">
						Society
					</div>
					<div className="data half">
						{data.modifiers.society}
					</div>
					<div className="label half">
						Qualities
					</div>
					<div className="data half">
						{data.qualities.join(', ')}
					</div>
					<div className="label half">
						Disadvantages
					</div>
					<div className="data half">
						{data.disadvantages.map((x) => isFunction(x) ? 'custom' : x).join(', ')}
					</div>
					<div className="label">
						Danger
					</div>
					<div className="data">
						{data.danger}
					</div>
					<div className="label">
						Story
					</div>
					<div className="data nocaps">
						{data.story.join(' ')}
					</div>
					<div className="label">
						Modifiers
					</div>
					<div className="data">
						<ul>{modifiers.map((m) => <li>{m}</li>)}</ul>
					</div>
					{warnings.length ? (
						<div className="label">
							Warnings
						</div>
					) : null }
					{warnings.length ? (
						<div className="data">
							<ul>{warnings.map((w) => <li>{w}</li>)}</ul>
						</div>
					) : null }
				</div>
		</span>
	);
};

