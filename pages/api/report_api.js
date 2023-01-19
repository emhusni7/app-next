import { useEffect } from "react";

export default async (req,res) => {
    try {
        if (req.body.report_type == 'sales_contract'){
            const result = await getReport(req.body.id, 'so_contract');
            return res.status(200).json(result);
        } else if ( req.body.report_type == "pos_approval"){
            const result = await getReport(req.body.id, 'po_approval');
            return res.status(200).json(result);
        }
        
        
    } catch (error) {
        return res.status(405).json({error}).end();
    } 
}


const getReport = async (id, report_name) => {
    
    const username = process.env.J_USERNAME
    const password = process.env.J_PASSWORD
    const url = process.env.JASPER_SERVER_URL+`${report_name}.pdf?id=${id}`
    const auth1 =  'Basic ' + Buffer.from(username + ":" + password).toString('base64');
    
    let result = await fetch(url,{
      method:'GET', 
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': auth1,
            'Content-Type' : 'application/pdf',
        },
    }) .then((response) => {
        return response.buffer();    
    }). then( async (buffer) => {
        const b64 = buffer.toString('base64');
        return b64;
    }).catch((error) => {
        return error;
    })
    return {"data": result };
}