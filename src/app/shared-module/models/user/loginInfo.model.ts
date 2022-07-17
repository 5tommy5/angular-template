import { ResponseModel } from "./response.model";
import { TokenModel } from "./token.model";

export class LoginInfoModel{
    username : string;
    tokens : TokenModel;
    response : ResponseModel;
}