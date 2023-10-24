const express = require('express')
const { createUser, userLogin, userUpdate, viewUser, userDelete } = require('../controller/userController')
const { authentication } = require('../middleware/auth')
const {  getTask, getParticularTask, userUpdateTask, userDeleteTask, createTask } = require('../controller/taskController')

const router = express.Router()

router.post('/register', createUser)
router.post('/login', userLogin)
router.get('/get',authentication,viewUser)
router.put('/update', authentication, userUpdate)
router.delete('/delete', authentication, userDelete)


//++++++++++++++++++++++++++++++++++++ task +++++++++++++++++++++++++++++++//

router.post('/task/add', authentication, createTask)
router.get('/task/get', authentication, getTask)
router.get('/task/get/:id', authentication, getParticularTask)
router.put('/task/update/:id', authentication, userUpdateTask)
router.delete('/task/delete/:id', authentication, userDeleteTask)


module.exports = router