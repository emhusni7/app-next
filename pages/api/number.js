import fs from 'fs';
import React from 'react';
import dataSeq from '../../data/numbers.json';


export default async (req, res) => {
    try {
        if (req.method !== 'POST') {
            res.status(405).send({ message: 'Only POST requests allowed' })
        } else {
            if (req.body.type == 'get'){
                const datas = getNumber();
                res.status(200).json(datas);
            } else if (req.body.type == 'set'){

            }
        }
    } catch (err){
        res.status(500).send({ error: 'failed to fetch data' })
    }
}

export const numberRepo = {
        getAllNumber: () => dataSeq,
        getNumber,
        setNumber 
}

function getNumber(model, year, month) {
    const dataS = dataSeq.find(x => x.model == model);
    const res = dataS.datas.find(x => x.year == year && x.month == month);
    return res;
}

function getModelNumber(model){
    const res = dataSeq.find(x => x.model == model);
    return res;
}

function setNumber(model, year, month) {
    const [number, setNumber] = React.useState(dataSeq);
    
    // let checked = false;
    // for (mdl in model){
    //     for (x in mdl.datas){
    //         if (x.year == year && x.month == month){
    //             x.number = x.number + 1
    //             checked = true
    //         }
    //     }
    // }
    // console.log(mdl);
    // if (!checked){
    // }
    //Object.assign({x: 3, z: 4, w: 5}, first); 
}

// private helper functions

function saveData() {
    fs.writeFileSync('../../data/numbers.json', JSON.stringify(users, null, 4));
}