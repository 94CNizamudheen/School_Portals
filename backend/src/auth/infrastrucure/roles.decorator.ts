<<<<<<< HEAD


=======
>>>>>>> e1a925f (forgetted auth module implimentd and acciently deleted item re implimented)
import { SetMetadata } from "@nestjs/common";
import { Role } from "./dto/auth.dto";

export const ROLES_KEY= 'roles';
<<<<<<< HEAD
export const Roles= (...roles:Role[])=>SetMetadata(ROLES_KEY,roles);
=======
export const Roles= (...roles:Role[])=>SetMetadata(ROLES_KEY,roles);
>>>>>>> e1a925f (forgetted auth module implimentd and acciently deleted item re implimented)
