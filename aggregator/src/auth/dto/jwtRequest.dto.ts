import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsString } from "class-validator";

export class JWTRequestDTO {
  @IsEthereumAddress()
  @ApiProperty({
    type: String,
    example: "0xef131ed1460626e97F34243DAc544B42eb52a472",
    description: "Public address of the user. This is used to sign the nonce.",
  })
  address: string;
  @IsString()
  @ApiProperty({
    type: String,
    example:
      "0x8919e2a19be04535b0592b38bd970f10cc4d930287e2dda7a6b223d43af14a387270a2d1c1ffca05c00102ad31662d9031ba9a9fc84ceccea26571a740ad78c91b",
    description:
      "Digital signature of the nonce received from the server. This is used to prevent replay attacks.",
  })
  signedNonce: string;
}
