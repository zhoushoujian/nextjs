//actionType
const TEXT = 'text';

// initialSate
const initialState = () => ({
  text: '',
});

type IAction = {
  type: string;
  data: any;
};

// Reducer
export default function reducer(state = initialState(), action: IAction) {
  switch (action.type) {
    case TEXT:
      return Object.assign({}, state, {
        text: action.data,
      });
    default:
      return state;
  }
}

// update
export const updateText = data => ({
  type: TEXT,
  data,
});
