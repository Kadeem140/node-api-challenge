const express = require('express');
const actions = require("../data/helpers/actionModel")

const router = express.Router()

//(GET)Get Actions
router.get("/actions", (req, res) => {
    actions.get()
        .then((action) => {
            console.log("Action", action)
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
    actions.get(req.params.id)
        .then((action) => {
            console.log()
            if(req.params.id){
                res.status(200).json(action)
            }else {
                res.status(404).json({
                    message: "There doesn't seem to be an action linked to this ID"
                })
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: "The information could not be found about this actions"
            })
        })
})

//(DELETE)Delete Action BY id
router.delete("/actions/:id", (req, res) => {
    actions.remove(req.params.id)
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
                        res.status(201).json(req.body)
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
router.post("/actions",(req, res) => {
        actions
            .insert(req.body)
            .then((action) => {
                res.status(201).json(action)
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json({
                    message: "Error adding the action???",
                })
            })
        })
            
        

    //middleware
    function validateAction(req, res, next) {
        const body = req.body;
        // const notes = body.notes;
        const description = body.description;
      
        if (!body) {
          res.status(400).json({ message: "missing action data" });
        } else if (!description) {
          res.status(400).json({ message: "missing required description field" });
        }  else {
          next();
        }
      }
      
      function validateActionId(req, res, next) {
        const id = req.params.id;
      
        actionsDb
          .get(id)
          .then(action => {
            if (action) {
              // attach value to my request
              req.body = action;
      
              // moving to next middleware in call stack
              next();
            } else {
              res.status(400).json({ message: "invalid action id" });
            }
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              message: "Could not make request"
            });
          });
      }
module.exports = router