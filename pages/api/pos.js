import { pool } from "../../src/models/db";
import dayjs from 'dayjs';

export default async (req, res) => {
    if (req.body.search){
        let params = '';        
        let parameter;
        if (req.body.search !== '' && req.body.search){
            params = req.body.search;
            if (params !== ''){
                parameter = `and o.oms like '%${params}%'`;
            } else{
                parameter = `and true`
            }        
            
            } else {
                parameter = `and true`
            }
            try {
                const result = await getListPo(parameter);
                return res.status(200).json(result);
            } catch (error){
                return res.status(405).json({error}).end();
            }
    } else if(req.body.appSearch){
        try {
            const result = await getAppPoSearch(req.body.searchQuery, req.body.page, req.body.rowpage);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(405).json({error}).end();
        }
    } else if (req.body.updateState){
        try {
            const result = await getUpdateState(req.body.id, req.body.state, req.body.user)
            return res.status(200).json(result);
        } catch (error) {
            return res.status(405).json({error}).end();
        }
    }
}

const getListPo = async (params) => {
    const query = `select 
        o.oms as title,
        o.cur,
        o.val,
        s.name,
        coalesce(NULLIF(o.state, ''), 'none')
    from oms o
    inner join sub s on s.sub = o.sub and o.oms like 'POS%'
    where close = 0 ${params}
    order by o.date desc  limit 5`;
    const result = await pool.query(query);
    return result;
}

export const purchaseObj = {
    getAppPO,
    getAppPoSearch,
}

async function getAppPO(queryStr, page, rowpage) {
    const offsets = rowpage * page;    
    const query = `
        SELECT 
            oms.oms,
            CAST(oms.date AS DATE) date,
            CONCAT("[",s.sub,"] ", s.name) supplier,
            oms.cur,
            oms.val,
            (case 
                when oms.state = 'to_approve'
            then 'to_approve'
                when oms.state = 'approved'
            then 'approved'
                when oms.state = 'cancel'
            then 'cancel'
            else 'none' end) as action,
            (case 
                when oms.state = 'to_approve'
            then 'to_approve'
                when oms.state = 'approved'
            then 'approved'
                when oms.state = 'cancel'
            then 'cancel'
            else 'none' end) as state
        FROM oms
        INNER JOIN sub s ON s.sub = oms.sub and oms like 'POS%'
        ${queryStr} 
        limit ${rowpage}
        offset ${offsets}
        `
    const result = await pool.query(query);
    const results = JSON.parse(JSON.stringify(result))
    return {
        total: 100,
        page: 0,
        data: results
    };
}

async function getUpdateState(id, tostate, user){
    const dtime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    let query, result;
    switch (tostate) {
        case 'approved':
            query = `update oms set state = '${tostate}', aprov=1, aprov_time='${dtime}', aprovby='${user}' where oms = '${id}'`
            result = await pool.query(query);
            return {id: id, state: 'approved'}
        case 'to_approve':
            query = `update oms set state = '${tostate}', aprov=0, aprov_time='${dtime}', aprovby='${user}' where oms = '${id}'`
            result = await pool.query(query);
            return {id: id, state: 'to_approve'}
        case 'cancel':
            query = `update oms set state = '${tostate}', aprov=0, aprov_time='${dtime}', aprovby='${user}' where oms = '${id}'`
            result = await pool.query(query);
            return {id: id, state: 'cancel'}
        default:
            return {id: id, state: 'none'};
    }
    
}

async function getAppPoSearch(searchQuery, page, rowpage){
    const offsets = rowpage * page;
    const query = `
        SELECT 
            oms.oms,
            CAST(oms.date AS DATE) date,
            CONCAT("[",s.sub,"] ", s.name) supplier,
            oms.cur,
            oms.val,
            (case 
                when oms.state = 'to_approve'
            then 'to_approve'
                when oms.state = 'approved'
            then 'approved'
                when oms.state = 'cancel'
            then 'cancel'
            else 'none' end) as action,
            (case 
                when oms.state = 'to_approve'
            then 'to_approve'
                when oms.state = 'approved'
            then 'approved'
            when oms.state = 'cancel'
                then 'cancel'
            else 'none' end) as state
        FROM oms
        INNER JOIN sub s ON s.sub = oms.sub and oms like 'POS%'
        ${searchQuery}
        ORDER BY oms.date DESC
        limit ${rowpage}
        offset ${offsets}
        `
    const result = await pool.query(query);
    return result;
}