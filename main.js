console.log(window.Redux)

const { createStore, applyMiddleware } = window.Redux
// SETUP REDUX STORE
// 1. State
// 2. Reducer
// 3. Store
// const initialState = [
//     'Listen to music',
//     'Reading the book',
//     'To the walking',
//     'To the swimming',
//     'Climing the mountain'
// ];

const initialState = JSON.parse(localStorage.getItem('hobby_list')) || []

const hobbyReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_HOBBY': {
            const newList = [...state];
            newList.push(action.payload)

            return newList
        }
        default:
            return state
    }
}

// Middlewares
const logger = store => next => action => {
    console.log(action.type);
    next(action)
}

// const appllyName = store => next => action => {
//     if (action.type === 'ADD_HOBBY') {
//         store.dispatch({ type: 'ADD_HOBBY', newList: action.payload})
//     }
//     next(action)
// }

const store = createStore(hobbyReducer, applyMiddleware(logger, appllyName));

// ---------------------

// RENDER REDUX HOBBY LIST

const renderHobbyList = (hobbyList) => {
    // if hobbyList khong la mang or length = 0 thi khong lam gie
    if (!Array.isArray(hobbyList) || hobbyList.length === 0) return;

    const ulElement = document.querySelector('#hobbies')
    if (!ulElement) return;

    // reset previous content of ul
    ulElement.innerHTML = '';
    
    for (const hobby of hobbyList) {
        const liElement = document.createElement('li');
        liElement.textContent = hobby;

        ulElement.appendChild(liElement);

    }
}

// RENDER INITIAL HOBBYLIST

const initialHobbyList = store.getState()
console.log(initialHobbyList)
renderHobbyList(initialHobbyList)

// HANDLE FORM SUBMIT 

const hobbyFormElement = document.getElementById('hobbyFormId')

if (hobbyFormElement) {
    const handleFormSubmit = (e) => {
        e.preventDefault()

        //console.log('SUBMIT')

        const hobbyTextElement = document.querySelector('#hobbyTextId')

        if (!hobbyTextElement) return
        //console.log('SUBMIT', hobbyTextElement.value)
        const action = {
            type: 'ADD_HOBBY',
            payload: hobbyTextElement.value
        }
        store.dispatch(action)

        // reset form
        hobbyFormElement.reset();
    }   

    hobbyFormElement.addEventListener('submit', handleFormSubmit)
}

store.subscribe(() => {
    console.log('STATE UPDATE: ', store.getState());
    const newHobbyList = store.getState()
    renderHobbyList(newHobbyList)

    localStorage.setItem('hobby_list', JSON.stringify(newHobbyList));
})
