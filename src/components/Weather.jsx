// Importe as dependências e módulos necessários
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Weather.module.css';
import termometro from '../assets/termometro.svg';
import umidade from '../assets/umidade.svg';
import vento from '../assets/vento.svg';

export function Weather() {
  // Estado e variáveis de estado
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [searchedCity, setSearchedCity] = useState('São Paulo');
  const apiKey = '24c89ce92b1d4485b4f941833d481f16';

  // Função para obter a previsão do tempo
  const getWeatherForecast = async () => {
    try {
      const response = await axios.get(
        `https://api.weatherbit.io/v2.0/forecast/daily?city=${searchedCity}&key=${apiKey}`
      );

      setWeatherData(response.data.data.slice(1, 4));
    } catch (error) {
      console.error('Erro ao obter dados da previsão do tempo:', error);

      if (error.response && error.response.status === 404) {
        alert('Cidade não encontrada. Verifique o nome da cidade.');
      } else {
        alert('Erro ao obter dados da previsão do tempo. Por favor, tente novamente.');
      }
    }
  };

  // Efeito para buscar a previsão do tempo quando a cidade é alterada
  useEffect(() => {
    getWeatherForecast();
  }, [searchedCity]);

  // Manipuladores de eventos
  const handleCityInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleGetWeatherClick = () => {
    const formattedCity = city.trim();

    if (formattedCity === '') {
      alert('Por favor, insira o nome da cidade.');
      return;
    }

    const capitalizedCity =
      formattedCity.charAt(0).toUpperCase() + formattedCity.slice(1).toLowerCase();
    setSearchedCity(capitalizedCity);
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGetWeatherClick();
    }
  };

  // JSX principal
  return (
    <div className={styles.box}>
      <input
        className={styles.input}
        type="text"
        placeholder="Ex: São Paulo"
        value={city}
        onChange={handleCityInputChange}
        onKeyDown={handleEnterKeyPress}
      />
      <button onClick={handleGetWeatherClick}>Search</button>

      {weatherData && (
        <div>
          <h2 className={styles.city}>{searchedCity}</h2>
          <div className={styles.weatherInfoOne} key={weatherData[0].valid_date}>
            <div className={styles.weatherDetails}>
              <p>
                <img src={termometro} alt="thermometer" />
                {weatherData[0].min_temp.toFixed(1)}°C | {weatherData[0].max_temp.toFixed(1)}°C
              </p>
              <p>
                <img className={styles.umidade} src={umidade} alt="umidade" />
                Umidade: {weatherData[0].rh}%
              </p>
              <p>
                <img className={styles.vento} src={vento} alt="vento" />
                Vento: {weatherData[0].wind_spd.toFixed(1)} m/s
              </p>
            </div>
            <div className={styles.weatherImage}>
              <img
                src={`https://www.weatherbit.io/static/img/icons/${weatherData[0].weather.icon}.png`}
                alt={`Clima para ${weatherData[0].valid_date}`}
              />
              <p>{weatherData[0].weather.description}</p>
            </div>
          </div>

          <h2 className={styles.title}>Próximos Dias</h2>
          <div className={styles.weatherInfoContainer}>
            {weatherData.slice(1).map((day) => (
              <div key={day.valid_date} className={styles.weatherInfo}>
                <div className={styles.weatherDetails}>
                  <p>{day.min_temp.toFixed(1)}°C | {day.max_temp.toFixed(1)}°C</p>
                </div>
                <div className={styles.weatherDays}>
                  <img
                    src={`https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png`}
                    alt={`Clima para ${day.valid_date}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
