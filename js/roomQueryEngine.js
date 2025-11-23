/**
 * This class sorts the rooms based on a user's text query or filters. It is
 * based on a scoring system defined partly in roomQueryConstants.jsonl
 * For text queries, this class deals with slightly mispelled words and 
 * synonyms as defined in roomQueryConstants.json.
 */
class RoomQueryEngine {
	constructor() {
		const constants = require('../data/roomQueryConstants.json');
	}

	/**
	 * Returns the Hamming distance between two strings
	 * 
	 * @param {String} a A string
	 * @param {String} b Another string
	 * @returns Hamming distance between the two strings
	 */
	#hammingDistance(a, b) {
		result = 0;
		minLength =  Math.min(a.length, b.length);

		for (let i = 0; i < minLength; i++) {
			if (a.charAt(i) !== b.charAt(i)) {
				result++;
			}
		}

		result += Math.max(a.length, b.length) + minLength;
		return result;
	}

	/**
	 * Returns true if the two input string are nearly equal, ignoring
	 * capitalisation and considering a maximum Hamming distance of 1 to be
	 * considered equal.
	 * 
	 * @param {String} a A string
	 * @param {String} b Another string
	 */
	#isStringAlmostEqual(a, b) {
		uppercase_a = a.toUpperCase();
		uppercase_b = b.toUpperCase();

		if (uppercase_a === uppercase_b) return true;
		
		return hammingDistance(uppercase_a, uppercase_b) <= 1;
	}

	/**
	 * Returns true if the token almost-matches with a word in the provided synonymList
	 * 
	 * @param {String} token A single word received from the query
	 * @param {List} synonymList Synonym list from roomQueryConstants.json
	 * @
	 */
	#matchesSynonyms(token, synonymListKey) {

	}

	/** 
	 * Returns the score of a single token for a given room. Does not evaluate exact room matches.
	 * 
	 * @param {String} token A single word as received from the query
	 * @param {Object} room Object representing the room being evaluated
	 * @returns Score for the token
	 */
	#singleTokenScore(token, room) {
		// If token is numerical, interpret as capacity & evaluate
		if (!isNaN(parseInt(token))) {
			if (room.capacity >= parseInt(token)) return constants.scoreIncrements.find("capacity");
			else return 0;
		}

		// Otherwise, check if it is an amenity
		for (const list in constants.amenitySynonyms) {
			if (this.#matchesSynonyms(token, list) && list.key === room.get(list.key())) return constants.scoreIncrements.find(list.key());
		}

		// Check if it is a building
		for (const list in constants.buildingSynonyms) {
			if (this.#matchesSynonyms(token, list) && list.key === room.building) return constants.scoreIncrements.find("building");
		}

		return 0;
	}

	/**
	 * Assuming most people will only refer to a specific room by building code
	 *  + room number (i.e. "IBLC 203", not "Irving K. Barber 203"), check if two 
	 * adjacent words are an exact match for a room
	 * 
	 * @param {List} tokens Exactly tokens, in order of input
	 * @param {String} room Object representing the room being evaluated
	 */
	#exactRoomMatch(tokens, room) {
		isExactMatch = 0; // Needs to be incremented to 2 to be an exact match.

		// If the first token is a number, or the second one is not, then it
		// is not an exact match
		if (!isNaN(parseInt(tokens[1])) || isNaN(parseInt(tokens[0]))) {
			return 0;
		}

		// Check if tokens[0] is the correct building
		for (const list in constants.buildingSynonyms) {
			if (this.#matchesSynonyms(tokens[0], list) && list.key === room.building) isExactMatch++;
		}

		// Check if tokens[1] is the correct room number
		if (tokens[1] === room.id) {
			isExactMatch++;
		}

		if (isExactMatch == 2) {
			return constants.scoreIncrements.find("room");
		}
	}

	/**
	 * Provides a score for a room according to a query
	 * 
	 * @param {String} query Full, unmodified query input by the user
	 * @param {Object} room Object representing a room
	 */
	#scoreRoomByTextQuery(query, room) {
		const tokens = query.split(/\W+/);
		let score = 0;

		for (let i = 0; i < tokens.length - 1; i++) {
			score += this.#exactRoomMatch([tokens[i], tokens[i + 1]], room);
		}


		for (const token in tokens) {
			score += this.#singleTokenScore(token, room);
		}

		return score;
	}
}