import React, { useState, useEffect, InputHTMLAttributes, useReducer } from 'react';
import './App.css';
import AppReducer from './AppReducer';

/*type ListItem = {
  id: string;
  name: string;
  priceUsd: number;
}

type Props={

}*/


const App = () => {

  // const [bitcoinsList, setBitcoinsList] = useState<ListItem[] | []>([]);
  const [error, setError] = useState<string | ''>('');
  //const [searchVal, setSearchVal] = useState<string | ''>('');
  //const [sum, setCartVal] = useState<number | 0>(0);
  //const [checked, setChecked] = useState<string[] | []>([]);
  const [state, dispatch] = useReducer(AppReducer, { bitcoinsList: [], cartVal: 0, searchVal: '', checkedItems: [] });
  const { bitcoinsList, searchVal, cartVal, checkedItems } = state;
  useEffect(() => {
    const fetchData = async () => {
      setError('');
      // setBitcoinsList([]);
      try {
        const response = await fetch("https://api.coincap.io/v2/assets");
        if (!response.ok) {
          throw new Error('Something went wrong');
        }
        const result = await response.json();
        const resultArr: any[] = [];
        result["data"].forEach((element: any) => {
          const { id, name, priceUsd } = element;
          resultArr.push({ id: id, name: name, priceUsd: priceUsd });
        });
        dispatch({ type: 'FETCH_INIT', payload: resultArr });
        //setBitcoinsList(resultArr);
      } catch (err: any) {
        setError('Unable to fetch data');
      }
    }
    fetchData();
  }, [])


  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {

    const currentIndex = checkedItems.toString().indexOf(value);
    const newChecked: string[] = [...checkedItems];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    dispatch({ type: 'SET_CHECKED', payload: newChecked });
  }

  const showCart = () => {
    let cum: number = 0;
    checkedItems.forEach(element => {
      const price = bitcoinsList.find((x) => x['id'] === element)?.priceUsd || 0;
      console.log('price......', price);
      cum = cum + Math.floor(price)
    });
    dispatch({ type: 'SET_CARTVAL', payload: cum });
    // setCartVal(Math.floor(cum));
  }

  const filterBitcoinsList = () => {
    return bitcoinsList.filter((item) => {
      return item["name"].toLowerCase().startsWith(searchVal);
    });
  }

  const resetCart = () => {
    dispatch({ type: 'RESET' });
  }

  const searchString = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch({ type: 'SET_SEARCH', payload: e.target.value });
  }
  return (

    <div className="App">
      <span>{error}</span>
      <button onClick={resetCart} >Reset</button>
      <button onClick={showCart} >Add to Cart</button>
      <span>Cart Value:{cartVal}</span>
      <input type='text' onChange={searchString} value={searchVal} />
      <ul>

        {filterBitcoinsList().map((item) => {
          const { name, id } = item;
          return (
            <li key={id}><input type="checkbox" checked={checkedItems.indexOf(id) !== -1} onChange={(e) => handleToggle(e, id)} />{name}</li>
          )
        })}
      </ul>
    </div>
  );
}

export default App;
