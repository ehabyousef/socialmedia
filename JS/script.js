let postCard = document.getElementById("post");
const baseurl = "https://tarmeezacademy.com/api/v1/";
axios
  .get(`${baseurl}posts?limit=5`)
  .then(function (response) {
    // handle success
    let posts = response.data.data;
    for (const post of posts) {
      let card = `
        <div class="card rounded-4 my-4 w-75">
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

function showLogBtn() {
  let loginBtn = document.getElementById("loginBtn");
  let logoutBtn = document.getElementById("logoutBtn");
  let addPost = document.getElementById("addPost");

  let taken = localStorage.getItem("token");
  if (taken == null) {
    logoutBtn.classList.add("BTN-Hide");
    loginBtn.classList.remove("BTN-Hide");
    addPost.classList.add("BTN-Hide");
  } else {
    logoutBtn.classList.remove("BTN-Hide");
    loginBtn.classList.add("BTN-Hide");
    addPost.classList.remove("BTN-Hide");
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
