const express = require("express")
const { route } = require("./auth")
const router = express.Router()
const mongoose = require("mongoose")
const Post = mongoose.model("Post")
const requireLogin = require("../middleware/requireLogin")

router.post('/createPost',requireLogin,(req,res) => {
    const {title,body} = req.body

    if(!title || !body) {
        return res.status(404).json("Lütfen gerekli alanları doldurunuz")
    }

    console.log(req.user)

    req.user.password = undefined

    console.log(req.user)

    const post = new Post({
        title,
        body,
        postedBy:req.user
    })

    post.save()
    .then(result => {
        res.json({data:result})
    }).catch(err => {
        console.log(err)
    })

    

})

router.get('/allpost',(req,res) => {
    Post.find()
    .populate("postedBy","_id name email")
    .then(posts => {
        res.json({posts:posts})
    }).catch(err => {
        console.log(err)
    })
})

router.get('/mypost',requireLogin,(req,res)=> {
    Post.find({postedBy:req.user.id})
    .populate("postedBy","_id name email")
    .then(mypost => {
        res.json({mypost})
    }).catch(err => {
        console.log(err)
    })
})


module.exports = router