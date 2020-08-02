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
  InputAdornment,
  Button,
} from "@material-ui/core";
import data from "./depcalc.json";
import numberFormat from "./utils";
import "./App.scss";
import NumberFormat from "react-number-format";

const formatDeposit = (dep) => {
  dep.param.sort((a, b) => a.period_from - b.period_from);
  dep.param.forEach((el) => {
    el.summs_and_rate.sort((a, b) => a.summ_from - b.summ_from);
  });
  return dep;
};

const emptyUserInput = { summ: "", term: "" };
function App() {
  const deposits = data.deposits;

  const [selected, setSelected] = React.useState(formatDeposit(deposits[0]));
  const [userInput, setUserInput] = React.useState(emptyUserInput);
  const [userOutput, setUserOutput] = React.useState({
    perc: "",
    income: "",
  });

  const handleSelectChange = (event) => {
    setSelected(event.target.value);
  };

  const handleInputChange = (name, event) => {
    //debugger;
    const value =
      name === "summ"
        ? event.target.value.replace(/,/g, "")
        : event.target.value;
    const newValue = { ...userInput };
    newValue[name] = parseInt(value);
    setUserInput(newValue);
  };

  const calculateOutput = () => {
    let ifError = false;
    if (userInput.summ !== " " && userInput.term !== " ") {
      ifError = true;
      // return;
    }

    let summsAndRate;
    for (let i = 0; i < selected.param.length; i++) {
      const el = selected.param;

      const interval = [
        el[i].period_from,
        el[i + 1] ? el[i + 1].period_from : Infinity,
      ];

      if (userInput.term >= interval[0] && userInput.term < interval[1]) {
        summsAndRate = selected.param[i].summs_and_rate;
      }
    }
    let rate;
    for (let i = 0; i < summsAndRate.length - 1; i++) {
      if (
        summsAndRate[i].summ_from <= userInput.summ &&
        summsAndRate[i + 1].summ_from > userInput.summ
      ) {
        rate = summsAndRate[i].rate;
      }
    }

    const income = (userInput.summ * userInput.term * rate) / (365 * 100);
    setUserInput(emptyUserInput);
    setUserOutput({ perc: rate, income: income });
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
      : " дней"
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
              // error={}
              label="сумма"
              thousandSeparator={true}
              value={userInput.summ}
              helperText={sumLabel}
              InputProps={{
                endAdornment: <InputAdornment position="end">₽</InputAdornment>,
              }}
              onChange={handleInputChange.bind(null, "summ")}
            />

            <TextField
              type="number"
              label="срок вклада в днях"
              value={userInput.term}
              onChange={handleInputChange.bind(null, "term")}
              helperText={termLabel}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={calculateOutput}
            >
              рассчитать
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="userOutput">
            <div>
              <span> процентная ставка:</span>
              <TextField value={userOutput.perc} />
            </div>
            <div>
              <span> доход:</span>
              <TextField value={userOutput.income} />
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
      <Select value={selected} onChange={handleChange}>
        {data.map((el) => {
          return (
            <MenuItem value={el} key={el.code}>
              {el.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
