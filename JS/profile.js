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
