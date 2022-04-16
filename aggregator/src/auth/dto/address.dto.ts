import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress } from "class-validator";

export class AddressDTO {
  @IsEthereumAddress()
  @ApiProperty({
    type: String,
    example:
      "0xef131ed1460626e97F34243DAc544B42eb52a472",
    description:
      "Ethereum address of the user. This is used to sign the nonce.",
  })
  address: string;
}
