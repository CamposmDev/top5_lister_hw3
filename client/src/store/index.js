import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveItem_Transaction from '../transactions/MoveItem_Transaction'
import ChangeItem_Transaction from '../transactions/ChangeItem_Transaction'

export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_ITEM_NAME_EDIT_ACTIVE: "SET_ITEM_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_EDITING: "MARK_LIST_FOR_EDITING"
    // SET_CLOSE_BUTTON_STATUS: "SET_CLOSE_BUTTON_STATUS",
    // SET_UNDO_REDO_BUTTON_STATUS: "SET_UNDO_REDO_BUTTON_STATUS",
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const COOKIE_COUNTER_NAME = 'new-list-counter'

function getCookie(name) {
    let dc = document.cookie;
    let prefix = name + "=";
    console.log('prefix=' + prefix)
    let begin = dc.indexOf("; " + prefix);
    console.log('begin=' + begin);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    } else {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        console.log('end=' + end)
        if (end == -1) {
            end = dc.length;
        }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end));
}

function getCookieNewListCounter() {
    let value = getCookie(COOKIE_COUNTER_NAME);
    if (value === null) {
        console.log('cookie-counter does not exist!')
        document.cookie = COOKIE_COUNTER_NAME + '=0;'
        return 0
    }
    console.log('cookie-counter exists!')
    console.log('cookie-counter=' + value)
    return value
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: getCookieNewListCounter(),
        isItemEditActive: false,
        listMarkedForDeletion: null,
        listMarkedForEditing: null,
        flagBtUndo: false,
        flagBtRedo: false,
        flagBtClose: false
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.SET_UNDO_REDO_BUTTON_STATUS: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: false,
                    listMarkedForEditing: null,
                    flagBtUndo: tps.hasTransactionToUndo(),
                    flagBtRedo: tps.hasTransactionToRedo(),
                    flagBtClose: store.flagBtClose
                })
            }
            case GlobalStoreActionType.SET_CLOSE_BUTTON_STATUS: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: false,
                    listMarkedForEditing: null,
                    flagBtUndo: store.flagBtUndo,
                    flagBtRedo: store.flagBtRedo,
                    flagBtClose: payload.flagBtClose
                })
            }
            case GlobalStoreActionType.MARK_LIST_FOR_EDITING: {
                console.log("list marked for editing: " + payload);
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: false,
                    listMarkedForEditing: payload
                })
            }
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                if (payload !== null) {
                    // console.log('payload=[' + payload._id + ', ' + payload.name + ']');
                }
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload
                });
            }
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.top5List,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                tps.clearAllTransactions();
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    flagBtUndo: tps.hasTransactionToUndo(),
                    flagBtRedo: tps.hasTransactionToRedo(),
                    flagBtClose: false
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    flagBtUndo: tps.hasTransactionToUndo(),
                    flagBtRedo: tps.hasTransactionToRedo(),
                    flagBtClose: payload.flagBtClose
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }
            case GlobalStoreActionType.SET_ITEM_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: true,
                    listMarkedForDeletion: null
                })
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getTop5ListById(id);
            console.log(response.data);
            if (response.data.success) {
                let top5List = response.data.top5List;
                top5List.name = newName;

                async function updateList(top5List) {
                    response = await api.updateTop5ListById(top5List._id, top5List);
                    console.log(response.data);
                    if (response.data.success) {

                        async function getListPairs(top5List) {
                            response = await api.getTop5ListPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        top5List: top5List
                                    }
                                });
                            }
                        }

                        getListPairs(top5List);
                    }
                }
                updateList(top5List);
            }
        }
        asyncChangeListName(id);
    }

    store.addChangeItemTransaction = function (index, newText) {
        let oldText = store.currentList.items[index];
        let transaction = new ChangeItem_Transaction(store, index, oldText, newText);
        tps.addTransaction(transaction);
    }

    store.changeItem = function (index, newText) {
        store.currentList.items[index] = newText;
        store.updateCurrentList();
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getTop5ListPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;

                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: {
                            currentList: top5List,
                            flagBtClose: true
                        }
                    });
                    store.history.push("/top5list/" + top5List._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.addMoveItemTransaction = function (start, end) {
        let transaction = new MoveItem_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    store.moveItem = function (start, end) {
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = store.currentList.items[start];
            for (let i = start; i < end; i++) {
                store.currentList.items[i] = store.currentList.items[i + 1];
            }
            store.currentList.items[end] = temp;
        }
        else if (start > end) {
            let temp = store.currentList.items[start];
            for (let i = start; i > end; i--) {
                store.currentList.items[i] = store.currentList.items[i - 1];
            }
            store.currentList.items[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.updateCurrentList = function () {
        async function asyncUpdateCurrentList() {
            const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: {
                        currentList: store.currentList,
                        flagBtClose: true
                    }
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.showDeleteListModal = function (idNamePair) {
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: idNamePair
        });

        let modal = document.getElementById('delete-modal');
        modal.classList.add('is-visible');
    }

    store.hideDeleteListModal = function () {
        let modal = document.getElementById('delete-modal');
        modal.classList.remove('is-visible');
    }

    store.deleteMarkedList = function () {
        let idNamePair = store.listMarkedForDeletion
        async function asyncDeleteList() {
            try {
                const response = await api.deleteTop5ListById(idNamePair._id);
                if (!response.data.success) {
                    throw new Error()
                }
            } catch (err) {
                console.log(err)
            }
        }
        asyncDeleteList().then(() => {
            console.log('Deleted: [id=' + idNamePair._id + ', name=' + idNamePair.name + ']');
            store.loadIdNamePairs()
            store.hideDeleteListModal()
        })
    }

    store.addList = function () {
        let id;
        async function asyncAddList() {
            const response = await api.createTop5List({
                name: 'Untitled' + store.newListCounter++,
                items: [
                    '?',
                    '?',
                    '?',
                    '?',
                    '?'
                ]
            });
            if (response.data.success) {
                id = response.data.top5List._id;
                store.loadIdNamePairs();
            }
        }
        asyncAddList().then(() => {
            store.setCurrentList(id);
        }).then(() => {
            document.cookie = COOKIE_COUNTER_NAME + '=' + store.newListCounter;
        })
    }

    store.handleCloseModal = function () {
        store.hideDeleteListModal();
        console.log(store.listMarkedForDeletion);
    }

    store.setIsItemNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_ITEM_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}