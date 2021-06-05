const inquirer = require('inquirer');
require('colors');

const questions = [
    {
        type: 'list',
        name: 'option',
        message: '¿Qué desea hacer?',
        choices: [
            {value: 1, name: `${'1.'.green} Buscar ciudad`},
            {value: 2, name: `${'2.'.green} Historial`},
            {value: 0, name: `${'0.'.green} Salir`}
        ]
    }
]

const inquirerMenu = async () => {
    console.clear();
    console.log('Seleccione una opción\n'.green);
    const {option} = await inquirer.prompt(questions);
    return option;
}

const stop = async () => {
    console.log('\n');
    return await inquirer.prompt([
        {
            type: 'input',
            name: 'confirm',
            message: `Presione ${'ENTER'.green} para continuar`
        }
    ])
}

const readInput = async (message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value) {
                if (value.length === 0) return 'Por favor ingrese un valor';
                return true;
            }
        }
    ]

    const {desc} = await inquirer.prompt(question);
    return desc;
}

const listPlaces = async (places = []) => {
    const choices = places.map((place, i) => {
        return {
            value: place.id,
            name: `${(i + 1 + '.').green} ${place.name}`
        }
    })

    choices.unshift({
        value: '0',
        name: `${'0.'.green} Cancelar`
    });

    const question = [
        {type: 'list', name: 'id', message: 'Seleccione lugar:', choices}
    ]
    const {id} = await inquirer.prompt(question);
    return id;
}


module.exports = {
    inquirerMenu,
    stop,
    readInput,
    listPlaces
}