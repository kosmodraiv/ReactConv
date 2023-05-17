import React, { useEffect, useRef, useState } from 'react';
import { Block } from './Block';
import './index.scss';

function App() {
  const [fromCurrency, setFromCurrency] = useState('UAH')
  const [toCurrency, setToCurrency] = useState('USD')
  const [fromPrice, setFromPrice] = useState(0)
  const [toPrice, setToPrice] = useState(1)

  // const [rates, setRates] = useState({});

  const ratesRef = useRef({});


  useEffect(() => {
    fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
    .then(res => res.json())
    .then(json => {
      const filteredRates = json.map(({ rate, cc }) => ({ currency: cc, rate: rate }));
      const formattedRates = filteredRates.reduce((acc, { currency, rate }) => {
        acc[currency] = rate;
        return acc;
      }, {});

      const uahRate = 1;
      formattedRates['UAH'] = uahRate
    
      ratesRef.current = formattedRates;
      
      onChangeToPrice(1);
    }).catch(err => {
      console.warn(err);
      alert('Не удалось получить информацию')
    })
  }, [])

  const onChangeFromPrice = (value) => {
    const price = value * ratesRef.current[fromCurrency];
    const result = price / ratesRef.current[toCurrency]
    setFromPrice(value)
    setToPrice(result)
  }
  const onChangeToPrice = (value) => {
    const price = value / ratesRef.current[fromCurrency];
    const result = price * ratesRef.current[toCurrency]
    setFromPrice(result)
    setToPrice(value)
  }

  useEffect(() => {
    onChangeFromPrice(fromPrice)
  }, [fromCurrency])

  useEffect(() => {
    onChangeToPrice(toPrice)
  }, [toCurrency])

  return (
    <div className="App">
      <Block value={fromPrice} currency={fromCurrency} onChangeCurrency={setFromCurrency} onChangeValue={onChangeFromPrice} />
      <Block value={toPrice} currency={toCurrency} onChangeCurrency={setToCurrency} onChangeValue={onChangeToPrice} />
    </div>
  );
}

export default App;
