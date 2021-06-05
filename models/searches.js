const fs = require('fs');
const axios = require('axios');

class Searches {
    file = './db/database.json';

    constructor() {
        this.record = [];
        this.readDB();
    }

    get recordCapitalized() {
        return this.record.map(place => {
            let word = place.split(' ').map(p => p[0].toUpperCase() + p.substring(1));
            return word.join(' ');
        })
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async town(place) {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramsMapbox
            });
            const resp = await instance.get();
            return resp.data.features.map(place => ({
                id: place.id,
                name: place.place_name,
                lng: place.center[0],
                lat: place.center[1]
            }));
        } catch (err) {
            return [];
        }
    }

    async weatherByPlace(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeather, lat, lon}
            });
            const resp = await instance.get();
            const {weather, main} = resp.data;
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (err) {
            console.log('No se pudo encontrar la ciudad');
        }
    }

    addRecord(place) {
        if (this.record.includes(place.toLowerCase())) return;
        this.record = this.record.splice(0, 5);
        this.record.unshift(place.toLowerCase());
        this.saveDB();
    }

    saveDB() {
        const load = {
            record: this.record
        }
        fs.writeFileSync(this.file, JSON.stringify(load))
    }

    readDB() {
        if (!fs.existsSync(this.file)) return [];
        const info = fs.readFileSync(this.file, {encoding: 'utf-8'})
        const data = JSON.parse(info);
        this.record = data.record
    }
}

module.exports = Searches;