import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [draggedTo, setDraggedTo] = useState(0);

    function handleDragStart(event) {
        event.dataTransfer.setData("item", event.target.id);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("item");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveItemTransaction(sourceId, targetId);
    }

    function handleToggleEdit(event) {
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsItemNameEditActive();
        }
        setEditActive(newActive);
    }

    function handleKeyPress(event) {
        if (event.code === 'Enter') {
            let id = props.index;
            let text = event.target.value;
            if (text.length > 0) {
                console.log('id=' + id + ', text=' + text);
                store.addChangeItemTransaction(id, text);
            } else {
                store.addChangeItemTransaction(id, '?');
            }
            toggleEdit();
        }
    }

    let cardStatus = false;
    if (store.isItemEditActive) {
        cardStatus = true;
    }
    let { index, text } = props;
    let itemClass = "top5-item";
    if (draggedTo) {
        itemClass = "top5-item-dragged-to";
    }

    console.log('index=' + index + ', name=' + text + ', editActive=' + editActive + ', store.isItemEditActive=' + store.isItemEditActive)

    // Define if itemCard should have controls or not based on store.isItemEditActive
    let itemCard = store.isItemEditActive ?
        <div id={'item-' + (index + 1)}
            className={itemClass}>
            <input
                disabled={cardStatus}
                type="button"
                id={"edit-item-" + index + 1}
                className="list-card-button"
                onClick={handleToggleEdit}
                value={"\u270E"} />
            {text}</div> :
        <div id={'item-' + (index + 1)}
            className={itemClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true">
            <input
                disabled={cardStatus}
                type="button"
                id={"edit-item-" + index + 1}
                className="list-card-button"
                onClick={handleToggleEdit}
                value={"\u270E"} />
            {text}</div>;

    if (editActive) {
        itemCard = <input
            className='top5-item-edit'
            type='text'
            onKeyPress={handleKeyPress}
            defaultValue={text} />
    }
    return itemCard;
}

export default Top5Item;