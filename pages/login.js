
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import { TextField, Button, Paper, Grid, Avatar } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockClockOutlined";
import {CustomizedProgressBars} from '../src/components/Layout/loader';


const validationSchema = yup.object({
    username: yup
      .string('Username')
      .required('Username is required'),
    password: yup
      .string('Enter your password')
      .min(4, 'Password should be of minimum 4 characters length')
      .required('Password is required'),
  });

const styles = {
    formBody:{
        width: "100%",
        height: "100%",
        background: "#556cd6",    
    },
    formC : {
        width: "330px",
        margin: "0 auto",
        display: "flex",
        background: "white",
        padding: "20px",
    }
}

function LoginForm() {
  const router = useRouter();
  const formik = useFormik({
      initialValues: {
        username: '',
        password: '',
      },
      validationSchema: validationSchema,
      onSubmit: async (values, { setSubmitting, setErrors}) => {
        setSubmitting(true);
        const params = {
          username: values.username,
          password: values.password,
          state: values.state,
        }
        const res = await fetch('api/users',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params),
        });
        const response = await res.json();
        setSubmitting(false)
        if (res.status === 200){
          router.push('/');
        } else{
          setErrors({'password': response.message, 'username': ''})
        }
        
      },
    });

    const paperStyle={padding :20,height:'70vh',width:280, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#1bbd7e'}

    return (
      <Grid>
        <Paper elevation={10} style={paperStyle} >
          <Grid align='center'>
              <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
              <h2>Sign In</h2>
          </Grid>
        <form onSubmit={formik.handleSubmit
        }>
          <TextField
            fullWidth
            id="username"
            name="username"
            variant="outlined"
            style={{ margin: "0px 0px 10px"}}
            label="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            style={{ margin: "0px 0px 10px"}}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <div>{formik.isSubmitting ? (<CustomizedProgressBars />) : ("")}</div>
          <Button color="primary" variant="contained" fullWidth type="submit">
            Login
          </Button>
          {/* <NotificationContainer /> */}
        </form>          
        </Paper>
      </Grid>
    );
  };

export default LoginForm;

