import * as constantsData from '../../data/roomQueryConstants.json' with {type: 'json'};

/**
 * This class sorts the rooms based on a user's text query or filters. It is
 * based on a scoring system defined partly in roomQueryConstants.jsonl
 * For text queries, this class deals with slightly mispelled words and 
 * synonyms as defined in roomQueryConstants.json.
 */
export default class RoomQueryEngine {
	constructor() {
		this.constants = constantsData.default;
	}

	/**
	 * Returns a distance between two strings (like a Hamming Distance but
	 * calculated slightly differently)
	 * 
	 * @param {String} a A string
	 * @param {String} b Another string
	 * @returns Hamming distance between the two strings
	 */
	static hammingDistance(a, b) {
		let result = 0;
		let minLength = Math.min(a.length, b.length);

		for (let i = 0; i < minLength; i++) {
			if (a.charAt(i) !== b.charAt(i)) {
				result++;
			}
		}

		result += Math.max(a.length, b.length) - minLength;
		return result;
	}

	/**
	 * Returns true if the two input string are nearly equal, ignoring
	 * capitalisation and considering a maximum Hamming distance of 1 to be
	 * considered equal.
	 * 
	 * @param {String} a A string
	 * @param {String} b Another string
	 * @returns True if a and b are nearly equal, false otherwise.
	 */
	static isStringAlmostEqual(a, b) {
		let uppercase_a = a.toUpperCase();
		let uppercase_b = b.toUpperCase();

		if (uppercase_a === uppercase_b) return true;
		
		return (RoomQueryEngine.hammingDistance(uppercase_a, uppercase_b) <= 1);
	}

	/**
	 * Returns true if the token almost-matches with a word in the provided
	 * synonymList
	 * 
	 * @param {String} token A single word received from the query
	 * @param {Object} synonyms Synonym object (containing both "key" and
	 * "synonyms") from roomQueryConstants.json
	 * @return True if either the key or one of the synonyms in the synonym
	 * list match the token, false otherwise.
	 */
	static matchesSynonyms(token, synonyms) {
		if (RoomQueryEngine.isStringAlmostEqual(token, synonyms.key)) {
			return true;
		}
		for (const synonym of synonyms.synonyms) {
			if (RoomQueryEngine.isStringAlmostEqual(token, synonym)) {
				return true;
			}
		}
		return false;
	}

	/** 
	 * Returns the score of a single token for a given room. Does not evaluate
	 * exact room matches.
	 * 
	 * @param {String} token A single word as received from the query
	 * @param {Object} room Object representing the room being evaluated
	 * @returns Score for the token, if it fits a criteria (except for "room"),
	 * 0 otherwise
	 */
	singleTokenScore(token, room) {
		// If token is numerical, interpret as capacity & evaluate
		if (!isNaN(parseInt(token))) {
			if (room.capacity >= parseInt(token)) return this.constants.scoreIncrements.find((e) => e.criterion === "capacity").increment;
			else return 0;
		}

		// Otherwise, check if it is an amenity
		for (const list of this.constants.amenitySynonyms) {
			if (RoomQueryEngine.matchesSynonyms(token, list) && room[list.key]) {
				return this.constants.scoreIncrements.find((e) => e.criterion === list.key).increment;
			}
		}

		// Check if it is a building
		for (const list of this.constants.buildingSynonyms) {
			if (RoomQueryEngine.matchesSynonyms(token, list) && list.key === room.building) {
				return this.constants.scoreIncrements.find((e) => e.criterion === "building").increment;
			}
		}

		return 0;
	}

	/**
	 * Assuming most people will only refer to a specific room by building code
	 * plus room number (i.e. "IBLC 203", not "Irving K. Barber 203"), check if
	 * two adjacent words are an exact match for a room
	 * 
	 * @param {List} tokens Exactly tokens, in order of input
	 * @param {Object} room Object representing the room being evaluated
	 * @returns The score increment for the "room" criterion if the tokens are
	 * a match for the input room, 0 otherwise.
	 */
	exactRoomMatch(tokens, room) {
		let isExactMatch = 0; // Needs to be incremented to 2 to be an exact match.

		// If the first token is a number, or the second one is not, then it
		// is not an exact match
		if (isNaN(parseInt(tokens[1])) || !isNaN(parseInt(tokens[0]))) {
			return 0;
		}

		// Check if tokens[0] is the correct building
		for (const list of this.constants.buildingSynonyms) {
			if (RoomQueryEngine.matchesSynonyms(tokens[0], list) && list.key === room.building) isExactMatch++;
		}

		// Check if tokens[1] is the correct room number
		if (tokens[1] === room.id) {
			isExactMatch++;
		}

		if (isExactMatch == 2) {
			return this.constants.scoreIncrements.find((e) => e.criterion === "room").increment;
		}

		return 0;
	}

	/**
	 * Provides a score for a room according to a query
	 * 
	 * @param {String} query Full, unmodified query input by the user
	 * @param {Object} room Object representing a room
	 * @returns Integer score of a room
	 */
	scoreRoomByTextQuery(query, room) {
		const tokens = query.split(/\W+/);
		let score = 0;

		for (let i = 0; i < tokens.length - 1; i++) {
			score += this.exactRoomMatch([tokens[i], tokens[i + 1]], room);
		}

		for (const token of tokens) {
			score += this.singleTokenScore(token, room);
		}

		return score;
	}

	/**
	 * (WIP) Sorts a list of rooms according to the query engine's scoring functions
	 * 
	 * @param {query} query Full, unmodified query input by the user
	 * @param {List} rooms List of Room objects
	 * @returns List of rooms sorted by score.
	 */
	getRoomsOrderedByQuery(query, rooms) {
		// Stub only, will implement sorting later
		return rooms;
	}
}
