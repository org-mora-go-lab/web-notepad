import { changeGroupAccess } from "../_lib/access-request";

export const POST = (request: Request) => changeGroupAccess(request, "leave");
