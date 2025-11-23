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
	hammingDistance(a, b) {
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
	isStringAlmostEqual(a, b) {
		uppercase_a = a.toUpperCase();
		uppercase_b = b.toUpperCase();

		if (uppercase_a === uppercase_b) return true;
		
		return hammingDistance(uppercase_a, uppercase_b) <= 1;
	}

	/**
	 * Provides a score for a room according to a query
	 * 
	 * @param {String} query Full, unmodified query input by the user
	 * @param {Object} room Object representing a room (Not sure how this is going to go)
	 */
	scoreRoomByQuery(query, room) {
		const tokens = query.split(/\W+/);
		let score = 0;

		for (const token in tokens) {
			score +=
		}

		return score;
	}
}