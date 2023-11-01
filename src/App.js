import { useEffect, useState } from "react";
import "./App.css";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

function App() {
  const [bitcoinsList, setBitcoinsList] = useState([]);
  const [searchVal, setSearchVal] = useState("");

  const [sum, setCartVal] = useState(0);
  const [checked, setChecked] = useState([]);
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
  
    return bitcoinsList.filter((item) => {
      return item["name"].toLowerCase().startsWith(rank);
    });
  }

 
  function showCart() {
    console.log("cart items", checked);
    const cartVal= checked.reduce((item,val, cum)=> (
     cum= cum+ bitcoinsList.find((x)=>x['id'] === val)['priceUsd']
  )
    ,0.0);
    setCartVal(Math.floor(cartVal));
  }


  function resetCart() {
    setCartVal(0);
  
    setSearchVal("");
    setChecked([]);
  }
 

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  
  };
  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>  
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ESTIMATE ASSET VALUE
          </Typography>
        </Toolbar>
      </AppBar>
      <Button variant="outlined" onClick={resetCart} sx={{m:4}}>Reset</Button>
    
     
      <TextField id="standard-basic" onChange={searchString} sx={{m:2}} value={searchVal} label="Search asset by name" variant="standard" />
      <Button variant="contained" onClick={showCart} sx={{m:4}}>Add to Cart</Button>
      <span>Cart Value:</span><Button  variant="contained" color="success" size="medium" sx={{m:4}}>{sum}</Button>
    
      
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {filterBitcoins(searchVal).map((item) => {
        return (
          <ListItem
            key={item.id}
            disablePadding
          >
            <ListItemButton role={undefined} onClick={handleToggle(item.id)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(item.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': item.id }}
                />
              </ListItemIcon>
              <ListItemText id={item.id} primary={item.name} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
      </Box>
    </div>
  );
}

export default App;
