let postCard = document.getElementById("post");
const baseurl = "https://tarmeezacademy.com/api/v1/";

// pagination
let currentpage = 1;
let lastpage = 1;
const handleInfiniteScroll = () => {
  const endOfPage =
    document.documentElement.scrollTop +
      document.documentElement.clientHeight >=
    document.documentElement.scrollHeight - 5;
  if (endOfPage && currentpage < lastpage) {
    getposts(currentpage++);
  }
};

// window.addEventListener("scroll", handleInfiniteScroll);

function getposts(page = 1) {
  axios
    .get(`${baseurl}posts?limit=2&page=${page}`)
    .then(function (response) {
      // handle success
      let posts = response.data.data;
      lastpage = response.data.meta.last_page;
      for (const post of posts) {
        let card = `
        <div onclick="showCurrentPost(${post.id})" class="card rounded-4 my-4 w-75 " style="cursor: pointer;">
          <div class="card-header d-flex align-items-center gap-3">
            <img class="avatar" src=${post.author.profile_image} alt="" srcset="" />
            <p class="mb-0">${post.author.username}</p>
          </div>
          <div class="card-body">
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
          <div class="com mx-2" style="background-color: #f1f1f1; overflow-y: scroll; max-height: 300px;">
            <div class="d-flex align-items-center">
              <img class="rounded-circle" src="/images/pngegg (1).png" alt="" /
              width="50px" height="50px">
              <b>user</b>
            </div>
            <div class="conten">
              <p class="mb-0">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Deserunt, omnis!
              </p>
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
  document.getElementById("container").innerHTML += `
    <div
        id="alrt-danger-error"
        class="d-flex align-items-center justify-content-center"
        
      >
       <div class="alert bg-danger fs-3 text-black" role="alert">${errorMassage}</div>
    </div>
`;
  setTimeout(() => {
    document.getElementById("alrt-danger-error").innerHTML = "";
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
    .get(`${baseurl}posts/1`)
    .then(function (response) {
      let post = response.data.data;
      console.log(post);
      const comments = post.comments;
      let commentData = ``;
      for (const comment of comments) {
        commentData ==
          `
             <div class="d-flex align-items-center gap-3 p-2">
                <img class="rounded-circle" src=${comment.author.profile_image} alt="" /
                width="50px" height="50px">
                <b>${comment.author.name}</b>
             </div>
             <div class="p-3">
                <p class="mb-0">
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
              <img class="w-100" src=${post.image} alt="" srcset="" />
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
      console.log(response.data.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error.response.data);
    });
}
