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

function Registeruser() {
  const username = document.getElementById("username").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const image = document.getElementById("image").files[0];

  const formData = new FormData();
  formData.append("username", username);
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("image", image);
  toggleLodaer(true);
  axios
    .post("https://tarmeezacademy.com/api/v1/register", formData)
    .then(function (response) {
      console.log(response);
      toggleLodaer(false);
      // localStorage.setItem("token", response.data.token);
      gotoLogin();
    })
    .catch(function (error) {
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
  toggleLodaer(true);
  axios
    .post("https://tarmeezacademy.com/api/v1/login", logUser)
    .then(function (response) {
      console.log(response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      window.location.href = "/home.html"; // Navigate to home.html
      toggleLodaer(false);
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

function toggleLodaer(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}
