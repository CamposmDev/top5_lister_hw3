import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ListCard from './ListCard.js'
import { GlobalStoreContext } from '../store'
import DeleteModal from './DeleteModal'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
    @author Michael Campos
*/
const ListSelector = () => {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    useEffect(() => {
        store.loadIdNamePairs();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function addListHandler() {
        store.addList();
    }

    store.idNamePairs.map((pair) => {
        console.log('id=' + pair._id + ', name=' + pair.name);
    });
    console.log('============================================================================')

    let btAddList = store.isListNameEditActive ?
        <input type="button"
            disabled={true}
            id="add-list-button"
            className="top5-button-disabled"
            value="+" /> :
        <input type="button"
            id="add-list-button"
            className="top5-button"
            onClick={addListHandler}
            value="+" />

    let listCard = "";
    if (store) {
        listCard = store.idNamePairs.map((pair) => (
            <ListCard
                key={pair._id}
                idNamePair={pair}
                selected={false}
            />
        ))
    }
    return (
        <div id="top5-list-selector">
            <div id="list-selector-heading">
                {btAddList}
                Your Lists
            </div>
            <div id="list-selector-list">
                {listCard}
                <DeleteModal />
            </div>
        </div>)
}

export default ListSelector;