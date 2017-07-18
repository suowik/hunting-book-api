let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let userSchema = Schema({
    login: String,
    password: String,
    name: String,
    surname: String,
    role: {
        type: String,
        enum: ['admin', 'user']
    },
    address: {
        phone: String,
        street: String,
        city: String
    },
    huntings: [{type: ObjectId, ref: 'Hunting'}]
});

let animalSchema = Schema({
    name: String
});

let huntingAreaSchema = Schema({
    name: String,
    area: [
        {
            coords: [
                {lat: Number, lng: Number}
            ]
        }
    ]
});

let huntingSchema = Schema({
    _userId: {type: ObjectId, ref: 'User'},
    status: {type: String, enum: ['started', 'finished']},
    start: Date,
    end: Date,
    area: {type: ObjectId, ref: 'HuntingArea'},
    huntedAnimals: [
        {animal: {type: ObjectId, ref: 'Animal'}, shots: Number, hunted: Number}
    ]
});

module.exports = {
    userSchema: userSchema,
    animalSchema: animalSchema,
    huntingAreaSchema: huntingAreaSchema,
    huntingSchema: huntingSchema
};