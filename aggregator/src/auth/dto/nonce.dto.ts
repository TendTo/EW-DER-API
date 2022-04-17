import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class NonceDTO {
  @IsString()
  @ApiProperty({
    type: String,
    example: "cn0aPC4I+MYWMF7L474PdpZEUBlwnoANUj79F643sfE=",
    description: "Nonce returned to the client. This is used to prevent replay attacks.",
  })
  nonce: string;
}
