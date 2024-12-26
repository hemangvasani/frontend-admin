import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  CircularProgress,
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import Joi from "joi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SET_USER } from "../../store/auth/authActionType";
import validator from "validator";

const loginSchema = Joi.object({
  email: Joi.string().custom((v) => {
    if (validator.isEmail(v)) {
      return v;
    }
    const phoneRegex = /^\+([0-9]{1,3})\)?[\s]?[0-9]{6,14}$/;
    if (phoneRegex.test(v)) {
      return v;
    }
    throw new Error("Please Provide valid data");
  }),
  password: Joi.string().required(),
});
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const login = () => {
    const data = {
      email,
      password,
    };
    // console.log(data);

    if (loginSchema.validate(data).error) {
      if (
        loginSchema.validate(data).error?.message ===
        `"email" is not allowed to be empty`
      ) {
        setErrorMsg("Please enter Email / Phone");
      } else if (
        loginSchema.validate(data).error?.message ===
        `"password" is not allowed to be empty`
      ) {
        setErrorMsg("Please enter Password");
      } else if (
        loginSchema.validate(data).error?.message ===
        `"email" failed custom validation because Please Provide valid data`
      ) {
        setErrorMsg("Please enter valid Email / Phone");
      }
      setIsSubmitting(false);
      return;
    } else {
      const payloadValue = loginSchema.validate(data).value;
      axios({
        method: "post",
        url: `${process.env.REACT_APP_BASE_URL}/auth/admin`,
        data: { username: payloadValue.email, password: payloadValue.password },
        withCredentials: true,
        headers: {
          "Access-Control-Allow-Credentials": "true",
        },
      })
        .then((res) => {
          console.log(res);

          localStorage.setItem(
            "token",
            res.headers["X-Auth-Token"] || res.headers["x-auth-token"]
          );
          // setToken(res.headers["X-Auth-Token"] || res.headers["x-auth-token"]);
          // if (res.data.userType !== "ADMIN") {
          //   alert("only admin can login");
          // }
          dispatch({ type: SET_USER, payload: res.data.user });

          navigate("../");
        })
        .catch((error) => {
          setIsSubmitting(false);
          if (error === "Error: Network Error") {
            setErrorMsg(
              "Something went wrong, please try again after some time or Refresh the Page."
            );
          } else if (error.response.status === 401) {
            setErrorMsg(error.response.data.message);
          } else if (error.response.status === 500) {
            setErrorMsg("Something happened wrong try again after sometime.");
          } else if (error.response.status === 422) {
            setErrorMsg(error.response.data.message);
          } else if (error.response.status === 415) {
            setErrorMsg(error.response.data.message);
          }
        });
    }
  };
  return (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center">
      <Box
        borderWidth={1}
        px={4}
        width="full"
        maxWidth="500px"
        borderRadius={4}
        textAlign="center"
        boxShadow="lg"
      >
        <Box p={4}>
          <Box textAlign="center">
            <Text>
              <br></br>
            </Text>
            <Heading>Sign In to Your Account</Heading>
            <Text>
              <br></br>
            </Text>
            <Text color="red">{errorMsg}</Text>
          </Box>
          <Box my={8} textAlign="left">
            <FormControl isRequired>
              <FormLabel>Enter Username </FormLabel>
              <Input
                type="email"
                placeholder="Enter your Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsSubmitting(true);
                    login();
                  }
                }}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            {isSubmitting ? (
              <Flex
                bg="white.500"
                color="gery.500"
                width="full"
                justifyContent="center"
                mt={4}
              >
                <Center>
                  <CircularProgress
                    size={7}
                    isIndeterminate
                    color="green.500"
                    m={1}
                  />
                </Center>
              </Flex>
            ) : (
              <Button
                bg="green.500"
                color="white"
                width="full"
                mt={4}
                onClick={() => {
                  setIsSubmitting(true);
                  login();
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}

export default Login;
