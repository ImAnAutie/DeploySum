var forEach = _.forEach;
var keys = _.keys;

/**
 * Export all data from an IndexedDB database
 * @param {IDBDatabase} idbDatabase - to export from
 * @param {function(Object, <string|void>)} cb - callback with signature (error, jsonString)
 */
function IDBexportToJsonString(idbDatabase, cb) {
	var exportObject = {};
	if(idbDatabase.objectStoreNames.length === 0)
		cb(null, JSON.stringify(exportObject));
	else {
		var transaction = idbDatabase.transaction(idbDatabase.objectStoreNames, "readonly");
		transaction.onerror = function(event) {
			cb(event, null);
		};
		forEach(idbDatabase.objectStoreNames, function(storeName) {
			var allObjects = [];
			transaction.objectStore(storeName).openCursor().onsuccess = function(event) {
				var cursor = event.target.result;
				if (cursor) {
					allObjects.push(cursor.value);
					cursor.continue();
				} else {
					exportObject[storeName] = allObjects;
					if(idbDatabase.objectStoreNames.length === keys(exportObject).length) {
						cb(null, JSON.stringify(exportObject));
					}
				}
			};
		});
	}
}

/**
 * Import data from JSON into an IndexedDB database. This does not delete any existing data
 *  from the database, so keys could clash
 *
 * @param {IDBDatabase} idbDatabase - to import into
 * @param {string} jsonString - data to import, one key per object store
 * @param {function(Object)} cb - callback with signature (error), where error is null on success
 */
function IDBimportFromJsonString(idbDatabase, jsonString, cb) {
	var transaction = idbDatabase.transaction(idbDatabase.objectStoreNames, "readwrite");
	transaction.onerror = function(event) {
		cb(event);
	};
	var importObject = JSON.parse(jsonString);
	forEach(idbDatabase.objectStoreNames, function(storeName) {
		var count = 0;
		forEach(importObject[storeName], function(toAdd) {
			var request = transaction.objectStore(storeName).add(toAdd);
			request.onsuccess = function(event) {
					count++;
					if(count === importObject[storeName].length) { // added all objects for this store
						delete importObject[storeName];
						if(keys(importObject).length === 0) // added all object stores
							cb(null);
					}
				}
		});
	});
}

/**
 * Clears a database of all data
 *
 * @param {IDBDatabase} idbDatabase - to delete all data from
 * @param {function(Object)} cb - callback with signature (error), where error is null on success
 */
function IDBclearDatabase(idbDatabase, cb) {
	var transaction = idbDatabase.transaction(idbDatabase.objectStoreNames, "readwrite");
	transaction.onerror = function(event) {
		cb(event);
	};
	var count = 0;
	forEach(idbDatabase.objectStoreNames, function(storeName) {
		transaction.objectStore(storeName).clear().onsuccess = function() {
			count++;
			if(count === idbDatabase.objectStoreNames.length) // cleared all object stores
				cb(null);
		};
	});
}
