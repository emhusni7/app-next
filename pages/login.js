
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import { TextField, Button, Paper, Grid, Avatar } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockClockOutlined";



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

function LoginForm({ csrfToken }) {
  const router = useRouter();

  const formik = useFormik({
      initialValues: {
        username: 'foobar@example.com',
        password: 'foobar12',
      },
      validationSchema: validationSchema,
      onSubmit: async (values, { setSubmitting }) => {
        
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
        
        if (res.status === 200){
          localStorage.setItem("user", JSON.stringify(response));
          router.push('/');
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
        <form onSubmit={formik.handleSubmit}>
          <input name="csrfToken" type="hidden" />
          <TextField
            fullWidth
            id="username"
            name="username"
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
          <Button color="primary" variant="contained" fullWidth type="submit">
            Login
          </Button>
        </form>          
        </Paper>
      </Grid>
    );
  };

export default LoginForm;

// export async function getServerSideProps(context) {
//   return {
//     props: {
//       csrfToken: await getCsrfToken(context),
//     },
//   }
// }