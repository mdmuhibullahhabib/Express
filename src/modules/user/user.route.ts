import { Router} from "express";
import { userController } from "./user.controller.js";
import auth from "../../middleware/auth.js";

const router = Router();

router.post('/', userController.createUser)
router.get('/', auth(), userController.getAllUSer)
router.get('/:id', userController.getSIngleUSer)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

export const userRoute = router
export const userRoute = router