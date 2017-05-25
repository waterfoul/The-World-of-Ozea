import React from 'react';
import './App.css';
import './Settlement.css';

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
			data.modifiers.law -= 2;
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
			case 'broad minded':
				data.modifiers.lore += 1;
				data.modifiers.society += 1;
				modifiers.push('The citizens are open, friendly, and tolerant, and react positively towards visitors.');
		}
	});

    return (
		<span
			className={`row-${data.location.row} col-${data.location.col} ${data.type} settlement hasCard`}
		>
			<div className="card">
					<div className="label">
						Name
					</div>
					<div className="data">
						{name}
					</div>
					<div className="label">
						Location
					</div>
					<div className="data">
						{data.location.col}x{data.location.row}
					</div>
					<div className="label">
						Alignment
					</div>
					<div className="data">
						{data.alignment.moral === data.alignment.ethical ?
							data.alignment.moral :
							data.alignment.moral + ' ' + data.alignment.ethical
						}
					</div>
					<div className="label">
						Story
					</div>
					<div className="data nocaps">
						{data.story}
					</div>
					<div className="label">
						Type
					</div>
					<div className="data">
						{data.type}
					</div>
					<div className="label">
						Local Spellcasting
					</div>
					<div className="data">
						{data.localCasters}
					</div>
					<div className="label">
						Base Limit
					</div>
					<div className="data">
						{data.baseLimit}
					</div>
					<div className="label">
						Purchase Limit
					</div>
					<div className="data">
						{data.purchaseLimit}
					</div>
					<div className="label">
						Corruption
					</div>
					<div className="data">
						{data.modifiers.corruption}
					</div>
					<div className="label">
						Crime
					</div>
					<div className="data">
						{data.modifiers.crime}
					</div>
					<div className="label">
						Economy
					</div>
					<div className="data">
						{data.modifiers.economy}
					</div>
					<div className="label">
						Law
					</div>
					<div className="data">
						{data.modifiers.law}
					</div>
					<div className="label">
						Lore
					</div>
					<div className="data">
						{data.modifiers.lore}
					</div>
					<div className="label">
						Society
					</div>
					<div className="data">
						{data.modifiers.society}
					</div>
					<div className="label">
						Qualities
					</div>
					<div className="data">
						{data.qualities.join(', ')}
					</div>
					<div className="label">
						Modifiers
					</div>
					<div className="data">
						<ul>{modifiers.map((m) => <li>{m}</li>)}</ul>
					</div>
					<div className="label">
						Danger
					</div>
					<div className="data">
						{data.danger}
					</div>
					<div className="label">
						Disadvantages
					</div>
					<div className="data">
						{data.disadvantages.join(', ')}
					</div>
					<div className="label">
						Government
					</div>
					<div className="data">
						{data.government}
					</div>
					<div className="label">
						Warnings
					</div>
					<div className="data">
						<ul>{warnings.map((w) => <li>{w}</li>)}</ul>
					</div>
				</div>
		</span>
	);
};

