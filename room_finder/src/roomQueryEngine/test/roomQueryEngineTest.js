/**
 * This file tests RoomQueryEngine (the lazy way).
 * 
 * I forgot how much I disliked JS and Mocha won't cooperate unless I set this
 * as a Node project and I don't feel like doing that.
 */

import RoomQueryEngine from '../main/roomQueryEngine.js';

function sanityTest() {
	const engine = new RoomQueryEngine();
}

function hammingDistanceTest() {
	let pass = true;

	pass = pass && (RoomQueryEngine.hammingDistance("abcdef", "abcdef") == 0);
	console.log("HDT 1: " + pass);
	pass = pass && (RoomQueryEngine.hammingDistance("abcdeg", "abcdef") == 1);
	console.log("HDT 2: " + pass);
	pass = pass && (RoomQueryEngine.hammingDistance("abcd", "abcdef") == 2);
	console.log("HDT 3: " + pass);
	pass = pass && (RoomQueryEngine.hammingDistance("abcdef", "abcd") == 2);
	console.log("HDT 4: " + pass)

	console.log("HDT: Hamming distance test passes? " + pass);
}

function isStringAlmostEqualTest() {
	let pass = true;

	pass = pass && (RoomQueryEngine.isStringAlmostEqual("abcdef", "abcdef") == true);
	console.log("ISAET 1: " + pass);
	pass = pass && (RoomQueryEngine.isStringAlmostEqual("abcdeg", "abcdef") == true);
	console.log("ISAET 2: " + pass);
	pass = pass && (RoomQueryEngine.isStringAlmostEqual("abcdmn", "abcdef") == false);
	console.log("ISAET 3: " + pass);
	pass = pass && (RoomQueryEngine.isStringAlmostEqual("abcd", "abcdef") == false);
	console.log("ISAET 4: " + pass);
	pass = pass && (RoomQueryEngine.isStringAlmostEqual("abcdef", "abcd") == false);
	console.log("ISAET 5: " + pass)

	console.log("Is String Almost Equal test passes? " + pass);
}

function matchesSynonymsTest() {
	let pass = true;
	pass = pass && (RoomQueryEngine.matchesSynonyms("whiteboard", {"key": "whiteboard", "synonyms": ["whiteboard", "chalkboard"]}) == true);
	console.log("MST 1: " + pass);
	pass = pass && (RoomQueryEngine.matchesSynonyms("whoteboard", {"key": "whiteboard", "synonyms": ["whiteboard", "chalkboard"]}) == true);
	console.log("MST 2: " + pass);
	pass = pass && (RoomQueryEngine.matchesSynonyms("chalkboard", {"key": "whiteboard", "synonyms": ["whiteboard", "chalkboard"]}) == true);
	console.log("MST 3: " + pass);
	pass = pass && (RoomQueryEngine.matchesSynonyms("chalkbarg", {"key": "whiteboard", "synonyms": ["whiteboard", "chalkboard"]}) == false);
	console.log("MST 4: " + pass);
	pass = pass && (RoomQueryEngine.matchesSynonyms("woodward", {"key": "Woodward", "synonyms": ["Woodward", "IRC", "WOOD"]}) == true);
	console.log("MST 5: " + pass);
	pass = pass && (RoomQueryEngine.matchesSynonyms("wood", {"key": "Woodward", "synonyms": ["Woodward", "IRC", "WOOD"]}) == true);
	console.log("MST 6: " + pass);
	pass = pass && (RoomQueryEngine.matchesSynonyms("woodywarg", {"key": "Woodward", "synonyms": ["Woodward", "IRC", "WOOD"]}) == false);
	console.log("MST 7: " + pass)

	console.log("Matches Synonym test passes? " + pass);
}

function singleTokenScoreTest() {
	const room1 = {"id": "156", "building": "Irving K. Barber", "capacity": 8, "whiteboard": true, "tv": false, "outlets": true, "quiet": true};
	const engine = new RoomQueryEngine();
	let pass = true;

	pass = pass && (engine.singleTokenScore("ikb", room1) == 10);
	console.log("STS 1: " + pass);
	// console.log("actual score: " + engine.singleTokenScore("ikb", room1));
	pass = pass && (engine.singleTokenScore("chalkboarg", room1) == 1);
	console.log("STS 2: " + pass);
	// console.log("actual score: " + engine.singleTokenScore("chalkboarg", room1));
	pass = pass && (engine.singleTokenScore("loud", room1) == 0);
	console.log("STS 3: " + pass);
	// console.log("actual score: " + engine.singleTokenScore("loud", room1));
	pass = pass && (engine.singleTokenScore("6", room1) == 10);
	console.log("STS 4: " + pass);
	// console.log("actual score: " + engine.singleTokenScore("6", room1));

	console.log("Single Token Score test passes? " + pass);
}

function exactRoomMatchTest() {
	const room1 = {"id": "156", "building": "Irving K. Barber", "capacity": 8, "whiteboard": true, "tv": false, "outlets": true, "quiet": true};
	const engine = new RoomQueryEngine();
	let pass = true;

	pass = pass && (engine.exactRoomMatch(["ikb", "156"], room1) == 100);
	console.log("ERMT 1: " + pass);
	pass = pass && (engine.exactRoomMatch(["iblc", "156"], room1) == 100);
	console.log("ERMT 2: " + pass);
	pass = pass && (engine.exactRoomMatch(["wood", "156"], room1) == 0);
	console.log("ERMT 3: " + pass);
	pass = pass && (engine.exactRoomMatch(["ikb", "200"], room1) == 0);
	console.log("ERMT 4: " + pass);
	pass = pass && (engine.exactRoomMatch(["wood", "200"], room1) == 0);
	console.log("ERMT 5: " + pass);

	console.log("Exact Room Match test passes? " + pass);
}

function scoreRoomByTextQueryTest() {
	const room1 = {"id": "156", "building": "Irving K. Barber", "capacity": 8, "whiteboard": true, "tv": false, "outlets": true, "quiet": true};
	const engine = new RoomQueryEngine();
	let pass = true;

	// Room + building match
	pass = pass && (engine.scoreRoomByQuery("ikb 156", room1) == 110); 
	console.log("SRBTQT 1: " + pass);
	// Building + quiet match ("silen" is "silent" mispelled)
	pass = pass && (engine.scoreRoomByQuery("ikb silen", room1) == 11); 
	console.log("SRBTQT 2: " + pass);
	// Building + capacity + chalkboard match (No "tv" match, room has no television)
	pass = pass && (engine.scoreRoomByQuery("ikb 6 people tv chalkboard", room1) == 21);
	console.log("SRBTQT 3: " + pass);
	// No match
	pass = pass && (engine.scoreRoomByQuery("irrelevant text", room1) == 0);
	console.log("SRBTQT 4: " + pass);

	console.log("Score Room By Text Query passes? " + pass);

}

sanityTest();
hammingDistanceTest();
isStringAlmostEqualTest();
matchesSynonymsTest();
singleTokenScoreTest();
exactRoomMatchTest();
scoreRoomByTextQueryTest();