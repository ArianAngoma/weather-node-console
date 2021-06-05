require('dotenv').config();
const Searches = require("./models/searches");
const {inquirerMenu, stop, readInput, listPlaces} = require('./helpers/inquirer');

const main = async () => {
    const searches = new Searches();
    let opt;
    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                const search = await readInput('Ciudad: ');
                const places = await searches.town(search);
                const id = await listPlaces(places);
                if (id === '0') continue;
                const placeSelected = places.find(place => place.id === id);
                searches.addRecord(placeSelected.name);
                const weatherSelected = await searches.weatherByPlace(placeSelected.lat, placeSelected.lng);

                console.log('\nInformación de la ciudad\n'.green);
                console.log(`Ciudad: ${placeSelected.name.green}`);
                console.log(`Lat: ${placeSelected.lat}`);
                console.log(`Lng: ${placeSelected.lng}`);
                console.log(`Temperatura: ${weatherSelected.temp}`);
                console.log(`Mínima: ${weatherSelected.min}`);
                console.log(`Máxima: ${weatherSelected.max}`);
                console.log(`Descripción: ${weatherSelected.desc.green}`);
                break;
            case 2:
                searches.recordCapitalized.forEach((place, i) => {
                    console.log(`${(i + 1 + '.').green} ${place}`)
                })
                break;
        }
        await stop();
    } while (opt !== 0)
}

main();