let postCard = document.getElementById("post");
const baseurl = "https://tarmeezacademy.com/api/v1/";

// pagination

let currentpage = 1;
let lastpage = 1;
const handleInfiniteScroll = () => {
  const endOfPage =
    document.documentElement.scrollTop +
      document.documentElement.clientHeight >=
    document.documentElement.scrollHeight - 10;
  if (endOfPage && currentpage < lastpage) {
    currentpage = currentpage + 1;
    getposts(currentpage);
  }
};
window.addEventListener("scroll", handleInfiniteScroll);

if (!localStorage.getItem("user")) {
  let container = document.getElementById("container");
  container.innerHTML = `
    <div
      id="not-signed"
        class="content h-100 w-100 d-flex flex-column gap-3 align-items-center justify-content-center"
      >
        <h4>you shold login</h4>
        <a href="login.html">
          <div class="btn btn-outline-dark">LogIn</div> </a
        >
      </div>
  `;
}
function getposts(page = 1) {
  toggleLodaer(true);
  axios
    .get(`${baseurl}posts?limit=3&page=${page}`)
    .then(function (response) {
      // handle success
      let posts = response.data.data;
      lastpage = response.data.meta.last_page;
      for (const post of posts) {
        const user = JSON.parse(localStorage.getItem("user"));
        let rightUser = user.id == post.author.id;
        console.log(rightUser);
        let editBtn = ``;
        if (rightUser) {
          editBtn = `
          <div>
            <div class="btn btn-outline-danger fw-bold" data-bs-toggle="modal" data-bs-target="#exampleModal">delete</div>
            <div onclick="editPost(${post.id})" class="btn btn-outline-info fw-bold">edit-post</div>
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    are you sure
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button onclick="deletePost(${post.id})" type="button" class="btn btn-danger">delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          `;
        }
        let card = `
        <div  class="card rounded-4 my-4" style="width: 60% !important;">
          <div class="card-header d-flex justify-content-between align-items-center">
            <div onclick="navigateUser(${post.author.id})" class=" d-flex align-items-center gap-3 "  style="cursor: pointer;">
              <img class="avatar" src=${post.author.profile_image} alt="" srcset="" />
              <p class="mb-0">${post.author.username}</p>
            </div>
           ${editBtn}
          </div>
          <div onclick="showCurrentPost(${post.id})" class="card-body" style="cursor: pointer;">
            <p>
             ${post.body}
            </p>
            <img class="w-100" src=${post.image} alt="" srcset="" />
            <h6 class="p-2 opacity-75">${post.created_at}</h6>
            <hr />
            <div class="d-flex align-items-center gap-2 p-2">
              <i class="fa-solid fa-pen-fancy"></i>
              <p class="mb-2">(${post.comments_count}) comments</p>
              <div id="post-tag-${post.id}" class="tags mx-2"></div>
            </div>
          </div>
        </div>
        `;
        postCard.innerHTML += card;
        let currnetpostTag = `post-tag-${post.id}`;
        document.getElementById(currnetpostTag).innerHTML = "";
        const tags = post.tags;
        for (const tag of tags) {
          let con = `
          <div class="btn btn-secondary">${tag.name}</div>
        `;
          document.getElementById(currnetpostTag).innerHTML += con;
        }
      }
      toggleLodaer(false);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}
getposts();
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

// create new post
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
  toggleLodaer(true);
  axios
    .post(`https://tarmeezacademy.com/api/v1/posts`, formData, {
      headers: headers,
    })
    .then((Response) => {
      toggleLodaer(false);
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

function closeForm() {
  document.getElementById("createPost").classList.add("BTN-Hide");
}
function openForm() {
  document.getElementById("createPost").classList.remove("BTN-Hide");
}

let showPost = document.getElementById("showPost");
function closePost() {
  showPost.classList.remove("getback");
  document.getElementById("container").style.opacity = "1";
  document.getElementById("navBar").style.opacity = "1";
}
function showCurrentPost(postId) {
  showPost.classList.add("getback");
  document.getElementById("container").style.opacity = ".5";
  document.getElementById("navBar").style.opacity = ".5";
  // get api
  console.log(postId);
  axios
    .get(`${baseurl}posts/${postId}`)
    .then(function (response) {
      let post = response.data.data;
      console.log(post);
      const comments = post.comments;
      let commentData = ``;
      for (const comment of comments) {
        commentData += `
             <div class="d-flex align-items-center gap-3 p-2">
                <img class="rounded-circle" src=${comment.author.profile_image} alt="" /
                width="50px" height="50px">
                <b>${comment.author.name}</b>
             </div>
             <div class="p-4">
                <p class="mb-0 p-2">
                  ${comment.body}
                </p>
             </div>
             
        `;
      }
      let con = `
        <div class="content">
          <div onclick="closePost()" class="close">
            <i class="fa-solid fa-circle-xmark"></i>
          </div>
          <div class="card">
            <div class="card-header d-flex align-items-center gap-3">
              <img class="avatar" src=${post.author.profile_image} alt="" srcset="" />
              <p class="mb-0">${post.author.username}</p>
            </div>
            <div class="card-body">
              <p>
                ${post.body}
              </p>
              <div class="d-flex justify-content-center">
                <img class="w-50" src=${post.image} alt="" srcset="" />
              </div>
              <h6 class="p-2 opacity-75">${post.created_at}</h6>
              <hr />
              <div class="d-flex align-items-center gap-2 p-2">
                <i class="fa-solid fa-pen-fancy"></i>
                <p class="mb-2">(${post.comments_count}) comments</p>
                <div id="post-tag-${post.id}" class="tags mx-2"></div>
              </div>
            </div>
            <div class="com m-2" style="background-color: #f1f1f1">
                ${commentData}
            </div>
             <div class="m-3 d-flex align-items-center flex-column">
              <input
                type="text"
                name="comment"
                id="commentBody"
                placeholder="Add  Your Comment"
                required
              />
              <div onclick="createComm(${postId})" class="btn btn-outline-dark w-25">send</div>
            </div>
          </div>
        </div>
      `;
      showPost.innerHTML = con;
      let currnetpostTag = `post-tag-${post.id}`;
      document.getElementById(currnetpostTag).innerHTML = "";
      const tags = post.tags;
      for (const tag of tags) {
        let con = `
          <div class="btn btn-secondary">${tag.name}</div>
        `;
        document.getElementById(currnetpostTag).innerHTML += con;
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error.response.data);
    });
}

function createComm(postid) {
  let commentBody = document.getElementById("commentBody").value;
  console.log("work");
  let param = {
    body: commentBody,
  };
  let token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
  };
  axios
    .post(`${baseurl}posts/${postid}/comments`, param, {
      headers: headers,
    })
    .then((Response) => {
      console.log(Response.data.data);
      showCurrentPost(postid);
    })
    .catch(function (error) {
      console.log(error);
      showErrDetails(error.response.data.message);
    });
}
let editPostId;
function editPost(postId) {
  axios
    .get(`${baseurl}posts/${postId}`)
    .then((Response) => {
      let post = Response.data.data;
      console.log(post);
      const editModal = document.getElementById("editePost");
      const body = document.getElementById("editpostBody");
      // const image = document.getElementById("editpostimage");
      // image.files[0] = image.files[post.image];
      body.value = post.body;
      editPostId = postId;
      console.log(body.value);
      editModal.classList.remove("BTN-Hide");
    })
    .catch(function (error) {
      console.log(error);
    });
}

function updatePost() {
  const body = document.getElementById("editpostBody").value;
  const image = document.getElementById("editpostimage").files[0];
  const formData = new FormData();
  formData.append("body", body);
  formData.append("image", image);

  const headers = {
    authorization: `Bearer ${token}`,
  };
  formData.append("_method", "PUT");

  axios
    .post(`${baseurl}posts/${editPostId}`, formData, {
      headers: headers,
    })
    .then((response) => {
      document.getElementById("editePost").classList.add("BTN-Hide");
      location.reload();
      console.log(response);
    })
    .catch((error) => {
      showErrDetails(error);
      console.log(error);
    });
}
function closeEditForm() {
  document.getElementById("editePost").classList.add("BTN-Hide");
}
function deletePost(postId) {
  let token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
  };
  axios
    .delete(`${baseurl}posts/${postId}`, {
      headers: headers,
    })
    .then((response) => {
      // document.getElementById("editePost").classList.add("BTN-Hide");
      const modal = document.getElementById("exampleModal");
      let modalins = bootstrap.Modal.getInstance(modal);
      modalins.hide();
      location.reload();
      console.log(response);
    })
    .catch((error) => {
      showErrDetails(error);
      console.log(error);
    });
}

// get user id
function navigateUser(userid) {
  window.location = `profile.html?userid=${userid}`;
}
function navigateMyProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  window.location = `profile.html?userid=${user.id}`;
}
function toggleLodaer(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}
