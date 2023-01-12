import fs from 'fs';
import usersData from '../../data/users.json';

export default async (req, res) => {
    try {
        if (req.method !== 'POST') {
            res.status(405).send({ message: 'Only POST requests allowed' })
        } else {
            const obj = req.body;
            const data = usersData.find(el => el.username === obj.username && el.password == obj.password)
            if (data){
                res.status(200).send(data);     
            }
            else {
                res.status(300).send({ message: 'User Not Found'});    
            }
           
        }
    } catch (err){
        res.status(500).send({ error: 'failed to fetch data' })
    }   
}