import { Grid } from "@mui/material";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import styles from '../styles/Home.module.css';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {CustomizedProgressBars} from '../src/components/Layout/loader';



export default function Index() {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [menus, setMenu] = useState([]);
    useEffect(() => {
        const access = eval(localStorage.getItem('menu'));
        setMenu(access);
        () => {}
    }, [])

    const pageRoute = (page) => {
        setLoading(true);
        router.push(`/${page}`);
    }
    
    return (
        <section>
            
            {loading ? (<div style={{ justifyContent:'center', margin: '20px',spacing: '2', alignItems:'center'}}><CustomizedProgressBars /></div>) : (<Grid justifyContent="center" alignItems="center" container spacing={2} minHeight={160}>
                {menus.map((value, index) => (
                <Card key={index} className={styles.card} sx={{ maxWidth: 85 }}>
                            <CardMedia
                                key={index}
                                component="img"
                                height="120"
                                image={`/static/${value.name}.png`}
                                alt={value.label}
                            />
                                <CardActions>
                                    <Button onClick={(e) => pageRoute(value.name)} size="small">{value.label}</Button>
                                </CardActions>
                        </Card>)
                )}
                
            </Grid>)}
            
        </section>)
}
