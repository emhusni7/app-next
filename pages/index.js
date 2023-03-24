import { Grid } from "@mui/material";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import {CardActionArea} from "@mui/material";
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import styles from '../styles/Home.module.css';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CircularProgressWithLabel from '../src/components/Layout/circularProgress';
import { getCookie } from "cookies-next";
import Box from '@mui/material/Box';



export default function Index() {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [menus, setMenu] = useState([]);
    useEffect(() => {
        const access = eval(getCookie('menu'));
        setMenu(access);
        () => {}
    }, [])

    const pageRoute = (page) => {
        setLoading(true);
        router.push(`/${page}`);
    }
    
    return (
        <section>
            
            {loading ? (<Box sx={{ width: '100%', height:100, margin: '50px',spacing: '5', alignItems:'center'}}><CircularProgressWithLabel /></Box>) : (<Grid justifyContent="center" alignItems="center" container sx={{ mt: 7}}  minHeight={160}>
                {menus.map((value, index) => (
                <Card key={index} className={styles.card} sx={{ width: 120 }}>
                    <CardActionArea
                    onClick={(e) => pageRoute(value.name)}
                    >
                            <CardMedia
                                key={index}
                                component="img"
                                height="100"
                                image={`/static/${value.name}.png`}
                                alt={value.label}
                            />
                                <CardActions>
                                    <Button onClick={(e) => pageRoute(value.name)} size="small">{value.label}</Button>
                                </CardActions>
                                </CardActionArea>            
                        </Card>)
                )}
                
            </Grid>)}
            
        </section>)
}
