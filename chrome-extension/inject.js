/*
    This script is intended to be run before messages have been loaded. It's pretty fragile since it relies on
    the HTML output from Discord, so any changes there might cause this to break. The main thing that makes
    this script possible is that each chat message has a UID, starting with 'chat-messages-', that's accessible to us. Without this,
    the following would break:

    1. Hidden content that is removed from and then added to back to the infinite scroll container wouldn't retain the closed state
    2. Hidden content wouldn't be saved between application loads

    If this UID isn't accessible in the future, then the usefulness of this script will be pretty minimal without
    finding a new way to save a reference to hidden content.
*/


const styles = `
    [class*="embedProvider"] {
        display: flex;
    }
    .embedProvider {
        font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: .75rem;
        line-height: 1.375rem;
        color: var(--text-normal);
    }

    .js-btn-accordion {
        width: 16px;
        margin-left: 4px;
        background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgOCA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNCA2TDAuNTM1ODk5IDAuNzQ5OTk5TDcuNDY0MSAwLjc1TDQgNloiIGZpbGw9IiNEOUQ5RDkiLz4KPC9zdmc+Cg==");
        background-repeat: no-repeat;
        background-position: center center;
        border-radius: 4px;
        cursor: pointer;
    }
    .js-btn-accordion:hover {
        background-color: #232428;
        
    }
    .accordion-hidden .js-btn-accordion {
        background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI3IiB2aWV3Qm94PSIwIDAgNiA3IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNS41IDMuNUwwLjI1IDYuOTY0MUwwLjI1IDAuMDM1ODk4NUw1LjUgMy41WiIgZmlsbD0iI0Q5RDlEOSIvPgo8L3N2Zz4K");
    }

    [id*="message-accessories-"].accordion-hidden { 
        height: 45px;
        overflow: hidden;
        margin-bottom: 5px;
        border-radius: 0 0 4px 4px;
    }
    /*
        We use 'visibility: hidden' here to retain the content width
        after it's hidden
    */
    .accordion-hidden [class*="embedProvider"] ~ * {
        visibility: hidden;
    }

    [id*="message-content-"].accordion-hidden {
        height: 40px;
        font-size: 0;
    }

    /*
        If content is hidden, we also want to hide any reactions to it
    */
    [id*="chat-messages-"]:has(.accordion-hidden) [class*="reactions-"] {
        display: none;
    }
`;
var styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

/* 
    Idealy we would be using localStorage here, but it's not avialable with Discord for some reason.
    It's overkill, IndexedDB is available for us to fallback on.

    * hiddenAccessories stores hidden content in the 'hidden' property. It also
    saves hidden content in a local DB so they presist between application and page load
*/
const hiddenAccessories = {
    db: null,
    hidden: [],
    add(accessoryID) {
        let transaction = this.db.transaction('ids', 'readwrite');
        let hiddenAccessoriesStore = transaction.objectStore('ids');

        let request = hiddenAccessoriesStore.add({
            id: accessoryID
        });

        request.onsuccess = () => {
            this.hidden.push(request.result);
        }
    },
    remove(accessoryID) {
        let transaction = this.db.transaction('ids', 'readwrite');
        let store = transaction.objectStore('ids');
        let remove = store.delete(accessoryID);

        remove.onsuccess = () => {
            this.hidden = this.hidden.filter(item => item != accessoryID);
        }

    },
    getAllFromDB() {
        return new Promise((res, rej) => {
            let transaction = this.db.transaction('ids', 'readonly');
            let store = transaction.objectStore('ids');
            let allIDs = store.getAll();
            
            allIDs.onsuccess = () => {
                res(allIDs.result);
            }
        });
    },
    init() {
        return new Promise((res, rej) => {
            let hiddenAccessoriesDB = indexedDB.open("hiddenContent", 1);

            hiddenAccessoriesDB.onupgradeneeded = () => {
                this.db = hiddenAccessoriesDB.result;

                if (!this.db.objectStoreNames.contains('ids')) {
                    this.db.createObjectStore('ids', {keyPath: 'id'});
                }
            }

            hiddenAccessoriesDB.onsuccess = () => {
                this.db = hiddenAccessoriesDB.result;
                this.getAllFromDB().then(data => {
                    if (data.length) this.hidden = data.map(item => {
                        return item.id;
                    });

                    res(true);
                });
            }
        });
    }
};

function addAccordionListner() {
    return addEventListener('click', e => {
        // Change selector to target accordion toggle button
        if (e.target.classList.contains('js-btn-accordion')) {
            const accessoryElem = e.target.closest('[id*="message-content-"]') || e.target.closest('[id*="message-accessories"]');
    
            if (hiddenAccessories.hidden.includes(accessoryElem.id)) {
                hiddenAccessories.remove(accessoryElem.id);
                accessoryElem.classList.remove('accordion-hidden');
            } else {
                hiddenAccessories.add(accessoryElem.id);
                accessoryElem.classList.add('accordion-hidden');
            }
        }
    });
};

