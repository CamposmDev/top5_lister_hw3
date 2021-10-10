import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    // let enabledButtonClass = "top5-button";

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    let editStatus = false;

    if (store.isListNameEditActive) {
        editStatus = true;
    }

    let classUndo, classRedo, classClose;

    store.flagBtUndo ? classUndo = 'top5-button' : classUndo = 'top5-button-disabled';
    store.flagBtRedo ? classRedo = 'top5-button' : classRedo = 'top5-button-disabled';
    store.flagBtClose ? classClose = 'top5-button' : classClose = 'top5-button-disabled';

    return (
        <div id="edit-toolbar">
            <div
                disabled={editStatus}
                id='undo-button'
                onClick={handleUndo}
                className={classUndo}>
                &#x21B6;
            </div>
            <div
                disabled={editStatus}
                id='redo-button'
                onClick={handleRedo}
                className={classRedo}>
                &#x21B7;
            </div>
            <div
                disabled={editStatus}
                id='close-button'
                onClick={handleClose}
                className={classClose}>
                &#x24E7;
            </div>
        </div>
    )
}

export default EditToolbar;