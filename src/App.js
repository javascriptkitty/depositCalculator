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
  InputAdornment,
  Button,
} from "@material-ui/core";
import data from "./depcalc.json";
import numberFormat, { createPDF } from "./utils";
import "./App.scss";
import NumberFormat from "react-number-format";
import PrintIcon from "@material-ui/icons/Print";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";

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
    perc: "",
    income: "",
  });

  const handleSelectChange = (event) => {
    setSelected(event.target.value);
  };

  const handleInputChange = (name, event) => {
    const value =
      name === "summ"
        ? event.target.value.replace(/,/g, "")
        : event.target.value;
    const newValue = { ...userInput };
    newValue[name] = parseInt(value);
    setUserInput(newValue);
  };

  const calculateOutput = () => {
    if (!userInput.summ && !userInput.term) {
      toast.error("введите данные для расчета!");
      return;
    }
    if (userInput.summ < minSumm) {
      toast.error(sumLabel);
      return;
    }
    if (userInput.term < minTerm) {
      toast.error(termLabel);
      return;
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
    for (let i = 0; i < summsAndRate.length; i++) {
      debugger;
      if (
        userInput.summ >= summsAndRate[i].summ_from &&
        userInput.summ <
          (summsAndRate[i + 1] ? summsAndRate[i + 1].summ_from : Infinity)
      ) {
        rate = summsAndRate[i].rate;
      }
    }

    const income = (
      (userInput.summ * userInput.term * rate) /
      (365 * 100)
    ).toFixed(2);
    // setUserInput(emptyUserInput);
    setUserOutput({ perc: rate, income: income });
  };

  const openPDF = () => {
    createPDF(selected, userInput, userOutput);
  };
  const minSumm = selected.param[0].summs_and_rate[0].summ_from;
  const sumLabel = `минимальная сумма ${numberFormat(minSumm)} рублей`;

  const minTerm = selected.param[0].period_from.toString();

  const termLabel = `минимальный срок ${minTerm}${
    minTerm.slice(-1) === "1"
      ? " день"
      : minTerm.slice(-1) === ("2" || "3" || "4")
      ? " дня"
      : " дней"
  } `;

  return (
    <Container maxWidth="md">
      <h2>Депозитный калькулятор</h2>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
      />
      <Card>
        <CardContent>
          {renderSelect(deposits, handleSelectChange, selected)}
          <NumberFormat
            customInput={TextField}
            min={0}
            label="сумма"
            thousandSeparator={true}
            decimalSeparator={false}
            allowNegative={false}
            value={userInput.summ}
            helperText={sumLabel}
            InputProps={{
              endAdornment: <InputAdornment position="end">₽</InputAdornment>,
              min: 0,
            }}
            onChange={handleInputChange.bind(null, "summ")}
          />

          <NumberFormat
            customInput={TextField}
            decimalSeparator={false}
            allowNegative={false}
            label="срок вклада в днях"
            value={userInput.term}
            onChange={handleInputChange.bind(null, "term")}
            helperText={termLabel}
          />
          <Button variant="contained" color="primary" onClick={calculateOutput}>
            рассчитать
          </Button>
          {!(userOutput.perc === "") & !(userOutput.income === "") ? (
            <div className="userOutput">
              <div className="output_perc">
                <span> процентная ставка:</span>
                <TextField value={userOutput.perc} /> % годовых
              </div>
              <div className="output_income">
                <span> доход:</span>
                <TextField value={numberFormat(userOutput.income)} />
                руб
              </div>

              <Button
                variant="contained"
                color="default"
                startIcon={<PrintIcon />}
                onClick={openPDF}
              >
                на печать
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
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
