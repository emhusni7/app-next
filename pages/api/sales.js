import { id } from "date-fns/locale";
import { pool } from "../../src/models/db";

export default async (req,res) => {
    try {
        let result;
        if (req.body.query){
            result = await getSales(req.body.query, req.body.page, req.body.rowpage);
        } else if (req.body.updateState){
            result = await setStatus(req.body.id, req.body.from_state, req.body.to_state)
        }
        return res.status(200).json(result);
    } catch (error) {   
        return res.status(405).json({error}).end();
    } 
}

const setStatus = async (id, from_state ,to_state) => {
    const query = `update okl set state = '${to_state}' where okl = '${id}'`;
    const result = await pool.query(query);
    return result
}

const getSales = async (params, page, rowpage) => {
    const offsets = rowpage * page;    
    const query = `
        select 
            so.okl,
            c.name,
            c.address,
            date_format(so.date,'%d/%m/%Y') so_date,
            so.nopoc,
            coalesce(nullif(so.asal,'-'),'-') asal,
            coalesce(nullif(so.tujuan,'-'),'-') tujuan,
            coalesce(nullif(so.spec,'-'),'-') spec,
            coalesce(nullif(so.ketlain,'-'),'-') ketlain,
            so.state action
    from okl so
        inner join sub c on c.sub = so.sub 
        ${params}
    order by so.date desc 
    limit ${rowpage}
    offset ${offsets}`
    const result = await pool.query(query);
    const results = JSON.parse(JSON.stringify(result))
    return {
        total: 100,
        page: page,
        data: results
    };
}