function getHidableContentFromMutationList(mutationList) {
    let hidableContent = [];

    /*
        - There are three ways that a chats can be shown
            1. On page load
                - A bunch of chats are added at once
            2. Scrolling
                - Individual chat-messages are added
            3. Changing chat windows
                -  A bunch of chats are added at once
    */
    for (const mutation of mutationList) {
        if (mutation.type != 'childList') continue;
        if (!mutation.addedNodes) continue;

        let chatMessages = [];
        Array.from(mutation.addedNodes).forEach(node => {
            // Single chat added. This happens when scrolling.
            if (typeof node.id == 'string' && node.id.startsWith('chat-message')) {
                chatMessages.push(node);
            } else {
                if (typeof node.className == 'string') {
                    let classes = node.className.split(' ');

                    // Bulk chat added. This happens when switching between chat windows, from direct messages to chat windows, or first page load.
                    if (classes.some(c => {
                        return /chatContent-.*/.test(c) || /chat-.*/.test(c);
                    } )) {
                        chatMessages = Array.from(node.querySelectorAll('[id*="chat-messages"]'));
                    } else 
                    
                    /* 
                        Chat accessories are being added to the page asynchronously.
                        This sometimes happens after a messages with a url is sent.
                    */
                    if (classes.some(c => {
                        return /embedWrapper-.*/.test(c);
                    } )) {
                        let parentElem = node.closest('[id*="chat-messages"]');
                        chatMessages.push(parentElem);
                    }
                }
            }
        });

        /*
            Things that need to be able to be hidden are in the '#message-accessories-' container.
            There is a case where that's not true (hopefully the only one).
                * Emojis are put into an '.emojiContainer-'. If a message consists of only
                emojis (no text), then those emojis are set to have a larger than usual size which can
                be distracting, especially when animated.
                    * '.emojiContainer-' is always inside of the '#message-content-' container which is also where the text for the message is.
                    * Unfortunately the text is usually unwrapped, except when using markup (bold, italics, etc)
                    * If someone edits a message a '.timestamp-' with a 'edited-' element will be inside '#message-content-'. If there is no other text, the 
                    emoji will still be large despite the 'edited' text


            * If there is an '.emojiContainer-', we need to make sure that there are only '.emojiContainer-', '.timestamp-', 
            and empty text nodes in the root of '#message-content-'
                * node.childNodes
                    * Look for nodes that aren't '.emojiContainer-', '.timestamp-', and empty text nodes
                    * Look for text nodes
                        * Check and see if text nodes are empty
                            * If empty, we should be able to hide this content
                            * If not empty, we shouldn't be able to hide

        */

        chatMessages.forEach(chat => {
            const accessory = document.querySelector(`#${chat.id} [id*="message-accessories-"]`);
            const emojiContainer = document.querySelector(`#${chat.id} [class*="emojiContainer-"]`);

            if (emojiContainer) {
                const messageContent = document.querySelector(`#${chat.id} [id*="message-content-"]`);
                let hidden = true;
                
                // If there are emojis, check to see if they're big or small
                if(Array.from(messageContent.childNodes).some(node => {
                    // If it's an element node
                    if (node.nodeType == 1) {
                        if (node.className.split(' ').some(c => {
                            return !/emojiContainer-.*/.test(c) && !/timestamp-.*/.test(c);
                        } )) {
                            hidden = false;
                        }
                        // If it's a text node
                    } else if (node.nodeType == 3) {
                        if (node.textContent.trim() != '') {
                            hidden = false;
                        }
                    }
                }));

                if (hidden) {
                    if (!hidableContent.includes(messageContent.id)) hidableContent.push(messageContent.id);
                }
            }
            
            // If there are things inside of '#message-accessories-', then we'll probably want to be able to hide them
            if (accessory && accessory.innerHTML != '') {

                // If the accessory isn't only reactions.
                if (! /reactions-.*/.test(accessory.children[0].id)) {
                    if (!hidableContent.includes(accessory.id)) hidableContent.push(accessory.id);
                }
            }
        });
    }

    return hidableContent;
}

function addAccordions(hidableContent) {
    hidableContent.forEach(accessory => {
        
        // If accordion previously closed
        if (hiddenAccessories.hidden.includes(accessory)) {
            document.querySelector(`#${accessory}`).classList.add('accordion-hidden');
        }

        let accessoryElem = document.querySelector(`#${accessory}`);
        let embedProvider = document.querySelector(`#${accessory} [class*="embedProvider-"]`);

        /*
            * embedProvider is auto populated from links where Discord is able to
            identify some kind of source
            * If there is no embedProvider, we'll make our own with a string of 'Attachments'
                * In the future, maybe add support with more descriptive names:
                    * GIF
                    * Image
                    * URL
        */
        if (embedProvider) {
            const accordionArrow = document.createElement('div');
            accordionArrow.classList.add('js-btn-accordion');
            embedProvider.append(accordionArrow);
        } else {
            const embedProviderElem = document.createElement('div');
            embedProviderElem.classList.add('embedProvider');
            embedProviderElem.innerHTML = 'Acessories<div class="js-btn-accordion"></div>';

            accessoryElem.prepend(embedProviderElem);
        }
    });
}

hiddenAccessories.init().then(() => {
    const accordionListener = addAccordionListner();

    const appObserver = new MutationObserver(mutationList => {
        addAccordions(getHidableContentFromMutationList(mutationList));
    });

    appObserver.observe(document.querySelector('body'),  {
        attributes: false,
        childList: true,
        subtree: true
    });
});