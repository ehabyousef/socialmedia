let postCard = document.getElementById("post");
const baseurl = "https://tarmeezacademy.com/api/v1/";

// function for butons
function showLogBtn() {
  let loginBtn = document.getElementById("loginBtn");
  let logoutBtn = document.getElementById("logoutBtn");
  let addPost = document.getElementById("addPost");
  let profilename = document.getElementById("profile-name");
  let profileimage = document.getElementById("profile-image");

  let taken = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (taken == null) {
    logoutBtn.classList.add("BTN-Hide");
    loginBtn.classList.remove("BTN-Hide");
    addPost.classList.add("BTN-Hide");
  } else {
    logoutBtn.classList.remove("BTN-Hide");
    loginBtn.classList.add("BTN-Hide");
    addPost.classList.remove("BTN-Hide");
    profilename.innerHTML = user.name;
    profileimage.src = user.profile_image;
  }
}
showLogBtn();
function logOutStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showLogBtn();
  location.reload();
}

const token = localStorage.getItem("token");
function createPost() {
  const body = document.getElementById("postBody").value;
  const image = document.getElementById("postimage").files[0];
  const formData = new FormData();
  formData.append("body", body);
  formData.append("image", image);

  const headers = {
    authorization: `Bearer ${token}`,
  };
  axios
    .post(`https://tarmeezacademy.com/api/v1/posts`, formData, {
      headers: headers,
    })
    .then((Response) => {
      const modal = document.getElementById("createPost");
      modal.classList.add("BTN-Hide");
      location.reload();
    })
    .catch(function (error) {
      showErrDetails(error.response.data.errors.image[1]);
    });
}

function showErrDetails(errorMassage) {
  let container = document.getElementById("container");
  container.innerHTML += `
      <div
          id="alrt-danger-error"
          class="d-flex align-items-center justify-content-center"
          
        >
        <div class="alert bg-danger fs-3 text-black" role="alert">${errorMassage}</div>
      </div>
  `;
  setTimeout(() => {
    let alertMessage = document.getElementById("alrt-danger-error");
    alertMessage.innerHTML = "";
    alertMessage.remove();
  }, 2000);
}