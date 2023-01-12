import { Grid } from "@mui/material";
import Layout from "../src/components/Layout";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import styles from '../styles/Home.module.css';
import { useRouter } from "next/router";


export default function Index() {
    const router = useRouter()
    return (
        <section>
            <Grid justifyContent="center" alignItems="center" container spacing={2} minHeight={160}>
                <Card className={styles.card} sx={{ maxWidth: 85 }}>
                    <CardMedia
                        component="img"
                        height="120"
                        image={`/static/money.png`}
                        alt="green iguana"
                    />
                   
                    <CardActions>
                        <Button size="small">Down Payment</Button>
                    </CardActions>
                </Card>
                <Card className={styles.card} sx={{ maxWidth: 85 }}>
                    <CardMedia
                        component="img"
                        height="120"
                        image={`/static/sales_contract.png`}
                        alt="Sales"
                    />
                   
                    <CardActions>
                        <Button size="small" onClick={() => router.push("/sales")}>Sales Contract</Button>
                    </CardActions>
                </Card>
            </Grid>
        </section>)
}
