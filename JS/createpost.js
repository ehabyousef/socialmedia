const baseurl = "https://tarmeezacademy.com/api/v1/";
let newPost = {
  body: "",
  image: "",
};

function handleCretePost(e) {
  newPost[e.name] = e.value;
  console.log(newPost);
}
function createPost() {
  axios
    .post(`${baseurl}posts?`)
    .then((Response) => console.log(Response))
    .catch((err) => console.log(err));
}
