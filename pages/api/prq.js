import { pool } from "../../src/models/db";
import dayjs from 'dayjs';

export default async (req,res) => {
    try {
        let result;
        console.log(req.body.query);
        if (req.body.appSearch){
            result = await getPrQ(req.body.searchQuery, req.body.page, req.body.rowpage);
        } else if (req.body.updateState){
            result = await setStatePrq(req.body.id, req.body.state, req.body.user)
        }
        return res.status(200).json(result
            );
    } catch (error) {   
        return res.status(405).json({error}).end();
    } 
}


const getPrQ = async (params, page, rowpage) => {
    try {
        const offsets = rowpage * page;
        const query = `
        select 
            SQL_CALC_FOUND_ROWS
            prq.prq,
            prq.date,
            prq.cct request,
            prq.remark ket,
            prq.aprov1,
            prq.aprov,
            (case 
                when prq.aprov1 = 1 and prq.aprov = 0
                    then 'To Approve'
                when prq.aprov = 1
                    then 'Approved'
                else 'New' end) as statee,
            convert(	group_concat(
                CONCAT("[",prd.inv,"] ", prd.remark),"-|",prd.dateneed,"-|",prd.qty,"-|",prd.unit SEPARATOR '-;'
            ) using utf8 ) as data
            from prq 
        left outer join prd on prq.prq = prd.prq
        where aprov1 = 1 ${params}
        and prq.delete != 1 
        GROUP BY prq.prq, prq.date,
            prq.cct,
            prq.remark,
            prq.aprov1,
            prq.aprov
        order by prq.date DESC, prq.prq ASC 
        limit ${rowpage}
        offset ${offsets}`
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

const setStatePrq = async (id, state, user) => {
    const strdate = dayjs().format('DD/MM/YYYY HH:mm');
    let query, result;
    try {
        switch (state) {
            case 'approved':
                query = `update prq set aprov=1, aprov1=1, apdate='${strdate}', chtime='${strdate}', chusr='${user}' where prq = '${id}'`
                console.log(query)
                result = await pool.query(query);
                return {id: id, state: 'approved'}
            case 'cancel':
                query = `update prq set aprov=0, aprov1=0, apdate='${strdate}', chtime='${strdate}', chusr='${user}' where prq = '${id}'`
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
