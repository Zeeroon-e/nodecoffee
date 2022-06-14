const nedb = require('nedb-promise');
const database = new nedb({ filename: 'menu.db', autoload: true });

async function getMenu() {
    let result = await database.find({});
    if (result.length === 0) {
        result = await database.insert((require('../menu.json')))
    }
    return result;
};

async function createMenuItem(coffee) {
    const result = await database.insert(coffee);
    return result;
};

async function checkIfItemExist(coffeeInfo) {
    const result = await database.find({ $or: [{ id: coffeeInfo.id }, { title: coffeeInfo.title}] });
    return result;
}

async function comparecoffeeInfo(coffeeInfo) {
    const result = await database.find({ $and: [{ id: coffeeInfo.id }, { title: coffeeInfo.title }] });
    return result;
}

async function deleteCoffee(coffeeInfo) {
     const result = await database.remove({ $or: [{ id: coffeeInfo.id }, { title: coffeeInfo.title }] });
     return result;
}

module.exports = { getMenu, createMenuItem, checkIfItemExist, comparecoffeeInfo, deleteCoffee }