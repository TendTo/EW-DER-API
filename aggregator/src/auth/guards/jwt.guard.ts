import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
  override canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (process.env.DISABLE_AUTH === "true") return true;
    return super.canActivate(context);
  }
}
