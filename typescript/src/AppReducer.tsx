type Actions = {
    readonly type: 'FETCH_INIT' | 'SET_SEARCH' | 'SET_CHECKED' | 'RESET' | 'SET_CARTVAL';
    payload?: any
}
type ListItem = {
    id: string;
    name: string;
    priceUsd: number;
}
type State = {
    bitcoinsList: ListItem[];
    searchVal: string;
    cartVal: number;
    checkedItems: string[]
}

const AppReducer = (state: State, action: Actions): State => {
    switch (action.type) {
        case 'FETCH_INIT':
            return { ...state, bitcoinsList: action.payload }
        case 'RESET':
            return { ...state, searchVal: '', checkedItems: [], cartVal: 0 }
        case 'SET_CHECKED':
            return { ...state, checkedItems: action.payload }
        case 'SET_SEARCH':
            return { ...state, searchVal: action.payload }
        case 'SET_CARTVAL':
            return { ...state, cartVal: action.payload }
        default:
            neverReached(action.type)
    }

    return state;
}
const neverReached = (never: never) => { };

export default AppReducer;