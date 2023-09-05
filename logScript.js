// toggle between forms
let forms = document.querySelectorAll("#form");
console.log(forms);

function gotoRegister() {
  console.log(forms[0]);
  forms[1].classList.remove("form-appear");
  forms[0].classList.add("form-appear");
}

function gotoLogin() {
  forms[1].classList.add("form-appear");
  forms[0].classList.remove("form-appear");
}
let userData = {
  username: "",
  password: "",
  name: "",
  email: "",
};

function handleRegister(e) {
  userData[e.name] = e.value;
  console.log(userData);
}

function Registeruser() {
  axios
    .post("https://tarmeezacademy.com/api/v1/register", userData)
    .then(function (response) {
      console.log(response);
      // localStorage.setItem("token", response.data.token);
      gotoLogin();
    })
    .catch(function (error) {
      // alert(error.response.data.message);
      showErrDetails(error.response.data.message);
    });
}

let logUser = {
  username: "",
  password: "",
};

function handleLogin(e) {
  logUser[e.name] = e.value;
  console.log(logUser);
}

function loginUser() {
  axios
    .post("https://tarmeezacademy.com/api/v1/login", logUser)
    .then(function (response) {
      console.log(response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // window.open('/home.html');
      window.location.href = "/home.html"; // Navigate to home.html
    })
    .catch(function (error) {
      // alert(error.response.data.message);
      showErrDetails(error.response.data.message);
    });
}

function showErrDetails(errorMassage) {
  document.getElementById("container").innerHTML += `
    <div
        id="alrt-danger"
        class="d-flex align-items-center justify-content-center position-absolute"
        style="top: 80px; left: 50%; transform: translateX(-50%)"
      >
       <div class="alert bg-danger fs-3 text-black" role="alert">${errorMassage}</div>
    </div>
`;
  setTimeout(() => {
    document.getElementById("alrt-danger").innerHTML = "";
  }, 2000);
}
