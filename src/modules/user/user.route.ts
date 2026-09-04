import { Router} from "express";
import { userController } from "./user.controller.js";
import auth from "../../middleware/auth.js";
import { USER_ROLE } from "../../types/index.js";

const router = Router();

router.post('/', userController.createUser)
router.get('/', auth(USER_ROLE.admin , USER_ROLE.agent, USER_ROLE.user), userController.getAllUSer)
router.get('/:id', userController.getSIngleUSer)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

export const userRoute = router