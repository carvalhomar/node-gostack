const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();
app.use(express.json());

const categories = [];

function logRequests(request, response, next){
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);

    return next();
}

function validateCategoryId (request, response, next){
    const { id } = request.params;

    if(!isUuid(id)){
        return response.status(400).json({ erro: 'Category invalid!'});
    }

    return next();
}

app.use(logRequests);

app.get('/category', (request, response)=> {
    
    const { name, created_at } = request.query;
    
    const result = name 
        ? categories.filter( category => category.name.includes(name))
        : categories;

    return response.json(categories);
});

app.post('/category', (request, response)=> {
    const { name, created_at } = request.body;

    category = { id:uuid(), name, created_at };

    categories.push(category);

    return response.json(category);
});

app.put('/category/:id', validateCategoryId, (request, response)=> {

    const { id } = request.params;
    const { name, created_at} = request.body; 

    const categoryIndex = categories.findIndex( category => category.id === id);

    if(categoryIndex < 0){
        return response.status(400).json({ error:'Category not found!'});
    }

    const category = {
        id, 
        name,
        created_at
    }

    categories[categoryIndex] = category;

    return response.json(category);
});

app.delete('/category/:id', validateCategoryId, (request, response)=> {

    const { id } = request.params;

    const categoryIndex = categories.findIndex( category => category.id === id);

    if(categoryIndex < 0){
        return response.status(400).json({ error:'Category not found!'});
    }

    categories.splice(categoryIndex, 1);

    return response.status(204).send();
});


//port to access
app.listen(3333, ()=>{
    console.log('🌪  Back-end Started!');
});