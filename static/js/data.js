"use strict";
/*
Project: HSR CAS FEE 2017, Project 01 - notes application.
Content: Data access helper for the notes application.
Created on: 12.10.2017
Author: Saidul Hofmann
*/

/**
 * Helper class for persisting and retrieving data from local storage.
 */
class StorageHelper {
    constructor(){
    }

    loadDataFromStorage(strStorageName){
        try {
            this.validateStorrageName(strStorageName);

            if (localStorage.getItem("strStorageName")) {
                return JSON.parse(localStorage.getItem("strStorageName"));
            } else {
                localStorage.setItem("strStorageName", JSON.stringify([]));
                return [];
            }
        }
        catch (error){
            console.log(error.message);
        }
    }

    /**
     * Creates a json string of the input object.
     * @param strStorageName = name of the storage as key for identifying the storage.
     * @param storage = storage with data (object, array, values,..) to persist.
     */
    saveDataInStorage(strStorageName, storage) {
        try {
            this.validateStorrageName(strStorageName);
            this.validateStorage(storage);
            localStorage.setItem("strStorageName", JSON.stringify(storage));
        }
        catch (error){
            console.log(error.message);
        }
    }

    validateStorrageName(strStorageName){
        if(typeof strStorageName !== "string") {
            throw `Die Bezeichnung des Speichermediums '${strStorageName.toString()}' ist nicht vom Datentyp Strig.`;
        }
        if (!strStorageName) {
            throw `Die Bezeichnung des Speichermediums '${strStorageName.toString()}' ist ungültig.`;
        }
        return true;
    }

    validateStorage(storage){
        if(typeof storage === "function" ){
            throw `Es wurde eine Funktion als zu speicherndes Objekt übergeben '${storage.toString()}'.`;
            return true;
        }
    }
}

/**
 * Exposed external interfaces.
 */
export default { StorageHelper };
