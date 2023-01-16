import { Grid } from "@mui/material";
import Layout from "../src/components/Layout";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import styles from '../styles/Home.module.css';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function Index() {
    const router = useRouter()
    const [menus, setMenu] = useState([]);
    useEffect(() => {
        const access = eval(localStorage.getItem('menu'));
        setMenu(access);
        () => {
            
        }
    }, [])

    const pageRoute = (page) => {
        router.push(`/${page}`);
    }
    
    return (
        <section>
            <Grid justifyContent="center" alignItems="center" container spacing={2} minHeight={160}>
                {menus.map((value, index) =>                         (<Card className={styles.card} sx={{ maxWidth: 85 }}>
                            <CardMedia
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
                
            </Grid>
        </section>)
}
