const express = require('express');
const actions = require("../data/helpers/actionModel")

const router = express.Router()

//(GET)Get Actions
router.get("/actions", (req, res) => {
    actions.get()
        .then((action) => {
            res.status(200).json(action)
        })
        .catch((err) => {  
            res.status(404).json({
                message: "actions could not be found"
            })

        })
})

//(GET)Get Action by ID
router.get("/actions/:id", (req, res) => {
    actions.get(req.param.id)
        .then((action) => {
            if(req.param.id){
                res.status(200).json(action)
            }else {
                res.status(404).json({
                    message: "There doesn't seem to be an action linked to this ID"
                })
            }
        })
        .catch(() => {
            res.status(500).json({
                message: "The information could not be found about this actions"
            })
        })
})

//(DELETE)Delete Action BY id
router.delete("/actions/:id", (req, res) => {
    actions.remove(req.param.id)
        .then((action) => {
             !req.params.id ? res.status(404).json({
                message: "Specified action doesn't exist"
            }) : res.status(200).json({
                message: "Action successfully deleted"
            })
        })
        .catch((err) => {
            console.log("Action Delete error",err)
            res.status(500).json({
                message: "The action information could not be removed",
            })
        })
})

//(PUT) EDIT ACTION BY id
router.put("/actions/:id", (req, res) => {
    actions.get(req.params.id)
        .then((action) => {
            if (!req.body.project_id || !req.body.description || req.body.completed) {
                res.status(400).json({
                    message: "Please provide a description for updated actions",
                })
            } else {
                actions
                    .update(req.params.id, req.body)
                    .then((action) => {
                        res.status(200).json(req.body)
                    })
                    .catch((err) => {
                        console.log(err)
                        res.status(500).json({
                            message: "The action information could not be updated",
                        })
                    })
            }

        }) 
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                message: "The action information could not be updated",  
        })
    })
})

//(POST)Create new Action
router.post("/actions/:id", (req, res) => {
    actions.get(req.params.id)
        .then((action) => {
            actions
            .get(req.params.id)
            .then((action) => {
                if (!req.body.project_id || !req.body.description || req.body.completed) {
                    res.status(400).json({
                        message: "Please fill out all fields",
                    })
                } else {
                    actions
                        .insert(req.body)
                        .then((action) => {
                            res.status(201).json(action)
                        })
                        .catch((err) => {
                            console.log(err)
                            res.status(500).json({
                                message: "Error adding the action",
                            })
                        })
                }
            })
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Error adding the action",
            })
        })
})

module.exports = router