let newPost = {
  body: "",
  image: "",
};
const token = localStorage.getItem("token");
let headers = {
  authorization: `Bearer ${token}`,
};
function handleCretePost(e) {
  newPost[e.name] = e.value;
  console.log(newPost);
}
function createPost() {
  axios
    .post(`https://tarmeezacademy.com/api/v1/posts`, {
      headers: headers,
    })
    .then((Response) => console.log(Response))
    .catch((err) => console.log(err));
}
