import { pool } from "../../src/models/db";
import dayjs from 'dayjs';

export default async (req,res) => {
    try {
        let result;
        console.log(req.body.query);
        if (req.body.appSearch){
            result = await getPrj(req.body.searchQuery, req.body.page, req.body.rowpage);
        } else if (req.body.updateState){
            result = await setStatePrj(req.body.id, req.body.state, req.body.user)
        }
        return res.status(200).json(result);
    } catch (error) {   
        return res.status(405).json({error}).end();
    } 
}


const getPrj = async (params, page, rowpage) => {
    try {
        const offsets = rowpage * page;
        const query = `
        select 
		SQL_CALC_FOUND_ROWS
            rma.rma,
            rma.date,
            rma.sub request,
            rma.remark ket,
            rma.aprov,
						case 
						when rma.aprov = 1 then "Approved"
						else "To Approve" end statee,
						convert(group_concat(
                CONCAT("[",rmb.inv,"] ", rmb.remark),"-|",rmb.qty,"-|",rmb.unit SEPARATOR '-;'
            ) using utf8 ) as data
            
				from rma 
				inner join rmb on rma.rma = rmb.rma
				where rma.group_ = 2 and rma.delete = 0 ${params} and (rma.sub is not null)
				GROUP BY rma.rma,
            rma.date,
            rma.sub,
            rma.remark,
            rma.aprov
				order by rma.date desc, rma.rma asc
        limit ${rowpage}
        offset ${offsets}`
        await pool.query(`SET SESSION group_concat_max_len = 1000000`);
        const result = await pool.query(query);
        const query2 = `select FOUND_ROWS() as total`;
        const jmlRow = await pool.query(query2);
        const resJml = JSON.parse(JSON.stringify(jmlRow))
        const total = resJml[0].total;
        return {
            total: total,
            page: page,
            data: result
        };
    } catch(error) {
        return error
    }
}

const setStatePrj = async (id, state, user) => {
    const strdate = dayjs().format('DD/MM/YYYY HH:mm');
    let query, result;
    try {
        switch (state) {
            case 'approved':
                query = `update rma set aprov=1, chtime='${strdate}', chusr='${user}' where rma = '${id}'`
                result = await pool.query(query);
                return {id: id, state: 'approved'}
            case 'cancel':
                query = `update rma set aprov=0, chtime='${strdate}', chusr='${user}' where rma = '${id}'`
                result = await pool.query(query);
                return {id: id, state: 'cancel'}
            default:
                return {id: id, state: 'none'};
        }
    } catch (err) {
        return { error: {
            code: err.code,
            message: err.sqlMessage,
        }
    }
    }
    
}
