const express = require('express');
const projects = require("../data/helpers/projectModel")

const router = express.Router()

//(GET)Get PROJECT
router.get("/projects", (req, res) => {
    projects.get()
        .then((project) => {
            res.status(200).json(project)
        })
        .catch((err) => {
            res.status(404).json({
                message: "actions could not be found"
            })
        }) 
})


//(GET)Get PROJECT by ID
router.get("/projects/:id", (req, res) => {
    projects.get(req.params.id)
        .then((project) => {
            req.params.id ? res.status(200).json(project) :
                res.status(404).json({
                message: "There doesn't seem to be an project linked to this ID"
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: "The information could not be found about this project"
            })
        })
        
})


//(DELETE)Delete PROJECT BY id
router.delete("/projects/:id", (req, res) => {
    projects.remove(req.params.id)
        .then((project) => {
            !req.params.id ? res.status(404).json({
                message: "Specified project doesn't exist"
            }) : res.status(200).json({
                message: "Project successfully deleted"
            })
        })
        .catch(() => {
            console.log("Project Delete error",err)
            res.status(500).json({
                message: "The Project information could not be removed",
            })
            
        })
        
})

//(PUT) EDIT PROJECT BY id
router.put("/projects/:id", (req, res) => {
    projects.get(req.params.id)
        .then((project) => {
            if (!req.body.name || !req.body.description) {
                res.status(400).json({
                    message: "Fill all Fields Please",
                })
            } else {
                projects
                    .update(req.params.id, req.body)
                    .then((project) => {
                        res.status(201).json(req.body)
                    })
                    .catch((err) => {
                        console.log(err)
                        res.status(500).json({
                            message: "The Project information could not be updated",
                        })
                    })
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                message: "The project information could not be updated",  
        })          
    })
})

//(POST)Create new PROJECT
router.post("/projects",(req, res) => {
        projects
            .insert(req.body)
            .then((project) => {
                res.status(201).json(project)
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json({
                    message: "Error adding the project",
                })
            })
})
       

module.exports = router