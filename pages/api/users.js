import usersData from '../../data/users.json';
import { pool } from '../../src/models/db';
import { setCookie } from 'cookies-next';

export default async (req, res) => {
    try {
        if (req.method !== 'POST') {
            res.status(405).send({ message: 'Only POST requests allowed' })
        } else {
            const obj = req.body;
            let result;
            const query = `select * from usr where user = '${obj.username}' and pswd = '${obj.password}' limit 1`;
            result = await pool.query(query)
            result = JSON.parse(JSON.stringify(result))
            if (result.length >=1 ){
                const data = usersData.find(el => el.username === obj.username)
                if (data){
                    setCookie("user", JSON.stringify(data),{req, res});
                    setCookie("menu", JSON.stringify(data.menu),{req,res});
                    res.status(200).send(data);     
                }
                else {
                    res.status(300).send({ message: 'User & Password does not Match'});    
                }
            } else {
                res.status(300).send({ message: 'User Not Found'});
            }
        }
    } catch (err){
        res.status(500).send({ error: 'Failed to fetch data', message: 'Failed to fetch data' })
    }   
}