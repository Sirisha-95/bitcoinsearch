import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [bitcoinsList, setBitcoinsList] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [sum, setCartVal] = useState(0);
  useEffect(() => {
    fetch("https://api.coincap.io/v2/assets")
      .then((response) => response.json())
      .then((result) => {
        setBitcoinsList(result.data);
      });
  }, []);

  function searchString(e) {
    e.preventDefault();
    console.log("search string", e.target.value);
    setSearchVal(e.target.value);
  }

  function filterBitcoins(rank) {
    console.log("called");
    return bitcoinsList.filter((item) => {
      return item["name"].toLowerCase().startsWith(rank);
    });
  }

  function saveToCart(e, asset) {
    e.preventDefault();
    const exists = searchIfExists(asset);

    if (exists) {
      setSelectedAssets(
        selectedAssets.map((item) => {
          if (item.rank === asset.rank) {
            // Create a *new* object with changes
            return { ...item, selected: e.target.checked };
          } else {
            // No changes
            return item;
          }
        })
      );
    } else {
      setSelectedAssets([
        ...selectedAssets,
        {
          rank: asset.rank,
          selected: e.target.checked,
          usd: asset.priceUsd,
        },
      ]);
    }
  }

  function showCart() {
    console.log("cart items", selectedAssets);
    const resultsum = selectedAssets
      .filter((x) => x.selected === true)
      .reduce((cum, item) => (cum += cum + parseFloat(item.usd)), 0.0);
    setCartVal(Math.floor(resultsum));
  }

  function searchIfExists(asset) {
    const found =
      selectedAssets.filter((x) => x.rank === asset.rank).length > 0
        ? true
        : false;
    return found;
  }

  function resetCart() {
    setCartVal(0);
    setSelectedAssets([]);
    setSearchVal("");
  }
  return (
    <div className="App">
      <button onClick={resetCart}>Reset</button>
      PURCHASE BITCOINS
      <input
        type="text"
        placeholder="type to search"
        onChange={searchString}
        value={searchVal}
      ></input>
      <button onClick={showCart}>Add</button> <span>Cart Value:{sum}</span>
      <ul>
        {filterBitcoins(searchVal).map((item) => {
          return (
            <li>
              <input
                type="checkbox"
                onChange={(e) => saveToCart(e, item)}
              ></input>
              {item.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
