import { getPosts, likeDisLikePost } from "./api.js";
import { handleAddComment } from "./post.js";

function logout(){
  localStorage.removeItem("username");
}

document.addEventListener("DOMContentLoaded", async function() {
    // Sample data
    console.log(localStorage.getItem('username'));
    const username = localStorage.getItem("username");
    console.log(localStorage.getItem('username'));
    const postsData = await getPosts();
    
    postsData.reverse();
    // [
    //   { imageUrl: "scripts/test_res/land.jpeg", poser: "p1", time: "12.00", likes: 100,
    //     comment:[{commenter:"commenter1", commentText:"i like cat too"},
    //             {commenter:"commenter25843275970", commentText:"i dont like cat i like dog alsdjflkajsldfj;lajs"}]},
    //   { imageUrl: "scripts/test_res/land.jpeg", poser: "p2", time: "50.00", likes: 200,
    //     comment:[{commenter:"commenter3", commentText:"i like cat too" }]},
    //   { imageUrl: "test_res/1.png", poser: "p3", time: "5.00", likes: 3,
    //     comment:[{commenter:"commenter4", commentText:"i like cat too" }]}
    // ];

    // sort data for highligh feed
    if (document.title == "highlight feed") {
      postsData.sort((postA, postB) => postB.likeNumber - postA.likeNumber);
    }

    //render things
    const account = document.getElementById("username");
    account.innerText = "account:"+username;
    const postsContainer = document.getElementById("postsContainer");
  
    function renderPosts() {
      let postsDataArray = [];
      //convert posts.json to array to get index
      postsData.forEach(post => postsDataArray.push(post));
      for (let i = 0; i < postsDataArray.length; i++) {
        let post = postsDataArray[i];
        // console.log("Image Data:", post.imageUrl.data);
        // console.log("Content Type:", post.imageUrl.contentType);
        const postElement = document.createElement("div");
        postElement.classList.add("postBox");
        
        // head
        const headerSection = document.createElement("div");
        headerSection.classList.add("headerPost")
        const posterElement = document.createElement("div");
        posterElement.classList.add("poster");
        posterElement.innerText = post.poster;
        const timeElement = document.createElement("div");
        timeElement.classList.add("time");
        timeElement.innerText = post.time;

        headerSection.appendChild(posterElement);
        headerSection.appendChild(timeElement);
        postElement.appendChild(headerSection);

        //image
        const imageElement = document.createElement("img");
        // convert post.imageUrl.data from Binary Buffer to Base64String 
        // const base64String = btoa(String.fromCharCode(...new Uint8Array(post.imageUrl.data)));
        // Assuming you have a buffer object
        // const buffer = Buffer.from(post.imageUrl.data);
        // const buffer = post.imageUrl.data;

        // Convert buffer to Base64 string
        // const base64String = buffer.toString('base64');
        // console.log("base64String:");
        // console.log(base64String);
        imageElement.src= post.imageUrl;
        // imageElement.src = base64String;

        postElement.appendChild(imageElement);

        //interact section
        const interactSection = document.createElement("div");
        interactSection.classList.add("interractSection");
        const likeBtn = document.createElement("button");
        //set liked btn
        if (post.likes.includes(username)) {
          likeBtn.classList.add("liked");
        }
        likeBtn.innerText = "like";
        // likeBtn.setAttribute('id', 'ไอดี');
        likeBtn.addEventListener("click", async () => {
          await likeDisLikePost(post._id, username);
          window.location.reload();
        });
        const likesElement = document.createElement("div");
        likesElement.classList.add("likes");
        likesElement.innerText = post.likeNumber + "likes";
        const newCommentElement = document.createElement("input");
        newCommentElement.type = "text";
        newCommentElement.setAttribute('id', `commentText_${i}`);
        newCommentElement.placeholder = "Add new comment";
        const sendCommentBtn = document.createElement("button");
        sendCommentBtn.innerText = "send";
        // test username as nam
        sendCommentBtn.addEventListener("click", async () => {
          await handleAddComment(post._id, `${i}`, username);
          window.location.reload();
        });
        
        interactSection.appendChild(likesElement);
        interactSection.appendChild(likeBtn);
        interactSection.appendChild(newCommentElement);
        interactSection.appendChild(sendCommentBtn);
        postElement.appendChild(interactSection);
        
        //comments
        const commentSection = document.createElement("div");
        commentSection.classList.add("commentSection");
        post.comments.forEach(comment => {
          const singleComment = document.createElement("div");
          singleComment.classList.add("singleComment");
          const commenterElement = document.createElement("div");
          commenterElement.innerText = comment.commenter;
          const commentTextElement = document.createElement("div");
          commentTextElement.innerText = comment.commentText;
          singleComment.appendChild(commenterElement);
          singleComment.appendChild(commentTextElement);
          commentSection.appendChild(singleComment)
        })
        postElement.appendChild(commentSection);
        
        postsContainer.appendChild(postElement);
      }
    }
  
    renderPosts();
  });