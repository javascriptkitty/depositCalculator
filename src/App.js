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
import numberFormat from "./utils";
import "./App.scss";
import NumberFormat from "react-number-format";
import { light } from "@material-ui/core/styles/createPalette";

const formatDeposit = (dep) => {
  dep.param.sort((a, b) => a.period_from - b.period_from);
  dep.param.forEach((el) => {
    el.summs_and_rate.sort((a, b) => a.summ_from - b.summ_from);
  });
  return dep;
};

function App() {
  const deposits = data.deposits;

  const [selected, setSelected] = React.useState(formatDeposit(deposits[0]));
  const [userInput, setUserInput] = React.useState({ summ: "", term: "" });
  const [userOutput, setUserOutput] = React.useState({
    perc: null,
    income: null,
  });

  const handleSelectChange = (event) => {
    setSelected(event.target.value);
  };

  const handleInputChange = (name, event) => {
    const value = event.target.value.replace(/,/g, "");
    const newValue = { ...userOutput };
    newValue[name] = event.target.value;
    setUserInput(newValue);
  };

  const sumLabel = `минимальная сумма ${numberFormat(
    selected.param[0].summs_and_rate[0].summ_from
  )} рублей`;

  const minTerm = selected.param[0].period_from.toString();

  const termLabel = `минимальный срок ${minTerm}${
    minTerm.slice(-1) === "1"
      ? " день"
      : minTerm.slice(-1) === ("2" || "3" || "4")
      ? " дня"
      : "дней"
  } `;
  return (
    <Container>
      <h2>Депозитный калькулятор</h2>
      <Paper>
        <Card>
          <CardContent className="userInput">
            {renderSelect(deposits, handleSelectChange, selected)}
            <NumberFormat
              customInput={TextField}
              label="сумма"
              thousandSeparator={true}
              value={userInput.summ}
              helperText={sumLabel}
              onChange={handleInputChange.bind(null, "summ")}
            />

            <TextField
              required
              type="number"
              label="срок вклада"
              value={userInput.term}
              onChange={handleInputChange.bind(null, "term")}
              helperText={termLabel}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="userOutput">
            <div>
              <span> процентная ставка:</span>{" "}
              <TextField value={userOutput.summ} />
            </div>
            <div>
              <span> доход:</span>
              <TextField value={userOutput.summ} />
            </div>
          </CardContent>
        </Card>
      </Paper>
    </Container>
  );
}

export default App;

function renderSelect(data, handleChange, selected) {
  return (
    <FormControl>
      <InputLabel>тип вклада</InputLabel>
      <Select value={selected.code} onChange={handleChange}>
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
