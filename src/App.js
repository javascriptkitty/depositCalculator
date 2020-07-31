import React from "react";
import {
  Container,
  Card,
  CardContent,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Paper,
} from "@material-ui/core";
import data from "./depcalc.json";
import "./App.scss";

function App() {
  const [selected, setSelected] = React.useState("");
  const deposits = data.deposits;
  const handleSelectChange = (event) => {
    setSelected(event.target.value);
  };

  return (
    <Container>
      <h2>Депозитный калькулятор</h2>
      <Paper>
        <Card>
          <CardContent className="userInput">
            {renderSelect(deposits, handleSelectChange, selected)}
            <TextField required label="сумма" />
            <TextField required label="срок вклада" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="userOutput">
            процентная ставка:
            <br />
            доход:
          </CardContent>
        </Card>
      </Paper>
    </Container>
  );
}

export default App;

function renderSelect(data, handleChange, selected) {
  return (
    <FormControl required>
      <InputLabel>тип вклада</InputLabel>
      <Select value={selected} onChange={handleChange}>
        {data.map((el) => {
          return (
            <MenuItem value={el.code} key={el.code}>
              {el.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
