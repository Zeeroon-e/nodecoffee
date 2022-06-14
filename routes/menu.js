const { Router, request, response } = require('express');
const router = Router();
const { getMenu, createMenuItem, checkIfItemExist, deleteCoffee } = require('../model/menudb');

router.get('/', async (req, res) => {
    const menu = await getMenu()
    const resObj = {
        success: false
    };

    if (menu) {
        resObj.success = true;
        resObj.menu = menu;
    } else {
        resObj.message = 'ErrorErrorError'
    };

    res.json(resObj);
});




router.use((req, res, next) =>{
    const authentication = req.headers.admin;
    const apiKeys = [
        'hyr367gbjk',
        'orm998pro',
        'oor554hhr'
    ]
    

    if (!apiKeys.includes(authentication)){
       console.log('u dont have admin access');
       const resObj={
        success: false
       }
       resObj.message = 'u dont have permission'
       res.json(resObj)
    }

    if (apiKeys.includes(authentication)) {
        
        
        next() 
    } 
    
    
    
})

router.post('/add', async (req, res) => {
    const coffeeInfo = req.body;
    const checkIfExist = await checkIfItemExist(coffeeInfo)

    const resObj = {
        success: false
    }

    if (coffeeInfo.hasOwnProperty('id') && coffeeInfo.hasOwnProperty('title') && coffeeInfo.hasOwnProperty('desc') && coffeeInfo.hasOwnProperty('price')) {
        if (checkIfExist.length > 0 ) {
            resObj.message = 'item already exist.'
        } else {
            
            const result = await createMenuItem(coffeeInfo)
            
            if (result) {
                resObj.success = true;
                resObj.message = `Item ${coffeeInfo.title} created.`;
                console.log('item added:',coffeeInfo);
            }
        }
    } else {

        resObj.message = 'Error reading coffeeInfo. Make sure you have \'id\', \'title\', \'desc\' and \'price\'.'
    }
    res.json(resObj)
});

router.delete('/delete', async (req, res) => {
    const coffeeInfo = req.body;
    const checkIfExist = await checkIfItemExist(coffeeInfo);

    const resObj = {
        success: false
    }

    result = await deleteCoffee(coffeeInfo);

    if (coffeeInfo.hasOwnProperty('id') && coffeeInfo.hasOwnProperty('title')) {
        if (checkIfExist.length > 0 ) {
            
            resObj.success = true
            resObj.message = ` item with id of ${coffeeInfo.id} and title of ` + `${coffeeInfo.title} was deleted`
            console.log('item deleted:',coffeeInfo);
        }
        else {
        resObj.message = 'item does not exist'
        } 
    }
    
    res.json(resObj);
});


module.exports = router