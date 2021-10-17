import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
    @author Camposm97
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

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

    let btUndo, btRedo, btClose;

    store.flagBtUndo ?
        btUndo = <div disabled={editStatus}
            id='undo-button'
            onClick={handleUndo}
            className={classUndo}>&#x21B6;</div> :
        btUndo = <div disabled={editStatus}
            id='undo-button'
            className={classUndo}>&#x21B6;</div>

    store.flagBtRedo ?
        btRedo = <div disabled={editStatus}
            id='redo-button'
            onClick={handleRedo}
            className={classRedo}>&#x21B7;</div> :
        btRedo = <div disabled={editStatus}
            id='redo-button'
            className={classRedo}>&#x21B7;</div>;

    store.flagBtClose ?
        btClose = <div disabled={editStatus}
            id='close-button'
            onClick={handleClose}
            className={classClose}>&#x24E7;</div> :
        btClose = <div disabled={editStatus}
            id='close-button'
            className={classClose}>
            &#x24E7;</div>

    return (
        <div id="edit-toolbar">
            {btUndo}
            {btRedo}
            {btClose}
        </div>
    )
}

export default EditToolbar;