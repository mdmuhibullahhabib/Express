import { Router } from "express";
import { userController } from "./user.controller.js";

const router = Router();

router.post('/', userController.createUser)
router.get('/', userController.getAllUSer)
router.get('/:id', userController.getSIngleUSer)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

export const userRoute = router